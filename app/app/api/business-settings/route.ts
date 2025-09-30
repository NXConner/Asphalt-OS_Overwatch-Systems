

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/business-settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.businessSetting.findMany({
      orderBy: [
        { category: 'asc' },
        { label: 'asc' }
      ]
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business settings' },
      { status: 500 }
    );
  }
}

// PUT /api/business-settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only ADMIN and OWNER can update business settings
    if (!['ADMIN', 'OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const updates = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Update settings in transaction
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        if (!update.key || update.value === undefined) {
          throw new Error('Missing required fields: key or value');
        }

        await tx.businessSetting.update({
          where: { key: update.key },
          data: { 
            value: String(update.value),
            updatedAt: new Date()
          }
        });
      }
    });

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating business settings:', error);
    return NextResponse.json(
      { error: 'Failed to update business settings' },
      { status: 500 }
    );
  }
}

