// File: src/app/api/users/rooms/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const roomSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(['LIVING_ROOM', 'BEDROOM', 'BATHROOM', 'KITCHEN', 'BALCONY', 'OUTDOOR', 'GREENHOUSE']),
  sunlight: z.string().min(1).max(50),
  humidity: z.string().min(1).max(50),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const rooms = await prisma.room.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        plants: {
          select: {
            id: true,
            nickname: true,
            plant: {
              select: {
                name: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    logger.info('User rooms fetched', { userId: session.user.id });
    return NextResponse.json(rooms);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user rooms', { error });
    throw new InternalServerError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const body = await req.json();
    const { name, type, sunlight, humidity } = roomSchema.parse(body);

    const room = await prisma.room.create({
      data: {
        name,
        type,
        sunlight,
        humidity,
        userId: parseInt(session.user.id),
      },
    });

    logger.info('Room created', { roomId: room.id, userId: session.user.id });
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating room', { error });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('id');

    if (!roomId) {
      throw new BadRequestError("Room ID is required");
    }

    const body = await req.json();
    const { name, type, sunlight, humidity } = roomSchema.parse(body);

    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });

    if (!room || room.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("Room not found or not owned by the user");
    }

    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: { name, type, sunlight, humidity },
    });

    logger.info('Room updated', { roomId, userId: session.user.id });
    return NextResponse.json(updatedRoom);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in updating room', { error });
    throw new InternalServerError();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('id');

    if (!roomId) {
      throw new BadRequestError("Room ID is required");
    }

    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });

    if (!room || room.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("Room not found or not owned by the user");
    }

    await prisma.room.delete({
      where: { id: parseInt(roomId) },
    });

    logger.info('Room deleted', { roomId, userId: session.user.id });
    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in deleting room', { error });
    throw new InternalServerError();
  }
}