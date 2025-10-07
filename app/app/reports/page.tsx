
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BarChart3, Download, TrendingUp, MapPin, Users, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateJobStats = () => {
    const byStatus = {
      POSSIBLE: jobs.filter(j => j.status === 'POSSIBLE').length,
      IN_PROGRESS: jobs.filter(j => j.status === 'IN_PROGRESS').length,
      COMPLETED: jobs.filter(j => j.status === 'COMPLETED').length,
      LOST: jobs.filter(j => j.status === 'LOST').length,
    };

    const byType = {
      SEALCOATING: jobs.filter(j => j.type === 'SEALCOATING').length,
      CRACK_REPAIR: jobs.filter(j => j.type === 'CRACK_REPAIR').length,
      LINE_STRIPING: jobs.filter(j => j.type === 'LINE_STRIPING').length,
      ASPHALT_PATCHING: jobs.filter(j => j.type === 'ASPHALT_PATCHING').length,
      COMBINATION: jobs.filter(j => j.type === 'COMBINATION').length,
    };

    const totalEstimated = jobs.reduce((sum, job) => sum + (job.estimatedCost || 0), 0);
    const completedValue = jobs
      .filter(j => j.status === 'COMPLETED')
      .reduce((sum, job) => sum + (job.estimatedCost || 0), 0);

    return { byStatus, byType, totalEstimated, completedValue };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  const stats = calculateJobStats();

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader 
        onTimesheetClick={() => router.push('/dashboard')}
        onSidebarToggle={() => {}}
        onDirectionsClick={() => router.push('/dashboard')}
        onSettingsClick={() => router.push('/settings')}
      />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Business Reports</h1>
                <p className="text-muted-foreground">Analytics and insights for your business</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobs.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.byStatus.COMPLETED}</div>
                <p className="text-xs text-muted-foreground">
                  ${stats.completedValue.toLocaleString()} value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalEstimated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total estimated value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.byStatus.IN_PROGRESS}</div>
                <p className="text-xs text-muted-foreground">Active jobs</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList>
              <TabsTrigger value="jobs">Jobs Report</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jobs by Status</CardTitle>
                    <CardDescription>Distribution of job statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Possible</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500" 
                              style={{ width: `${(stats.byStatus.POSSIBLE / jobs.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.byStatus.POSSIBLE}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">In Progress</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(stats.byStatus.IN_PROGRESS / jobs.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.byStatus.IN_PROGRESS}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${(stats.byStatus.COMPLETED / jobs.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.byStatus.COMPLETED}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Lost</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${(stats.byStatus.LOST / jobs.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.byStatus.LOST}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Jobs by Type</CardTitle>
                    <CardDescription>Service distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sealcoating</span>
                        <span className="text-sm font-medium">{stats.byType.SEALCOATING}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Crack Repair</span>
                        <span className="text-sm font-medium">{stats.byType.CRACK_REPAIR}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Line Striping</span>
                        <span className="text-sm font-medium">{stats.byType.LINE_STRIPING}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Asphalt Patching</span>
                        <span className="text-sm font-medium">{stats.byType.ASPHALT_PATCHING}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Combination</span>
                        <span className="text-sm font-medium">{stats.byType.COMBINATION}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Financial performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Revenue analytics coming soon</p>
                    <p className="text-sm mt-2">Track income trends and forecasts</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="productivity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Productivity Metrics</CardTitle>
                  <CardDescription>Employee and team performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Productivity reports coming soon</p>
                    <p className="text-sm mt-2">Monitor team efficiency and output</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
