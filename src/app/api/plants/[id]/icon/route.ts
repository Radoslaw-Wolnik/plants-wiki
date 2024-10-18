import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/uploadFile';
import { UnauthorizedError, BadRequestError, InternalServerError } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { checkUserBanStatus } from '@/lib/userModeration';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }

    await checkUserBanStatus(session.user.id);

    // Check if the user has permission to upload plant icons
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
      throw new UnauthorizedError('You do not have permission to upload plant icons');
    }

    const plantId = parseInt(params.id);
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const plant = await prisma.plant.findUnique({ where: { id: plantId } });
    if (!plant) {
      throw new BadRequestError('Plant not found');
    }

    const fileUrl = await uploadFile(file, 'plant-icon', plantId);

    if (plant.icon) {
      await deleteFile(plant.icon);
    }

    const updatedPlant = await prisma.plant.update({
      where: { id: plantId },
      data: { icon: fileUrl },
    });

    return NextResponse.json({ success: true, plant: updatedPlant });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error uploading plant icon:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}