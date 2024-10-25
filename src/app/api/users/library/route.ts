// File: src/app/api/users/[id]/library/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { UnauthorizedError, NotFoundError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { UserPlant } from '@/types';

interface UserPlantExtended extends UserPlant {
  lastWatering?: Date;      // Add lastWatering property
  lastFertilizing?: Date;   // Add lastFertilizing property
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(session.user.id);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const library = await prisma.userLibrary.findUnique({
      where: { userId: session.user.id },
      include: {
        userPlants: {
          where: {
            OR: [
              { nickname: { contains: search, mode: 'insensitive' } },
              { plant: { name: { contains: search, mode: 'insensitive' } } },
              { plant: { scientificName: { contains: search, mode: 'insensitive' } } },
            ],
          },
          skip,
          take: limit,
          orderBy: { acquiredDate: 'desc' },
          include: {
            plant: {
              select: {
                name: true,
                scientificName: true,
                icon: true,
              },
            },
            room: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!library) {
      throw new NotFoundError("User library not found");
    }

    const totalCount = await prisma.userPlant.count({
      where: {
        libraryId: library.id,
        OR: [
          { nickname: { contains: search, mode: 'insensitive' } },
          { plant: { name: { contains: search, mode: 'insensitive' } } },
          { plant: { scientificName: { contains: search, mode: 'insensitive' } } },
        ],
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    for (let userPlant of library.userPlants) {
      // Cast userPlant to UserPlantExtended
      const extendedUserPlant = userPlant as UserPlantExtended;
      const [lastWatering, lastFertilizing] = await Promise.all([
        prisma.wateringLog.findFirst({
          where: { userPlantId: userPlant.id },
          orderBy: { date: 'desc' },
          select: { date: true },
        }),
        prisma.fertilizingLog.findFirst({
          where: { userPlantId: userPlant.id },
          orderBy: { date: 'desc' },
          select: { date: true },
        }),
      ]);
      // Safely assign the values to the extended userPlant object
      extendedUserPlant.lastWatering = lastWatering?.date;
      extendedUserPlant.lastFertilizing = lastFertilizing?.date;
    }


    logger.info('User library fetched', { userId: session.user.id, page, limit, search });
    return NextResponse.json({
      library,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user library', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}