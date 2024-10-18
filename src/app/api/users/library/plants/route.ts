// File: src/app/api/users/library/plants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

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

    await checkUserBanStatus(session.user.id);

    const body = await req.json();
    const { plantId, nickname, roomId, notes } = addPlantSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

// GET method to fetch details about a user's specific plant
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    const url = new URL(req.url);
    const userPlantId = parseInt(url.searchParams.get('userPlantId') || '');

    if (isNaN(userPlantId)) {
      throw new BadRequestError("Invalid user plant ID");
    }

    // Fetch user plant details including photos, notes, etc.
    const userPlant = await prisma.userPlant.findUnique({
      where: { id: userPlantId },
      select: { // Use select here for UserPlant fields
        id: true,
        nickname: true,
        acquiredDate: true,
        notes: true,
        room: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: { // Still include photos for UserPlantPhoto
          select: {
            id: true,
            url: true,
            description: true,
            takenAt: true, // Optional if you need the date
          },
        },
        plant: { // Include related Plant model
          select: {
            id: true,
            name: true,
            scientificName: true,
            icon: true,
            // No photos here, as mentioned before
          },
        },
        wateringLogs: true, // Include watering logs if necessary
        fertilizingLogs: true, // Include fertilizing logs if necessary
      },
    });

    if (!userPlant) {
      throw new BadRequestError("User plant not found");
    }

    logger.info('Fetched user plant details', { userPlantId });
    return NextResponse.json(userPlant, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user plant details', { error });
    throw new InternalServerError();
  }
}

