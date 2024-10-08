// File: src/app/api/users/library/plants/[id]/watering/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const wateringLogSchema = z.object({
  date: z.string().datetime(),
  amount: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const userPlantId = parseInt(params.id);
    const body = await req.json();
    const { date, amount, notes } = wateringLogSchema.parse(body);

    const userPlant = await prisma.userPlant.findUnique({
      where: { id: userPlantId },
      include: { library: true },
    });

    if (!userPlant || userPlant.library.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("User plant not found or not owned by the user");
    }

    const wateringLog = await prisma.wateringLog.create({
      data: {
        userPlantId,
        date: new Date(date),
        amount,
        notes,
      },
    });

    logger.info('Watering logged for user plant', { wateringLogId: wateringLog.id, userPlantId, userId: session.user.id });
    return NextResponse.json(wateringLog, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in logging watering', { error });
    throw new InternalServerError();
  }
}