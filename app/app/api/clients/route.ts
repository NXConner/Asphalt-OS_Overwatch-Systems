
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET all clients
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const where: any = {};
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        _count: {
          select: {
            jobs: true,
            contracts: true,
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients', details: error.message }, { status: 500 });
  }
}

// POST create new client
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const client = await prisma.client.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        businessType: body.businessType,
        taxId: body.taxId,
        preferredContact: body.preferredContact,
        notes: body.notes,
        rating: body.rating,
        creditLimit: body.creditLimit,
        paymentTerms: body.paymentTerms,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client', details: error.message }, { status: 500 });
  }
}
