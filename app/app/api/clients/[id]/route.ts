
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET single client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        contracts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        documents: {
          include: {
            document: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Failed to fetch client', details: error.message }, { status: 500 });
  }
}

// PUT update client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const client = await prisma.client.update({
      where: { id: params.id },
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
        isActive: body.isActive,
      },
    });

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Failed to update client', details: error.message }, { status: 500 });
  }
}

// DELETE client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Failed to delete client', details: error.message }, { status: 500 });
  }
}
