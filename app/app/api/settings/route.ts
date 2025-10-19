
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get app settings
    const appSettings = await prisma.appSettings.findFirst({
      where: { userId: user.id },
    });

    return NextResponse.json({
      user,
      settings: appSettings || {},
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { mapSettings, notifications, display } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert app settings
    const settings = await prisma.appSettings.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        mapDefaultLat: mapSettings?.defaultLat,
        mapDefaultLng: mapSettings?.defaultLng,
        mapDefaultZoom: mapSettings?.defaultZoom,
        mapType: mapSettings?.defaultMapType || 'hybrid',
      },
      update: {
        mapDefaultLat: mapSettings?.defaultLat,
        mapDefaultLng: mapSettings?.defaultLng,
        mapDefaultZoom: mapSettings?.defaultZoom,
        mapType: mapSettings?.defaultMapType || 'hybrid',
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
