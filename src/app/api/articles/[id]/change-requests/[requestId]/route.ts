// File: src/app/api/articles/[id]/change-requests/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, ForbiddenError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const changeRequestSchema = z.object({
  content: z.string().min(1),
});

const approvalSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const articleId = parseInt(params.id);

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

    logger.info('Article change requests fetched', { articleId, userId: session.user.id });
    return NextResponse.json(changeRequests);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching article change requests', { error: error instanceof Error ? error.message : String(error) });
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

    const articleId = parseInt(params.id);
    const body = await req.json();
    const { content } = changeRequestSchema.parse(body);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new BadRequestError("Article not found");
    }

    const changeRequest = await prisma.changeRequest.create({
      data: {
        content,
        authorId: parseInt(session.user.id),
        articleId,
      },
    });

    logger.info('Change request created', { changeRequestId: changeRequest.id, articleId, userId: session.user.id });
    return NextResponse.json(changeRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating change request', { error });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request, { params }: { params: { id: string, requestId: string } }) {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session || !['MODERATOR', 'ADMIN'].includes(session.user.role)) {
        throw new UnauthorizedError();
      }
  
      const articleId = parseInt(params.id);
      const requestId = parseInt(params.requestId);
  
      const body = await req.json();
      const { action } = approvalSchema.parse(body);
  
      const changeRequest = await prisma.changeRequest.findUnique({
        where: { id: requestId },
        include: { article: true },
      });
  
      if (!changeRequest || changeRequest.articleId !== articleId) {
        throw new BadRequestError("Change request not found or does not belong to the specified article");
      }
  
      if (changeRequest.status !== 'PENDING') {
        throw new BadRequestError("Change request has already been processed");
      }
  
      const updatedChangeRequest = await prisma.changeRequest.update({
        where: { id: requestId },
        data: { 
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          approvals: {
            create: {
              moderatorId: parseInt(session.user.id),
            },
          },
        },
      });
  
      if (action === 'APPROVE') {
        await prisma.article.update({
          where: { id: articleId },
          data: { content: changeRequest.content },
        });
      }
  
      logger.info('Change request processed', { changeRequestId: requestId, articleId, action, moderatorId: session.user.id });
      return NextResponse.json(updatedChangeRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      if (error instanceof AppError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      logger.error('Unhandled error in processing change request', { error });
      throw new InternalServerError();
    }
  }