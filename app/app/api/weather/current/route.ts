export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentWeather, analyzeWeatherForWork } from '@/lib/weather';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude required' }, { status: 400 });
    }

    const weather = await getCurrentWeather(lat, lon);
    
    if (!weather) {
      return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }

    const analysis = analyzeWeatherForWork(weather);

    return NextResponse.json({
      weather,
      analysis,
    });
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
