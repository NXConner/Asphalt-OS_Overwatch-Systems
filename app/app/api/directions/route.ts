

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/directions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { origin, destination } = await request.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    // Get current business settings for fuel calculations
    const settings = await prisma.businessSetting.findMany();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = parseFloat(setting.value);
      return acc;
    }, {} as Record<string, number>);

    // The actual directions calculation will be done on the client side
    // with Google Maps Directions API due to browser security requirements
    // This endpoint returns the current business settings for calculations
    return NextResponse.json({
      settings: {
        vehicleMpg: settingsMap.VEHICLE_MPG || 17.5,
        fuelPrice: settingsMap.FUEL_PRICE || 3.50,
      }
    });
  } catch (error) {
    console.error('Error in directions API:', error);
    return NextResponse.json(
      { error: 'Failed to process directions request' },
      { status: 500 }
    );
  }
}

