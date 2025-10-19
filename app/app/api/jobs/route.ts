
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';
import { createJobSchema, updateJobSchema } from '@/lib/validations/job.validation';

export const dynamic = "force-dynamic";

export const GET = withSecurity(
  async () => {
    const session = await getServerSession(authOptions);
    
    const jobs = await prisma.job.findMany({
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(jobs);
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);

export const POST = withSecurity(
  async (request: Request) => {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    
    const job = await prisma.job.create({
      data: {
        ...data,
        createdBy: session!.user!.id,
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(job, { status: 201 });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager', 'foreman'],
    validationSchema: createJobSchema,
    rateLimit: rateLimiters.general,
  }
);
