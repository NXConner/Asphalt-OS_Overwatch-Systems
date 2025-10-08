
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET training assignments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: any = {};
    if (userId) {
      where.userId = userId;
    } else {
      // If no userId specified, show current user's assignments
      where.userId = (session.user as any).id;
    }
    if (status) where.status = status;

    const assignments = await prisma.trainingAssignment.findMany({
      where,
      include: {
        course: true,
      },
      orderBy: {
        assignedDate: 'desc',
      },
    });

    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments', details: error.message }, { status: 500 });
  }
}

// POST assign training
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const assignment = await prisma.trainingAssignment.create({
      data: {
        userId: body.userId,
        courseId: body.courseId,
        assignedBy: (session.user as any).id,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        notes: body.notes,
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error('Error assigning training:', error);
    return NextResponse.json({ error: 'Failed to assign training', details: error.message }, { status: 500 });
  }
}
