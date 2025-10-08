
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// POST return equipment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get the checkout record
    const checkout = await prisma.equipmentCheckout.findUnique({
      where: { id: params.id },
      include: { equipment: true },
    });

    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 });
    }

    // Update checkout record
    const updatedCheckout = await prisma.equipmentCheckout.update({
      where: { id: params.id },
      data: {
        returnedAt: new Date(),
        returnedBy: (session.user as any).id,
        returnLocation: body.returnLocation,
        conditionAtReturn: body.conditionAtReturn,
        damageNotes: body.damageNotes,
        status: body.damageNotes ? 'DAMAGED' : 'RETURNED',
      },
    });

    // Update equipment status
    const newStatus = body.damageNotes ? 'IN_MAINTENANCE' : 'AVAILABLE';
    await prisma.equipmentItem.update({
      where: { id: checkout.equipmentId },
      data: { 
        status: newStatus,
        condition: body.conditionAtReturn,
      },
    });

    return NextResponse.json(updatedCheckout);
  } catch (error: any) {
    console.error('Error returning equipment:', error);
    return NextResponse.json({ error: 'Failed to return equipment', details: error.message }, { status: 500 });
  }
}
