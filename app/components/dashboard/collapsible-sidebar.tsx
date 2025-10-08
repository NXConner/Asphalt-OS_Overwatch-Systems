

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Building2,
  Users,
  FileText,
  BarChart3,
  Settings,
  Calculator,
  Clock,
  Navigation,
  Palette,
  UserCircle,
  Briefcase,
  Truck,
  Package,
  MessageSquare,
  BookOpen,
  Box,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGlassEffects } from '@/hooks/use-glass-effects';
import { getGlassEffectStyles } from '@/lib/glass-effects';

interface CollapsibleSidebarProps {
  jobs: any[];
  onJobSelect: (job: any) => void;
  onNewJob: () => void;
  onEstimate: (job: any) => void;
  onDirections?: (job: any) => void;
  defaultCollapsed?: boolean;
}

export function CollapsibleSidebar({ 
  jobs, 
  onJobSelect, 
  onNewJob, 
  onEstimate,
  onDirections,
  defaultCollapsed = false 
}: CollapsibleSidebarProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { sidebarSettings } = useGlassEffects();

  // Load sidebar preferences from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === 'true');
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // Filter jobs based on search and status
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'POSSIBLE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOST': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SEALCOATING': return '🛣️';
      case 'CRACK_REPAIR': return '🔧';
      case 'LINE_STRIPING': return '📏';
      case 'ASPHALT_PATCHING': return '🕳️';
      case 'COMBINATION': return '🔄';
      default: return '📍';
    }
  };

  // Navigation items for different user roles
  const getNavigationItems = () => {
    const baseItems: Array<{
      icon: any;
      label: string;
      active?: boolean;
      onClick?: () => void;
      count?: number;
    }> = [
      { icon: MapPin, label: 'Map View', active: true, onClick: () => router.push('/dashboard') },
      { icon: Plus, label: 'New Job', onClick: onNewJob },
    ];

    if (session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER') {
      return [
        ...baseItems,
        { icon: Building2, label: 'Jobs', count: jobs?.length || 0, onClick: () => router.push('/dashboard') },
        { icon: Calculator, label: 'Estimates', onClick: () => router.push('/estimates') },
        { icon: UserCheck, label: 'Clients', onClick: () => router.push('/clients') },
        { icon: Briefcase, label: 'Services', onClick: () => router.push('/services') },
        { icon: Users, label: 'Employees', onClick: () => router.push('/hr') },
        { icon: Activity, label: 'Employee Tracking', onClick: () => router.push('/tracking') },
        { icon: DollarSign, label: 'Payroll', onClick: () => router.push('/payroll') },
        { icon: Truck, label: 'Fleet', onClick: () => router.push('/fleet') },
        { icon: Package, label: 'Equipment', onClick: () => router.push('/equipment') },
        { icon: Box, label: 'Materials', onClick: () => router.push('/materials') },
        { icon: BookOpen, label: 'Training', onClick: () => router.push('/training') },
        { icon: MessageSquare, label: 'Communications', onClick: () => router.push('/communications') },
        { icon: FileText, label: 'Financials', onClick: () => router.push('/financials') },
        { icon: BarChart3, label: 'Reports', onClick: () => router.push('/reports') },
        { icon: Calendar, label: 'Schedule', onClick: () => router.push('/schedule') },
        { icon: Palette, label: 'Theme', onClick: () => router.push('/theme') },
        { icon: UserCircle, label: 'Profile', onClick: () => router.push('/profile') },
        { icon: Settings, label: 'Settings', onClick: () => router.push('/settings') },
      ];
    }

    return [
      ...baseItems,
      { icon: Building2, label: 'My Jobs', count: filteredJobs?.length || 0, onClick: () => router.push('/dashboard') },
      { icon: Clock, label: 'Timesheet', onClick: () => router.push('/dashboard') },
      { icon: Calendar, label: 'Schedule', onClick: () => router.push('/schedule') },
      { icon: Briefcase, label: 'Services', onClick: () => router.push('/services') },
      { icon: UserCircle, label: 'Profile', onClick: () => router.push('/profile') },
      { icon: Palette, label: 'Theme', onClick: () => router.push('/theme') },
    ];
  };

  const navigationItems = getNavigationItems();

  // Get sidebar background styles based on preferences
  const getSidebarClasses = () => {
    const baseClasses = 'border-r border-border flex flex-col relative z-50 transition-all duration-300';
    const isGlassEnabled = sidebarSettings.enabled && sidebarSettings.type !== 'none';
    
    return cn(
      baseClasses,
      isGlassEnabled ? 'glass-morphism' : 'bg-card',
      collapsed ? 'w-16' : 'w-80'
    );
  };

  const glassStyles = getGlassEffectStyles(sidebarSettings);

  // Collapsed View - Icon Only
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <aside className={getSidebarClasses()} style={glassStyles}>
          <div className="p-2 flex justify-center border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {navigationItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "w-full h-10 relative",
                        item.active && "bg-primary hover:bg-primary/90"
                      )}
                      onClick={item.onClick}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.count !== undefined && item.count > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs rounded-full">
                          {item.count > 9 ? '9+' : item.count}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </aside>
      </TooltipProvider>
    );
  }

  // Expanded View - Full Sidebar
  return (
    <aside className={getSidebarClasses()} style={glassStyles}>
      {/* Header with Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h1 className="text-lg font-bold text-primary">AsphaltPro</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.active && "bg-primary hover:bg-primary/90"
              )}
              onClick={item.onClick}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              {item.count !== undefined && (
                <Badge variant="secondary" className="ml-auto">
                  {item.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Jobs Section */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Jobs</h2>
          <Button
            size="sm"
            onClick={onNewJob}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {['all', 'POSSIBLE', 'IN_PROGRESS', 'COMPLETED', 'LOST'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="text-xs"
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredJobs?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm">No jobs found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={onNewJob}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Job
                </Button>
              </div>
            ) : (
              filteredJobs?.map((job) => (
                <Card 
                  key={job.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onJobSelect(job)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(job.type)}</span>
                        <h3 className="font-medium text-sm truncate">
                          {job.title}
                        </h3>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                        {job.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 truncate">
                      📍 {job.address}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-muted-foreground">
                        {job.squareFootage && `${job.squareFootage.toLocaleString()} sq ft`}
                        {job.linearFootage && `${job.linearFootage} lin ft`}
                        {job.numberOfStalls && `${job.numberOfStalls} stalls`}
                      </div>
                      
                      {job.estimatedCost && (
                        <span className="font-medium text-green-600">
                          ${job.estimatedCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJobSelect(job);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEstimate(job);
                        }}
                      >
                        <Calculator className="h-3 w-3 mr-1" />
                        Estimate
                      </Button>
                      {onDirections && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2 flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDirections(job);
                          }}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Summary Stats */}
        {jobs?.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">
                    {jobs?.filter(j => j.status === 'POSSIBLE')?.length || 0}
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400">Possible</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <div className="font-medium text-green-800 dark:text-green-200">
                    {jobs?.filter(j => j.status === 'COMPLETED')?.length || 0}
                  </div>
                  <div className="text-green-600 dark:text-green-400">Completed</div>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-xs">
                <div className="font-medium text-blue-800 dark:text-blue-200">
                  ${jobs?.reduce((sum, job) => sum + (job.estimatedCost || 0), 0)?.toLocaleString() || '0'}
                </div>
                <div className="text-blue-600 dark:text-blue-400">Total Pipeline</div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
