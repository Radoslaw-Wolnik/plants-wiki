// File: src/app/api/users/friends/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const friendRequestSchema = z.object({
  friendId: z.number().int().positive(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const friends = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        friends: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    logger.info('User friends fetched', { userId: session.user.id });
    return NextResponse.json(friends?.friends || []);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user friends', { error });
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
    const { friendId } = friendRequestSchema.parse(body);

    if (friendId === parseInt(session.user.id)) {
      throw new BadRequestError("You cannot add yourself as a friend");
    }

    const friend = await prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      throw new BadRequestError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        friends: {
          connect: { id: friendId },
        },
      },
      select: {
        friends: {
          where: { id: friendId },
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    logger.info('Friend added', { userId: session.user.id, friendId });
    return NextResponse.json(updatedUser.friends[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in adding friend', { error });
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
    const friendId = searchParams.get('id');

    if (!friendId) {
      throw new BadRequestError("Friend ID is required");
    }

    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        friends: {
          disconnect: { id: parseInt(friendId) },
        },
      },
    });

    logger.info('Friend removed', { userId: session.user.id, friendId });
    return NextResponse.json({ message: "Friend removed successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in removing friend', { error });
    throw new InternalServerError();
  }
}