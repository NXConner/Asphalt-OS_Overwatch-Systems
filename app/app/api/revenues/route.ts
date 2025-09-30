
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;

    const revenues = await prisma.revenue.findMany({
      where,
      include: {
        job: { select: { title: true, address: true } },
        creator: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.revenue.count({ where });

    return NextResponse.json({
      revenues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching revenues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const revenue = await prisma.revenue.create({
      data: {
        ...body,
        createdBy: session.user.id
      },
      include: {
        job: { select: { title: true, address: true } },
        creator: { select: { firstName: true, lastName: true } }
      }
    });

    return NextResponse.json(revenue, { status: 201 });
  } catch (error) {
    console.error('Error creating revenue:', error);
    return NextResponse.json({ error: 'Failed to create revenue' }, { status: 500 });
  }
}
