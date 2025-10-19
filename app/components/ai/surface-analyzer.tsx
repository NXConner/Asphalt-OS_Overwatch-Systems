
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, X, Upload, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SurfaceAnalyzerProps {
  mapInstance?: google.maps.Map | null;
  onClose?: () => void;
  onEstimateGenerated?: (estimate: any) => void;
}

export function SurfaceAnalyzer({ mapInstance, onClose, onEstimateGenerated }: SurfaceAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const captureMapArea = async () => {
    if (!mapInstance) {
      setError('Map not available');
      return null;
    }

    try {
      // Get map bounds
      const bounds = mapInstance.getBounds();
      const center = mapInstance.getCenter();
      
      if (!bounds || !center) {
        setError('Unable to get map bounds');
        return null;
      }

      // Take a screenshot of the map
      const mapDiv = mapInstance.getDiv();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setError('Canvas not supported');
        return null;
      }

      canvas.width = mapDiv.clientWidth;
      canvas.height = mapDiv.clientHeight;

      // Convert map to image (this is a simplified version)
      // In production, you'd use a library like html2canvas
      return {
        bounds: {
          north: bounds.getNorthEast().lat(),
          south: bounds.getSouthWest().lat(),
          east: bounds.getNorthEast().lng(),
          west: bounds.getSouthWest().lng(),
        },
        center: {
          lat: center.lat(),
          lng: center.lng(),
        },
        zoom: mapInstance.getZoom(),
      };
    } catch (err) {
      console.error('Error capturing map:', err);
      setError('Failed to capture map area');
      return null;
    }
  };

  const analyzeArea = async () => {
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const mapData = await captureMapArea();
      
      if (!mapData) {
        return;
      }

      const response = await fetch('/api/ai/analyze-surface', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapData),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);

      if (onEstimateGenerated && data.estimate) {
        onEstimateGenerated(data.estimate);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze surface. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="fixed top-20 right-4 z-[100] w-96 glass-morphism border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Surface Analyzer
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Analyze Current Map View</Label>
          <p className="text-sm text-muted-foreground">
            Position the map to show the area you want to analyze. The AI will detect the surface type, 
            estimate area, and suggest services.
          </p>
        </div>

        <Button
          onClick={analyzeArea}
          disabled={isAnalyzing || !mapInstance}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Analyze This Area
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Analysis Results</h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Surface Type:</p>
                  <p className="font-medium">{result.surfaceType || 'Asphalt'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estimated Area:</p>
                  <p className="font-medium">{result.area || '0'} sq ft</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition:</p>
                  <p className="font-medium">{result.condition || 'Fair'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence:</p>
                  <p className="font-medium">{result.confidence || '85'}%</p>
                </div>
              </div>

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Recommended Services:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.estimatedCost && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <p className="text-sm font-medium">Estimated Cost Range:</p>
                  <p className="text-lg font-bold text-primary">
                    ${result.estimatedCost.min.toLocaleString()} - ${result.estimatedCost.max.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 Tips for best results:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Use satellite view</li>
            <li>Zoom in on the specific area</li>
            <li>Ensure good lighting/visibility</li>
            <li>Center the area of interest</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
