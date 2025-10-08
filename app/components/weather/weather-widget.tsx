
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  location: string;
}

interface WeatherWidgetProps {
  lat?: number;
  lon?: number;
  location?: string;
  className?: string;
}

export function WeatherWidget({ lat, lon, location, className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        setError('Weather API key not configured');
        setLoading(false);
        return;
      }

      try {
        let url = '';
        if (lat && lon) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        } else if (location) {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`;
        } else {
          // Default to Richmond, VA if no location provided
          url = `https://api.openweathermap.org/data/2.5/weather?q=Richmond,VA,US&appid=${apiKey}&units=imperial`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind_speed: Math.round(data.wind.speed),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          location: data.name,
        });
        setError(null);
      } catch (err) {
        setError('Unable to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon, location]);

  const getWeatherIcon = (iconCode: string) => {
    const code = iconCode?.substring(0, 2);
    switch (code) {
      case '01':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case '02':
      case '03':
      case '04':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case '09':
        return <CloudDrizzle className="h-8 w-8 text-blue-500" />;
      case '10':
        return <CloudRain className="h-8 w-8 text-blue-600" />;
      case '13':
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      case '50':
        return <Wind className="h-8 w-8 text-gray-400" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getWorkCondition = (temp: number, description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('snow') || desc.includes('storm')) {
      return { label: 'Poor', color: 'bg-red-100 text-red-800', recommendation: 'Not recommended for paving' };
    }
    if (temp < 50 || temp > 95) {
      return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800', recommendation: 'Proceed with caution' };
    }
    return { label: 'Excellent', color: 'bg-green-100 text-green-800', recommendation: 'Ideal for paving work' };
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            {error || 'Weather data unavailable'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const workCondition = getWorkCondition(weather.temp, weather.description);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Weather Conditions</span>
          <Badge className={workCondition.color}>{workCondition.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{weather.temp}°F</span>
              <span className="text-sm text-muted-foreground">
                Feels like {weather.feels_like}°F
              </span>
            </div>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {weather.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              📍 {weather.location}
            </p>
          </div>
          <div>{getWeatherIcon(weather.icon)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-medium">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Wind Speed</p>
            <p className="text-sm font-medium">{weather.wind_speed} mph</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs font-medium mb-1">Work Conditions:</p>
          <p className="text-xs text-muted-foreground">{workCondition.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
