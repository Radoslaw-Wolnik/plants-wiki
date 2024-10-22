// app/api/icon/save/[plantId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

const ICONS_DIR = path.join(process.cwd(), 'public', 'upload', 'icons');

const getNextVersionNumber = async (plantId: number): Promise<number> => {
  try {
    const existingVersions = await prisma.plantIcon.findMany({
      where: { plantId },
      select: { version: true },
    });
    
    const versions = existingVersions.map(v => v.version);
    return versions.length > 0 ? Math.max(...versions) + 1 : 1;
  } catch {
    return 1;
  }
};

export async function POST(
  request: NextRequest,
  { params }: { params: { plantId: string } }
) {
  try {
    const plantId = parseInt(params.plantId);
    const { imageData, layers, userId } = await request.json();

    // Ensure directory exists
    const plantIconDir = path.join(ICONS_DIR, plantId.toString());
    await fs.mkdir(plantIconDir, { recursive: true });
    
    const version = await getNextVersionNumber(plantId);
    const fileName = `icon-${version.toString().padStart(3, '0')}`;
    
    // Save files
    const jsonPath = path.join(plantIconDir, `${fileName}.json`);
    const pngPath = path.join(plantIconDir, `${fileName}.png`);
    
    // Save JSON project file
    await fs.writeFile(
      jsonPath,
      JSON.stringify({ imageData, layers, version })
    );

    // Save PNG image
    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
    await fs.writeFile(pngPath, imageBuffer);

    // Create database record
    const iconRecord = await prisma.plantIcon.create({
      data: {
        plantId,
        userId,
        version,
        jsonPath: `/upload/icons/${plantId}/${fileName}.json`,
        imagePath: `/upload/icons/${plantId}/${fileName}.png`,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      message: 'Icon saved successfully',
      version,
      fileName,
      iconId: iconRecord.id
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving icon:', error);
    return NextResponse.json({ message: 'Error saving icon' }, { status: 500 });
  }
}