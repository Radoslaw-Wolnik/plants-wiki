// File: src/app/api/search/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const searchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['ALL', 'PLANTS', 'ARTICLES', 'USERS']).default('ALL'),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const { searchParams } = new URL(req.url);
    const { query, type } = searchSchema.parse(Object.fromEntries(searchParams));

    let results = {
      plants: [],
      articles: [],
      users: [],
    };

    const searchOptions = {
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { scientificName: { contains: query, mode: 'insensitive' } },
          { commonName: { contains: query, mode: 'insensitive' } },
        ],
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
    logger.error('Unhandled error in search', { error });
    throw new InternalServerError();
  }
}