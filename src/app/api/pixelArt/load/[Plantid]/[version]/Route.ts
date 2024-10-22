// app/api/icon/load/[plantId]/[version]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { plantId: string, version: string } }
) {
  try {
    const plantId = parseInt(params.plantId);
    const version = parseInt(params.version);

    const iconRecord = await prisma.plantIcon.findFirst({
      where: {
        plantId,
        version,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!iconRecord) {
      return NextResponse.json({ message: 'Icon not found' }, { status: 404 });
    }

    const jsonPath = path.join(process.cwd(), 'public', iconRecord.jsonPath);
    const projectData = await fs.readFile(jsonPath, 'utf-8');
    
    return NextResponse.json({
      ...JSON.parse(projectData),
      creator: iconRecord.user,
      status: iconRecord.status
    });

  } catch (error) {
    console.error('Error loading icon:', error);
    return NextResponse.json({ message: 'Error loading icon' }, { status: 404 });
  }
}