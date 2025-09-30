
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeTimesheet = await prisma.timesheet.findFirst({
      where: {
        userId: session.user.id,
        clockOut: null
      }
    });

    return NextResponse.json({
      isClockedIn: !!activeTimesheet,
      timesheet: activeTimesheet
    });
  } catch (error) {
    console.error('Error fetching clock status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
