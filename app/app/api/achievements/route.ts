
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';

export const dynamic = "force-dynamic";

// Get all achievements (definitions)
export const GET = withSecurity(
  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get user's earned achievements
      const userAchievements = await prisma.employeeAchievement.findMany({
        where: { userId },
        include: {
          achievement: true,
        },
        orderBy: {
          earnedDate: 'desc',
        },
      });

      return NextResponse.json(userAchievements);
    } else {
      // Get all available achievements
      const achievements = await prisma.achievement.findMany({
        where: { isActive: true },
        orderBy: {
          category: 'asc',
        },
      });

      return NextResponse.json(achievements);
    }
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);

// Award achievement to user
export const POST = withSecurity(
  async (request: Request) => {
    const data = await request.json();
    
    // Check if achievement already earned
    const existing = await prisma.employeeAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: data.userId,
          achievementId: data.achievementId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Achievement already earned' },
        { status: 400 }
      );
    }

    const userAchievement = await prisma.employeeAchievement.create({
      data: {
        userId: data.userId,
        achievementId: data.achievementId,
        progress: data.progress || 100,
        metadata: data.metadata,
      },
      include: {
        achievement: true,
      },
    });

    return NextResponse.json(userAchievement, { status: 201 });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    rateLimit: rateLimiters.general,
  }
);
