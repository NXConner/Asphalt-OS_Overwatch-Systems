
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, X, Eye, EyeOff, Navigation, Fuel } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vehicle {
  id: string;
  name: string;
  type: 'TRUCK' | 'TRAILER' | 'EQUIPMENT';
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE';
  latitude: number;
  longitude: number;
  speed?: number;
  fuelLevel?: number;
}

interface FleetTrackerOverlayProps {
  map: google.maps.Map | null;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const DEMO_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Truck #1',
    type: 'TRUCK',
    status: 'ACTIVE',
    latitude: 36.6164,
    longitude: -80.7848,
    speed: 35,
    fuelLevel: 75,
  },
  {
    id: '2',
    name: 'Paver #1',
    type: 'EQUIPMENT',
    status: 'ACTIVE',
    latitude: 36.6064,
    longitude: -80.7748,
    speed: 0,
    fuelLevel: 45,
  },
  {
    id: '3',
    name: 'Truck #2',
    type: 'TRUCK',
    status: 'IDLE',
    latitude: 36.5964,
    longitude: -80.7648,
    speed: 0,
    fuelLevel: 90,
  },
];

export function FleetTrackerOverlay({ 
  map, 
  enabled = true,
  onToggle 
}: FleetTrackerOverlayProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVisible, setIsVisible] = useState(enabled);

  // Create vehicle markers
  useEffect(() => {
    if (!map || !isVisible) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
      return;
    }

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = vehicles.map(vehicle => {
      const iconPath = vehicle.type === 'TRUCK' ? 
        'M 0,0 L 8,0 L 8,4 L 6,4 L 6,6 L 2,6 L 2,4 L 0,4 Z' :
        google.maps.SymbolPath.FORWARD_CLOSED_ARROW;

      const marker = new google.maps.Marker({
        position: { lat: vehicle.latitude, lng: vehicle.longitude },
        map: map,
        title: vehicle.name,
        icon: {
          path: iconPath,
          scale: vehicle.type === 'TRUCK' ? 1.5 : 5,
          fillColor: vehicle.status === 'ACTIVE' ? '#3b82f6' : 
                    vehicle.status === 'IDLE' ? '#f59e0b' : '#94a3b8',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedVehicle(vehicle);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Update vehicle positions every 5 seconds
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(veh => {
        if (veh.status === 'ACTIVE' && veh.speed && veh.speed > 0) {
          // Simulate movement
          return {
            ...veh,
            latitude: veh.latitude + (Math.random() - 0.5) * 0.001,
            longitude: veh.longitude + (Math.random() - 0.5) * 0.001,
          };
        }
        return veh;
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, vehicles, isVisible]);

  const toggleVisibility = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle?.(newState);
  };

  if (!map) return null;

  return (
    <>
      {/* Toggle Button */}
      <div className="absolute top-32 right-4 z-10">
        <Button
          variant={isVisible ? "default" : "outline"}
          size="sm"
          onClick={toggleVisibility}
          className="shadow-lg"
        >
          <Truck className="h-4 w-4 mr-2" />
          {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      </div>

      {/* Selected Vehicle Card */}
      {isVisible && selectedVehicle && (
        <Card className="absolute top-44 right-4 w-80 z-10 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <h3 className="font-semibold">{selectedVehicle.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVehicle(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline">
                  {selectedVehicle.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  selectedVehicle.status === 'ACTIVE' ? 'default' :
                  selectedVehicle.status === 'IDLE' ? 'secondary' :
                  'outline'
                }>
                  {selectedVehicle.status}
                </Badge>
              </div>
              {selectedVehicle.speed !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speed:</span>
                  <span className="font-medium">{selectedVehicle.speed} mph</span>
                </div>
              )}
              {selectedVehicle.fuelLevel !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel:</span>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-3 w-3" />
                    <span className="font-medium">{selectedVehicle.fuelLevel}%</span>
                  </div>
                </div>
              )}
              <Button
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  map.panTo({ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude });
                  map.setZoom(16);
                }}
              >
                <Navigation className="h-3 w-3 mr-2" />
                Center on Map
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      {isVisible && (
        <Card className="absolute bottom-24 left-4 w-64 z-10 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4" />
              <h3 className="font-semibold text-sm">Active Fleet</h3>
              <Badge variant="secondary" className="ml-auto">
                {vehicles.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {vehicles.map(vehicle => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    map.panTo({ lat: vehicle.latitude, lng: vehicle.longitude });
                  }}
                  className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    vehicle.status === 'ACTIVE' && "bg-blue-500 animate-pulse",
                    vehicle.status === 'IDLE' && "bg-amber-500",
                    vehicle.status === 'MAINTENANCE' && "bg-gray-400"
                  )} />
                  <span className="text-sm truncate">{vehicle.name}</span>
                  {vehicle.fuelLevel && vehicle.fuelLevel < 30 && (
                    <Fuel className="h-3 w-3 text-red-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
