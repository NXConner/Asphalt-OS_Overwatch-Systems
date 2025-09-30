
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { downloadFile, deleteFile } from '@/lib/s3';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        job: { select: { title: true, address: true } },
        creator: { select: { firstName: true, lastName: true, email: true } },
        approver: { select: { firstName: true, lastName: true } }
      }
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Check if user can edit this expense (owner or creator)
    const existingExpense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: { creator: true }
    });

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const canEdit = user?.role === 'OWNER' || user?.role === 'ADMIN' || existingExpense.createdBy === session.user.id;
    
    if (!canEdit) {
      return NextResponse.json({ error: 'Not authorized to edit this expense' }, { status: 403 });
    }

    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: body,
      include: {
        category: true,
        job: { select: { title: true, address: true } },
        creator: { select: { firstName: true, lastName: true } },
        approver: { select: { firstName: true, lastName: true } }
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can delete this expense (owner or creator)
    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: { creator: true }
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const canDelete = user?.role === 'OWNER' || user?.role === 'ADMIN' || expense.createdBy === session.user.id;
    
    if (!canDelete) {
      return NextResponse.json({ error: 'Not authorized to delete this expense' }, { status: 403 });
    }

    // Delete receipt from S3 if it exists
    if (expense.receiptCloudStoragePath) {
      try {
        await deleteFile(expense.receiptCloudStoragePath);
      } catch (error) {
        console.error('Error deleting receipt from S3:', error);
      }
    }

    await prisma.expense.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
