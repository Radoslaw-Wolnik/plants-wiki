// File: src/app/api/plants/verification/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { uploadFile } from '@/lib/uploadFile';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const plantVerificationSchema = z.object({
  name: z.string().min(1),
  scientificName: z.string().min(1),
  commonName: z.string().min(1),
  family: z.string().min(1),
  light: z.string().min(1),
  temperature: z.string().min(1),
  soil: z.string().min(1),
  climate: z.string().min(1),
  humidity: z.string().min(1),
  growthCycle: z.string().min(1),
  toxicity: z.string().min(1),
  petSafe: z.boolean(),
  plantType: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }
    await checkUserBanStatus(parseInt(session.user.id));

    const formData = await req.formData();
    const iconFile = formData.get('icon') as File;
    const plantData = Object.fromEntries(formData.entries());
    delete plantData.icon;

    const validatedData = plantVerificationSchema.parse(plantData);
    const iconUrl = await uploadFile(iconFile, ['image/jpeg', 'image/png', 'image/webp']);

    const plantVerification = await prisma.plantVerification.create({
      data: {
        ...validatedData,
        icon: iconUrl,
        submittedById: parseInt(session.user.id),
      },
    });

    logger.info('New plant verification submitted', { plantVerificationId: plantVerification.id, userId: session.user.id });
    return NextResponse.json(plantVerification, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in plant verification submission', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['MODERATOR', 'ADMIN'].includes(session.user.role)) {
      throw new UnauthorizedError();
    }

    const body = await req.json();
    const { id, status } = z.object({
      id: z.number(),
      status: z.enum(['APPROVED', 'REJECTED']),
    }).parse(body);

    const updatedVerification = await prisma.plantVerification.update({
      where: { id },
      data: {
        status,
        reviewedById: parseInt(session.user.id),
        reviewedAt: new Date(),
      },
    });

    if (status === 'APPROVED') {
      await prisma.plant.create({
        data: {
          name: updatedVerification.name,
          scientificName: updatedVerification.scientificName,
          commonName: updatedVerification.commonName,
          family: updatedVerification.family,
          icon: updatedVerification.icon,
          light: updatedVerification.light,
          temperature: updatedVerification.temperature,
          soil: updatedVerification.soil,
          climate: updatedVerification.climate,
          humidity: updatedVerification.humidity,
          growthCycle: updatedVerification.growthCycle,
          toxicity: updatedVerification.toxicity,
          petSafe: updatedVerification.petSafe,
          plantType: updatedVerification.plantType,
        },
      });
    }

    logger.info('Plant verification reviewed', { plantVerificationId: id, status, reviewerId: session.user.id });
    return NextResponse.json(updatedVerification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in plant verification review', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}