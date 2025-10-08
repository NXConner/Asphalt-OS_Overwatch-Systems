
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, Plus, FileText, DollarSign, Calendar, 
  TrendingUp, Target, Award, XCircle, Clock, AlertCircle,
  ArrowLeft, Search, BarChart
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function BidsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<any[]>([]);
  const [filteredBids, setFilteredBids] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBids();
    }
  }, [status]);

  useEffect(() => {
    filterBids();
  }, [bids, searchTerm, statusFilter]);

  const fetchBids = async () => {
    try {
      const response = await fetch('/api/bids');
      if (response.ok) {
        const data = await response.json();
        setBids(data);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to fetch bids');
    } finally {
      setLoading(false);
    }
  };

  const filterBids = () => {
    let filtered = bids;

    if (searchTerm) {
      filtered = filtered.filter(bid => 
        bid.bidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.client?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === statusFilter);
    }

    setFilteredBids(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON':
        return 'bg-green-100 text-green-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'LOST':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'EXPIRED':
        return 'bg-orange-100 text-orange-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WON':
        return <Award className="h-4 w-4" />;
      case 'SUBMITTED':
        return <FileText className="h-4 w-4" />;
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4" />;
      case 'LOST':
        return <XCircle className="h-4 w-4" />;
      case 'DRAFT':
        return <FileText className="h-4 w-4" />;
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const totalBidAmount = filteredBids.reduce((sum, bid) => sum + bid.bidAmount, 0);
  const wonAmount = filteredBids.filter(bid => bid.status === 'WON').reduce((sum, bid) => sum + (bid.wonAmount || bid.bidAmount), 0);
  const winRate = filteredBids.length > 0 
    ? ((filteredBids.filter(bid => bid.status === 'WON').length / filteredBids.filter(bid => ['WON', 'LOST'].includes(bid.status)).length) * 100).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        onTimesheetClick={() => router.push('/timesheets')}
        onSidebarToggle={() => {}}
        onDirectionsClick={() => {}}
        onSettingsClick={() => router.push('/settings')}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Bid Management</h1>
              <p className="text-muted-foreground">Track proposals and win rates</p>
            </div>
          </div>
          <Button onClick={() => router.push('/bids/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bid
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bid Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredBids.length} bid(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Amount</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${wonAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredBids.filter(bid => bid.status === 'WON').length} won
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {winRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bids..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="WON">Won</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bids List */}
        <div className="space-y-4">
          {filteredBids.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bids found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Create your first bid to get started'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => router.push('/bids/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bid
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredBids.map((bid) => (
              <Card key={bid.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/bids/${bid.id}`)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{bid.bidNumber}</h3>
                        <Badge className={getStatusColor(bid.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(bid.status)}
                            {bid.status.replace('_', ' ')}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BarChart className="h-3 w-3" />
                          {bid.probability}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-lg text-foreground">
                          {bid.title}
                        </p>
                        <p className="text-muted-foreground">
                          {bid.client?.companyName}
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          {bid.submittedDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Submitted: {format(new Date(bid.submittedDate), 'MMM dd, yyyy')}
                            </span>
                          )}
                          {bid.expirationDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Expires: {format(new Date(bid.expirationDate), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${bid.bidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {bid.estimatedHours && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {bid.estimatedHours} hours estimated
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
