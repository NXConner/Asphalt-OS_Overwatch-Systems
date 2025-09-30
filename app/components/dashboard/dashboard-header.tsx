
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MapPin,
  Clock,
  Menu,
  LogOut,
  User,
  Settings,
  Timer,
  TimerOff,
  Navigation,
  Route,
} from 'lucide-react';

interface DashboardHeaderProps {
  onTimesheetClick: () => void;
  onSidebarToggle: () => void;
  onDirectionsClick: () => void;
  onSettingsClick: () => void;
}

export function DashboardHeader({ onTimesheetClick, onSidebarToggle, onDirectionsClick, onSettingsClick }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const [clockStatus, setClockStatus] = useState<{ isClockedIn: boolean; timesheet?: any }>({
    isClockedIn: false
  });

  // Check clock-in status
  useEffect(() => {
    const checkClockStatus = async () => {
      try {
        const response = await fetch('/api/timesheets/status');
        if (response.ok) {
          const status = await response.json();
          setClockStatus(status);
        }
      } catch (error) {
        console.error('Error checking clock status:', error);
      }
    };

    if (session?.user?.role === 'EMPLOYEE') {
      checkClockStatus();
      // Check every 30 seconds
      const interval = setInterval(checkClockStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'EMPLOYEE': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserInitials = (firstName?: string | null, lastName?: string | null, name?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (name) {
      const parts = name.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name[0]?.toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">AsphaltPro Maps</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Employee Clock Status */}
        {session?.user?.role === 'EMPLOYEE' && (
          <div className="flex items-center gap-2">
            {clockStatus.isClockedIn ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Timer className="h-3 w-3 mr-1" />
                Clocked In
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                <TimerOff className="h-3 w-3 mr-1" />
                Not Clocked In
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onTimesheetClick}
              className="hidden sm:flex"
            >
              <Clock className="h-4 w-4 mr-1" />
              {clockStatus.isClockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDirectionsClick}
            className="hidden sm:flex"
          >
            <Navigation className="h-4 w-4 mr-1" />
            Directions
          </Button>
          
          {['ADMIN', 'OWNER'].includes(session?.user?.role || '') && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="hidden sm:flex"
            >
              <Settings className="h-4 w-4 mr-1" />
              Business Settings
            </Button>
          )}
        </div>

        {/* Current Time */}
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  {getUserInitials(
                    session?.user?.firstName,
                    session?.user?.lastName,
                    session?.user?.name
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.firstName && session?.user?.lastName
                    ? `${session.user.firstName} ${session.user.lastName}`
                    : session?.user?.name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
                <Badge className={`w-fit ${getRoleColor(session?.user?.role || '')}`}>
                  {session?.user?.role || 'USER'}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {session?.user?.role === 'EMPLOYEE' && (
              <>
                <DropdownMenuItem onClick={onTimesheetClick}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Timesheet</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem onClick={onDirectionsClick}>
              <Navigation className="mr-2 h-4 w-4" />
              <span>Directions</span>
            </DropdownMenuItem>
            
            {['ADMIN', 'OWNER'].includes(session?.user?.role || '') && (
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Business Settings</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
