// File: src/app/api/moderator-requests/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { UnauthorizedError, BadRequestError, ForbiddenError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        _count: {
          select: {
            plants: true,
            approvals: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (user.createdAt > oneMonthAgo || user._count.plants < 3 || user._count.approvals < 5) {
      throw new ForbiddenError("You do not meet the requirements to become a moderator");
    }

    const existingRequest = await prisma.moderatorRequest.findFirst({
      where: { userId: user.id, status: 'PENDING' },
    });

    if (existingRequest) {
      throw new BadRequestError("You already have a pending moderator request");
    }

    const moderatorRequest = await prisma.moderatorRequest.create({
      data: {
        userId: user.id,
      },
    });

    logger.info('Moderator request created', { requestId: moderatorRequest.id, userId: user.id });
    return NextResponse.json(moderatorRequest, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating moderator request', { error });
    throw new InternalServerError();
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      throw new UnauthorizedError();
    }

    const moderatorRequests = await prisma.moderatorRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            _count: {
              select: {
                plants: true,
                approvals: true,
              },
            },
          },
        },
      },
    });

    logger.info('Moderator requests fetched', { adminId: session.user.id });
    return NextResponse.json(moderatorRequests);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching moderator requests', { error });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      throw new BadRequestError("Invalid request ID or action");
    }

    const moderatorRequest = await prisma.moderatorRequest.findUnique({
      where: { id: parseInt(requestId) },
      include: { user: true },
    });

    if (!moderatorRequest || moderatorRequest.status !== 'PENDING') {
      throw new BadRequestError("Invalid moderator request");
    }

    if (action === 'approve') {
      await prisma.user.update({
        where: { id: moderatorRequest.userId },
        data: { role: 'MODERATOR' },
      });
    }

    await prisma.moderatorRequest.update({
      where: { id: parseInt(requestId) },
      data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' },
    });

    logger.info('Moderator request processed', { requestId, action, adminId: session.user.id });
    return NextResponse.json({ message: `Moderator request ${action}d successfully` });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in processing moderator request', { error });
    throw new InternalServerError();
  }
}