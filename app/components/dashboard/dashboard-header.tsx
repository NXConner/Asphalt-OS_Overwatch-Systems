

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  User,
  LogOut,
  Settings,
  Clock,
  Navigation,
  Sun,
  Moon,
  CloudRain,
} from 'lucide-react';
import { GlitchWrapper } from '@/components/ui/glitch-wrapper';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  onTimesheetClick?: () => void;
  onSidebarToggle?: () => void;
  onDirectionsClick?: () => void;
  onSettingsClick?: () => void;
  onWeatherClick?: () => void;
}

export function DashboardHeader({
  onTimesheetClick,
  onSidebarToggle,
  onDirectionsClick,
  onSettingsClick,
  onWeatherClick,
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-500/30 shadow-lg relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
      
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <GlitchWrapper>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AOS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Asphalt OS
                </h1>
                <p className="text-xs text-blue-300">Overwatch Systems</p>
              </div>
            </div>
          </GlitchWrapper>
        </div>

        {/* Center section - Action buttons */}
        <div className="flex items-center gap-2">
          {onWeatherClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onWeatherClick}
              className="text-white hover:bg-white/10"
              title="Toggle Weather Widget"
            >
              <CloudRain className="h-4 w-4 mr-2" />
              Weather
            </Button>
          )}
          
          {session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role) && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDirectionsClick}
                className="text-white hover:bg-white/10"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettingsClick}
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </>
          )}

          {onTimesheetClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTimesheetClick}
              className="text-white hover:bg-white/10"
            >
              <Clock className="h-4 w-4 mr-2" />
              Timesheet
            </Button>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-white hover:bg-white/10"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{session?.user?.name}</span>
                {session?.user?.role && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {session.user.role}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
