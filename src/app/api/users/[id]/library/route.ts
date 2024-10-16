import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { UnauthorizedError, NotFoundError, InternalServerError, AppError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

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


    logger.info('User library fetched', { userId: session.user.id, page, limit, search });
    return NextResponse.json({
      library: { ...library, userPlants: library.userPlants },
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