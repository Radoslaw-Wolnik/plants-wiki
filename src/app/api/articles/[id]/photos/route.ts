import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/uploadFile';
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

    const articleId = parseInt(params.id);
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const article = await prisma.article.findUnique({ 
      where: { id: articleId },
      include: { contributors: true }
    });

    if (!article) {
      throw new BadRequestError('Article not found');
    }

    // Check if the user is a contributor to the article
    if (!article.contributors.some(contributor => contributor.id === session.user.id)) {
      throw new UnauthorizedError('You do not have permission to upload photos to this article');
    }

    const fileUrl = await uploadFile(file, 'article', articleId);

    // Assuming you have an ArticlePhoto model in your schema
    const articlePhoto = await prisma.articlePhoto.create({
      data: {
        articleId,
        url: fileUrl,
        caption,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json({ success: true, photo: articlePhoto });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Error uploading article photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}