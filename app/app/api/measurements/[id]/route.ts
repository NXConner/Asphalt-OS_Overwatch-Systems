
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Fetch single measurement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const measurement = await prisma.mapMeasurement.findUnique({
      where: { id: params.id },
      include: { job: true },
    });

    if (!measurement) {
      return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });
    }

    return NextResponse.json(measurement);
  } catch (error) {
    console.error('Error fetching measurement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update measurement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const measurement = await prisma.mapMeasurement.update({
      where: { id: params.id },
      data: {
        name: body.name,
        vertices: body.vertices,
        area: body.area,
        perimeter: body.perimeter,
        length: body.length,
        width: body.width,
        color: body.color,
        isVisible: body.isVisible,
        isManuallyAdjusted: true,
        notes: body.notes,
      },
    });

    return NextResponse.json(measurement);
  } catch (error) {
    console.error('Error updating measurement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete measurement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.mapMeasurement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting measurement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
