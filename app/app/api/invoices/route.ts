
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { withSecurity } from '@/lib/security-middleware';
import { rateLimiters } from '@/lib/rate-limiter';
import { createInvoiceSchema, updateInvoiceSchema } from '@/lib/validations/invoice.validation';

export const GET = withSecurity(
  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const clientId = searchParams.get('clientId');

    let whereClause: any = {};
    if (jobId) whereClause.jobId = jobId;
    if (clientId) whereClause.job = { clientId };

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        job: {
          include: {
            client: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invoices);
  },
  {
    requireAuth: true,
    rateLimit: rateLimiters.general,
  }
);

export const POST = withSecurity(
  async (request: Request) => {
    const data = await request.json();

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' },
    });

    const lastNumber = lastInvoice?.invoiceNumber 
      ? parseInt(lastInvoice.invoiceNumber.replace('INV-', ''))
      : 0;
    const invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`;

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        jobId: data.jobId,
        status: data.status || 'DRAFT',
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subtotal: data.subtotal || 0,
        tax: data.tax || 0,
        total: data.total || 0,
        notes: data.notes,
        items: {
          create: data.items?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })) || [],
        },
      },
      include: {
        job: {
          include: {
            client: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    validationSchema: createInvoiceSchema,
    rateLimit: rateLimiters.general,
  }
);

export const PUT = withSecurity(
  async (request: Request) => {
    const data = await request.json();
    const { id, items, ...invoiceData } = data;

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...invoiceData,
        items: {
          deleteMany: {},
          create: items?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })) || [],
        },
      },
      include: {
        job: {
          include: {
            client: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(invoice);
  },
  {
    requireAuth: true,
    allowedRoles: ['admin', 'manager'],
    validationSchema: updateInvoiceSchema,
    rateLimit: rateLimiters.general,
  }
);

export const DELETE = withSecurity(
  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  },
  {
    requireAuth: true,
    allowedRoles: ['admin'],
    rateLimit: rateLimiters.strict,
  }
);

