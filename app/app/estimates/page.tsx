
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Search,
  Download,
  Eye,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  address: string;
  type: string;
  status: string;
  estimatedCost: number;
  createdAt: string;
  squareFootage?: number;
  linearFootage?: number;
  numberOfStalls?: number;
}

export default function EstimatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchJobs();
    }
  }, [status]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const hasEstimate = job.estimatedCost && job.estimatedCost > 0;
    return matchesSearch && matchesStatus && hasEstimate;
  });

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

  const totalEstimatedValue = filteredJobs.reduce((sum, job) => sum + (job.estimatedCost || 0), 0);

  const handleViewEstimate = (jobId: string) => {
    router.push(`/dashboard?jobId=${jobId}&action=estimate`);
  };

  const handlePrintEstimate = (jobId: string) => {
    window.open(`/api/jobs/${jobId}/estimate/print`, '_blank');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading estimates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onTimesheetClick={() => {}}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onDirectionsClick={() => {}}
        onSettingsClick={() => router.push('/settings')}
      />

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calculator className="h-8 w-8 text-blue-600" />
                Job Estimates
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage all job estimates
              </p>
            </div>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">
                ${totalEstimatedValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Estimated Value
              </div>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by job title or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {['all', 'POSSIBLE', 'IN_PROGRESS', 'COMPLETED', 'LOST'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimates Grid */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calculator className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Estimates Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create job estimates from the dashboard'}
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(job.type)}</span>
                      <CardTitle className="text-lg line-clamp-1">
                        {job.title}
                      </CardTitle>
                    </div>
                    <Badge className={cn('text-xs', getStatusColor(job.status))}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{job.address}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Job Details */}
                  <div className="space-y-1 text-sm">
                    {job.squareFootage && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Area:</span>
                        <span className="font-medium">{job.squareFootage.toLocaleString()} sq ft</span>
                      </div>
                    )}
                    {job.linearFootage && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Length:</span>
                        <span className="font-medium">{job.linearFootage.toLocaleString()} lin ft</span>
                      </div>
                    )}
                    {job.numberOfStalls && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Stalls:</span>
                        <span className="font-medium">{job.numberOfStalls}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Estimated Cost */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">
                          Estimated Cost
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        ${job.estimatedCost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewEstimate(job.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePrintEstimate(job.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredJobs.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Estimates Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredJobs.length}
                  </div>
                  <div className="text-sm text-blue-900">Total Estimates</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredJobs.filter(j => j.status === 'POSSIBLE').length}
                  </div>
                  <div className="text-sm text-yellow-900">Possible</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredJobs.filter(j => j.status === 'COMPLETED').length}
                  </div>
                  <div className="text-sm text-green-900">Completed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${(totalEstimatedValue / (filteredJobs.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-purple-900">Avg. Estimate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
