
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('MONTHLY');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?period=${period}&limit=20`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchLeaderboard();
    }
  }, [session, period]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold">Employee Leaderboard</h1>
          <p className="text-muted-foreground">Top performers across all metrics</p>
        </div>
      </div>

      <Tabs defaultValue="monthly" onValueChange={setPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="DAILY">Daily</TabsTrigger>
          <TabsTrigger value="WEEKLY">Weekly</TabsTrigger>
          <TabsTrigger value="MONTHLY">Monthly</TabsTrigger>
          <TabsTrigger value="QUARTERLY">Quarterly</TabsTrigger>
          <TabsTrigger value="YEARLY">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          <LeaderboardTable
            entries={leaderboard}
            period={period}
            metric="points"
          />
        </TabsContent>
      </Tabs>

      {leaderboard.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No leaderboard data for this period</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
