// File: src/app/api/moderation/flags/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, ForbiddenError, BadRequestError, InternalServerError } from '@/lib/errors';
import { addStrike } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const reviewFlagSchema = z.object({
  flagId: z.number().int().positive(),
  action: z.enum(['APPROVE', 'REJECT']),
  strikeUser: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [flags, totalCount] = await Promise.all([
      prisma.flag.findMany({
        where: { resolved: false },
        include: {
          changeRequest: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.flag.count({ where: { resolved: false } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Unresolved flags fetched', { userId: session.user.id, page, limit });
    return NextResponse.json({
      flags,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching unresolved flags', { error });
    throw new InternalServerError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new UnauthorizedError();
    }

    const body = await req.json();
    const { flagId, action, strikeUser } = reviewFlagSchema.parse(body);

    const flag = await prisma.flag.findUnique({
      where: { id: flagId },
      include: {
        changeRequest: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!flag) {
      throw new BadRequestError("Flag not found");
    }

    if (flag.resolved) {
      throw new BadRequestError("Flag has already been resolved");
    }

    await prisma.flag.update({
      where: { id: flagId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        reviewerId: parseInt(session.user.id),
      },
    });

    if (action === 'APPROVE') {
      await prisma.changeRequest.update({
        where: { id: flag.changeRequestId },
        data: { status: 'REJECTED' },
      });

      if (strikeUser) {
        await addStrike(flag.changeRequest.authorId);
      }
    }

    logger.info('Flag reviewed', { flagId, action, reviewerId: session.user.id, strikeUser });
    return NextResponse.json({ message: "Flag reviewed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in reviewing flag', { error });
    throw new InternalServerError();
  }
}