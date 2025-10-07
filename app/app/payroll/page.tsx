'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, DollarSign, Users, Calendar, FileText, Download, ArrowLeft, Plus, Clock, CheckCircle, XCircle, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Search, TrendingUp, AlertTriangle, TrendingDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Timesheet {
  id: string;
  userId: string;
  clockIn: Date;
  clockOut?: Date;
  totalHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  hourlyRate: number;
  regularPay?: number;
  overtimePay?: number;
  totalPay?: number;
  isValidLocation: boolean;
  notes?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    hourlyRate: number;
  };
}

export default function PayrollPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      const [timesheetsRes, employeesRes] = await Promise.all([
        fetch('/api/timesheets'),
        fetch('/api/users')
      ]);

      if (timesheetsRes.ok) {
        const data = await timesheetsRes.json();
        setTimesheets(data);
      }

      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data.filter((u: any) => u.role === 'EMPLOYEE' && u.isActive));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPayPeriod = () => {
    const now = currentDate;
    const dayOfMonth = now.getDate();
    
    let startDate: Date, endDate: Date;
    
    if (dayOfMonth <= 15) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 15, 23, 59, 59);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 16);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }
    
    return { startDate, endDate };
  };

  const getPayPeriodTimesheets = (startDate: Date, endDate: Date) => {
    return timesheets.filter(ts => {
      const clockInDate = new Date(ts.clockIn);
      return clockInDate >= startDate && clockInDate <= endDate && ts.clockOut;
    });
  };

  const calculateEmployeePayroll = (userId: string, periodTimesheets: Timesheet[]) => {
    const employeeTimesheets = periodTimesheets.filter(ts => ts.userId === userId);
    const employee = employees.find(e => e.id === userId);
    
    if (!employee) return null;

    const totalHours = employeeTimesheets.reduce((sum, ts) => sum + (ts.totalHours || 0), 0);
    const regularHours = Math.min(totalHours, 80);
    const overtimeHours = Math.max(totalHours - 80, 0);
    
    const regularRate = employee.hourlyRate;
    const overtimeRate = regularRate * 1.5;
    
    const regularPay = regularHours * regularRate;
    const overtimePay = overtimeHours * overtimeRate;
    const grossPay = regularPay + overtimePay;
    
    const taxes = grossPay * 0.2265;
    const deductions = 0;
    const netPay = grossPay - taxes - deductions;

    return {
      userId,
      employee,
      regularHours,
      overtimeHours,
      totalHours,
      regularRate,
      overtimeRate,
      regularPay,
      overtimePay,
      grossPay,
      taxes,
      deductions,
      netPay,
      timesheetCount: employeeTimesheets.length
    };
  };

  const processPayrollForPeriod = () => {
    const { startDate, endDate } = getCurrentPayPeriod();
    const periodTimesheets = getPayPeriodTimesheets(startDate, endDate);
    
    const employeePayrolls = employees.map(emp => 
      calculateEmployeePayroll(emp.id, periodTimesheets)
    ).filter(p => p !== null);

    return { startDate, endDate, employeePayrolls, periodTimesheets };
  };

  const handleProcessPayroll = async () => {
    setProcessing(true);
    try {
      const { startDate, endDate } = processPayrollForPeriod();
      toast.success(`Payroll processed for ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`);
      setShowProcessDialog(false);
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast.error('Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  const downloadPayrollReport = () => {
    const { startDate, endDate, employeePayrolls } = processPayrollForPeriod();
    
    let csv = 'Employee,Regular Hours,OT Hours,Total Hours,Regular Rate,OT Rate,Regular Pay,OT Pay,Gross Pay,Taxes,Deductions,Net Pay\n';
    
    employeePayrolls.forEach((p: any) => {
      csv += `"${p.employee.firstName} ${p.employee.lastName}",${p.regularHours.toFixed(2)},${p.overtimeHours.toFixed(2)},${p.totalHours.toFixed(2)},$${p.regularRate.toFixed(2)},$${p.overtimeRate.toFixed(2)},$${p.regularPay.toFixed(2)},$${p.overtimePay.toFixed(2)},$${p.grossPay.toFixed(2)},$${p.taxes.toFixed(2)},$${p.deductions.toFixed(2)},$${p.netPay.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Payroll report downloaded');
  };

  const downloadTimesheetReport = () => {
    const { startDate, endDate, periodTimesheets } = processPayrollForPeriod();
    
    let csv = 'Employee,Clock In,Clock Out,Total Hours,Regular Hours,OT Hours,Hourly Rate,Regular Pay,OT Pay,Total Pay,Valid Location,Notes\n';
    
    periodTimesheets.forEach((ts: any) => {
      csv += `"${ts.user.firstName} ${ts.user.lastName}","${format(new Date(ts.clockIn), 'MM/dd/yyyy HH:mm')}","${ts.clockOut ? format(new Date(ts.clockOut), 'MM/dd/yyyy HH:mm') : 'N/A'}",${(ts.totalHours || 0).toFixed(2)},${(ts.regularHours || 0).toFixed(2)},${(ts.overtimeHours || 0).toFixed(2)},$${ts.hourlyRate.toFixed(2)},$${(ts.regularPay || 0).toFixed(2)},$${(ts.overtimePay || 0).toFixed(2)},$${(ts.totalPay || 0).toFixed(2)},${ts.isValidLocation ? 'Yes' : 'No'},"${ts.notes || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheets-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Timesheet report downloaded');
  };

  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 15);
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 15);
    setCurrentDate(newDate);
  };

  const goToCurrentPeriod = () => {
    setCurrentDate(new Date());
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

  const { startDate, endDate, employeePayrolls, periodTimesheets } = processPayrollForPeriod();
  const totalGrossPay = employeePayrolls.reduce((sum: number, p: any) => sum + p.grossPay, 0);
  const totalNetPay = employeePayrolls.reduce((sum: number, p: any) => sum + p.netPay, 0);
  const totalTaxes = employeePayrolls.reduce((sum: number, p: any) => sum + p.taxes, 0);
  const totalHours = employeePayrolls.reduce((sum: number, p: any) => sum + p.totalHours, 0);

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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Payroll Management</h1>
                <p className="text-muted-foreground">Process employee payroll and manage timesheets</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={downloadPayrollReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Payroll
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={previousPeriod}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      Pay Period: {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {periodTimesheets.length} timesheets | {employees.length} employees
                    </p>
                  </div>
                  <Button variant="outline" size="icon" onClick={nextPeriod}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={goToCurrentPeriod}>
                    Current Period
                  </Button>
                  <Button 
                    onClick={() => setShowProcessDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={employeePayrolls.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Process Payroll
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Total Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {employeePayrolls.length} employees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Gross Pay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalGrossPay.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Before deductions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Taxes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalTaxes.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">22.65% withholding</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Net Pay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalNetPay.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total disbursement</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="payroll" className="space-y-4">
            <TabsList>
              <TabsTrigger value="payroll">Payroll Summary</TabsTrigger>
              <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
            </TabsList>

            <TabsContent value="payroll" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Employee Payroll</CardTitle>
                      <CardDescription>Review and process employee payments for this period</CardDescription>
                    </div>
                    <Button variant="outline" onClick={downloadPayrollReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {employeePayrolls.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Payroll Data</h3>
                      <p className="text-muted-foreground">No completed timesheets found for this pay period.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Employee</th>
                            <th className="text-right p-3 font-medium">Reg Hours</th>
                            <th className="text-right p-3 font-medium">OT Hours</th>
                            <th className="text-right p-3 font-medium">Total Hours</th>
                            <th className="text-right p-3 font-medium">Rate</th>
                            <th className="text-right p-3 font-medium">Gross Pay</th>
                            <th className="text-right p-3 font-medium">Taxes</th>
                            <th className="text-right p-3 font-medium">Net Pay</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeePayrolls.map((payroll: any, index: number) => (
                            <tr key={payroll.userId} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="p-3">
                                <div className="font-medium">{payroll.employee.firstName} {payroll.employee.lastName}</div>
                                <div className="text-xs text-muted-foreground">{payroll.employee.email}</div>
                              </td>
                              <td className="text-right p-3 text-sm">{payroll.regularHours.toFixed(2)}</td>
                              <td className="text-right p-3 text-sm">
                                {payroll.overtimeHours > 0 ? (
                                  <span className="text-orange-600 font-medium">{payroll.overtimeHours.toFixed(2)}</span>
                                ) : '0.00'}
                              </td>
                              <td className="text-right p-3 font-medium">{payroll.totalHours.toFixed(2)}</td>
                              <td className="text-right p-3 text-sm">${payroll.regularRate.toFixed(2)}</td>
                              <td className="text-right p-3 font-medium text-green-600">${payroll.grossPay.toFixed(2)}</td>
                              <td className="text-right p-3 text-sm text-red-600">${payroll.taxes.toFixed(2)}</td>
                              <td className="text-right p-3 font-medium text-emerald-600">${payroll.netPay.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timesheets" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Timesheet Details</CardTitle>
                      <CardDescription>Individual timesheet entries for this pay period</CardDescription>
                    </div>
                    <Button variant="outline" onClick={downloadTimesheetReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {periodTimesheets.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Timesheets</h3>
                      <p className="text-muted-foreground">No completed timesheets found for this period.</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3">
                        {periodTimesheets.map((timesheet: any) => (
                          <Card key={timesheet.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="font-medium">{timesheet.user.firstName} {timesheet.user.lastName}</div>
                                    <Badge variant={timesheet.isValidLocation ? "default" : "destructive"} className="text-xs">
                                      {timesheet.isValidLocation ? (
                                        <>
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Valid Location
                                        </>
                                      ) : (
                                        <>
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          Invalid Location
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <div className="text-muted-foreground text-xs">Clock In</div>
                                      <div className="font-medium">{format(new Date(timesheet.clockIn), 'MM/dd/yyyy')}</div>
                                      <div className="text-xs">{format(new Date(timesheet.clockIn), 'h:mm a')}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground text-xs">Clock Out</div>
                                      <div className="font-medium">
                                        {timesheet.clockOut ? format(new Date(timesheet.clockOut), 'MM/dd/yyyy') : 'N/A'}
                                      </div>
                                      <div className="text-xs">
                                        {timesheet.clockOut ? format(new Date(timesheet.clockOut), 'h:mm a') : ''}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground text-xs">Hours</div>
                                      <div className="font-medium text-lg">{(timesheet.totalHours || 0).toFixed(2)}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground text-xs">Pay</div>
                                      <div className="font-medium text-lg text-green-600">
                                        ${(timesheet.totalPay || 0).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                  {timesheet.notes && (
                                    <div className="mt-2 text-xs text-muted-foreground italic">Note: {timesheet.notes}</div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payroll</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process payroll for the period {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}?
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Employees:</span>
                    <span className="font-medium">{employeePayrolls.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="font-medium">{totalHours.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Pay:</span>
                    <span className="font-medium text-green-600">${totalGrossPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span className="font-medium text-red-600">${totalTaxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Net Pay:</span>
                    <span className="font-bold text-emerald-600">${totalNetPay.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProcessPayroll}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Process Payroll
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
