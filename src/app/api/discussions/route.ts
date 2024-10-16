import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, NotFoundError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const discussionSchema = z.object({
  content: z.string().min(1),
  articleId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

    const body = await req.json();
    const { content, articleId, parentId } = discussionSchema.parse(body);

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    const discussion = await prisma.discussion.create({
      data: {
        content,
        author: { connect: { id: parseInt(session.user.id) } },
        article: { connect: { id: articleId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });

    logger.info('Discussion created', { discussionId: discussion.id, userId: session.user.id, articleId });
    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating discussion', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');
    if (!articleId) {
      throw new BadRequestError("Article ID must be provided");
    }

    const discussions = await prisma.discussion.findMany({
      where: {
        articleId: parseInt(articleId),
        parentId: null, // Only fetch top-level discussions
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('Discussions fetched', { articleId, userId: session.user.id });
    return NextResponse.json(discussions);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching discussions', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}