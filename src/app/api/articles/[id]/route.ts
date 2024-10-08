// File: src/app/api/articles/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NotFoundError, InternalServerError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const articleId = parseInt(params.id);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        plant: {
          select: {
            id: true,
            name: true,
            scientificName: true,
            icon: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    // If the user is logged in and is a moderator or admin, include change requests
    if (session && ['MODERATOR', 'ADMIN'].includes(session.user.role)) {
      const changeRequests = await prisma.changeRequest.findMany({
        where: { articleId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          approvals: {
            include: {
              moderator: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      article.changeRequests = changeRequests;
    }

    logger.info('Article details fetched', { articleId, userId: session?.user.id });
    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching article details', { error });
    throw new InternalServerError();
  }
}