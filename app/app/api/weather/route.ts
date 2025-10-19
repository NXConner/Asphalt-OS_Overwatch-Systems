export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Weather API not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    // Analyze work conditions for asphalt paving
    let workRecommendation: 'PROCEED' | 'CAUTION' | 'DELAY' = 'PROCEED';
    
    const temp = data.main.temp;
    const condition = data.weather[0].main.toLowerCase();
    const windSpeed = data.wind.speed;

    // Temperature checks (asphalt paving ideal: 50-85°F)
    if (temp < 40 || temp > 95) {
      workRecommendation = 'DELAY';
    } else if (temp < 50 || temp > 85) {
      workRecommendation = 'CAUTION';
    }

    // Weather condition checks
    if (condition.includes('rain') || condition.includes('storm')) {
      workRecommendation = 'DELAY';
    } else if (condition.includes('cloud') && temp < 60) {
      workRecommendation = 'CAUTION';
    }

    // Wind check (high winds can affect sealcoating)
    if (windSpeed > 15) {
      workRecommendation = workRecommendation === 'PROCEED' ? 'CAUTION' : workRecommendation;
    }

    const weatherData = {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      workRecommendation,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
