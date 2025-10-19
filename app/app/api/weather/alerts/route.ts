export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Fetch weather alerts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const alerts = await prisma.weatherAlert.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new weather alert
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === 'EMPLOYEE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    const alert = await prisma.weatherAlert.create({
      data: {
        alertType: body.alertType,
        severity: body.severity,
        title: body.title,
        description: body.description,
        latitude: body.latitude,
        longitude: body.longitude,
        radius: body.radius || 50000,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        conditions: body.conditions,
        temperature: body.temperature,
        precipitation: body.precipitation,
        windSpeed: body.windSpeed,
        workRecommendation: body.workRecommendation,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error creating weather alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update a weather alert (acknowledge or deactivate)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, acknowledged, active } = body;

    const alert = await prisma.weatherAlert.update({
      where: { id },
      data: {
        ...(acknowledged !== undefined && { acknowledged }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error updating weather alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
