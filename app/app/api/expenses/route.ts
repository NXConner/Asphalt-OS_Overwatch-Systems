
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { uploadFile } from '@/lib/s3';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
        job: { select: { title: true, address: true } },
        creator: { select: { firstName: true, lastName: true, email: true } },
        approver: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.expense.count({ where });

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const categoryId = formData.get('categoryId') as string;
    const expenseDate = new Date(formData.get('expenseDate') as string);
    const jobId = formData.get('jobId') as string || null;
    const vendor = formData.get('vendor') as string || null;
    const isTaxDeductible = formData.get('isTaxDeductible') === 'true';
    const isReimbursable = formData.get('isReimbursable') === 'true';
    
    const receiptFile = formData.get('receipt') as File | null;
    
    let receiptCloudStoragePath: string | null = null;
    let receiptFileName: string | null = null;
    let receiptContentType: string | null = null;

    // Handle receipt upload
    if (receiptFile && receiptFile.size > 0) {
      const buffer = Buffer.from(await receiptFile.arrayBuffer());
      receiptCloudStoragePath = await uploadFile(buffer, receiptFile.name);
      receiptFileName = receiptFile.name;
      receiptContentType = receiptFile.type;
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        categoryId,
        expenseDate,
        jobId,
        vendor,
        isTaxDeductible,
        isReimbursable,
        receiptCloudStoragePath,
        receiptFileName,
        receiptContentType,
        createdBy: session.user.id
      },
      include: {
        category: true,
        job: { select: { title: true, address: true } },
        creator: { select: { firstName: true, lastName: true } }
      }
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
