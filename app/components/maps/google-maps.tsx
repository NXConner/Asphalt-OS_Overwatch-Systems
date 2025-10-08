
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MeasurementTools } from '@/components/map/measurement-tools';

interface GoogleMapsProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number, address?: string) => void;
  onAreaMeasured?: (area: number) => void;
  onMapLoad?: (map: google.maps.Map, center: google.maps.LatLng) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  enableMeasuring?: boolean;
  enableAISurfaceDetection?: boolean;
  jobId?: string;
}

// Patrick County, Virginia (default location - centered above the county)
const PATRICK_COUNTY_CENTER = { lat: 36.7141, lng: -80.2937 }; // Centered above Patrick County

export function GoogleMaps({
  markers = [],
  onMarkerClick,
  onMapClick,
  onAreaMeasured,
  onMapLoad,
  center,
  zoom,
  enableMeasuring = false,
  enableAISurfaceDetection = false,
  jobId
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [measuredArea, setMeasuredArea] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(center || PATRICK_COUNTY_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(zoom || 12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Drawing manager for measuring areas
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  
  // Use refs to store callbacks to prevent re-initialization
  const onMapClickRef = useRef(onMapClick);
  const onAreaMeasuredRef = useRef(onAreaMeasured);
  const onMapLoadRef = useRef(onMapLoad);
  
  // Update refs when callbacks change
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);
  
  useEffect(() => {
    onAreaMeasuredRef.current = onAreaMeasured;
  }, [onAreaMeasured]);
  
  useEffect(() => {
    onMapLoadRef.current = onMapLoad;
  }, [onMapLoad]);

  // Get user's current location on component mount
  useEffect(() => {
    if (!center) {
      // Only try to get location if no center is provided
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(userPos);
            setMapCenter(userPos);
            setMapZoom(15); // Zoom in closer when user location is found
            setLocationError(null);
          },
          (error) => {
            console.warn('Geolocation error:', error.message);
            setLocationError(error.message);
            // Fall back to Patrick County, Virginia
            setMapCenter(PATRICK_COUNTY_CENTER);
            setMapZoom(12);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        console.warn('Geolocation not supported by browser');
        setLocationError('Geolocation not supported');
        // Fall back to Patrick County, Virginia
        setMapCenter(PATRICK_COUNTY_CENTER);
        setMapZoom(12);
      }
    } else {
      // Use provided center
      setMapCenter(center);
      setMapZoom(zoom || 12);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

        // Initialize map with user location or Patrick County default
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: mapZoom,
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

        // Add user location marker if available
        if (userLocation) {
          new google.maps.Marker({
            position: userLocation,
            map: mapInstance,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          });
        }

        // Notify parent component of map load (only once)
        const centerLatLng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
        onMapLoadRef.current?.(mapInstance, centerLatLng);

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
            onAreaMeasuredRef.current?.(areaInSqFt);

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
          if (event.latLng && onMapClickRef.current && !isDrawing) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            // Reverse geocode to get address
            try {
              const geocoder = new google.maps.Geocoder();
              const response = await geocoder.geocode({ location: { lat, lng } });
              const address = response.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
              onMapClickRef.current(lat, lng, address);
            } catch (error) {
              onMapClickRef.current(lat, lng);
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

    // Only initialize map once, but wait for mapCenter to be set
    if (!map && mapCenter) {
      initMap();
    }
  }, [map, mapCenter, mapZoom, userLocation]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Update map center and zoom when they change (e.g., when user location is found)
  useEffect(() => {
    if (map && mapCenter) {
      map.setCenter(mapCenter);
      map.setZoom(mapZoom);
    }
  }, [map, mapCenter, mapZoom]);

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

      {/* Radar Sweep Effect */}
      {map && (
        <div className="radar-sweep pointer-events-none" />
      )}

      {/* Measurement Tools */}
      {(enableMeasuring || enableAISurfaceDetection) && map && (
        <MeasurementTools
          map={map}
          jobId={jobId}
          onMeasurementSaved={(measurement) => {
            if (measurement.area) {
              setMeasuredArea(measurement.area);
              onAreaMeasuredRef.current?.(measurement.area);
            }
          }}
        />
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
        <div className="absolute top-96 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-right z-50">
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
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-50">
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

      {/* Location status indicator */}
      {!center && (
        <div className="absolute top-20 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg z-50 text-xs">
          {userLocation ? (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Using your location</span>
            </div>
          ) : locationError ? (
            <div className="text-amber-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Patrick County, VA (Default)</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <span>Getting location...</span>
            </div>
          )}
        </div>
      )}

      {/* Re-center button (if user location available) */}
      {userLocation && map && (
        <button
          onClick={() => {
            map.setCenter(userLocation);
            map.setZoom(15);
          }}
          className="absolute top-20 right-4 bg-white hover:bg-gray-50 p-2 rounded-lg shadow-lg z-50 transition-colors"
          title="Center on your location"
        >
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
