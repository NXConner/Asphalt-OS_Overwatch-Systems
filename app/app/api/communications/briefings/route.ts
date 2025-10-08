
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET briefings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const where: any = {
      type: 'BRIEFING',
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

    const briefings = await prisma.communication.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(briefings);
  } catch (error: any) {
    console.error('Error fetching briefings:', error);
    return NextResponse.json({ error: 'Failed to fetch briefings', details: error.message }, { status: 500 });
  }
}

// POST create briefing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const briefing = await prisma.communication.create({
      data: {
        type: 'BRIEFING',
        authorId: (session.user as any).id,
        recipientIds: body.recipientIds || [],
        teamIds: body.teamIds || [],
        subject: body.subject,
        message: body.message,
        date: body.date ? new Date(body.date) : new Date(),
        nextDayPlan: body.nextDayPlan,
        attachments: body.attachments || null,
        priority: body.priority || 'NORMAL',
        responseRequired: body.responseRequired || false,
        responseDeadline: body.responseDeadline ? new Date(body.responseDeadline) : null,
        jobIds: body.jobIds || [],
      },
    });

    return NextResponse.json(briefing);
  } catch (error: any) {
    console.error('Error creating briefing:', error);
    return NextResponse.json({ error: 'Failed to create briefing', details: error.message }, { status: 500 });
  }
}
