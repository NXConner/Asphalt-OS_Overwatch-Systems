
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { EmployeeCard } from '@/components/employee-card';
import { toast } from 'sonner';

// Demo employee data
const DEMO_EMPLOYEES = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@asphaltpaving.com',
    role: 'EMPLOYEE',
    currentStatus: 'DRIVING' as const,
    latitude: 36.6054,
    longitude: -80.7938,
    speed: 45,
    heading: 90,
    isMoving: true,
    isDriving: true,
    totalTimeToday: 420, // 7 hours
    drivingTimeToday: 180, // 3 hours
    stationaryTimeToday: 60, // 1 hour
    fuelCostToday: 25.50,
    wastedTimeCost: 15.00,
    moneySaved: 50.00,
    netImpact: 35.00,
    safetyScore: 95,
    efficiencyScore: 88,
    punctualityScore: 92,
    overallScore: 92,
    violationsToday: 0,
    phoneUsageMinutes: 30,
    socialMediaMinutes: 10,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@asphaltpaving.com',
    role: 'EMPLOYEE',
    currentStatus: 'AT_JOB_SITE' as const,
    latitude: 36.6154,
    longitude: -80.8038,
    speed: 0,
    isStationary: true,
    totalTimeToday: 360, // 6 hours
    drivingTimeToday: 90, // 1.5 hours
    stationaryTimeToday: 240, // 4 hours
    fuelCostToday: 18.00,
    wastedTimeCost: 35.00,
    moneySaved: 25.00,
    netImpact: -10.00,
    safetyScore: 78,
    efficiencyScore: 65,
    punctualityScore: 85,
    overallScore: 76,
    violationsToday: 2,
    phoneUsageMinutes: 90,
    socialMediaMinutes: 60,
  },
  {
    id: '3',
    name: 'Sarah Davis',
    email: 'sarah@asphaltpaving.com',
    role: 'ADMIN',
    currentStatus: 'ONLINE' as const,
    latitude: 36.6254,
    longitude: -80.8138,
    speed: 0,
    isStationary: true,
    totalTimeToday: 480, // 8 hours
    drivingTimeToday: 60, // 1 hour
    stationaryTimeToday: 60, // 1 hour
    fuelCostToday: 8.50,
    wastedTimeCost: 5.00,
    moneySaved: 120.00,
    netImpact: 115.00,
    safetyScore: 100,
    efficiencyScore: 96,
    punctualityScore: 98,
    overallScore: 98,
    violationsToday: 0,
    phoneUsageMinutes: 15,
    socialMediaMinutes: 0,
  },
];

export default function EmployeeTrackingPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<typeof DEMO_EMPLOYEES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Only ADMIN and OWNER can access tracking
      if (!['ADMIN', 'OWNER'].includes(session.user.role)) {
        router.replace('/dashboard');
        toast.error('Access denied: Tracking is for administrators only');
      }
    }
  }, [status, session, router]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Playback paused' : 'Playback started');
  };

  const handleReset = () => {
    setIsPlaying(false);
    toast.success('Playback reset to start of day');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8" />
                Employee Tracking
              </h1>
              <p className="text-muted-foreground">
                Monitor employee locations, performance, and costs in real-time
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/settings/glass-effects')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Glass Effects
          </Button>
        </div>

        {/* Playback Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Playback Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={handlePlayPause} variant="default">
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <div className="flex-1 text-sm text-muted-foreground">
                {isPlaying ? 'Playing back employee movements...' : 'Paused - Click play to start playback'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{DEMO_EMPLOYEES.length}</div>
              <p className="text-sm text-muted-foreground">Active today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">127.5 mi</div>
              <p className="text-sm text-muted-foreground">Traveled today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+$140.00</div>
              <p className="text-sm text-muted-foreground">Company savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Employee List */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Employees</h2>
            <div className="grid grid-cols-1 gap-6">
              {DEMO_EMPLOYEES.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={() => toast.info('Edit employee functionality coming soon')}
                  onViewDetails={() => {
                    setSelectedEmployee(employee);
                    toast.success('Viewing employee details');
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">🎯 Demo Mode</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is a demonstration of the employee tracking system. In production, this would show:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time GPS tracking of employee locations</li>
              <li>Live movement status (driving, stationary, at job site)</li>
              <li>Actual phone usage data from mobile app</li>
              <li>Historical playback with video-style controls</li>
              <li>Automatic compliance violation detection</li>
              <li>Real-time cost tracking and savings calculations</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Note:</strong> Full functionality requires a mobile app for data collection.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
