
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { CommunicationsManagement } from '@/components/communications/communications-management';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CommunicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSettingsClick={() => router.push('/settings')}
        onTimesheetClick={() => {}}
        onDirectionsClick={() => {}}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          jobs={[]}
          collapsed={sidebarCollapsed}
          onJobSelect={() => {}}
          onNewJob={() => {}}
          onEstimate={() => {}}
          onDirections={() => {}}
        />
        
        <main className="flex-1 overflow-auto bg-muted/50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <CommunicationsManagement />
          </div>
        </main>
      </div>
    </div>
  );
}
