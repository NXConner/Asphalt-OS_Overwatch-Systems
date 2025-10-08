
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET all equipment items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { itemNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (status) where.status = status;

    const items = await prisma.equipmentItem.findMany({
      where,
      include: {
        _count: {
          select: {
            checkouts: true,
            maintenanceRecords: true,
          },
        },
      },
      orderBy: {
        itemNumber: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json({ error: 'Failed to fetch equipment', details: error.message }, { status: 500 });
  }
}

// POST create new equipment item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const item = await prisma.equipmentItem.create({
      data: {
        name: body.name,
        itemNumber: body.itemNumber,
        category: body.category,
        description: body.description,
        brand: body.brand,
        model: body.model,
        serialNumber: body.serialNumber,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchasePrice: body.purchasePrice,
        supplier: body.supplier,
        status: body.status || 'AVAILABLE',
        condition: body.condition,
        location: body.location,
        lastMaintenanceDate: body.lastMaintenanceDate ? new Date(body.lastMaintenanceDate) : null,
        nextMaintenanceDate: body.nextMaintenanceDate ? new Date(body.nextMaintenanceDate) : null,
        maintenanceInterval: body.maintenanceInterval,
        qrCode: body.qrCode,
        barcode: body.barcode,
        replacementCost: body.replacementCost,
        depreciationRate: body.depreciationRate,
        notes: body.notes,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Error creating equipment:', error);
    return NextResponse.json({ error: 'Failed to create equipment', details: error.message }, { status: 500 });
  }
}
