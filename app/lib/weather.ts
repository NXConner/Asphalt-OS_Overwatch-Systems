
// Weather API integration using OpenWeatherMap
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  clouds: number;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface WeatherForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: { all: number };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: { '3h': number };
  snow?: { '3h': number };
  dt_txt: string;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      console.error('Weather API error:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    return {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      visibility: data.visibility,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      wind_gust: data.wind.gust,
      clouds: data.clouds.all,
      rain: data.rain,
      snow: data.snow,
      weather: data.weather,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[] | null> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      console.error('Weather forecast API error:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.list || [];
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
}

export function analyzeWeatherForWork(weather: WeatherData): {
  recommendation: 'PROCEED' | 'CAUTION' | 'DELAY' | 'CANCEL';
  reasons: string[];
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
} {
  const reasons: string[] = [];
  let recommendation: 'PROCEED' | 'CAUTION' | 'DELAY' | 'CANCEL' = 'PROCEED';
  let severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' = 'LOW';

  // Check temperature - asphalt paving requires specific temps
  if (weather.temp < 50) {
    reasons.push('Temperature too low for quality asphalt application (< 50°F)');
    recommendation = 'CANCEL';
    severity = 'HIGH';
  } else if (weather.temp < 55) {
    reasons.push('Temperature approaching minimum for asphalt work (< 55°F)');
    if (recommendation === 'PROCEED') recommendation = 'CAUTION';
    severity = 'MODERATE';
  }

  if (weather.temp > 95) {
    reasons.push('Extreme heat may affect material workability (> 95°F)');
    if (recommendation === 'PROCEED') recommendation = 'CAUTION';
    severity = 'MODERATE';
  }

  // Check precipitation
  if (weather.rain) {
    const rainAmount = weather.rain['1h'] || weather.rain['3h'] || 0;
    if (rainAmount > 0.1) {
      reasons.push('Active precipitation - cannot apply asphalt in rain');
      recommendation = 'CANCEL';
      severity = 'SEVERE';
    }
  }

  // Check weather conditions
  const mainCondition = weather.weather[0]?.main.toLowerCase();
  if (mainCondition.includes('rain') || mainCondition.includes('storm') || mainCondition.includes('drizzle')) {
    reasons.push('Precipitation in forecast - unsuitable for asphalt work');
    recommendation = 'CANCEL';
    severity = 'SEVERE';
  } else if (mainCondition.includes('snow') || mainCondition.includes('sleet')) {
    reasons.push('Winter conditions - asphalt work not recommended');
    recommendation = 'CANCEL';
    severity = 'SEVERE';
  }

  // Check humidity
  if (weather.humidity > 85) {
    reasons.push('High humidity may affect curing time');
    if (recommendation === 'PROCEED') recommendation = 'CAUTION';
    if (severity === 'LOW') severity = 'MODERATE';
  }

  // Check wind
  if (weather.wind_speed > 20) {
    reasons.push('High winds may affect material application');
    if (recommendation === 'PROCEED') recommendation = 'CAUTION';
    if (severity === 'LOW') severity = 'MODERATE';
  }

  // If no issues found
  if (reasons.length === 0) {
    reasons.push('Weather conditions are favorable for asphalt paving');
  }

  return { recommendation, reasons, severity };
}

export function shouldTriggerRainAlert(forecast: WeatherForecast[]): {
  shouldAlert: boolean;
  alertTime: Date | null;
  rainIntensity: number;
  duration: number; // hours
} {
  for (let i = 0; i < Math.min(forecast.length, 8); i++) { // Check next 24 hours
    const item = forecast[i];
    const rainAmount = item.rain?.['3h'] || 0;
    
    if (rainAmount > 0.1) { // More than 0.1 inches
      return {
        shouldAlert: true,
        alertTime: new Date(item.dt * 1000),
        rainIntensity: rainAmount,
        duration: 3,
      };
    }
  }
  
  return {
    shouldAlert: false,
    alertTime: null,
    rainIntensity: 0,
    duration: 0,
  };
}
