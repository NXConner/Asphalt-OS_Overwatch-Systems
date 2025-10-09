export type WeatherWindow = { start: Date; end: Date; reason?: string };

// Very simple heuristic; replace with real API integration later
export function getSchedulingRecommendation(forecast: Array<{ time: Date; precipitationIn: number; tempF: number; windMph: number }>): WeatherWindow | null {
  const suitable = forecast.filter(f => f.precipitationIn <= 0.05 && f.tempF >= 50 && f.windMph <= 15);
  if (suitable.length === 0) return null;
  const start = suitable[0].time;
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  return { start, end };
}
