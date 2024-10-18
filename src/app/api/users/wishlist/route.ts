// File: src/app/api/users/wishlist/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const wishlistItemSchema = z.object({
  plantName: z.string().min(1).max(100),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const wishlistItems = await prisma.wishlistPlant.findMany({
      where: { userId: session.user.id },
      orderBy: { id: 'desc' },
    });

    logger.info('User wishlist fetched', { userId: session.user.id });
    return NextResponse.json(wishlistItems);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user wishlist', { error });
    throw new InternalServerError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const body = await req.json();
    const { plantName } = wishlistItemSchema.parse(body);

    const wishlistItem = await prisma.wishlistPlant.create({
      data: {
        plantName,
        userId: session.user.id,
      },
    });

    logger.info('Wishlist item added', { wishlistItemId: wishlistItem.id, userId: session.user.id });
    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in adding wishlist item', { error });
    throw new InternalServerError();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      throw new BadRequestError("Wishlist item ID is required");
    }

    const wishlistItem = await prisma.wishlistPlant.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!wishlistItem || wishlistItem.userId !== session.user.id) {
      throw new BadRequestError("Wishlist item not found or not owned by the user");
    }

    await prisma.wishlistPlant.delete({
      where: { id: parseInt(itemId) },
    });

    logger.info('Wishlist item deleted', { wishlistItemId: itemId, userId: session.user.id });
    return NextResponse.json({ message: "Wishlist item deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in deleting wishlist item', { error });
    throw new InternalServerError();
  }
}