
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'MONTHLY';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get current period dates
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date = now;

    switch (period) {
      case 'DAILY':
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'WEEKLY':
        const dayOfWeek = now.getDay();
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        break;
      case 'MONTHLY':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'QUARTERLY':
        const quarter = Math.floor(now.getMonth() / 3);
        periodStart = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'YEARLY':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        periodStart = new Date(0); // All time
    }

    const leaderboard = await prisma.leaderboardEntry.findMany({
      where: {
        period: period as any,
        periodStart: {
          gte: periodStart,
        },
        isActive: true,
      },
      orderBy: [
        { totalPoints: 'desc' },
        { jobsCompleted: 'desc' },
      ],
      take: limit,
    });

    // Enrich with user data
    const enrichedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: {
            name: true,
            firstName: true,
            lastName: true,
          },
        });

        return {
          ...entry,
          userName: user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.name || 'Unknown',
        };
      })
    );

    return NextResponse.json(enrichedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
