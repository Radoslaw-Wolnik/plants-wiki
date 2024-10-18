import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const notificationSchema = z.object({
  type: z.enum(['FRIEND_REQUEST', 'ARTICLE_COMMENT', 'CHANGE_REQUEST_APPROVED', 'CHANGE_REQUEST_REJECTED']),
  content: z.string(),
  relatedId: z.number().int().positive().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const notifications = await prisma.userNotification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('User notifications fetched', { userId: session.user.id });
    return NextResponse.json(notifications);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user notifications', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const body = await req.json();
    const { type, content, relatedId } = notificationSchema.parse(body);

    const notification = await prisma.userNotification.create({
      data: {
        type,
        content,
        relatedId,
        userId: session.user.id,
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
    logger.error('Unhandled error in creating notification', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      throw new BadRequestError("Notification ID is required");
    }

    const notification = await prisma.userNotification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification || notification.userId !== session.user.id) {
      throw new BadRequestError("Notification not found or not owned by the user");
    }

    const updatedNotification = await prisma.userNotification.update({
      where: { id: parseInt(notificationId) },
      data: { read: true },
    });

    logger.info('Notification marked as read', { notificationId, userId: session.user.id });
    return NextResponse.json(updatedNotification);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in updating notification', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      throw new BadRequestError("Notification ID is required");
    }

    const notification = await prisma.userNotification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification || notification.userId !== session.user.id) {
      throw new BadRequestError("Notification not found or not owned by the user");
    }

    await prisma.userNotification.delete({
      where: { id: parseInt(notificationId) },
    });

    logger.info('Notification deleted', { notificationId, userId: session.user.id });
    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in deleting notification', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}