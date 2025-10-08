
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET all checkouts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.checkedOutBy = userId;

    const checkouts = await prisma.equipmentCheckout.findMany({
      where,
      include: {
        equipment: true,
      },
      orderBy: {
        checkedOutAt: 'desc',
      },
    });

    return NextResponse.json(checkouts);
  } catch (error: any) {
    console.error('Error fetching checkouts:', error);
    return NextResponse.json({ error: 'Failed to fetch checkouts', details: error.message }, { status: 500 });
  }
}

// POST checkout equipment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Update equipment status
    await prisma.equipmentItem.update({
      where: { id: body.equipmentId },
      data: { status: 'CHECKED_OUT' },
    });

    // Create checkout record
    const checkout = await prisma.equipmentCheckout.create({
      data: {
        equipmentId: body.equipmentId,
        checkedOutBy: body.checkedOutBy || (session.user as any).id,
        expectedReturnDate: body.expectedReturnDate ? new Date(body.expectedReturnDate) : null,
        checkoutLocation: body.checkoutLocation,
        jobSiteId: body.jobSiteId,
        conditionAtCheckout: body.conditionAtCheckout,
        notes: body.notes,
      },
      include: {
        equipment: true,
      },
    });

    return NextResponse.json(checkout);
  } catch (error: any) {
    console.error('Error checking out equipment:', error);
    return NextResponse.json({ error: 'Failed to checkout equipment', details: error.message }, { status: 500 });
  }
}
