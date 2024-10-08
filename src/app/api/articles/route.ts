// File: src/app/api/articles/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  plantId: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const body = await req.json();
    const { title, content, plantId } = articleSchema.parse(body);

    const plant = await prisma.plant.findUnique({ where: { id: plantId } });
    if (!plant) {
      throw new BadRequestError("Plant not found");
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: parseInt(session.user.id),
        plantId,
      },
    });

    logger.info('New article created', { articleId: article.id, userId: session.user.id, plantId });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in article creation', { error });
    throw new InternalServerError();
  }
}