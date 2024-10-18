import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/uploadFile';
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

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const userId = session.user.id;
    const fileUrl = await uploadFile(file, 'user-profile', userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.profilePicture) {
      await deleteFile(user.profilePicture);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: fileUrl },
    });

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}