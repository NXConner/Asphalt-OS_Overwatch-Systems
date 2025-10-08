
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET debriefs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const userId = searchParams.get('userId');

    const where: any = {
      type: 'DEBRIEF',
    };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (userId) {
      where.authorId = userId;
    }

    const debriefs = await prisma.communication.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(debriefs);
  } catch (error: any) {
    console.error('Error fetching debriefs:', error);
    return NextResponse.json({ error: 'Failed to fetch debriefs', details: error.message }, { status: 500 });
  }
}

// POST create debrief
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const debrief = await prisma.communication.create({
      data: {
        type: 'DEBRIEF',
        authorId: (session.user as any).id,
        recipientIds: body.recipientIds || [],
        teamIds: body.teamIds || [],
        subject: body.subject,
        message: body.message,
        date: body.date ? new Date(body.date) : new Date(),
        tasksCompleted: body.tasksCompleted || null,
        problemsEncountered: body.problemsEncountered || null,
        nextDayPlan: body.nextDayPlan,
        hoursWorked: body.hoursWorked,
        jobsCompleted: body.jobsCompleted,
        attachments: body.attachments || null,
        priority: body.priority || 'NORMAL',
        responseRequired: body.responseRequired || false,
        responseDeadline: body.responseDeadline ? new Date(body.responseDeadline) : null,
        jobIds: body.jobIds || [],
      },
    });

    return NextResponse.json(debrief);
  } catch (error: any) {
    console.error('Error creating debrief:', error);
    return NextResponse.json({ error: 'Failed to create debrief', details: error.message }, { status: 500 });
  }
}
