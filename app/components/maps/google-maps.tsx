

'use client';

import { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MeasurementTools } from '@/components/map/measurement-tools';
import { Navigation, Crosshair } from 'lucide-react';

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

// Default map center location
const DEFAULT_CENTER = { lat: 36.7141, lng: -80.2937 };

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
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(center || DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(zoom || 12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

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

  // Get user's current location on component mount (silently, no banner)
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
            // Don't automatically center on user location, just store it
          },
          (error) => {
            console.warn('Geolocation error:', error.message);
            // Silently use default location
            setUserLocation(null);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000 // Cache location for 1 minute
          }
        );
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to locate user and fly to their location
  const locateMe = () => {
    if (!map) return;
    
    setLocatingUser(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Fly to user location
          map.panTo(userPos);
          map.setZoom(16);
          
          // Add or update user location marker
          new google.maps.Marker({
            position: userPos,
            map: map,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#FFD700', // Gold
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            animation: google.maps.Animation.DROP,
          });
          
          setLocatingUser(false);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          setLocatingUser(false);
          alert('Unable to get your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLocatingUser(false);
    }
  };

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

        // Get saved map type preference from localStorage
        const savedMapType = localStorage.getItem('mapType') || 'hybrid';

        // Initialize map with default center (not user location)
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          mapTypeId: savedMapType as google.maps.MapTypeId,
          mapTypeControl: false,
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
        });

        setMap(mapInstance);

        // Notify parent component of map load (only once)
        const centerLatLng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
        onMapLoadRef.current?.(mapInstance, centerLatLng);

        // Initialize drawing manager for measuring (hide default controls)
        if (enableMeasuring) {
          const drawingManagerInstance = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false, // Hide default controls
            polygonOptions: {
              fillColor: '#FFD700', // Gold
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: '#FFD700',
              clickable: false,
              editable: true,
              zIndex: 1,
            },
            rectangleOptions: {
              fillColor: '#FFD700',
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: '#FFD700',
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

    // Only initialize map once
    if (!map && mapCenter) {
      initMap();
    }
  }, [map, mapCenter, mapZoom]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Update map center and zoom when they change
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
        <div className="absolute top-96 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-right z-50 border">
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
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-50 border">
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

      {/* GPS Locate Me Button - Icon Only */}
      {map && (
        <Button
          onClick={locateMe}
          disabled={locatingUser}
          size="icon"
          className="absolute top-4 right-52 bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg z-50"
          title="Locate Me"
        >
          {locatingUser ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
          ) : (
            <Crosshair className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
}
