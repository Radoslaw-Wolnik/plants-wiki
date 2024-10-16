import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
import { z } from 'zod';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const addToGraveyardSchema = z.object({
  endDate: z.string().datetime(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const userPlantId = parseInt(params.id);
    const body = await req.json();
    const { endDate } = addToGraveyardSchema.parse(body);

    const userPlant = await prisma.userPlant.findUnique({
      where: { id: userPlantId },
      include: { library: true, plant: true },
    });

    if (!userPlant || userPlant.library.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("User plant not found or not owned by the user");
    }

    const graveyardItem = await prisma.graveyardPlant.create({
      data: {
        plantName: userPlant.plant.name,
        startDate: userPlant.acquiredDate,
        endDate: new Date(endDate),
        userId: parseInt(session.user.id),
      },
    });

    await prisma.userPlant.delete({
      where: { id: userPlantId },
    });

    logger.info('Plant added to graveyard', { graveyardItemId: graveyardItem.id, userPlantId, userId: session.user.id });
    return NextResponse.json(graveyardItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in adding plant to graveyard', { error });
    throw new InternalServerError();
  }
}