import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  plantId: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(session.user.id);

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
        contributors: {
          connect: { id: session.user.id }
        },
        plant: {
          connect: { id: plantId }
        }
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
    logger.error('Unhandled error in article creation', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}