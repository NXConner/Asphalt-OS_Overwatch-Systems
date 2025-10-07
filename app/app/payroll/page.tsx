
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Users, Calendar, FileText, Download, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PayrollPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timesheets, setTimesheets] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTimesheets();
    }
  }, [status]);

  const fetchTimesheets = async () => {
    try {
      const response = await fetch('/api/timesheets');
      if (response.ok) {
        const data = await response.json();
        setTimesheets(data);
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayrollSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTimesheets = timesheets.filter(ts => {
      const date = new Date(ts.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalHours = monthlyTimesheets.reduce((sum, ts) => sum + (ts.hoursWorked || 0), 0);
    const totalGross = monthlyTimesheets.reduce((sum, ts) => {
      const hourlyRate = ts.user?.hourlyRate || 20;
      return sum + (ts.hoursWorked || 0) * hourlyRate;
    }, 0);

    return { totalHours, totalGross, count: monthlyTimesheets.length };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  const summary = calculatePayrollSummary();

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
                <h1 className="text-3xl font-bold">Payroll Management</h1>
                <p className="text-muted-foreground">Manage employee payroll and timesheets</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Payroll
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalHours.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  From {summary.count} timesheet entries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.totalGross.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Before taxes and deductions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(timesheets.map(ts => ts.userId)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  With logged hours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payroll Details */}
          <Tabs defaultValue="current" className="space-y-6">
            <TabsList>
              <TabsTrigger value="current">Current Period</TabsTrigger>
              <TabsTrigger value="history">Payroll History</TabsTrigger>
              <TabsTrigger value="settings">Payroll Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Pay Period</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timesheets
                      .filter(ts => {
                        const date = new Date(ts.date);
                        return date.getMonth() === new Date().getMonth();
                      })
                      .reduce((acc: any[], ts) => {
                        const existing = acc.find(item => item.userId === ts.userId);
                        if (existing) {
                          existing.totalHours += ts.hoursWorked || 0;
                        } else {
                          acc.push({
                            userId: ts.userId,
                            userName: ts.user?.name || ts.user?.email || 'Unknown',
                            totalHours: ts.hoursWorked || 0,
                            hourlyRate: ts.user?.hourlyRate || 20,
                          });
                        }
                        return acc;
                      }, [])
                      .map((employee: any) => (
                        <div
                          key={employee.userId}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{employee.userName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {employee.totalHours.toFixed(1)} hours @ ${employee.hourlyRate}/hr
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${(employee.totalHours * employee.hourlyRate).toLocaleString()}
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </div>
                      ))}

                    {timesheets.filter(ts => {
                      const date = new Date(ts.date);
                      return date.getMonth() === new Date().getMonth();
                    }).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No timesheet entries for this period
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll History</CardTitle>
                  <CardDescription>Past pay periods and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No historical payroll records available</p>
                    <p className="text-sm mt-2">Payroll history will appear here once processed</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Settings</CardTitle>
                  <CardDescription>Configure payroll preferences and tax settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Pay Period</h3>
                      <p className="text-sm text-muted-foreground">Monthly (1st to end of month)</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">Direct Deposit</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Tax Withholding</h3>
                      <p className="text-sm text-muted-foreground">Managed by employee settings</p>
                    </div>
                    <Button variant="outline">Edit Payroll Settings</Button>
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
