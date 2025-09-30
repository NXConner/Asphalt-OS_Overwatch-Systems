
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { downloadFile } from '@/lib/s3';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      select: { receiptCloudStoragePath: true, receiptFileName: true }
    });

    if (!expense || !expense.receiptCloudStoragePath) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    // Generate signed URL for receipt download
    const signedUrl = await downloadFile(expense.receiptCloudStoragePath);
    
    return NextResponse.json({ 
      downloadUrl: signedUrl,
      fileName: expense.receiptFileName 
    });
  } catch (error) {
    console.error('Error getting receipt:', error);
    return NextResponse.json({ error: 'Failed to get receipt' }, { status: 500 });
  }
}
