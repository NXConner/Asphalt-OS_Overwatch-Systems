
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { GlitchWrapper } from '@/components/ui/glitch-wrapper';
import {
  Plus,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Building2,
  Users,
  FileText,
  BarChart3,
  Settings,
  Calculator,
  Clock,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  jobs: any[];
  collapsed: boolean;
  onJobSelect: (job: any) => void;
  onNewJob: () => void;
  onEstimate: (job: any) => void;
  onDirections?: (job: any) => void;
}

export function DashboardSidebar({ 
  jobs, 
  collapsed, 
  onJobSelect, 
  onNewJob, 
  onEstimate,
  onDirections 
}: DashboardSidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter jobs based on search and status
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'POSSIBLE': return 'bg-yellow-100 text-yellow-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
        { icon: Users, label: 'Employees', onClick: () => router.push('/hr') },
        { icon: DollarSign, label: 'Payroll', onClick: () => router.push('/payroll') },
        { icon: FileText, label: 'Invoices', onClick: () => router.push('/financials') },
        { icon: BarChart3, label: 'Reports', onClick: () => router.push('/reports') },
        { icon: Calendar, label: 'Schedule', onClick: () => router.push('/schedule') },
        { icon: Settings, label: 'Settings', onClick: () => router.push('/settings') },
      ];
    }

    return [
      ...baseItems,
      { icon: Building2, label: 'My Jobs', count: filteredJobs?.length || 0, onClick: () => router.push('/dashboard') },
      { icon: Clock, label: 'Timesheet', onClick: () => router.push('/dashboard') },
      { icon: Calendar, label: 'Schedule', onClick: () => router.push('/schedule') },
    ];
  };

  const navigationItems = getNavigationItems();

  if (collapsed) {
    return (
      <aside className="w-16 bg-white border-r border-gray-200 p-2 relative z-50">
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={cn("w-full justify-center p-2", item.active && "bg-blue-600")}
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col relative z-50">
      {/* Navigation */}
      <div className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.active && "bg-blue-600 hover:bg-blue-700"
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-1">
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
                <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-2" />
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
                        {job.status.replace('_', ' ')}
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
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="font-medium text-yellow-800">
                    {jobs?.filter(j => j.status === 'POSSIBLE')?.length || 0}
                  </div>
                  <div className="text-yellow-600">Possible</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-medium text-green-800">
                    {jobs?.filter(j => j.status === 'COMPLETED')?.length || 0}
                  </div>
                  <div className="text-green-600">Completed</div>
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded text-xs">
                <div className="font-medium text-blue-800">
                  ${jobs?.reduce((sum, job) => sum + (job.estimatedCost || 0), 0)?.toLocaleString() || '0'}
                </div>
                <div className="text-blue-600">Total Pipeline</div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
