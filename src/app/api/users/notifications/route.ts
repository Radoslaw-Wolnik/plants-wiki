// File: src/app/api/users/notifications/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const notificationSchema = z.object({
  type: z.enum(['FRIEND_REQUEST', 'ARTICLE_COMMENT', 'CHANGE_REQUEST_APPROVED', 'CHANGE_REQUEST_REJECTED']),
  content: z.string(),
  relatedId: z.number().int().positive().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('User notifications fetched', { userId: session.user.id });
    return NextResponse.json(notifications);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user notifications', { error });
    throw new InternalServerError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const body = await req.json();
    const { type, content, relatedId } = notificationSchema.parse(body);

    const notification = await prisma.notification.create({
      data: {
        type,
        content,
        relatedId,
        userId: parseInt(session.user.id),
      },
    });

    logger.info('Notification created', { notificationId: notification.id, userId: session.user.id });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating notification', { error });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      throw new BadRequestError("Notification ID is required");
    }

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification || notification.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("Notification not found or not owned by the user");
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { read: true },
    });

    logger.info('Notification marked as read', { notificationId, userId: session.user.id });
    return NextResponse.json(updatedNotification);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in updating notification', { error });
    throw new InternalServerError();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      throw new BadRequestError("Notification ID is required");
    }

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification || notification.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("Notification not found or not owned by the user");
    }

    await prisma.notification.delete({
      where: { id: parseInt(notificationId) },
    });

    logger.info('Notification deleted', { notificationId, userId: session.user.id });
    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in deleting notification', { error });
    throw new InternalServerError();
  }
}