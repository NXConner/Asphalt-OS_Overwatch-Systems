
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calculator,
  DollarSign,
  FileText,
  Loader2,
  Download,
  Send,
  MapPin,
  Clock,
  Truck,
  Wrench,
} from 'lucide-react';
import { calculateEstimate, EstimateResult, EstimateInput, BUSINESS_ADDRESS, BusinessSettings } from '@/lib/business-logic';

interface EstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: any;
}

export function EstimateDialog({ 
  open, 
  onOpenChange, 
  job 
}: EstimateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [savedEstimate, setSavedEstimate] = useState<any>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);

  // Fetch business settings when dialog opens
  useEffect(() => {
    if (open) {
      fetchBusinessSettings();
    }
  }, [open]);

  // Calculate estimate when job or settings change
  useEffect(() => {
    if (job && open && businessSettings) {
      calculateJobEstimate();
    }
  }, [job, open, businessSettings]);

  const fetchBusinessSettings = async () => {
    try {
      const response = await fetch('/api/business-settings');
      if (response.ok) {
        const settings = await response.json();
        const settingsMap = settings.reduce((acc: BusinessSettings, setting: any) => {
          acc[setting.key] = parseFloat(setting.value);
          return acc;
        }, {});
        setBusinessSettings(settingsMap);
      }
    } catch (error) {
      console.error('Error fetching business settings:', error);
      // Use default settings if fetch fails
      setBusinessSettings({});
    }
  };

  const calculateJobEstimate = () => {
    if (!job || !businessSettings) return;

    const input: EstimateInput = {
      jobType: job.type,
      squareFootage: job.squareFootage,
      linearFootage: job.linearFootage,
      numberOfStalls: job.numberOfStalls,
      hasOilSpots: job.hasOilSpots,
      crackSeverity: job.crackSeverity || 'MEDIUM',
      jobAddress: job.address,
      businessAddress: BUSINESS_ADDRESS
    };

    const result = calculateEstimate(input, businessSettings);
    setEstimateResult(result);
  };

  const handleSaveEstimate = async () => {
    if (!job || !estimateResult) return;

    setLoading(true);

    try {
      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          jobType: job.type,
          squareFootage: job.squareFootage,
          linearFootage: job.linearFootage,
          numberOfStalls: job.numberOfStalls,
          hasOilSpots: job.hasOilSpots,
          crackSeverity: job.crackSeverity || 'MEDIUM',
          jobAddress: job.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save estimate');
      }

      const estimate = await response.json();
      setSavedEstimate(estimate);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error saving estimate:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getJobTypeDisplay = (type: string) => {
    switch (type) {
      case 'SEALCOATING': return 'Sealcoating';
      case 'CRACK_REPAIR': return 'Crack Repair';
      case 'ASPHALT_PATCHING': return 'Asphalt Patching';
      case 'LINE_STRIPING': return 'Line Striping';
      case 'COMBINATION': return 'Combination Job';
      default: return type;
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Estimate Calculator
            </DialogTitle>
            {savedEstimate && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Estimate #{savedEstimate.estimateNumber}
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {job.title} • {getJobTypeDisplay(job.type)}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="estimate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estimate">Estimate Breakdown</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="estimate" className="space-y-4">
              {/* Job Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Job Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Address</div>
                      <div className="font-medium">{job.address}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Type</div>
                      <div className="font-medium">{getJobTypeDisplay(job.type)}</div>
                    </div>
                    {job.squareFootage && (
                      <div>
                        <div className="text-muted-foreground">Square Footage</div>
                        <div className="font-medium">{job.squareFootage.toLocaleString()} sq ft</div>
                      </div>
                    )}
                    {job.linearFootage && (
                      <div>
                        <div className="text-muted-foreground">Linear Footage</div>
                        <div className="font-medium">{job.linearFootage.toLocaleString()} lin ft</div>
                      </div>
                    )}
                    {job.numberOfStalls && (
                      <div>
                        <div className="text-muted-foreground">Parking Stalls</div>
                        <div className="font-medium">{job.numberOfStalls}</div>
                      </div>
                    )}
                    {job.hasOilSpots && (
                      <div>
                        <div className="text-muted-foreground">Special Notes</div>
                        <div className="font-medium text-orange-600">Has oil spots</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Estimate Breakdown */}
              {estimateResult && (
                <div className="space-y-4">
                  {/* Labor */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Labor Costs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Hours</div>
                          <div className="font-medium">{estimateResult.labor.hours.toFixed(1)} hrs</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Rate</div>
                          <div className="font-medium">{formatCurrency(estimateResult.labor.rate)}/hr</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total</div>
                          <div className="font-medium text-lg">{formatCurrency(estimateResult.labor.cost)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Equipment & Travel */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          Equipment & Fuel
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fuel Cost</span>
                            <span className="font-medium">{formatCurrency(estimateResult.equipment.fuelCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Equipment</span>
                            <span className="font-medium">{formatCurrency(estimateResult.equipment.equipmentCost)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Subtotal</span>
                            <span>{formatCurrency(estimateResult.equipment.fuelCost + estimateResult.equipment.equipmentCost)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Travel Costs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Distance</span>
                            <span className="font-medium">{estimateResult.travel.distance} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Round Trip</span>
                            <span className="font-medium">{(estimateResult.travel.distance * 2)} miles</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Travel Cost</span>
                            <span>{formatCurrency(estimateResult.travel.cost)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Final Totals */}
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Estimate Totals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Materials</span>
                            <span className="font-medium">{formatCurrency(estimateResult.materials.reduce((sum, m) => sum + m.totalCost, 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Labor</span>
                            <span className="font-medium">{formatCurrency(estimateResult.labor.cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Equipment/Fuel</span>
                            <span className="font-medium">{formatCurrency(estimateResult.equipment.fuelCost + estimateResult.equipment.equipmentCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Travel</span>
                            <span className="font-medium">{formatCurrency(estimateResult.travel.cost)}</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-base">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatCurrency(estimateResult.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Overhead (15%)</span>
                            <span>{formatCurrency(estimateResult.overhead)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Profit (25%)</span>
                            <span>{formatCurrency(estimateResult.profit)}</span>
                          </div>
                        </div>
                        
                        <Separator className="border-2" />
                        
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total Estimate</span>
                          <span className="text-blue-600">{formatCurrency(estimateResult.total)}</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground text-center">
                          Estimate valid for 30 days • Subject to site inspection
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              {estimateResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Material Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {estimateResult.materials.map((material, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <div>
                              <div className="font-medium">{material.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {material.quantity} {material.unit} × {formatCurrency(material.unitCost)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(material.totalCost)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total Materials</span>
                      <span>{formatCurrency(estimateResult.materials.reduce((sum, m) => sum + m.totalCost, 0))}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              {estimateResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Estimate Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Job Details</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div><strong>Customer:</strong> {job.contactName || 'Not specified'}</div>
                          <div><strong>Location:</strong> {job.address}</div>
                          <div><strong>Service:</strong> {getJobTypeDisplay(job.type)}</div>
                          {job.description && <div><strong>Description:</strong> {job.description}</div>}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Pricing Breakdown</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Labor ({estimateResult.labor.hours.toFixed(1)} hours)</span>
                            <span>{formatCurrency(estimateResult.labor.cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Materials</span>
                            <span>{formatCurrency(estimateResult.materials.reduce((sum, m) => sum + m.totalCost, 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equipment & Fuel</span>
                            <span>{formatCurrency(estimateResult.equipment.fuelCost + estimateResult.equipment.equipmentCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Travel ({estimateResult.travel.distance * 2} miles)</span>
                            <span>{formatCurrency(estimateResult.travel.cost)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-medium">
                            <span>Subtotal</span>
                            <span>{formatCurrency(estimateResult.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Overhead & Profit</span>
                            <span>{formatCurrency(estimateResult.overhead + estimateResult.profit)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(estimateResult.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm">
                          <div className="font-medium text-blue-900 mb-1">Terms & Conditions</div>
                          <ul className="text-blue-800 space-y-1 text-xs">
                            <li>• Estimate valid for 30 days from date of issue</li>
                            <li>• Final pricing subject to site inspection</li>
                            <li>• Payment terms: 50% deposit, balance on completion</li>
                            <li>• Weather delays may affect scheduling</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {savedEstimate ? 
              `Estimate saved as #${savedEstimate.estimateNumber}` : 
              'Click "Save Estimate" to create a formal quote'
            }
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {!savedEstimate && estimateResult && (
              <Button onClick={handleSaveEstimate} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                <FileText className="h-4 w-4 mr-1" />
                Save Estimate
              </Button>
            )}
            {savedEstimate && (
              <>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-1" />
                  Send to Customer
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
