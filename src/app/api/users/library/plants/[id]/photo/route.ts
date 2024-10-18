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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userPlantId = formData.get('userPlantId') as string;
    const description = formData.get('description') as string;

    if (!file || !userPlantId) {
      throw new BadRequestError('Missing required fields');
    }

    const userPlant = await prisma.userPlant.findUnique({
      where: { id: parseInt(userPlantId) },
      include: { library: true },
    });

    if (!userPlant || userPlant.library.userId !== session.user.id) {
      throw new BadRequestError('User plant not found or not owned by the user');
    }

    const fileUrl = await uploadFile(file, 'user-plant', userPlantId);

    const userPlantPhoto = await prisma.userPlantPhoto.create({
      data: {
        userPlantId: parseInt(userPlantId),
        url: fileUrl,
        description,
      },
    });

    return NextResponse.json({ success: true, photo: userPlantPhoto });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error uploading user plant photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}