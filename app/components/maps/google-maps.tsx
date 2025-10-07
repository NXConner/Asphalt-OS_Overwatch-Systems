
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface GoogleMapsProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number, address?: string) => void;
  onAreaMeasured?: (area: number) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  enableMeasuring?: boolean;
}

const BUSINESS_LOCATION = { lat: 36.6484, lng: -80.2737 }; // Stuart, VA

export function GoogleMaps({
  markers = [],
  onMarkerClick,
  onMapClick,
  onAreaMeasured,
  center = BUSINESS_LOCATION,
  zoom = 12,
  enableMeasuring = false
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [measuredArea, setMeasuredArea] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // Drawing manager for measuring areas
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        // Load Google Maps script first (regardless of ref status)
        if (!window.google || !window.google.maps) {
          // Check if script is already being loaded
          const existingScript = document.querySelector(
            'script[src*="maps.googleapis.com"]'
          );
          
          if (!existingScript) {
            // Load Google Maps script directly
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,drawing,geometry&v=weekly`;
            script.async = true;
            script.defer = true;
            
            await new Promise<void>((resolve, reject) => {
              script.onload = () => {
                console.log('Google Maps script loaded successfully');
                resolve();
              };
              script.onerror = (error) => {
                console.error('Failed to load Google Maps script:', error);
                reject(new Error('Failed to load Google Maps script'));
              };
              document.head.appendChild(script);
            });
          } else {
            // Wait for the existing script to load
            await new Promise<void>((resolve) => {
              const checkLoaded = setInterval(() => {
                if (window.google && window.google.maps) {
                  clearInterval(checkLoaded);
                  resolve();
                }
              }, 100);
              
              // Timeout after 10 seconds
              setTimeout(() => {
                clearInterval(checkLoaded);
                resolve();
              }, 10000);
            });
          }
        }

        // Wait for ref to be ready (with timeout)
        let retries = 0;
        while (!mapRef.current && retries < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }

        if (!mapRef.current) {
          console.error('Map ref is not available after waiting');
          setError('Map container not ready');
          setLoading(false);
          return;
        }

        if (!window.google || !window.google.maps) {
          console.error('Google Maps API not available after script load');
          setError('Failed to load Google Maps API. Please check your API key and enabled APIs.');
          setLoading(false);
          return;
        }

        console.log('Initializing map with ref and Google Maps API ready');

        // Initialize map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: 'hybrid', // Hybrid satellite/road view
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
          },
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          clickableIcons: false,
          gestureHandling: 'greedy', // Enable scroll wheel zoom without ctrl key
        });

        setMap(mapInstance);

        // Initialize drawing manager for measuring
        if (enableMeasuring) {
          const drawingManagerInstance = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.RECTANGLE,
              ],
            },
            polygonOptions: {
              fillColor: '#60B5FF',
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: '#60B5FF',
              clickable: false,
              editable: true,
              zIndex: 1,
            },
            rectangleOptions: {
              fillColor: '#60B5FF',
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: '#60B5FF',
              clickable: false,
              editable: true,
              zIndex: 1,
            },
          });

          drawingManagerInstance.setMap(mapInstance);
          setDrawingManager(drawingManagerInstance);

          // Use geometry library
          const spherical = google.maps.geometry.spherical;

          // Handle overlay complete
          google.maps.event.addListener(drawingManagerInstance, 'overlaycomplete', (event: any) => {
            const overlay = event.overlay;
            let area = 0;

            if (event.type === 'polygon') {
              area = spherical.computeArea(overlay.getPath());
            } else if (event.type === 'rectangle') {
              const bounds = overlay.getBounds();
              const ne = bounds?.getNorthEast();
              const sw = bounds?.getSouthWest();
              if (ne && sw) {
                const coords = [
                  sw,
                  new google.maps.LatLng(sw.lat(), ne.lng()),
                  ne,
                  new google.maps.LatLng(ne.lat(), sw.lng())
                ];
                area = spherical.computeArea(coords);
              }
            }

            // Convert to square feet
            const areaInSqFt = area * 10.764;
            setMeasuredArea(areaInSqFt);
            onAreaMeasured?.(areaInSqFt);

            // Clear drawing mode
            drawingManagerInstance.setDrawingMode(null);
            setIsDrawing(false);
          });

          // Handle drawing mode changes
          google.maps.event.addListener(drawingManagerInstance, 'drawingmode_changed', () => {
            setIsDrawing(drawingManagerInstance.getDrawingMode() !== null);
          });
        }

        // Add click listener for adding jobs
        mapInstance.addListener('click', async (event: any) => {
          if (event.latLng && onMapClick && !isDrawing) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            // Reverse geocode to get address
            try {
              const geocoder = new google.maps.Geocoder();
              const response = await geocoder.geocode({ location: { lat, lng } });
              const address = response.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
              onMapClick(lat, lng, address);
            } catch (error) {
              onMapClick(lat, lng);
            }
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Error initializing Google Maps:', err);
        setError('Failed to load Google Maps');
        setLoading(false);
      }
    };

    initMap();
  }, [center, zoom, enableMeasuring, onMapClick, onAreaMeasured, isDrawing]);

  // Update markers when they change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    // Note: In a production app, you'd want to track markers to clear them properly

    // Add new markers
    markers?.forEach((marker) => {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getMarkerColor(marker.status),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-sm">
            <h3 class="font-semibold text-lg">${marker.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${marker.address}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-1 text-xs rounded-full bg-${getStatusColor(marker.status)}-100 text-${getStatusColor(marker.status)}-800">
                ${marker.status.replace('_', ' ')}
              </span>
              <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                ${marker.type.replace('_', ' ')}
              </span>
            </div>
            ${marker.description ? `<p class="text-sm">${marker.description}</p>` : ''}
            ${marker.estimatedCost ? `<p class="text-sm font-medium mt-1">Estimated: $${marker.estimatedCost.toLocaleString()}</p>` : ''}
          </div>
        `,
      });

      mapMarker.addListener('click', () => {
        infoWindow.open(map, mapMarker);
        onMarkerClick?.(marker);
      });
    });
  }, [map, markers, onMarkerClick]);

  const getMarkerColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED': return '#22c55e'; // Green
      case 'POSSIBLE': return '#eab308'; // Yellow
      case 'LOST': return '#ef4444'; // Red
      case 'IN_PROGRESS': return '#3b82f6'; // Blue
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'POSSIBLE': return 'yellow';
      case 'LOST': return 'red';
      case 'IN_PROGRESS': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Always render the map div so ref is available */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-50">
          <Card className="p-6 text-center">
            <p className="text-destructive mb-2">Failed to load map</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </Card>
        </div>
      )}
      
      {/* Measured area display */}
      {enableMeasuring && measuredArea > 0 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
          <div className="text-sm font-medium">Measured Area</div>
          <div className="text-lg font-bold text-primary">
            {measuredArea.toLocaleString()} sq ft
          </div>
          <div className="text-xs text-muted-foreground">
            {(measuredArea / 43560).toFixed(3)} acres
          </div>
        </div>
      )}

      {/* Status legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="text-sm font-medium mb-2">Job Status</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Possible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Lost</span>
          </div>
        </div>
      </div>
    </div>
  );
}
