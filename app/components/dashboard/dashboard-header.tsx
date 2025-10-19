


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
  Palette,
} from 'lucide-react';
import { GlitchWrapper } from '@/components/ui/glitch-wrapper';
import { useRouter } from 'next/navigation';
import { useGlassEffects } from '@/hooks/use-glass-effects';
import { getGlassEffectStyles } from '@/lib/glass-effects';
import { cn } from '@/lib/utils';
import { GameModeToggle } from '@/components/game/game-mode-toggle';
import { DivisionThemeSelector } from '@/components/theme/division-theme-selector';
import { XPProgressBar } from '@/components/gamification/xp-progress-bar';

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
  const router = useRouter();
  const { topbarSettings } = useGlassEffects();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const glassStyles = getGlassEffectStyles(topbarSettings);
  const isGlassEnabled = topbarSettings.enabled && topbarSettings.type !== 'none';

  return (
    <header 
      className={cn(
        "border-b border-border shadow-lg relative overflow-hidden transition-all duration-300 z-50",
        isGlassEnabled ? "glass-morphism" : "bg-card"
      )}
      style={glassStyles}
    >
      {/* Animated gradient overlay - only show when not using glass */}
      {!isGlassEnabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse" />
      )}
      
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="hover:bg-accent/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <GlitchWrapper>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">AOS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Asphalt OS
                </h1>
                <p className="text-xs text-muted-foreground">Overwatch Systems</p>
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
              className="hover:bg-accent/10"
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
                className="hover:bg-accent/10"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettingsClick}
                className="hover:bg-accent/10"
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
              className="hover:bg-accent/10"
            >
              <Clock className="h-4 w-4 mr-2" />
              Timesheet
            </Button>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* XP Progress Bar */}
          <XPProgressBar compact />

          {/* Game Mode Toggle */}
          <GameModeToggle />

          {/* Division Theme Selector */}
          <DivisionThemeSelector />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-accent/10"
            title="Dark/Light Mode"
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
              <Button variant="ghost" size="sm" className="hover:bg-accent/10">
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
              <DropdownMenuItem onClick={() => window.location.href = '/theme'}>
                <Palette className="mr-2 h-4 w-4" />
                Theme Customizer
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
