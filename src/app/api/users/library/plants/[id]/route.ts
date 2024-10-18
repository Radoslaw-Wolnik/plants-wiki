import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/uploadFile';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { checkUserBanStatus } from '@/lib/userModeration';
import { z } from 'zod';

const updateSchema = z.object({
  nickname: z.string().optional(),
  notes: z.string().optional(),
  watering: z.object({
    date: z.string(),
    amount: z.number().optional(),
    notes: z.string().optional(),
  }).optional(),
  fertilizing: z.object({
    date: z.string(),
    fertilizer: z.string(),
    amount: z.number().optional(),
    notes: z.string().optional(),
  }).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    const userPlantId = parseInt(params.id);
    const userPlant = await prisma.userPlant.findUnique({
      where: { id: userPlantId },
      include: { library: true },
    });

    if (!userPlant || userPlant.library.userId !== session.user.id) {
      throw new BadRequestError('User plant not found or not owned by the user');
    }

    const formData = await req.formData();
    const updateData = JSON.parse(formData.get('data') as string);
    const file = formData.get('file') as File | null;

    const validatedData = updateSchema.parse(updateData);

    let photoUrl: string | undefined;
    if (file) {
      photoUrl = await uploadFile(file, 'user-plant', userPlantId);
    }

    const updatedPlant = await prisma.$transaction(async (tx) => {
      const plant = await tx.userPlant.update({
        where: { id: userPlantId },
        data: {
          nickname: validatedData.nickname,
          notes: validatedData.notes,
        },
      });

      if (photoUrl) {
        await tx.userPlantPhoto.create({
          data: {
            userPlantId,
            url: photoUrl,
            description: 'User uploaded photo',
          },
        });
      }

      if (validatedData.watering) {
        await tx.wateringLog.create({
          data: {
            userPlantId,
            date: new Date(validatedData.watering.date),
            amount: validatedData.watering.amount,
            notes: validatedData.watering.notes,
          },
        });
      }

      if (validatedData.fertilizing) {
        await tx.fertilizingLog.create({
          data: {
            userPlantId,
            date: new Date(validatedData.fertilizing.date),
            fertilizer: validatedData.fertilizing.fertilizer,
            amount: validatedData.fertilizing.amount,
            notes: validatedData.fertilizing.notes,
          },
        });
      }

      return plant;
    });

    return NextResponse.json({ success: true, plant: updatedPlant });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error updating user plant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}