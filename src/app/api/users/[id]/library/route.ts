// File: src/app/api/users/[id]/library/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { UnauthorizedError, NotFoundError, InternalServerError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = parseInt(params.id);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const library = await prisma.userLibrary.findUnique({
      where: { userId },
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

    // If it's the user's own library, include more details
    if (session && userId === parseInt(session.user.id)) {
      for (let userPlant of library.userPlants) {
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

        userPlant.lastWatering = lastWatering?.date;
        userPlant.lastFertilizing = lastFertilizing?.date;
      }
    }

    logger.info('User library fetched', { userId, page, limit, search });
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
    logger.error('Unhandled error in fetching user library', { error });
    throw new InternalServerError();
  }
}