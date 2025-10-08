
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Navigation2,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Phone,
  Activity,
  Award,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    // Current status
    currentStatus: 'ONLINE' | 'OFFLINE' | 'DRIVING' | 'AT_JOB_SITE' | 'ON_BREAK' | 'IDLE';
    // Location
    latitude?: number;
    longitude?: number;
    speed?: number; // mph
    heading?: number; // degrees
    // Stats
    isMoving?: boolean;
    isStationary?: boolean;
    isDriving?: boolean;
    isPassenger?: boolean;
    // Time tracking
    totalTimeToday?: number; // minutes
    drivingTimeToday?: number; // minutes
    stationaryTimeToday?: number; // minutes
    // Costs
    fuelCostToday?: number;
    wastedTimeCost?: number;
    moneySaved?: number;
    netImpact?: number;
    // Performance
    safetyScore?: number;
    efficiencyScore?: number;
    punctualityScore?: number;
    overallScore?: number;
    // Violations
    violationsToday?: number;
    // Phone usage
    phoneUsageMinutes?: number;
    socialMediaMinutes?: number;
  };
  onEdit?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

export function EmployeeCard({ employee, onEdit, onViewDetails, compact = false }: EmployeeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'OFFLINE': return 'bg-gray-500';
      case 'DRIVING': return 'bg-blue-500';
      case 'AT_JOB_SITE': return 'bg-purple-500';
      case 'ON_BREAK': return 'bg-yellow-500';
      case 'IDLE': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ');
  };

  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const safetyScore = employee.safetyScore ?? 100;
  const efficiencyScore = employee.efficiencyScore ?? 100;
  const punctualityScore = employee.punctualityScore ?? 100;
  const overallScore = employee.overallScore ?? 100;

  // Compact view for map popups
  if (compact) {
    return (
      <Card className="w-80 border-2 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{employee.name}</h3>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", getStatusColor(employee.currentStatus), "text-white")}>
                  {getStatusText(employee.currentStatus)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {employee.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Current Activity */}
          {employee.isDriving && (
            <div className="flex items-center gap-2 text-sm">
              <Navigation2 className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{employee.speed ?? 0} mph</span>
              {employee.heading && (
                <span className="text-muted-foreground">
                  heading {Math.round(employee.heading)}°
                </span>
              )}
            </div>
          )}

          {/* Net Impact */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Net Impact</span>
            <div className="flex items-center gap-1">
              {(employee.netImpact ?? 0) >= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-bold">
                    +${Math.abs(employee.netImpact ?? 0).toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 font-bold">
                    -${Math.abs(employee.netImpact ?? 0).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Time Today</div>
              <div className="font-medium">{Math.floor((employee.totalTimeToday ?? 0) / 60)}h {(employee.totalTimeToday ?? 0) % 60}m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Fuel Cost</div>
              <div className="font-medium">${(employee.fuelCostToday ?? 0).toFixed(2)}</div>
            </div>
          </div>

          {/* Performance Score */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-sm font-bold">{overallScore.toFixed(0)}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={onViewDetails}>
              View Details
            </Button>
            {onEdit && (
              <Button size="sm" variant="ghost" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view
  return (
    <Card className="w-full max-w-2xl border-2 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary shadow-lg">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("text-sm", getStatusColor(employee.currentStatus), "text-white")}>
                  {getStatusText(employee.currentStatus)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {employee.role}
                </Badge>
              </div>
            </div>
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Activity */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Current Activity
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {employee.latitude && employee.longitude
                  ? `${employee.latitude.toFixed(4)}, ${employee.longitude.toFixed(4)}`
                  : 'Location unavailable'}
              </span>
            </div>
            {employee.isDriving && (
              <div className="flex items-center gap-2">
                <Navigation2 className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{employee.speed ?? 0} mph</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Impact */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Impact (Today)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="text-sm text-muted-foreground">Money Saved</div>
              <div className="text-xl font-bold text-green-600">
                +${(employee.moneySaved ?? 0).toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="text-sm text-muted-foreground">Money Cost</div>
              <div className="text-xl font-bold text-red-600">
                -${((employee.wastedTimeCost ?? 0) + (employee.fuelCostToday ?? 0)).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="font-medium">Net Impact</span>
              <div className="flex items-center gap-2">
                {(employee.netImpact ?? 0) >= 0 ? (
                  <>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-600">
                      +${Math.abs(employee.netImpact ?? 0).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <span className="text-2xl font-bold text-red-600">
                      -${Math.abs(employee.netImpact ?? 0).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Time Tracking */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Tracking (Today)
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Time</div>
              <div className="text-lg font-bold">{Math.floor((employee.totalTimeToday ?? 0) / 60)}h {(employee.totalTimeToday ?? 0) % 60}m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Driving</div>
              <div className="text-lg font-bold text-blue-600">{Math.floor((employee.drivingTimeToday ?? 0) / 60)}h {(employee.drivingTimeToday ?? 0) % 60}m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Stationary</div>
              <div className="text-lg font-bold text-orange-600">{Math.floor((employee.stationaryTimeToday ?? 0) / 60)}h {(employee.stationaryTimeToday ?? 0) % 60}m</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Phone Usage */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Usage (Today)
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Usage</div>
              <div className="text-lg font-bold">{employee.phoneUsageMinutes ?? 0} min</div>
            </div>
            <div>
              <div className="text-muted-foreground">Social Media</div>
              <div className="text-lg font-bold text-red-600">{employee.socialMediaMinutes ?? 0} min</div>
            </div>
          </div>
          {(employee.wastedTimeCost ?? 0) > 0 && (
            <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-950/20 text-sm text-red-600">
              Wasted time cost: ${(employee.wastedTimeCost ?? 0).toFixed(2)}
            </div>
          )}
        </div>

        <Separator />

        {/* Performance Scores */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Performance Scores
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Safety</span>
                <span className="text-sm font-bold">{safetyScore.toFixed(0)}%</span>
              </div>
              <Progress value={safetyScore} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Efficiency</span>
                <span className="text-sm font-bold">{efficiencyScore.toFixed(0)}%</span>
              </div>
              <Progress value={efficiencyScore} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Punctuality</span>
                <span className="text-sm font-bold">{punctualityScore.toFixed(0)}%</span>
              </div>
              <Progress value={punctualityScore} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Overall Score</span>
                <span className="text-sm font-bold">{overallScore.toFixed(0)}%</span>
              </div>
              <Progress value={overallScore} className="h-2" />
            </div>
          </div>
        </div>

        {/* Violations */}
        {(employee.violationsToday ?? 0) > 0 && (
          <>
            <Separator />
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <div className="font-semibold">{employee.violationsToday} Violation(s) Today</div>
                  <div className="text-sm">Review and address compliance issues</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        {onViewDetails && (
          <div className="flex gap-2">
            <Button className="flex-1" onClick={onViewDetails}>
              View Full Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
