
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWeatherForecast, shouldTriggerRainAlert } from '@/lib/weather';

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

    const forecast = await getWeatherForecast(lat, lon);
    
    if (!forecast) {
      return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: 500 });
    }

    const rainAlert = shouldTriggerRainAlert(forecast);

    return NextResponse.json({
      forecast,
      rainAlert,
    });
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
