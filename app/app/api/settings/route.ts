
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';

export const dynamic = "force-dynamic";

export const GET = withSecurity(
  async () => {
    const session = await getServerSession(authOptions);
    
    const settings = await prisma.user.findUnique({
      where: { id: session!.user!.id },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        bio: true,
        isVeteran: true,
        veteranBranch: true,
        veteranServiceYears: true,
        image: true,
        hourlyRate: true,
        role: true,
      },
    });

    return NextResponse.json(settings);
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);

export const PUT = withSecurity(
  async (request: Request) => {
    const session = await getServerSession(authOptions);
    const data = await request.json();

    const updated = await prisma.user.update({
      where: { id: session!.user!.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        isVeteran: data.isVeteran,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        bio: true,
        isVeteran: true,
        veteranBranch: true,
        veteranServiceYears: true,
        image: true,
      },
    });

    return NextResponse.json(updated);
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);
