
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Fetch all measurements
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    const measurements = await prisma.mapMeasurement.findMany({
      where: jobId ? { jobId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new measurement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Calculate center point
    const vertices = body.vertices as Array<{ lat: number; lng: number }>;
    const centerLat = vertices.reduce((sum, v) => sum + v.lat, 0) / vertices.length;
    const centerLng = vertices.reduce((sum, v) => sum + v.lng, 0) / vertices.length;

    const measurement = await prisma.mapMeasurement.create({
      data: {
        name: body.name,
        type: body.type || 'POLYGON',
        vertices: body.vertices,
        area: body.area,
        perimeter: body.perimeter,
        length: body.length,
        width: body.width,
        detectedType: body.detectedType,
        aiConfidence: body.aiConfidence,
        isAIGenerated: body.isAIGenerated || false,
        isManuallyAdjusted: false,
        jobId: body.jobId,
        color: body.color || '#3b82f6',
        strokeWidth: 3,
        fillOpacity: 0.3,
        isVisible: true,
        centerLat,
        centerLng,
        createdBy: session.user.id,
        notes: body.notes,
      },
    });

    // If jobId provided, update job's square footage
    if (body.jobId && body.area) {
      await prisma.job.update({
        where: { id: body.jobId },
        data: { squareFootage: body.area },
      });
    }

    return NextResponse.json(measurement, { status: 201 });
  } catch (error) {
    console.error('Error creating measurement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
