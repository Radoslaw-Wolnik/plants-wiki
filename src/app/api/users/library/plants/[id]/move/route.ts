import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const movePlantSchema = z.object({
  roomId: z.number().int().positive(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const userPlantId = parseInt(params.id);
    const body = await req.json();
    const { roomId } = movePlantSchema.parse(body);

    const userPlant = await prisma.userPlant.findUnique({
      where: { id: userPlantId },
      include: { library: true },
    });

    if (!userPlant || userPlant.library.userId !== session.user.id) {
      throw new BadRequestError("User plant not found or not owned by the user");
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.userId !== session.user.id) {
      throw new BadRequestError("Room not found or not owned by the user");
    }

    const updatedUserPlant = await prisma.userPlant.update({
      where: { id: userPlantId },
      data: { roomId },
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

    logger.info('Plant moved to new room', { userPlantId, roomId, userId: session.user.id });
    return NextResponse.json(updatedUserPlant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in moving plant', { error });
    throw new InternalServerError();
  }
}