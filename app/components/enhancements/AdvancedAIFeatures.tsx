
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Route,
  DollarSign,
  Calendar,
  MapPin,
  Zap,
  Brain,
  Target
} from 'lucide-react';

export function AdvancedAIFeatures() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handleJobOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization
    setTimeout(() => {
      setOptimizationResult({
        currentEfficiency: 72,
        optimizedEfficiency: 89,
        timeSaved: 4.5,
        costSaved: 850,
        recommendations: [
          'Reschedule 3 jobs to match crew availability',
          'Combine 2 nearby jobs for reduced travel',
          'Adjust material orders for better bulk pricing',
          'Assign more experienced crew to complex jobs'
        ]
      });
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced AI Features</h2>
        <p className="text-muted-foreground">
          AI-powered job optimization and intelligent route planning
        </p>
      </div>

      <Tabs defaultValue="job-optimization">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="job-optimization">Job Optimization</TabsTrigger>
          <TabsTrigger value="route-planning">Route Planning</TabsTrigger>
          <TabsTrigger value="cost-prediction">Cost Prediction</TabsTrigger>
        </TabsList>

        {/* Job Optimization Tab */}
        <TabsContent value="job-optimization" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Intelligent Job Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes crew skills, weather, and job requirements
                </p>
              </div>
            </div>

            {!optimizationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Pending Jobs</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Active Crews</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">72%</p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">$2.4K</p>
                    <p className="text-xs text-muted-foreground">Potential Savings</p>
                  </Card>
                </div>

                <Button 
                  onClick={handleJobOptimization}
                  disabled={isOptimizing}
                  className="w-full h-12"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {isOptimizing ? 'Optimizing...' : 'Optimize Job Schedule'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Current</p>
                    <p className="text-3xl font-bold text-red-500">
                      {optimizationResult.currentEfficiency}%
                    </p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Optimized</p>
                    <p className="text-3xl font-bold text-green-500">
                      {optimizationResult.optimizedEfficiency}%
                    </p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                </div>

                <div className="flex items-center justify-around p-4 rounded-lg bg-primary/10">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {optimizationResult.timeSaved}h
                    </p>
                    <p className="text-xs text-muted-foreground">Time Saved</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      ${optimizationResult.costSaved}
                    </p>
                    <p className="text-xs text-muted-foreground">Cost Saved</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {optimizationResult.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-accent">
                        <Badge variant="outline" className="mt-0.5">{idx + 1}</Badge>
                        <p className="text-sm flex-1">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    Apply Optimization
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setOptimizationResult(null)}
                  >
                    Re-analyze
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Route Planning Tab */}
        <TabsContent value="route-planning" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Route className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Intelligent Route Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Minimize travel time and fuel costs with AI-powered routing
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <Route className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">45 mi</p>
                  <p className="text-xs text-muted-foreground">Total Distance</p>
                </Card>
                <Card className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">$28</p>
                  <p className="text-xs text-muted-foreground">Fuel Cost</p>
                </Card>
                <Card className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                </Card>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <h4 className="font-semibold mb-3">Today's Optimized Route</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Base → Job Site A', distance: '8.2 mi', time: '12 min' },
                    { name: 'Job Site A → Job Site B', distance: '4.5 mi', time: '8 min' },
                    { name: 'Job Site B → Lunch Stop', distance: '2.1 mi', time: '5 min' },
                    { name: 'Lunch Stop → Job Site C', distance: '6.3 mi', time: '11 min' },
                    { name: 'Job Site C → Base', distance: '9.8 mi', time: '16 min' }
                  ].map((leg, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-background/50">
                      <span className="text-sm font-medium">{leg.name}</span>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{leg.distance}</span>
                        <span>{leg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Cost Prediction Tab */}
        <TabsContent value="cost-prediction" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Cost Prediction</h3>
                <p className="text-sm text-muted-foreground">
                  Accurate cost estimates based on historical data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Predicted Cost</p>
                  <p className="text-3xl font-bold text-primary">$3,245</p>
                  <Badge variant="secondary" className="mt-2">95% confidence</Badge>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Actual Average</p>
                  <p className="text-3xl font-bold">$3,198</p>
                  <Badge variant="outline" className="mt-2">Historical data</Badge>
                </Card>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <h4 className="font-semibold mb-3">Cost Breakdown Prediction</h4>
                <div className="space-y-3">
                  {[
                    { category: 'Materials', amount: 1250, percentage: 38 },
                    { category: 'Labor', amount: 1400, percentage: 43 },
                    { category: 'Equipment', amount: 395, percentage: 12 },
                    { category: 'Fuel & Travel', amount: 200, percentage: 7 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">
                          ${item.amount} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-accent rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Generate Detailed Estimate
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
