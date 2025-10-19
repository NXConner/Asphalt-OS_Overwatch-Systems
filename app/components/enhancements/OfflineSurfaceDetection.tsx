
'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Scan,
  Download,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface DetectionResult {
  surfaceType: string;
  condition: string;
  confidence: number;
  area: number;
  estimatedCost: number;
  recommendations: string[];
}

export function OfflineSurfaceDetection() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadModel = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsModelLoaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isModelLoaded) return;

    setIsProcessing(true);
    setResult(null);

    // Simulate edge-based processing
    setTimeout(() => {
      const mockResult: DetectionResult = {
        surfaceType: 'Asphalt Parking Lot',
        condition: 'Fair',
        confidence: 87.5,
        area: 5234,
        estimatedCost: 1570.2,
        recommendations: [
          'Crack filling recommended in southeast section',
          'Sealcoating needed within 6 months',
          'Minor patching required near entrance',
          'Re-striping needed for parking stalls'
        ]
      };

      setResult(mockResult);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Offline Surface Detection
          <WifiOff className="w-6 h-6 text-muted-foreground" />
        </h2>
        <p className="text-muted-foreground">
          Edge-based AI analysis without internet connection
        </p>
      </div>

      {/* Model Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Edge AI Model</h3>
            <p className="text-sm text-muted-foreground">
              Local processing for instant results
            </p>
          </div>
          <Badge variant={isModelLoaded ? 'default' : 'secondary'}>
            {isModelLoaded ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready
              </>
            ) : (
              'Not Loaded'
            )}
          </Badge>
        </div>

        {!isModelLoaded ? (
          <div className="space-y-4">
            {progress > 0 && progress < 100 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Loading model...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button onClick={handleLoadModel} className="w-full" disabled={progress > 0 && progress < 100}>
              <Download className="w-4 h-4 mr-2" />
              {progress > 0 && progress < 100 ? 'Loading...' : 'Load AI Model (15MB)'}
            </Button>

            <div className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
              <p className="font-semibold mb-1">Benefits of Offline Mode:</p>
              <ul className="space-y-1">
                <li>• Works without internet connection</li>
                <li>• Instant analysis (no network latency)</li>
                <li>• Privacy-focused (data stays on device)</li>
                <li>• Perfect for remote job sites</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {!result && !isProcessing && (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <p className="font-medium mb-1">Upload Surface Image</p>
                  <p className="text-sm text-muted-foreground">
                    Click to select or drag and drop an image
                  </p>
                </>
              )}

              {isProcessing && (
                <>
                  <Scan className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
                  <p className="font-medium">Analyzing surface...</p>
                  <p className="text-sm text-muted-foreground">
                    Processing on-device with edge AI
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Results */}
            {result && (
              <Card className="p-6 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Detection Results</h4>
                  <Badge variant="secondary" className="text-base">
                    {result.confidence}% confidence
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Surface Type</p>
                    <p className="font-semibold">{result.surfaceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Condition</p>
                    <Badge variant={
                      result.condition === 'Good' ? 'default' :
                      result.condition === 'Fair' ? 'outline' : 'destructive'
                    }>
                      {result.condition}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Area</p>
                    <p className="font-semibold">{result.area.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                    <p className="font-semibold text-primary">
                      ${result.estimatedCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Recommendations
                  </h5>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button className="flex-1">
                    Create Estimate
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                    Analyze Another
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <WifiOff className="w-5 h-5" />
          How Offline Detection Works
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          Our edge AI model runs entirely on your device using WebAssembly and TensorFlow.js,
          providing instant surface analysis even in areas with no internet connectivity.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-background/50 rounded p-2">
            <p className="font-semibold">Model Size</p>
            <p className="text-muted-foreground">15MB compressed</p>
          </div>
          <div className="bg-background/50 rounded p-2">
            <p className="font-semibold">Processing Time</p>
            <p className="text-muted-foreground">~2 seconds</p>
          </div>
          <div className="bg-background/50 rounded p-2">
            <p className="font-semibold">Accuracy</p>
            <p className="text-muted-foreground">85-95%</p>
          </div>
          <div className="bg-background/50 rounded p-2">
            <p className="font-semibold">Surfaces</p>
            <p className="text-muted-foreground">12 types</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
