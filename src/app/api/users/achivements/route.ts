// File: src/app/api/users/achievements/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { UnauthorizedError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        achievements: true,
        _count: {
          select: {
            plants: true,
            articles: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Check for new achievements
    const newAchievements = [];

    if (user._count.plants >= 10 && !user.achievements.some(a => a.type === 'PLANT_COLLECTOR')) {
      newAchievements.push({ type: 'PLANT_COLLECTOR', name: 'Plant Collector', description: 'Added 10 plants to your collection' });
    }

    if (user._count.articles >= 5 && !user.achievements.some(a => a.type === 'WIKI_CONTRIBUTOR')) {
      newAchievements.push({ type: 'WIKI_CONTRIBUTOR', name: 'Wiki Contributor', description: 'Created 5 articles' });
    }

    if (user._count.comments >= 20 && !user.achievements.some(a => a.type === 'ACTIVE_COMMENTER')) {
      newAchievements.push({ type: 'ACTIVE_COMMENTER', name: 'Active Commenter', description: 'Posted 20 comments' });
    }

    // Add new achievements to the database
    if (newAchievements.length > 0) {
      await prisma.achievement.createMany({
        data: newAchievements.map(achievement => ({
          ...achievement,
          userId: user.id,
        })),
      });

      user.achievements.push(...newAchievements);
    }

    logger.info('User achievements fetched', { userId: session.user.id, newAchievementsCount: newAchievements.length });
    return NextResponse.json(user.achievements);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user achievements', { error });
    throw new InternalServerError();
  }
}