
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Trophy, Award, Star, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AchievementBadge } from '@/components/achievements/achievement-badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AchievementsPage() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    earned: 0,
    points: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achievementsRes, availableRes] = await Promise.all([
          fetch('/api/achievements'),
          fetch('/api/achievements', { method: 'POST' }),
        ]);

        if (achievementsRes.ok && availableRes.ok) {
          const earnedAchievements = await achievementsRes.json();
          const allAchievements = await availableRes.json();

          setAchievements(earnedAchievements);
          setAvailable(allAchievements);

          const totalPoints = earnedAchievements.reduce(
            (sum: number, a: any) => sum + a.achievement.points,
            0
          );

          setStats({
            total: allAchievements.length,
            earned: earnedAchievements.length,
            points: totalPoints,
          });
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const groupByCategory = (items: any[]) => {
    return items.reduce((acc: any, item: any) => {
      const category = item.achievement?.category || item.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const earnedByCategory = groupByCategory(achievements);
  const availableByCategory = groupByCategory(available);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.earned} / {stats.total}
            </div>
            <Progress value={(stats.earned / stats.total) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {((stats.earned / stats.total) * 100).toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.points}</div>
            <p className="text-xs text-muted-foreground mt-2">Achievement Points Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Achievement</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {achievements[0]?.achievement?.name || 'None yet'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {achievements[0]
                ? new Date(achievements[0].earnedDate).toLocaleDateString()
                : 'Start completing jobs to earn achievements!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Tabs */}
      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="earned">Earned ({stats.earned})</TabsTrigger>
          <TabsTrigger value="available">Available ({stats.total - stats.earned})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-6">
          {Object.entries(earnedByCategory).map(([category, items]: [string, any]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category.replace(/_/g, ' ')}</CardTitle>
                <CardDescription>{items.length} achievements earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item: any) => (
                    <AchievementBadge
                      key={item.id}
                      name={item.achievement.name}
                      description={item.achievement.description}
                      rarity={item.achievement.rarity}
                      category={item.achievement.category}
                      badgeColor={item.achievement.badgeColor}
                      earnedDate={item.earnedDate}
                      size="md"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {achievements.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Medal className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No achievements earned yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete jobs and tasks to earn achievements!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          {Object.entries(availableByCategory).map(([category, items]: [string, any]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category.replace(/_/g, ' ')}</CardTitle>
                <CardDescription>{items.length} achievements available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="opacity-50 grayscale">
                      <AchievementBadge
                        name={item.name}
                        description={item.description}
                        rarity={item.rarity}
                        category={item.category}
                        badgeColor={item.badgeColor}
                        size="md"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
