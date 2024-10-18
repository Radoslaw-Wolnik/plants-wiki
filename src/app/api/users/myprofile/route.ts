// File: src/app/api/users/profile/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { UnauthorizedError, NotFoundError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  email: z.string().email().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        createdAt: true,
        role: true,
        wishlistPlants: true,
        graveyardPlants: true,
        _count: {
          select: {
            friends: true,
          },
        },
        // Include the user's library and count the number of plants
        library: {
          select: {
            _count: {
              select: {
                userPlants: true, // Count the number of plants in the user's library
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    logger.info('User fetched own profile', { userId: session.user.id });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user profile', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const body = await req.json();
    const { username, email } = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        createdAt: true,
        role: true,
      },
    });

    logger.info('User updated profile', { userId: session.user.id });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in updating user profile', { error });
    throw new InternalServerError();
  }
}