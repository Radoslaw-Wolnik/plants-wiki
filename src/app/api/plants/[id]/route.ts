// File: src/app/api/plants/[id]/route.ts

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
    const plantId = parseInt(params.id);

    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        articles: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!plant) {
      throw new NotFoundError("Plant not found");
    }

    // If the plant belongs to the current user, include additional details
    if (session && plant.userId === parseInt(session.user.id)) {
      const wateringLogs = await prisma.wateringLog.findMany({
        where: { plantId },
        orderBy: { date: 'desc' },
        take: 5,
      });

      const fertilizingLogs = await prisma.fertilizingLog.findMany({
        where: { plantId },
        orderBy: { date: 'desc' },
        take: 5,
      });

      plant.wateringLogs = wateringLogs;
      plant.fertilizingLogs = fertilizingLogs;
    }

    logger.info('Plant details fetched', { plantId, userId: session?.user.id });
    return NextResponse.json(plant);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching plant details', { error });
    throw new InternalServerError();
  }
}