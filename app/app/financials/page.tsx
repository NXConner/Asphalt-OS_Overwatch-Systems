
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp, TrendingDown, FileText, Download, Plus, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FinancialsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFinancialData();
    }
  }, [status]);

  const fetchFinancialData = async () => {
    try {
      const [expensesRes, revenuesRes] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/revenues')
      ]);

      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);
      }

      if (revenuesRes.ok) {
        const revenuesData = await revenuesRes.json();
        setRevenues(revenuesData);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const totalRevenue = revenues.reduce((sum, rev) => sum + (rev.amount || 0), 0);
    const netIncome = totalRevenue - totalExpenses;

    return { totalExpenses, totalRevenue, netIncome };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const summary = calculateSummary();

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
                <h1 className="text-3xl font-bold">Financial Management</h1>
                <p className="text-muted-foreground">Track income, expenses, and invoices</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${summary.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {revenues.length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${summary.totalExpenses.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {expenses.length} expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${summary.netIncome.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary.netIncome >= 0 ? 'Profit' : 'Loss'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Details */}
          <Tabs defaultValue="invoices" className="space-y-6">
            <TabsList>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage customer invoices and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No invoices created yet</p>
                    <p className="text-sm mt-2">Create invoices for completed jobs</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>Business expenses and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenses.length > 0 ? (
                      expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{expense.description}</h3>
                            <p className="text-sm text-muted-foreground">
                              {expense.category?.name || 'Uncategorized'} • {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-600">
                              -${expense.amount.toLocaleString()}
                            </div>
                            <Badge variant={expense.receiptPath ? 'default' : 'secondary'}>
                              {expense.receiptPath ? 'Receipt' : 'No Receipt'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No expenses recorded</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Income from jobs and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenues.length > 0 ? (
                      revenues.map((revenue) => (
                        <div
                          key={revenue.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{revenue.description}</h3>
                            <p className="text-sm text-muted-foreground">
                              {revenue.source} • {new Date(revenue.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              +${revenue.amount.toLocaleString()}
                            </div>
                            <Badge variant="default">
                              {revenue.paymentMethod}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No revenue recorded</p>
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
