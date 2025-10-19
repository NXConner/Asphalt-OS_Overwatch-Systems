
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';
import { createClientSchema, updateClientSchema } from '@/lib/validations/client.validation';

// GET all clients
export const GET = withSecurity(
  async (request: Request) => {
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
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);

// POST create new client
export const POST = withSecurity(
  async (request: Request) => {
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

    return NextResponse.json(client, { status: 201 });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    rateLimit: rateLimiters.general,
  }
);
