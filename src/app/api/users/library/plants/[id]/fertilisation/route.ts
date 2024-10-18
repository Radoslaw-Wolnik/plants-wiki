import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const fertilizingLogSchema = z.object({
  date: z.string().datetime(),
  fertilizer: z.string().min(1).max(100),
  amount: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const userPlantId = parseInt(params.id);
    const body = await req.json();
    const { date, fertilizer, amount, notes } = fertilizingLogSchema.parse(body);

    const userPlant = await prisma.userPlant.findUnique({
      where: { id: userPlantId },
      include: { library: true },
    });

    if (!userPlant || userPlant.library.userId !== session.user.id) {
      throw new BadRequestError("User plant not found or not owned by the user");
    }

    const fertilizingLog = await prisma.fertilizingLog.create({
      data: {
        userPlantId,
        date: new Date(date),
        fertilizer,
        amount,
        notes,
      },
    });

    logger.info('Fertilizing logged for user plant', { fertilizingLogId: fertilizingLog.id, userPlantId, userId: session.user.id });
    return NextResponse.json(fertilizingLog, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in logging fertilizing', { error });
    throw new InternalServerError();
  }
}