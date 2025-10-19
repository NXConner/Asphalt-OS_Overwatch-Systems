
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';
import { createBidSchema, updateBidSchema } from '@/lib/validations/bid.validation';

export const GET = withSecurity(
  async (request: Request) => {
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
        createdById: session!.user!.id,
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

    return NextResponse.json(bid, { status: 201 });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    rateLimit: rateLimiters.general,
  }
);

export const PUT = withSecurity(
  async (request: Request) => {
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
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    rateLimit: rateLimiters.general,
  }
);

export const DELETE = withSecurity(
  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Bid ID required' }, { status: 400 });
    }

    await prisma.bid.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    rateLimit: rateLimiters.strict,
  }
);
