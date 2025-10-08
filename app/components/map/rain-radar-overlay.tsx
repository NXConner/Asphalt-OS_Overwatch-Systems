
'use client';

import { useEffect, useState } from 'react';

interface RainRadarOverlayProps {
  map: google.maps.Map | null;
  center: google.maps.LatLng | null;
  radius: number; // in miles
  enabled: boolean;
}

export function RainRadarOverlay({ map, center, radius, enabled }: RainRadarOverlayProps) {
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [radarLayer, setRadarLayer] = useState<google.maps.ImageMapType | null>(null);

  useEffect(() => {
    if (!map || !center || !enabled) {
      // Clean up existing overlays
      if (circle) {
        circle.setMap(null);
        setCircle(null);
      }
      if (radarLayer && map) {
        const index = map.overlayMapTypes.getLength() - 1;
        if (index >= 0) {
          map.overlayMapTypes.removeAt(index);
        }
        setRadarLayer(null);
      }
      return;
    }

    // Create radius circle
    const newCircle = new google.maps.Circle({
      strokeColor: '#4285F4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4285F4',
      fillOpacity: 0.1,
      map,
      center,
      radius: radius * 1609.34, // Convert miles to meters
    });

    setCircle(newCircle);

    // Add OpenWeather radar overlay
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (apiKey) {
      const baseUrl = 'tile.openweathermap.org';
      const radarImageMapType = new google.maps.ImageMapType({
        getTileUrl: (coord: google.maps.Point | null, zoom: number): string | null => {
          if (!coord) return null;
          const x = coord.x;
          const y = coord.y;
          const url = `https://${baseUrl}/map/precipitation_new/${zoom}/${x}/${y}.png?appid=${apiKey}`;
          return url;
        },
        tileSize: new google.maps.Size(256, 256),
        name: 'Rain Radar',
        opacity: 0.6,
        maxZoom: 18,
        minZoom: 0,
      } as google.maps.ImageMapTypeOptions);

      // Use insertAt instead of push to avoid type issues
      map.overlayMapTypes.insertAt(0, radarImageMapType as any);
      setRadarLayer(radarImageMapType);
    }

    return () => {
      if (newCircle) {
        newCircle.setMap(null);
      }
      if (map) {
        const len = map.overlayMapTypes.getLength();
        if (len > 0) {
          map.overlayMapTypes.removeAt(len - 1);
        }
      }
    };
  }, [map, center, radius, enabled]);

  // Update circle when radius changes
  useEffect(() => {
    if (circle && center) {
      circle.setRadius(radius * 1609.34);
      circle.setCenter(center);
    }
  }, [circle, center, radius]);

  return null; // This component only manages map overlays
}

