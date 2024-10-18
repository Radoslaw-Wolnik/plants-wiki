// File: src/app/api/admin/statistics/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { PrismaClient } from "@prisma/client";
import { UnauthorizedError, ForbiddenError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can access this route');
    }

    const [
      totalUsers,
      activeUsers,
      totalPlants,
      totalArticles,
      totalComments,
      flaggedContent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
          }
        }
      }),
      prisma.plant.count(),
      prisma.article.count(),
      prisma.comment.count(),
      prisma.flag.count({
        where: { resolved: false }
      }),
    ]);

    const topContributors = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            articles: true,
            comments: true,
          }
        }
      },
      orderBy: {
        articles: {
          _count: 'desc'
        }
      },
      take: 10
    });

    const statistics = {
      totalUsers,
      activeUsers,
      totalPlants,
      totalArticles,
      totalComments,
      flaggedContent,
      topContributors: topContributors.map(user => ({
        id: user.id,
        username: user.username,
        contributions: user._count.articles + user._count.comments
      }))
    };

    logger.info('Site statistics fetched', { adminId: session.user.id });
    return NextResponse.json(statistics);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching site statistics', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}