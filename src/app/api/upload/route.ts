import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedError, BadRequestError, InternalServerError, AppError } from '@/lib/errors';
import logger from '@/lib/logger';

export const runtime = 'nodejs' // Specify Node.js runtime
export const dynamic = 'force-dynamic' // Make this route dynamic

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new UnauthorizedError();
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueFilename);
    
    await writeFile(filePath, buffer);
    
    const fileUrl = `/uploads/${uniqueFilename}`;
    logger.info('Image uploaded', { userId: session.user.id, fileUrl });
    
    return NextResponse.json({ fileUrl });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in image upload', { error });
    throw new InternalServerError();
  }
}