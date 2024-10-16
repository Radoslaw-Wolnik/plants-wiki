import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';
import { uploadFile } from '@/lib/fileUpload';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    if (!type || !['profile', 'article', 'plant-icon', 'plant-photo'].includes(type)) {
      throw new BadRequestError("Invalid upload type");
    }

    let allowedTypes: string[];
    switch (type) {
      case 'profile':
      case 'plant-icon':
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        break;
      case 'article':
      case 'plant-photo':
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        break;
      default:
        throw new BadRequestError("Invalid upload type");
    }

    const fileUrl = await uploadFile(file, allowedTypes);
    
    logger.info('Image uploaded', { userId: session.user.id, fileUrl, type });
   
    return NextResponse.json({ fileUrl });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in image upload', { error: error instanceof Error ? error.message : String(error) });
    throw new InternalServerError();
  }
}