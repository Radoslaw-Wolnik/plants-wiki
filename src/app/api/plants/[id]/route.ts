import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NotFoundError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const plantId = parseInt(params.id);
    

    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
    });
    

    if (!plant) {
      throw new NotFoundError("Plant not found");
    }

    logger.info('Plant details fetched', { plantId, userId: session?.user?.id });
    return NextResponse.json(plant);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching plant details', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}