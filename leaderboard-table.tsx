
'use client';

import { Trophy, Medal, Award, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  jobsCompleted: number;
  hoursWorked: number;
  revenueGenerated: number;
  totalPoints: number;
  achievementsEarned: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  period: string;
  metric: 'points' | 'jobs' | 'hours' | 'revenue';
}

export function LeaderboardTable({ entries, period, metric }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-semibold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank === 2) return 'bg-gray-100 text-gray-800';
    if (rank === 3) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard - {period}
        </CardTitle>
        <CardDescription>Top performers based on {metric}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead className="text-center">Jobs</TableHead>
              <TableHead className="text-center">Hours</TableHead>
              <TableHead className="text-center">Revenue</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead className="text-center">Achievements</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.userId} className={entry.rank <= 3 ? getRankBadge(entry.rank) : ''}>
                <TableCell>
                  <div className="flex items-center justify-center">{getRankIcon(entry.rank)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {entry.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{entry.userName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{entry.jobsCompleted}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {entry.hoursWorked.toFixed(1)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {(entry.revenueGenerated / 1000).toFixed(1)}k
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-blue-600">{entry.totalPoints}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{entry.achievementsEarned}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
