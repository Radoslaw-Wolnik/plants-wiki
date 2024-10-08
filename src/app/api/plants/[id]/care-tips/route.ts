// File: src/app/api/plants/[id]/care-tips/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, NotFoundError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const careTipSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const plantId = parseInt(params.id);

    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
      include: {
        careTips: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!plant) {
      throw new NotFoundError("Plant not found");
    }

    logger.info('Plant care tips fetched', { plantId, userId: session.user.id });
    return NextResponse.json(plant.careTips);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching plant care tips', { error });
    throw new InternalServerError();
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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
    logger.error('Unhandled error in creating care tip', { error });
    throw new InternalServerError();
  }
}