// File: src/app/api/plants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { uploadFile } from '@/lib/fileUpload';
import { checkUserBanStatus } from '@/lib/userModeration';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const plantSchema = z.object({
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

    if (!session) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(parseInt(session.user.id));

    const formData = await req.formData();
    const iconFile = formData.get('icon') as File;
    const plantData = Object.fromEntries(formData.entries());
    delete plantData.icon;

    const validatedData = plantSchema.parse(plantData);

    const iconUrl = await uploadFile(iconFile, ['image/jpeg', 'image/png', 'image/webp']);

    const plant = await prisma.plant.create({
      data: {
        ...validatedData,
        icon: iconUrl,
        userId: parseInt(session.user.id),
      },
    });

    logger.info('New plant created', { plantId: plant.id, userId: session.user.id });
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in plant creation', { error });
    throw new InternalServerError();
  }
}