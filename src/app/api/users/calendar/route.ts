// File: src/app/api/users/calendar/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      throw new BadRequestError("Start date and end date are required");
    }

    const [wateringLogs, fertilizingLogs] = await Promise.all([
      prisma.wateringLog.findMany({
        where: {
          userPlant: {
            library: {
              userId: parseInt(session.user.id),
            },
          },
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        include: {
          userPlant: {
            include: {
              plant: true,
            },
          },
        },
      }),
      prisma.fertilizingLog.findMany({
        where: {
          userPlant: {
            library: {
              userId: parseInt(session.user.id),
            },
          },
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        include: {
          userPlant: {
            include: {
              plant: true,
            },
          },
        },
      }),
    ]);

    const calendarEvents = [
      ...wateringLogs.map(log => ({
        type: 'watering',
        date: log.date,
        plantName: log.userPlant.plant.name,
        plantId: log.userPlant.plantId,
      })),
      ...fertilizingLogs.map(log => ({
        type: 'fertilizing',
        date: log.date,
        plantName: log.userPlant.plant.name,
        plantId: log.userPlant.plantId,
        fertilizer: log.fertilizer,
      })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    logger.info('Calendar events fetched', { userId: session.user.id, startDate, endDate });
    return NextResponse.json(calendarEvents);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching calendar events', { error });
    throw new InternalServerError();
  }
}