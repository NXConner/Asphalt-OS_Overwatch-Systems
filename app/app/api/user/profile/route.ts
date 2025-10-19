
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
    
    const profile = await prisma.user.findUnique({
      where: { id: session!.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        address: true,
        bio: true,
        hireDate: true,
        isVeteran: true,
        veteranBranch: true,
        veteranServiceYears: true,
        image: true,
        hourlyRate: true,
        createdAt: true,
      },
    });

    return NextResponse.json(profile);
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

    const profile = await prisma.user.update({
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
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        address: true,
        bio: true,
        hireDate: true,
        isVeteran: true,
        veteranBranch: true,
        veteranServiceYears: true,
        image: true,
        hourlyRate: true,
      },
    });

    return NextResponse.json(profile);
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);
