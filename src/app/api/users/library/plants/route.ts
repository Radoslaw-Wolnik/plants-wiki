// File: src/app/api/users/library/plants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const addPlantSchema = z.object({
  plantId: z.number().int().positive(),
  nickname: z.string().min(1).max(50).optional(),
  roomId: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const body = await req.json();
    const { plantId, nickname, roomId, notes } = addPlantSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: { library: true },
    });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    if (!user.library) {
      await prisma.userLibrary.create({
        data: { userId: user.id },
      });
    }

    const userPlant = await prisma.userPlant.create({
      data: {
        library: { connect: { userId: user.id } },
        plant: { connect: { id: plantId } },
        nickname,
        acquiredDate: new Date(),
        notes,
        room: roomId ? { connect: { id: roomId } } : undefined,
      },
      include: {
        plant: {
          select: {
            name: true,
            scientificName: true,
            icon: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
      },
    });

    logger.info('Plant added to user library', { userPlantId: userPlant.id, userId: session.user.id, plantId });
    return NextResponse.json(userPlant, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in adding plant to user library', { error });
    throw new InternalServerError();
  }
}