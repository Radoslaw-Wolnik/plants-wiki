// File: src/app/api/plants/[id]/care-tips/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, NotFoundError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const careTipSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

    const plantId = parseInt(params.id);
    const careTips = await prisma.careTip.findMany({
      where: { plantId },
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { likes: true, flags: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('Plant care tips fetched', { plantId, userId: session.user.id });
    return NextResponse.json(careTips);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching plant care tips', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

    const plantId = parseInt(params.id);
    const body = await req.json();
    const { title, content } = careTipSchema.parse(body);

    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
    });

    if (!plant) {
      throw new NotFoundError("Plant not found");
    }

    const careTip = await prisma.careTip.create({
      data: {
        title,
        content,
        plantId,
        authorId: parseInt(session.user.id),
      },
    });

    logger.info('Care tip created', { careTipId: careTip.id, plantId, userId: session.user.id });
    return NextResponse.json(careTip, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating care tip', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

// New route for liking a care tip
export async function PUT(req: Request, { params }: { params: { id: string, tipId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

    const careTipId = parseInt(params.tipId);

    const existingLike = await prisma.careTipLike.findUnique({
      where: {
        careTipId_userId: {
          careTipId,
          userId: parseInt(session.user.id),
        },
      },
    });

    if (existingLike) {
      await prisma.careTipLike.delete({
        where: { id: existingLike.id },
      });
      logger.info('Care tip unliked', { careTipId, userId: session.user.id });
      return NextResponse.json({ message: 'Care tip unliked' });
    } else {
      await prisma.careTipLike.create({
        data: {
          careTipId,
          userId: parseInt(session.user.id),
        },
      });
      logger.info('Care tip liked', { careTipId, userId: session.user.id });
      return NextResponse.json({ message: 'Care tip liked' });
    }
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in liking/unliking care tip', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

// New route for flagging a care tip
export async function PATCH(req: Request, { params }: { params: { id: string, tipId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

    const careTipId = parseInt(params.tipId);
    const body = await req.json();
    const { reason } = z.object({ reason: z.string().min(1) }).parse(body);

    const flag = await prisma.careTipFlag.create({
      data: {
        careTipId,
        userId: parseInt(session.user.id),
        reason,
      },
    });

    logger.info('Care tip flagged', { careTipId, userId: session.user.id, flagId: flag.id });
    return NextResponse.json({ message: 'Care tip flagged for review' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in flagging care tip', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}
