
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { calculateEstimate } from '@/lib/business-logic';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';
import { createEstimateSchema } from '@/lib/validations/estimate.validation';

export const dynamic = "force-dynamic";

export const GET = withSecurity(
  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    const where: any = {};
    if (jobId) where.jobId = jobId;

    const estimates = await prisma.estimate.findMany({
      where,
      include: {
        job: {
          select: {
            title: true,
            address: true,
          },
        },
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(estimates);
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);

export const POST = withSecurity(
  async (request: Request) => {
    const session = await getServerSession(authOptions);
    const input = await request.json();
    
    // Calculate the estimate using business logic
    const estimateResult = calculateEstimate({
      jobType: input.jobType,
      squareFootage: input.squareFootage,
      linearFootage: input.linearFootage,
      numberOfStalls: input.numberOfStalls,
      hasOilSpots: input.hasOilSpots,
      crackSeverity: input.crackSeverity,
      jobAddress: input.jobAddress,
      businessAddress: '337 Ayers Orchard Road, Stuart, VA 24171'
    });

    // Generate estimate number
    const estimateCount = await prisma.estimate.count();
    const estimateNumber = `EST-${String(estimateCount + 1).padStart(4, '0')}`;

    // Create estimate in database
    const estimate = await prisma.estimate.create({
      data: {
        jobId: input.jobId,
        estimateNumber,
        laborHours: estimateResult.labor.hours,
        laborRate: estimateResult.labor.rate,
        laborCost: estimateResult.labor.cost,
        materialCost: estimateResult.materials.reduce((sum, m) => sum + m.totalCost, 0),
        equipmentCost: estimateResult.equipment.equipmentCost,
        fuelCost: estimateResult.equipment.fuelCost,
        travelDistance: estimateResult.travel.distance,
        travelCost: estimateResult.travel.cost,
        subtotal: estimateResult.subtotal,
        overhead: estimateResult.overhead,
        profit: estimateResult.profit,
        totalCost: estimateResult.total,
        createdBy: session!.user!.id,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    return NextResponse.json({ estimate, breakdown: estimateResult }, { status: 201 });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    validationSchema: createEstimateSchema,
    rateLimit: rateLimiters.general,
  }
);
