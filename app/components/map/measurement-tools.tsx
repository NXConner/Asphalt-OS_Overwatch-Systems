
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Ruler,
  Square,
  Circle,
  PenTool,
  Trash2,
  Save,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  X,
  Check,
} from 'lucide-react';
import {
  calculatePolygonArea,
  calculatePerimeter,
  detectRectangularDimensions,
  detectAsphaltSurfaces,
  type DetectedSurface,
} from '@/lib/ai-surface-detection';
import { toast } from 'react-hot-toast';

export interface Measurement {
  id: string;
  name: string;
  type: 'POLYGON' | 'RECTANGLE' | 'CIRCLE' | 'LINE';
  vertices: Array<{ lat: number; lng: number }>;
  area?: number;
  perimeter?: number;
  length?: number;
  width?: number;
  color: string;
  isVisible: boolean;
  jobId?: string;
  isAIGenerated?: boolean;
  aiConfidence?: number;
}

interface MeasurementToolsProps {
  map: google.maps.Map | null;
  onMeasurementSaved?: (measurement: Measurement) => void;
  jobId?: string;
  drawingManager?: google.maps.drawing.DrawingManager | null;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
];

export function MeasurementTools({ map, onMeasurementSaved, jobId, drawingManager }: MeasurementToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentVertices, setCurrentVertices] = useState<Array<{ lat: number; lng: number }>>([]);
  const [currentPolygon, setCurrentPolygon] = useState<google.maps.Polygon | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<google.maps.Marker[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [measurementName, setMeasurementName] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSurfaces, setDetectedSurfaces] = useState<DetectedSurface[]>([]);

  // Load saved measurements
  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      const response = await fetch('/api/measurements');
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data);
        // Render measurements on map
        data.forEach((m: Measurement) => renderMeasurement(m));
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const renderMeasurement = (measurement: Measurement) => {
    if (!map || !measurement.isVisible) return;

    const polygon = new google.maps.Polygon({
      paths: measurement.vertices,
      strokeColor: measurement.color,
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: measurement.color,
      fillOpacity: 0.3,
      editable: false,
      draggable: false,
      map: map,
    });

    // Add label with measurements
    if (measurement.area) {
      const bounds = new google.maps.LatLngBounds();
      measurement.vertices.forEach(v => bounds.extend(v));
      const center = bounds.getCenter();

      const label = new google.maps.InfoWindow({
        content: `
          <div class="measurement-label">
            <strong>${measurement.name}</strong><br/>
            ${measurement.area ? `Area: ${measurement.area.toLocaleString()} sq ft` : ''}<br/>
            ${measurement.length && measurement.width ? 
              `${measurement.length.toFixed(1)}' × ${measurement.width.toFixed(1)}'` : ''}
            ${measurement.isAIGenerated ? '<br/><small>🤖 AI Detected</small>' : ''}
          </div>
        `,
        position: center,
      });

      polygon.addListener('click', () => {
        label.open(map);
      });
    }
  };

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!activeTool || !event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (activeTool === 'polygon') {
        // Add vertex to current polygon
        const newVertices = [...currentVertices, { lat, lng }];
        setCurrentVertices(newVertices);

        // Add marker
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map!,
          draggable: true,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: selectedColor,
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        marker.addListener('drag', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const index = currentMarkers.indexOf(marker);
          const updated = [...currentVertices];
          updated[index] = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          setCurrentVertices(updated);
          if (currentPolygon) {
            currentPolygon.setPath(updated);
          }
        });

        setCurrentMarkers([...currentMarkers, marker]);

        // Update or create polygon
        if (newVertices.length >= 2) {
          if (currentPolygon) {
            currentPolygon.setPath(newVertices);
          } else {
            const polygon = new google.maps.Polygon({
              paths: newVertices,
              strokeColor: selectedColor,
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: selectedColor,
              fillOpacity: 0.3,
              map: map!,
            });
            setCurrentPolygon(polygon);
          }
        }

        setIsDrawing(true);
      }
    },
    [activeTool, currentVertices, currentPolygon, currentMarkers, map, selectedColor]
  );

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener('click', handleMapClick);

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, handleMapClick]);

  const finishDrawing = () => {
    if (currentVertices.length < 3) {
      toast.error('Please add at least 3 points to create a measurement');
      return;
    }

    // Calculate measurements
    const area = calculatePolygonArea(currentVertices);
    const perimeter = calculatePerimeter(currentVertices);
    const dimensions = detectRectangularDimensions(currentVertices);

    const measurement: Measurement = {
      id: `measure_${Date.now()}`,
      name: measurementName || `Measurement ${measurements.length + 1}`,
      type: 'POLYGON',
      vertices: currentVertices,
      area,
      perimeter,
      length: dimensions?.length,
      width: dimensions?.width,
      color: selectedColor,
      isVisible: true,
      jobId,
    };

    saveMeasurement(measurement);
    resetDrawing();
  };

  const saveMeasurement = async (measurement: Measurement) => {
    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurement),
      });

      if (response.ok) {
        const saved = await response.json();
        setMeasurements([...measurements, saved]);
        renderMeasurement(saved);
        toast.success('Measurement saved!');
        onMeasurementSaved?.(saved);
      } else {
        toast.error('Failed to save measurement');
      }
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('Error saving measurement');
    }
  };

  const resetDrawing = () => {
    // Clear markers
    currentMarkers.forEach(m => m.setMap(null));
    setCurrentMarkers([]);

    // Clear polygon
    if (currentPolygon) {
      currentPolygon.setMap(null);
      setCurrentPolygon(null);
    }

    setCurrentVertices([]);
    setIsDrawing(false);
    setActiveTool(null);
    setMeasurementName('');
  };

  const cancelDrawing = () => {
    resetDrawing();
    toast('Drawing cancelled');
  };

  const startAIDetection = async () => {
    if (!map) return;

    const center = map.getCenter();
    if (!center) return;

    setIsDetecting(true);
    toast('🤖 Analyzing map for asphalt surfaces...');

    try {
      const result = await detectAsphaltSurfaces(
        center.lat(),
        center.lng(),
        map.getZoom() || 20
      );

      setDetectedSurfaces(result.surfaces);

      if (result.surfaces.length > 0) {
        toast.success(`Found ${result.surfaces.length} surface(s)! Click to add them.`);

        // Render detected surfaces as overlay
        result.surfaces.forEach((surface, index) => {
          const polygon = new google.maps.Polygon({
            paths: surface.vertices,
            strokeColor: '#10b981',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#10b981',
            fillOpacity: 0.2,
            map: map,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <strong>🤖 AI Detected Surface</strong><br/>
                Type: ${surface.type}<br/>
                Area: ${surface.measurements.area.toLocaleString()} sq ft<br/>
                Confidence: ${(surface.confidence * 100).toFixed(0)}%<br/>
                <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  onclick="window.acceptSurface${index}()">
                  Accept
                </button>
              </div>
            `,
            position: surface.center,
          });

          // Add click handler to accept surface
          (window as any)[`acceptSurface${index}`] = () => {
            const measurement: Measurement = {
              id: surface.id,
              name: `${surface.type.replace('_', ' ')} (AI)`,
              type: 'POLYGON',
              vertices: surface.vertices,
              area: surface.measurements.area,
              perimeter: surface.measurements.perimeter,
              length: surface.measurements.length,
              width: surface.measurements.width,
              color: '#10b981',
              isVisible: true,
              jobId,
              isAIGenerated: true,
              aiConfidence: surface.confidence,
            };

            saveMeasurement(measurement);
            polygon.setMap(null);
            infoWindow.close();
          };

          polygon.addListener('click', () => {
            infoWindow.open(map);
          });
        });
      } else {
        toast('No surfaces detected. Try drawing manually.');
      }
    } catch (error) {
      console.error('Error detecting surfaces:', error);
      toast.error('Error detecting surfaces');
    } finally {
      setIsDetecting(false);
    }
  };

  const deleteMeasurement = async (id: string) => {
    try {
      const response = await fetch(`/api/measurements/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMeasurements(measurements.filter(m => m.id !== id));
        toast.success('Measurement deleted');
        // Reload map to refresh
        loadMeasurements();
      }
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast.error('Error deleting measurement');
    }
  };

  const toggleVisibility = (id: string) => {
    setMeasurements(
      measurements.map(m =>
        m.id === id ? { ...m, isVisible: !m.isVisible } : m
      )
    );
    // Reload map
    loadMeasurements();
  };

  return (
    <>
      {/* Measurement Tools Card - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-3 glass-effect">
          <div className="space-y-2">
            <div className="text-sm font-medium">Measurement Tools</div>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant={activeTool === 'polygon' ? 'default' : 'outline'}
                onClick={() => {
                  if (isDrawing) {
                    toast.error('Finish or cancel current drawing first');
                    return;
                  }
                  setActiveTool('polygon');
                  toast('Click on map to add vertices. Click Finish when done.');
                }}
                className="flex-1"
                title="Draw a Shape"
              >
                <PenTool className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={startAIDetection}
                disabled={isDetecting}
                className="flex-1"
                title="AI Surface Detection"
              >
                {isDetecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isDrawing && (
              <div className="space-y-2 pt-2 border-t">
                <Input
                  placeholder="Measurement name"
                  value={measurementName}
                  onChange={(e) => setMeasurementName(e.target.value)}
                  size={30}
                />

                <div className="flex gap-1">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 ${
                        selectedColor === color ? 'border-black' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  {currentVertices.length} vertices
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={finishDrawing}
                    className="flex-1"
                    disabled={currentVertices.length < 3}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Finish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelDrawing}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Saved Measurements - Top Right Below Measurement Tools */}
      {measurements.length > 0 && (
        <div className="absolute top-48 right-4 z-10">
          <Card className="p-3 glass-effect max-h-64 overflow-auto">
            <div className="text-sm font-medium mb-2">Saved Measurements</div>
            <div className="space-y-1">
              {measurements.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between text-xs p-2 bg-white/50 rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-muted-foreground">
                      {m.area ? `${m.area.toLocaleString()} sq ft` : 'N/A'}
                    </div>
                    {m.isAIGenerated && (
                      <Badge variant="outline" className="text-xs">
                        🤖 AI {(m.aiConfidence! * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleVisibility(m.id)}
                    >
                      {m.isVisible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMeasurement(m.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
