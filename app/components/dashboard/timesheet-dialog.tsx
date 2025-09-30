
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  MapPin,
  Timer,
  TimerOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Navigation,
} from 'lucide-react';

interface TimesheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimesheetDialog({ 
  open, 
  onOpenChange 
}: TimesheetDialogProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [clockStatus, setClockStatus] = useState<{ isClockedIn: boolean; timesheet?: any }>({
    isClockedIn: false
  });
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get current location and fetch data when dialog opens
  useEffect(() => {
    if (open) {
      getCurrentLocation();
      fetchClockStatus();
      fetchTimesheets();
    }
  }, [open]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError('');
        },
        (error) => {
          setLocationError('Location access denied. Please enable location services.');
          console.error('Error getting location:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const fetchClockStatus = async () => {
    try {
      const response = await fetch('/api/timesheets/status');
      if (response.ok) {
        const status = await response.json();
        setClockStatus(status);
      }
    } catch (error) {
      console.error('Error fetching clock status:', error);
    }
  };

  const fetchTimesheets = async () => {
    try {
      const response = await fetch('/api/timesheets');
      if (response.ok) {
        const data = await response.json();
        setTimesheets(data);
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleClockAction = async (action: 'clock_in' | 'clock_out') => {
    if (!location && !locationError) {
      getCurrentLocation();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          latitude: location?.lat,
          longitude: location?.lng,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update timesheet');
      }

      const result = await response.json();
      
      // Update clock status
      setClockStatus({
        isClockedIn: action === 'clock_in',
        timesheet: result.timesheet
      });

      // Clear notes
      setNotes('');

      // Refresh timesheets
      fetchTimesheets();

      // Show success message if location was valid
      if (!result.locationValid) {
        setLocationError('⚠️ You are outside the approved work area, but time was recorded.');
      }

    } catch (error) {
      console.error('Error with clock action:', error);
      setLocationError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getLocationStatus = () => {
    if (locationError) {
      return { status: 'error', message: locationError, icon: AlertCircle };
    }
    if (!location) {
      return { status: 'loading', message: 'Getting location...', icon: Navigation };
    }
    return { status: 'success', message: 'Location acquired', icon: CheckCircle2 };
  };

  const locationStatus = getLocationStatus();

  if (session?.user?.role !== 'EMPLOYEE') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <p className="text-muted-foreground">
              Timesheet access is only available to employees.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Employee Timesheet
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Current Status */}
          <Card className={clockStatus.isClockedIn ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {clockStatus.isClockedIn ? (
                  <Timer className="h-5 w-5 text-green-600" />
                ) : (
                  <TimerOff className="h-5 w-5 text-gray-500" />
                )}
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {currentTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Time</div>
                  </div>
                  
                  <Badge
                    variant={clockStatus.isClockedIn ? "default" : "secondary"}
                    className={clockStatus.isClockedIn ? 'bg-green-600' : ''}
                  >
                    {clockStatus.isClockedIn ? 'CLOCKED IN' : 'NOT CLOCKED IN'}
                  </Badge>
                </div>

                {clockStatus.isClockedIn && clockStatus.timesheet && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Clocked in at: {new Date(clockStatus.timesheet.clockIn).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Duration: {formatDuration(
                        (currentTime.getTime() - new Date(clockStatus.timesheet.clockIn).getTime()) / (1000 * 60 * 60)
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <locationStatus.icon className="h-4 w-4" />
                <AlertDescription>{locationStatus.message}</AlertDescription>
              </Alert>
              
              {location && (
                <div className="mt-4 text-xs text-muted-foreground">
                  <div>Business Location: 337 Ayers Orchard Road, Stuart, VA</div>
                  <div>Current: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clock In/Out Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {clockStatus.isClockedIn ? 'Clock Out' : 'Clock In'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about your shift..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={() => handleClockAction(clockStatus.isClockedIn ? 'clock_out' : 'clock_in')}
                  disabled={loading || (!location && !locationError)}
                  className={clockStatus.isClockedIn ? 
                    'w-full bg-red-600 hover:bg-red-700' : 
                    'w-full bg-green-600 hover:bg-green-700'
                  }
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {clockStatus.isClockedIn ? (
                    <>
                      <TimerOff className="h-4 w-4 mr-2" />
                      Clock Out
                    </>
                  ) : (
                    <>
                      <Timer className="h-4 w-4 mr-2" />
                      Clock In
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Timesheets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Timesheets</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {timesheets?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="mx-auto h-8 w-8 mb-2" />
                    <p>No timesheets found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {timesheets?.slice(0, 10)?.map((timesheet) => (
                      <div key={timesheet.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">
                            {new Date(timesheet.clockIn).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            {timesheet.isValidLocation ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            )}
                            {timesheet.totalPay && (
                              <Badge variant="secondary">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {formatCurrency(timesheet.totalPay)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            <div>Clock In: {new Date(timesheet.clockIn).toLocaleTimeString()}</div>
                            {timesheet.clockOut && (
                              <div>Clock Out: {new Date(timesheet.clockOut).toLocaleTimeString()}</div>
                            )}
                          </div>
                          <div className="text-right">
                            {timesheet.totalHours && (
                              <div>Total: {formatDuration(timesheet.totalHours)}</div>
                            )}
                            {timesheet.overtimeHours > 0 && (
                              <div className="text-orange-600">
                                OT: {formatDuration(timesheet.overtimeHours)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {timesheet.notes && (
                          <div className="mt-2 text-xs text-muted-foreground italic">
                            "{timesheet.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          {timesheets?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>This Week Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {timesheets
                        ?.filter(t => {
                          const date = new Date(t.clockIn);
                          const now = new Date();
                          const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                          return date >= weekStart;
                        })
                        ?.reduce((sum, t) => sum + (t.totalHours || 0), 0)
                        ?.toFixed(1) || '0.0'}h
                    </div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        timesheets
                          ?.filter(t => {
                            const date = new Date(t.clockIn);
                            const now = new Date();
                            const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                            return date >= weekStart;
                          })
                          ?.reduce((sum, t) => sum + (t.totalPay || 0), 0) || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Pay</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {timesheets
                        ?.filter(t => {
                          const date = new Date(t.clockIn);
                          const now = new Date();
                          const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                          return date >= weekStart;
                        })
                        ?.reduce((sum, t) => sum + (t.overtimeHours || 0), 0)
                        ?.toFixed(1) || '0.0'}h
                    </div>
                    <div className="text-sm text-muted-foreground">Overtime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
