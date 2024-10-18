// File: src/app/api/users/graveyard/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const graveyardItemSchema = z.object({
  plantName: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const graveyardItems = await prisma.graveyardPlant.findMany({
      where: { userId: session.user.id },
      orderBy: { endDate: 'desc' },
    });

    logger.info('User plant graveyard fetched', { userId: session.user.id });
    return NextResponse.json(graveyardItems);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user plant graveyard', { error });
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
    const { plantName, startDate, endDate } = graveyardItemSchema.parse(body);

    const graveyardItem = await prisma.graveyardPlant.create({
      data: {
        plantName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: session.user.id,
      },
    });

    logger.info('Graveyard item added', { graveyardItemId: graveyardItem.id, userId: session.user.id });
    return NextResponse.json(graveyardItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in adding graveyard item', { error });
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
      throw new BadRequestError("Graveyard item ID is required");
    }

    const graveyardItem = await prisma.graveyardPlant.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!graveyardItem || graveyardItem.userId !== session.user.id) {
      throw new BadRequestError("Graveyard item not found or not owned by the user");
    }

    await prisma.graveyardPlant.delete({
      where: { id: parseInt(itemId) },
    });

    logger.info('Graveyard item deleted', { graveyardItemId: itemId, userId: session.user.id });
    return NextResponse.json({ message: "Graveyard item deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in deleting graveyard item', { error });
    throw new InternalServerError();
  }
}