// File: src/app/api/trades/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { UnauthorizedError, BadRequestError, NotFoundError, InternalServerError } from '@/lib/errors';
import { checkUserBanStatus } from '@/lib/userModeration';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const tradeOfferSchema = z.object({
  offeredPlantId: z.number().int().positive(),
  requestedPlantId: z.number().int().positive(),
  message: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const body = await req.json();
    const { offeredPlantId, requestedPlantId, message } = tradeOfferSchema.parse(body);

    const offeredPlant = await prisma.userPlant.findUnique({
      where: { id: offeredPlantId },
      include: { library: true },
    });

    const requestedPlant = await prisma.userPlant.findUnique({
      where: { id: requestedPlantId },
      include: { library: true },
    });

    if (!offeredPlant || offeredPlant.library.userId !== parseInt(session.user.id)) {
      throw new BadRequestError("Offered plant not found or not owned by you");
    }

    if (!requestedPlant || requestedPlant.library.userId === parseInt(session.user.id)) {
      throw new BadRequestError("Requested plant not found or owned by you");
    }

    const tradeOffer = await prisma.tradeOffer.create({
      data: {
        offererId: parseInt(session.user.id),
        recipientId: requestedPlant.library.userId,
        offeredPlantId,
        requestedPlantId,
        message,
        status: 'PENDING',
      },
    });

    logger.info('Trade offer created', { tradeOfferId: tradeOffer.id, offererId: session.user.id, recipientId: requestedPlant.library.userId });
    return NextResponse.json(tradeOffer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in creating trade offer', { error });
    throw new InternalServerError();
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const tradeOffers = await prisma.tradeOffer.findMany({
      where: {
        OR: [
          { offererId: parseInt(session.user.id) },
          { recipientId: parseInt(session.user.id) },
        ],
      },
      include: {
        offerer: { select: { id: true, username: true, profilePicture: true } },
        recipient: { select: { id: true, username: true, profilePicture: true } },
        offeredPlant: { include: { plant: true } },
        requestedPlant: { include: { plant: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('Trade offers fetched', { userId: session.user.id });
    return NextResponse.json(tradeOffers);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching trade offers', { error });
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
    const tradeOfferId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!tradeOfferId || !action || !['accept', 'reject'].includes(action)) {
      throw new BadRequestError("Invalid trade offer ID or action");
    }

    const tradeOffer = await prisma.tradeOffer.findUnique({
      where: { id: parseInt(tradeOfferId) },
    });

    if (!tradeOffer || tradeOffer.recipientId !== parseInt(session.user.id)) {
      throw new NotFoundError("Trade offer not found or you're not the recipient");
    }

    if (tradeOffer.status !== 'PENDING') {
      throw new BadRequestError("This trade offer has already been processed");
    }

    if (action === 'accept') {
      // Perform the trade
      await prisma.$transaction(async (prisma) => {
        await prisma.userPlant.update({
          where: { id: tradeOffer.offeredPlantId },
          data: { libraryId: tradeOffer.recipientId },
        });

        await prisma.userPlant.update({
          where: { id: tradeOffer.requestedPlantId },
          data: { libraryId: tradeOffer.offererId },
        });

        await prisma.tradeOffer.update({
          where: { id: parseInt(tradeOfferId) },
          data: { status: 'ACCEPTED' },
        });
      });
    } else {
      await prisma.tradeOffer.update({
        where: { id: parseInt(tradeOfferId) },
        data: { status: 'REJECTED' },
      });
    }

    logger.info('Trade offer processed', { tradeOfferId, action, userId: session.user.id });
    return NextResponse.json({ message: `Trade offer ${action}ed successfully` });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in processing trade offer', { error });
    throw new InternalServerError();
  }
}