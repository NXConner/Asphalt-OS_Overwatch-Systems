
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { calculateEstimate } from '@/lib/business-logic';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        createdBy: session.user.id,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    // Create estimate materials
    for (const material of estimateResult.materials) {
      // Find or create material in database
      let dbMaterial = await prisma.material.findFirst({
        where: { name: material.name }
      });

      if (!dbMaterial) {
        dbMaterial = await prisma.material.create({
          data: {
            name: material.name,
            unit: material.unit,
            costPerUnit: material.unitCost,
            supplier: 'SealMaster, Madison, NC',
            category: 'OTHER'
          }
        });
      }

      await prisma.estimateMaterial.create({
        data: {
          estimateId: estimate.id,
          materialId: dbMaterial.id,
          quantity: material.quantity,
          unitCost: material.unitCost,
          totalCost: material.totalCost
        }
      });
    }

    // Return estimate with full details
    const fullEstimate = await prisma.estimate.findUnique({
      where: { id: estimate.id },
      include: {
        materials: {
          include: {
            material: true
          }
        },
        job: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      ...fullEstimate,
      calculatedMaterials: estimateResult.materials,
      breakdown: estimateResult
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating estimate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const estimates = await prisma.estimate.findMany({
      include: {
        job: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        materials: {
          include: {
            material: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(estimates);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
