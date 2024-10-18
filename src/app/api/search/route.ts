import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const searchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['ALL', 'PLANTS', 'ARTICLES', 'USERS']).default('ALL'),
});

// Implement the checkUserBanStatus function if it doesn't exist
async function checkUserBanStatus(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isBanned: true, banExpiresAt: true },
  });

  if (user?.isBanned) {
    if (user.banExpiresAt && user.banExpiresAt <= new Date()) {
      await prisma.user.update({
        where: { id: userId },
        data: { isBanned: false, banExpiresAt: null },
      });
    } else {
      throw new UnauthorizedError('User is banned');
    }
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(session.user.id);

    const { searchParams } = new URL(req.url);
    const { query, type } = searchSchema.parse(Object.fromEntries(searchParams));

    let results: {
      plants: any[];
      articles: any[];
      users: any[];
    } = {
      plants: [],
      articles: [],
      users: [],
    };

    const searchOptions: Prisma.PlantFindManyArgs = {
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { scientificName: { contains: query, mode: 'insensitive' } },
          { commonName: { contains: query, mode: 'insensitive' } },
        ] as Prisma.PlantWhereInput[],
      },
      take: 10,
    };

    if (type === 'ALL' || type === 'PLANTS') {
      results.plants = await prisma.plant.findMany(searchOptions);
    }

    if (type === 'ALL' || type === 'ARTICLES') {
      results.articles = await prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
    }

    if (type === 'ALL' || type === 'USERS') {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
        take: 10,
      });
    }

    logger.info('Search performed', { userId: session.user.id, query, type });
    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in search', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}
