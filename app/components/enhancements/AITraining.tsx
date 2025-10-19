
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Upload,
  CheckCircle,
  XCircle,
  Zap,
  TrendingUp,
  Database,
  Settings
} from 'lucide-react';

interface TrainingData {
  id: string;
  type: 'surface' | 'job' | 'cost';
  description: string;
  images?: string[];
  labels: string[];
  accuracy?: number;
}

export function AITraining() {
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedType, setSelectedType] = useState<'surface' | 'job' | 'cost'>('surface');

  const trainingStats = {
    totalSamples: 1250,
    surfaceDetection: { samples: 500, accuracy: 94.2 },
    jobOptimization: { samples: 400, accuracy: 89.7 },
    costEstimation: { samples: 350, accuracy: 91.5 }
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Training Center</h2>
        <p className="text-muted-foreground">
          Fine-tune AI models on your business data for better accuracy
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Surface Detection</h4>
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Samples</span>
              <span className="font-medium">{trainingStats.surfaceDetection.samples}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy</span>
              <Badge variant="secondary">{trainingStats.surfaceDetection.accuracy}%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Job Optimization</h4>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Samples</span>
              <span className="font-medium">{trainingStats.jobOptimization.samples}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy</span>
              <Badge variant="secondary">{trainingStats.jobOptimization.accuracy}%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Cost Estimation</h4>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Samples</span>
              <span className="font-medium">{trainingStats.costEstimation.samples}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy</span>
              <Badge variant="secondary">{trainingStats.costEstimation.accuracy}%</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Training Interface */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Add Training Data
            </h3>

            <div className="space-y-4">
              <div>
                <Label>Training Category</Label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full mt-2 px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="surface">Surface Detection</option>
                  <option value="job">Job Optimization</option>
                  <option value="cost">Cost Estimation</option>
                </select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what this training data represents..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label>Upload Images (optional)</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              <div>
                <Label>Labels (comma-separated)</Label>
                <Input
                  placeholder="e.g., parking lot, asphalt, good condition"
                  className="mt-2"
                />
              </div>

              <Button className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Add Training Sample
              </Button>
            </div>
          </div>

          {/* Training Progress */}
          {(isTraining || trainingProgress === 100) && (
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Training Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing samples...</span>
                  <span className="font-medium">{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
                {trainingProgress === 100 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                    <CheckCircle className="w-4 h-4" />
                    Training completed successfully!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Training Actions */}
          <div className="border-t pt-6">
            <div className="flex gap-2">
              <Button
                onClick={handleStartTraining}
                disabled={isTraining}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isTraining ? 'Training...' : 'Start Training'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Training History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Training Sessions</h3>
        <div className="space-y-3">
          {[
            { date: '2025-10-19', type: 'Surface Detection', accuracy: 94.2, samples: 50 },
            { date: '2025-10-18', type: 'Job Optimization', accuracy: 89.7, samples: 35 },
            { date: '2025-10-17', type: 'Cost Estimation', accuracy: 91.5, samples: 42 }
          ].map((session, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">{session.type}</p>
                  <p className="text-xs text-muted-foreground">{session.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{session.accuracy}% accuracy</p>
                <p className="text-xs text-muted-foreground">{session.samples} samples</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
