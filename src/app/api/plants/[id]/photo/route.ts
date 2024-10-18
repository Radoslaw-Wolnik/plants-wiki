import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/uploadFile';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { checkUserBanStatus } from '@/lib/userModeration';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    // Check if the user has permission to upload global plant photos
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
      throw new UnauthorizedError('You do not have permission to upload global plant photos');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const plantId = formData.get('plantId') as string;
    const description = formData.get('description') as string;

    if (!file || !plantId) {
      throw new BadRequestError('Missing required fields');
    }

    const plant = await prisma.plant.findUnique({ where: { id: parseInt(plantId) } });
    if (!plant) {
      throw new BadRequestError('Plant not found');
    }

    const fileUrl = await uploadFile(file, 'plant', plantId);

    // Assuming you have a PlantPhoto model in your schema
    const plantPhoto = await prisma.plantPhoto.create({
      data: {
        plantId: parseInt(plantId),
        url: fileUrl,
        description,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json({ success: true, photo: plantPhoto });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error uploading global plant photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}