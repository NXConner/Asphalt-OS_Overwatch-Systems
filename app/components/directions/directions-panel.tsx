

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Route, 
  Fuel, 
  X, 
  ArrowRight,
  Building,
  Target,
  Loader2
} from 'lucide-react';
import { BUSINESS_ADDRESS, getDirections, DirectionsResult } from '@/lib/business-logic';

interface DirectionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  jobs?: Array<{
    id: string;
    title: string;
    address: string;
  }>;
  selectedJobId?: string;
  onJobSelect?: (jobId: string) => void;
}

export function DirectionsPanel({ 
  isOpen, 
  onClose, 
  jobs = [], 
  selectedJobId, 
  onJobSelect 
}: DirectionsPanelProps) {
  const [origin, setOrigin] = useState(BUSINESS_ADDRESS);
  const [destination, setDestination] = useState('');
  const [isReverse, setIsReverse] = useState(false);
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<any>(null);

  useEffect(() => {
    if (selectedJobId && jobs.length > 0) {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob) {
        setDestination(selectedJob.address);
      }
    }
  }, [selectedJobId, jobs]);

  useEffect(() => {
    fetchBusinessSettings();
  }, []);

  const fetchBusinessSettings = async () => {
    try {
      const response = await fetch('/api/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: '', destination: '' })
      });
      if (response.ok) {
        const data = await response.json();
        setBusinessSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching business settings:', error);
    }
  };

  const handleGetDirections = async () => {
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    try {
      const result = await getDirections(
        isReverse ? destination : origin,
        isReverse ? origin : destination,
        businessSettings
      );

      if (result) {
        setDirections(result);
      } else {
        toast.error('Unable to get directions. Please check the addresses.');
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      toast.error('Failed to get directions');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapAddresses = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setIsReverse(!isReverse);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Directions</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Job Selection */}
          {jobs.length > 0 && (
            <div className="space-y-2">
              <Label>Select Job Site</Label>
              <Select value={selectedJobId || ''} onValueChange={(value) => {
                if (value && onJobSelect) {
                  onJobSelect(value);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{job.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {job.address}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Origin */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              From
            </Label>
            <Input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Starting address"
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              To
            </Label>
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination address"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleSwapAddresses} variant="outline" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button onClick={handleGetDirections} className="flex-1" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              <Route className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>

        {/* Results */}
        {directions && (
          <>
            <Separator />
            <div className="flex-1 overflow-hidden">
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Card className="p-3">
                    <div className="text-center">
                      <Route className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{directions.route.distance}</div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <div className="text-sm font-medium">{directions.route.duration}</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <Fuel className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                      <div className="text-sm font-medium">${directions.fuelCost.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Fuel Cost</div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Turn-by-turn directions */}
              <div className="px-4 pb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Turn-by-turn Directions
                </h3>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {directions.route.steps.map((step, index) => (
                      <div key={index} className="flex gap-3 p-2 rounded-lg bg-muted/50">
                        <Badge variant="outline" className="text-xs px-2">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 text-sm">
                          <p className="mb-1">{step.instruction}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{step.distance}</span>
                            <span>{step.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Fuel costs calculated using current business settings
        </p>
      </div>
    </div>
  );
}

