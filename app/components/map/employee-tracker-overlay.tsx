
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, X, Eye, EyeOff, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  currentStatus: 'ONLINE' | 'DRIVING' | 'AT_JOB_SITE' | 'OFFLINE';
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

interface EmployeeTrackerOverlayProps {
  map: google.maps.Map | null;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const DEMO_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    currentStatus: 'DRIVING',
    latitude: 36.6054,
    longitude: -80.7938,
    speed: 45,
    heading: 90,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    currentStatus: 'AT_JOB_SITE',
    latitude: 36.6154,
    longitude: -80.8038,
    speed: 0,
  },
  {
    id: '3',
    name: 'Sarah Davis',
    currentStatus: 'ONLINE',
    latitude: 36.6254,
    longitude: -80.8138,
    speed: 0,
  },
];

export function EmployeeTrackerOverlay({ 
  map, 
  enabled = true,
  onToggle 
}: EmployeeTrackerOverlayProps) {
  const [employees, setEmployees] = useState<Employee[]>(DEMO_EMPLOYEES);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isVisible, setIsVisible] = useState(enabled);

  // Create employee markers
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
    const newMarkers = employees.map(employee => {
      const marker = new google.maps.Marker({
        position: { lat: employee.latitude, lng: employee.longitude },
        map: map,
        title: employee.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: employee.currentStatus === 'DRIVING' ? '#22c55e' : 
                    employee.currentStatus === 'AT_JOB_SITE' ? '#3b82f6' : 
                    employee.currentStatus === 'ONLINE' ? '#f59e0b' : '#94a3b8',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedEmployee(employee);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Update employee positions every 5 seconds
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        if (emp.currentStatus === 'DRIVING') {
          // Simulate movement
          return {
            ...emp,
            latitude: emp.latitude + (Math.random() - 0.5) * 0.001,
            longitude: emp.longitude + (Math.random() - 0.5) * 0.001,
          };
        }
        return emp;
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, employees, isVisible]);

  const toggleVisibility = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle?.(newState);
  };

  if (!map) return null;

  return (
    <>
      {/* Toggle Button */}
      <div className="absolute top-20 right-4 z-10">
        <Button
          variant={isVisible ? "default" : "outline"}
          size="sm"
          onClick={toggleVisibility}
          className="shadow-lg"
        >
          <Users className="h-4 w-4 mr-2" />
          {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      </div>

      {/* Selected Employee Card */}
      {isVisible && selectedEmployee && (
        <Card className="absolute top-32 right-4 w-80 z-10 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  selectedEmployee.currentStatus === 'DRIVING' && "bg-green-500",
                  selectedEmployee.currentStatus === 'AT_JOB_SITE' && "bg-blue-500",
                  selectedEmployee.currentStatus === 'ONLINE' && "bg-amber-500",
                  selectedEmployee.currentStatus === 'OFFLINE' && "bg-gray-400"
                )} />
                <h3 className="font-semibold">{selectedEmployee.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmployee(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  selectedEmployee.currentStatus === 'DRIVING' ? 'default' :
                  selectedEmployee.currentStatus === 'AT_JOB_SITE' ? 'secondary' :
                  'outline'
                }>
                  {selectedEmployee.currentStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
              {selectedEmployee.speed !== undefined && selectedEmployee.speed > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speed:</span>
                  <span className="font-medium">{selectedEmployee.speed} mph</span>
                </div>
              )}
              <Button
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  map.panTo({ lat: selectedEmployee.latitude, lng: selectedEmployee.longitude });
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


    </>
  );
}
