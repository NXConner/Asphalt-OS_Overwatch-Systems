
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (status) whereClause.status = status;

    const bids = await prisma.bid.findMany({
      where: whereClause,
      include: {
        client: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Generate bid number
    const lastBid = await prisma.bid.findFirst({
      orderBy: { bidNumber: 'desc' },
    });

    const lastNumber = lastBid?.bidNumber 
      ? parseInt(lastBid.bidNumber.replace('BID-', ''))
      : 0;
    const bidNumber = `BID-${String(lastNumber + 1).padStart(6, '0')}`;

    const bid = await prisma.bid.create({
      data: {
        bidNumber,
        title: data.title,
        description: data.description,
        clientId: data.clientId,
        status: data.status || 'DRAFT',
        submittedDate: data.submittedDate ? new Date(data.submittedDate) : null,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        bidAmount: data.bidAmount || 0,
        estimatedHours: data.estimatedHours,
        probability: data.probability || 0,
        notes: data.notes,
        createdById: session.user.id,
      },
      include: {
        client: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json({ error: 'Failed to create bid' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...bidData } = data;

    const bid = await prisma.bid.update({
      where: { id },
      data: {
        ...bidData,
        submittedDate: bidData.submittedDate ? new Date(bidData.submittedDate) : null,
        expirationDate: bidData.expirationDate ? new Date(bidData.expirationDate) : null,
      },
      include: {
        client: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error updating bid:', error);
    return NextResponse.json({ error: 'Failed to update bid' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Bid ID required' }, { status: 400 });
    }

    await prisma.bid.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bid:', error);
    return NextResponse.json({ error: 'Failed to delete bid' }, { status: 500 });
  }
}
