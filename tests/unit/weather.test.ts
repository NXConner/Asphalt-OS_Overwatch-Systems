import { getSchedulingRecommendation } from '@/lib/weather';

describe('weather', () => {
  it('recommends a window when suitable', () => {
    const now = new Date();
    const forecast = Array.from({ length: 6 }).map((_, i) => ({
      time: new Date(now.getTime() + i * 60 * 60 * 1000),
      precipitationIn: 0,
      tempF: 70,
      windMph: 5,
    }));
    const win = getSchedulingRecommendation(forecast);
    expect(win).not.toBeNull();
  });
});
