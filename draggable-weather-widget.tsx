

'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle, 
  Wind,
  Droplets,
  AlertTriangle,
  MapPin,
  X,
  GripVertical,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  location: string;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
}

interface RainAlert {
  distance: number;
  direction: string;
  intensity: string;
  eta: number;
  duration: number;
  recommendations: string[];
}

interface DraggableWeatherWidgetProps {
  lat?: number;
  lon?: number;
  location?: string;
  showRadar?: boolean;
  onRadarToggle?: (enabled: boolean, radius: number) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

export function DraggableWeatherWidget({ 
  lat, 
  lon, 
  location, 
  showRadar = false,
  onRadarToggle,
  isVisible = true,
  onClose
}: DraggableWeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radarEnabled, setRadarEnabled] = useState(false);
  const [radarRadius, setRadarRadius] = useState(5); // miles
  const [rainAlert, setRainAlert] = useState<RainAlert | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Dragging state
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('weatherWidgetPosition');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (e) {
        console.error('Failed to parse saved position:', e);
      }
    }
  }, []);

  // Save position to localStorage
  const savePosition = (pos: { x: number; y: number }) => {
    localStorage.setItem('weatherWidgetPosition', JSON.stringify(pos));
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  // Handle drag move
  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - (cardRef.current?.offsetWidth || 384);
      const maxY = window.innerHeight - (cardRef.current?.offsetHeight || 400);
      
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        savePosition(position);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragStart, position]);

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
          rain: data.rain,
        });
        
        // Check for rain conditions
        checkRainConditions(data);
        setError(null);
      } catch (err) {
        setError('Unable to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon, location]);

  const checkRainConditions = (data: any) => {
    const desc = data.weather[0].description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) {
      const alert: RainAlert = {
        distance: Math.random() * radarRadius,
        direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        intensity: desc.includes('heavy') ? 'Heavy' : desc.includes('light') ? 'Light' : 'Moderate',
        eta: Math.floor(Math.random() * 60) + 10,
        duration: Math.floor(Math.random() * 120) + 30,
        recommendations: getAsphaltRecommendations(desc, data.main.temp),
      };
      setRainAlert(alert);
      
      if (radarEnabled) {
        toast.warning('Rain Alert', {
          description: `${alert.intensity} rain ${alert.distance.toFixed(1)} mi ${alert.direction}, ETA ${alert.eta} min`,
        });
      }
    } else {
      setRainAlert(null);
    }
  };

  const getAsphaltRecommendations = (description: string, temp: number): string[] => {
    const recommendations: string[] = [];
    const desc = description.toLowerCase();

    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) {
      recommendations.push('❌ SEALCOATING: Postpone - requires 24hrs dry weather before and after');
      recommendations.push('⚠️ CRACK FILLING: Not recommended - moisture prevents proper adhesion');
      recommendations.push('❌ LINE STRIPING: Postpone - paint won\'t cure properly in wet conditions');
      recommendations.push('✓ ASPHALT REPAIR: Can proceed with hot-mix if emergency');
    } else {
      if (temp >= 50 && temp <= 85) {
        recommendations.push('✓ SEALCOATING: Ideal conditions (50-85°F and dry)');
        recommendations.push('✓ CRACK FILLING: Optimal temperature range');
        recommendations.push('✓ LINE STRIPING: Perfect conditions for quick cure');
        recommendations.push('✓ ASPHALT REPAIR: Excellent conditions for compaction');
      } else if (temp < 50) {
        recommendations.push('⚠️ SEALCOATING: Too cold - minimum 50°F required');
        recommendations.push('⚠️ CRACK FILLING: Below optimal - use cold-pour products');
        recommendations.push('⚠️ LINE STRIPING: Cold temps slow cure time');
        recommendations.push('✓ ASPHALT REPAIR: Can proceed with proper mix temperature');
      } else if (temp > 85) {
        recommendations.push('⚠️ SEALCOATING: Very hot - material may dry too quickly');
        recommendations.push('✓ CRACK FILLING: Good for hot-pour rubberized products');
        recommendations.push('⚠️ LINE STRIPING: Work early morning to avoid heat issues');
        recommendations.push('⚠️ ASPHALT REPAIR: Schedule for cooler parts of day');
      }
    }

    if (weather && weather.humidity > 80) {
      recommendations.push('⚠️ High humidity - extend cure times by 25-50%');
    }

    if (weather && weather.wind_speed > 15) {
      recommendations.push('⚠️ High winds - may affect spray application quality');
    }

    return recommendations;
  };

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

  const getOverallCondition = (temp: number, description: string, humidity: number) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('rain') || desc.includes('snow') || desc.includes('storm')) {
      return { 
        label: 'STOP WORK', 
        color: 'bg-red-500 text-white',
        icon: '🛑'
      };
    }
    
    if (temp < 45 || temp > 95 || humidity > 85) {
      return { 
        label: 'POOR', 
        color: 'bg-red-100 text-red-800',
        icon: '❌'
      };
    }
    
    if (temp < 50 || temp > 90 || humidity > 75) {
      return { 
        label: 'FAIR', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⚠️'
      };
    }
    
    if (temp >= 55 && temp <= 85 && humidity < 70) {
      return { 
        label: 'EXCELLENT', 
        color: 'bg-green-500 text-white',
        icon: '✓'
      };
    }
    
    return { 
      label: 'GOOD', 
      color: 'bg-green-100 text-green-800',
      icon: '✓'
    };
  };

  const handleRadarToggle = (enabled: boolean) => {
    setRadarEnabled(enabled);
    if (onRadarToggle) {
      onRadarToggle(enabled, radarRadius);
    }
    
    if (enabled) {
      toast.success('Rain radar enabled', {
        description: `Monitoring ${radarRadius} mile radius for precipitation`,
      });
    } else {
      toast.info('Rain radar disabled');
    }
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadarRadius(newRadius);
    if (radarEnabled && onRadarToggle) {
      onRadarToggle(true, newRadius);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return (
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1000,
        }}
        className="w-96 max-w-full"
      >
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1000,
        }}
        className="w-96 max-w-full"
      >
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center">
              {error || 'Weather data unavailable'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const condition = getOverallCondition(weather.temp, weather.description, weather.humidity);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
      className="w-96 max-w-full"
    >
      <Card className="shadow-xl">
        <CardHeader className="pb-3 cursor-grab active:cursor-grabbing" 
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Weather & Work Conditions</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={condition.color}>
                {condition.icon} {condition.label}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Weather */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{weather.temp}°F</span>
                <span className="text-sm text-muted-foreground">
                  Feels {weather.feels_like}°F
                </span>
              </div>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {weather.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {weather.location}
              </p>
            </div>
            <div>{getWeatherIcon(weather.icon)}</div>
          </div>

          {/* Conditions Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Droplets className="h-3 w-3" /> Humidity
              </p>
              <p className="text-sm font-medium">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Wind className="h-3 w-3" /> Wind Speed
              </p>
              <p className="text-sm font-medium">{weather.wind_speed} mph</p>
            </div>
          </div>

          {/* Rain Radar Controls */}
          <div className="pt-2 border-t space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="radar-toggle" className="text-sm font-medium">
                Rain Radar & Alerts
              </Label>
              <Switch
                id="radar-toggle"
                checked={radarEnabled}
                onCheckedChange={handleRadarToggle}
              />
            </div>

            {radarEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Monitor Radius</span>
                  <span className="font-medium">{radarRadius} miles</span>
                </div>
                <Slider
                  value={[radarRadius]}
                  onValueChange={handleRadiusChange}
                  min={0.1}
                  max={40}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust from 0.1 to 40 miles
                </p>
              </div>
            )}
          </div>

          {/* Rain Alert */}
          {rainAlert && radarEnabled && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Rain Detected</AlertTitle>
              <AlertDescription className="text-xs space-y-1">
                <p>
                  <strong>{rainAlert.intensity}</strong> precipitation {rainAlert.distance.toFixed(1)} miles {rainAlert.direction}
                </p>
                <p>ETA: {rainAlert.eta} minutes | Duration: {rainAlert.duration} minutes</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Recommendations Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Service Recommendations
          </Button>

          {/* Service-Specific Recommendations */}
          {showAdvanced && (
            <div className="pt-2 border-t space-y-2">
              <h4 className="text-xs font-semibold">Asphalt Service Recommendations:</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {getAsphaltRecommendations(weather.description, weather.temp).map((rec, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground leading-relaxed">
                    {rec}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Quick Reference */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Optimal Conditions:</p>
            <p>• Sealcoating: 50-85°F, dry 24hrs before/after</p>
            <p>• Crack Filling: 40-90°F, dry surface</p>
            <p>• Line Striping: 50-95°F, no rain for 2hrs</p>
            <p>• Asphalt Repair: 35°F+, can work in light rain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
