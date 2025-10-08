'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AdvancedDashboard } from '@/components/reports/advanced-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, ArrowLeft, FileText, DollarSign, TrendingUp, MapPin, Target, PieChart, BarChart3, Users, Award, Activity, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState('current-month');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER') {
        router.replace('/dashboard');
        return;
      }
      fetchData();
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [jobsRes, timesheetsRes, expensesRes, revenuesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/timesheets'),
        fetch('/api/expenses'),
        fetch('/api/revenues')
      ]);

      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (timesheetsRes.ok) setTimesheets(await timesheetsRes.json());
      if (expensesRes.ok) setExpenses(await expensesRes.json());
      if (revenuesRes.ok) setRevenues(await revenuesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (dateRange) {
      case 'current-month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'last-month':
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(subMonths(now, 1));
        break;
      case 'current-year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'last-year':
        start = startOfYear(subYears(now, 1));
        end = endOfYear(subYears(now, 1));
        break;
      case 'all-time':
      default:
        start = new Date(2020, 0, 1);
        end = now;
    }

    return { start, end };
  };

  const filterByDateRange = (items: any[], dateField: string = 'createdAt') => {
    const { start, end } = getDateRangeFilter();
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const calculateJobMetrics = () => {
    const filteredJobs = filterByDateRange(jobs);
    
    const byStatus = {
      POSSIBLE: filteredJobs.filter(j => j.status === 'POSSIBLE'),
      IN_PROGRESS: filteredJobs.filter(j => j.status === 'IN_PROGRESS'),
      COMPLETED: filteredJobs.filter(j => j.status === 'COMPLETED'),
      LOST: filteredJobs.filter(j => j.status === 'LOST'),
    };

    const byType = {
      SEALCOATING: filteredJobs.filter(j => j.type === 'SEALCOATING'),
      CRACK_REPAIR: filteredJobs.filter(j => j.type === 'CRACK_REPAIR'),
      LINE_STRIPING: filteredJobs.filter(j => j.type === 'LINE_STRIPING'),
      ASPHALT_PATCHING: filteredJobs.filter(j => j.type === 'ASPHALT_PATCHING'),
      COMBINATION: filteredJobs.filter(j => j.type === 'COMBINATION'),
    };

    const totalEstimated = filteredJobs.reduce((sum, job) => sum + (job.estimatedCost || 0), 0);
    const completedJobs = byStatus.COMPLETED;
    const completedValue = completedJobs.reduce((sum, job) => sum + (job.estimatedCost || 0), 0);
    const avgJobValue = completedJobs.length > 0 ? completedValue / completedJobs.length : 0;
    
    const pipelineValue = byStatus.POSSIBLE.reduce((sum, job) => sum + (job.estimatedCost || 0), 0) +
                         byStatus.IN_PROGRESS.reduce((sum, job) => sum + (job.estimatedCost || 0), 0);
    
    const conversionRate = (byStatus.POSSIBLE.length + byStatus.IN_PROGRESS.length + byStatus.COMPLETED.length) > 0
      ? (completedJobs.length / (byStatus.POSSIBLE.length + byStatus.IN_PROGRESS.length + byStatus.COMPLETED.length)) * 100
      : 0;

    return { byStatus, byType, totalEstimated, completedValue, avgJobValue, pipelineValue, conversionRate, filteredJobs };
  };

  const calculateFinancialMetrics = () => {
    const filteredExpenses = filterByDateRange(expenses, 'expenseDate');
    const filteredRevenues = filterByDateRange(revenues, 'revenueDate');
    
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const totalRevenue = filteredRevenues.reduce((sum, rev) => sum + (rev.amount || 0), 0);
    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    const expensesByCategory = filteredExpenses.reduce((acc: any, exp) => {
      const category = exp.category?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + exp.amount;
      return acc;
    }, {});

    return { totalExpenses, totalRevenue, netIncome, profitMargin, expensesByCategory, filteredExpenses, filteredRevenues };
  };

  const calculateLaborMetrics = () => {
    const filteredTimesheets = filterByDateRange(timesheets, 'clockIn');
    
    const totalHours = filteredTimesheets.reduce((sum, ts) => sum + (ts.totalHours || 0), 0);
    const totalLaborCost = filteredTimesheets.reduce((sum, ts) => sum + (ts.totalPay || 0), 0);
    const avgHourlyRate = totalHours > 0 ? totalLaborCost / totalHours : 0;
    
    const employeeHours = filteredTimesheets.reduce((acc: any, ts) => {
      const employeeId = ts.userId;
      const employeeName = `${ts.user?.firstName || ''} ${ts.user?.lastName || ''}`.trim();
      if (!acc[employeeId]) {
        acc[employeeId] = { name: employeeName, hours: 0, pay: 0 };
      }
      acc[employeeId].hours += ts.totalHours || 0;
      acc[employeeId].pay += ts.totalPay || 0;
      return acc;
    }, {});

    return { totalHours, totalLaborCost, avgHourlyRate, employeeHours, filteredTimesheets };
  };

  const downloadReport = (reportType: string) => {
    const jobMetrics = calculateJobMetrics();
    const financialMetrics = calculateFinancialMetrics();
    const laborMetrics = calculateLaborMetrics();
    const { start, end } = getDateRangeFilter();

    let csv = '';
    let filename = '';

    if (reportType === 'jobs') {
      csv = 'Title,Address,Type,Status,Square Footage,Estimated Cost,Scheduled Date,Completed Date\n';
      jobMetrics.filteredJobs.forEach((job: any) => {
        csv += `"${job.title}","${job.address}","${job.type}","${job.status}",${job.squareFootage || 0},$${(job.estimatedCost || 0).toFixed(2)},"${job.scheduledDate ? format(new Date(job.scheduledDate), 'MM/dd/yyyy') : 'N/A'}","${job.completedDate ? format(new Date(job.completedDate), 'MM/dd/yyyy') : 'N/A'}"\n`;
      });
      filename = `jobs-report-${format(start, 'yyyy-MM-dd')}-to-${format(end, 'yyyy-MM-dd')}.csv`;
    } else if (reportType === 'financial') {
      csv = 'Type,Date,Description,Category,Amount\n';
      financialMetrics.filteredExpenses.forEach((exp: any) => {
        csv += `Expense,"${format(new Date(exp.expenseDate), 'MM/dd/yyyy')}","${exp.description}","${exp.category?.name || 'N/A'}",-$${exp.amount.toFixed(2)}\n`;
      });
      financialMetrics.filteredRevenues.forEach((rev: any) => {
        csv += `Revenue,"${format(new Date(rev.revenueDate), 'MM/dd/yyyy')}","${rev.description}","N/A",$${rev.amount.toFixed(2)}\n`;
      });
      filename = `financial-report-${format(start, 'yyyy-MM-dd')}-to-${format(end, 'yyyy-MM-dd')}.csv`;
    } else if (reportType === 'labor') {
      csv = 'Employee,Total Hours,Total Pay,Avg Rate,Timesheets\n';
      Object.values(laborMetrics.employeeHours).forEach((emp: any) => {
        const avgRate = emp.hours > 0 ? emp.pay / emp.hours : 0;
        csv += `"${emp.name}",${emp.hours.toFixed(2)},$${emp.pay.toFixed(2)},$${avgRate.toFixed(2)},${laborMetrics.filteredTimesheets.filter((ts: any) => `${ts.user?.firstName} ${ts.user?.lastName}` === emp.name).length}\n`;
      });
      filename = `labor-report-${format(start, 'yyyy-MM-dd')}-to-${format(end, 'yyyy-MM-dd')}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded`);
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

  const jobMetrics = calculateJobMetrics();
  const financialMetrics = calculateFinancialMetrics();
  const laborMetrics = calculateLaborMetrics();

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader 
        onTimesheetClick={() => router.push('/dashboard')}
        onSidebarToggle={() => {}}
        onDirectionsClick={() => router.push('/dashboard')}
        onSettingsClick={() => router.push('/settings')}
      />

      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
                <h1 className="text-3xl font-bold">Business Analytics & Reports</h1>
                <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
              </div>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${financialMetrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {financialMetrics.filteredRevenues.length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Net Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${financialMetrics.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${financialMetrics.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {financialMetrics.profitMargin.toFixed(1)}% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  Jobs Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobMetrics.byStatus.COMPLETED.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${jobMetrics.completedValue.toLocaleString()} value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${jobMetrics.pipelineValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {jobMetrics.byStatus.POSSIBLE.length + jobMetrics.byStatus.IN_PROGRESS.length} opportunities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Job Analytics</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="labor">Labor</TabsTrigger>
            </TabsList>

            {/* Advanced Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-4">
              <AdvancedDashboard data={{ jobs, timesheets, expenses, revenues }} />
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Job Status Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Job Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(jobMetrics.byStatus).map(([status, jobs]: [string, any]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'COMPLETED' ? 'bg-green-500' :
                            status === 'POSSIBLE' ? 'bg-yellow-500' :
                            status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{jobs.length} jobs</Badge>
                          <span className="text-sm font-semibold">
                            ${jobs.reduce((sum: number, j: any) => sum + (j.estimatedCost || 0), 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Job Type Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Job Type Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(jobMetrics.byType).map(([type, jobs]: [string, any]) => {
                      const maxJobs = Math.max(...Object.values(jobMetrics.byType).map((j: any) => j.length));
                      const percentage = maxJobs > 0 ? (jobs.length / maxJobs) * 100 : 0;
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                            <span className="text-sm text-muted-foreground">{jobs.length} jobs</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Financial Summary
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => downloadReport('financial')}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">Total Revenue</span>
                      <span className="text-lg font-bold text-green-600">
                        ${financialMetrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-red-800">Total Expenses</span>
                      <span className="text-lg font-bold text-red-600">
                        ${financialMetrics.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg ${financialMetrics.netIncome >= 0 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                      <span className={`font-medium ${financialMetrics.netIncome >= 0 ? 'text-emerald-800' : 'text-orange-800'}`}>
                        Net Income
                      </span>
                      <span className={`text-lg font-bold ${financialMetrics.netIncome >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                        ${financialMetrics.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground mb-1">Profit Margin</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${financialMetrics.profitMargin >= 0 ? 'bg-emerald-600' : 'bg-red-600'}`}
                            style={{ width: `${Math.min(Math.abs(financialMetrics.profitMargin), 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{financialMetrics.profitMargin.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Labor Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Labor Summary
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => downloadReport('labor')}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800 mb-1">Total Hours</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {laborMetrics.totalHours.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-800 mb-1">Avg Rate</div>
                        <div className="text-2xl font-bold text-purple-600">
                          ${laborMetrics.avgHourlyRate.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">Total Labor Cost</span>
                      <span className="text-lg font-bold text-green-600">
                        ${laborMetrics.totalLaborCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Top Performers</div>
                      <div className="space-y-2">
                        {Object.values(laborMetrics.employeeHours)
                          .sort((a: any, b: any) => b.hours - a.hours)
                          .slice(0, 3)
                          .map((emp: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Award className={`h-4 w-4 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />
                                <span>{emp.name}</span>
                              </div>
                              <span className="font-medium">{emp.hours.toFixed(1)}h</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conversion Rate & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Job Conversion Rate</div>
                      <div className="text-3xl font-bold mb-2">{jobMetrics.conversionRate.toFixed(1)}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${jobMetrics.conversionRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {jobMetrics.byStatus.COMPLETED.length} completed out of {jobMetrics.filteredJobs.length} total
                      </p>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Average Job Value</div>
                      <div className="text-3xl font-bold mb-2">
                        ${jobMetrics.avgJobValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Based on {jobMetrics.byStatus.COMPLETED.length} completed jobs
                      </p>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Total Pipeline Value</div>
                      <div className="text-3xl font-bold mb-2">
                        ${jobMetrics.pipelineValue.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        {jobMetrics.byStatus.POSSIBLE.length + jobMetrics.byStatus.IN_PROGRESS.length} active opportunities
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Job Analytics</CardTitle>
                      <CardDescription>Detailed job performance and trends</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => downloadReport('jobs')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Jobs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Status Details */}
                    <div>
                      <h3 className="font-semibold mb-4">Jobs by Status</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(jobMetrics.byStatus).map(([status, jobs]: [string, any]) => (
                          <Card key={status} className="border-2">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                                <div className={`w-3 h-3 rounded-full ${
                                  status === 'COMPLETED' ? 'bg-green-500' :
                                  status === 'POSSIBLE' ? 'bg-yellow-500' :
                                  status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-red-500'
                                }`} />
                              </div>
                              <div className="text-2xl font-bold mb-1">{jobs.length}</div>
                              <div className="text-sm text-muted-foreground">
                                ${jobs.reduce((sum: number, j: any) => sum + (j.estimatedCost || 0), 0).toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Type Details */}
                    <div>
                      <h3 className="font-semibold mb-4">Jobs by Type</h3>
                      <div className="space-y-3">
                        {Object.entries(jobMetrics.byType).map(([type, jobs]: [string, any]) => {
                          const totalValue = jobs.reduce((sum: number, j: any) => sum + (j.estimatedCost || 0), 0);
                          const avgValue = jobs.length > 0 ? totalValue / jobs.length : 0;
                          return (
                            <div key={type} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{type.replace('_', ' ')}</span>
                                <Badge>{jobs.length} jobs</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Total Value:</span>
                                  <span className="ml-2 font-semibold">${totalValue.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Avg Value:</span>
                                  <span className="ml-2 font-semibold">${avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Financial Analytics</CardTitle>
                      <CardDescription>Income, expenses, and profitability analysis</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => downloadReport('financial')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Financial
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Expenses by Category */}
                    <div>
                      <h3 className="font-semibold mb-4">Expenses by Category</h3>
                      {Object.keys(financialMetrics.expensesByCategory).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          No expense data for this period
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(financialMetrics.expensesByCategory)
                            .sort(([, a]: any, [, b]: any) => b - a)
                            .map(([category, amount]: [string, any]) => {
                              const percentage = financialMetrics.totalExpenses > 0 
                                ? (amount / financialMetrics.totalExpenses) * 100 
                                : 0;
                              return (
                                <div key={category}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{category}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground">
                                        {percentage.toFixed(1)}%
                                      </span>
                                      <span className="text-sm font-semibold">
                                        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-red-600 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Labor Tab */}
            <TabsContent value="labor" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Labor Analytics</CardTitle>
                      <CardDescription>Employee hours, costs, and productivity</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => downloadReport('labor')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Labor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.keys(laborMetrics.employeeHours).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        No labor data for this period
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-medium">Employee</th>
                              <th className="text-right p-3 font-medium">Hours</th>
                              <th className="text-right p-3 font-medium">Total Pay</th>
                              <th className="text-right p-3 font-medium">Avg Rate</th>
                              <th className="text-right p-3 font-medium">Timesheets</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(laborMetrics.employeeHours)
                              .sort((a: any, b: any) => b.hours - a.hours)
                              .map((emp: any, index: number) => {
                                const avgRate = emp.hours > 0 ? emp.pay / emp.hours : 0;
                                const timesheetCount = laborMetrics.filteredTimesheets.filter(
                                  (ts: any) => `${ts.user?.firstName} ${ts.user?.lastName}`.trim() === emp.name
                                ).length;
                                return (
                                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                    <td className="p-3 font-medium">{emp.name}</td>
                                    <td className="text-right p-3">{emp.hours.toFixed(2)}</td>
                                    <td className="text-right p-3 text-green-600 font-medium">
                                      ${emp.pay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="text-right p-3">${avgRate.toFixed(2)}</td>
                                    <td className="text-right p-3">
                                      <Badge variant="outline">{timesheetCount}</Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
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
