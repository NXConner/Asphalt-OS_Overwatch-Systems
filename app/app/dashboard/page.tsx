
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { GoogleMaps } from '@/components/maps/google-maps';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CollapsibleSidebar } from '@/components/dashboard/collapsible-sidebar';
import { JobDialog } from '@/components/dashboard/job-dialog';
import { EstimateDialog } from '@/components/dashboard/estimate-dialog';
import { TimesheetDialog } from '@/components/dashboard/timesheet-dialog';
import { DirectionsPanel } from '@/components/directions/directions-panel';
import { ScanLine } from '@/components/ui/scan-line';
import { EnhancedWeatherWidget } from '@/components/weather/enhanced-weather-widget';
import { RainRadarOverlay } from '@/components/map/rain-radar-overlay';
import { MapMarker } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const [showTimesheetDialog, setShowTimesheetDialog] = useState(false);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [selectedJobForDirections, setSelectedJobForDirections] = useState<string>('');
  const [newJobLocation, setNewJobLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [radarEnabled, setRadarEnabled] = useState(false);
  const [radarRadius, setRadarRadius] = useState(5);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLng | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // Fetch jobs
  useEffect(() => {
    if (status === 'authenticated') {
      fetchJobs();
    }
  }, [status]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert jobs to map markers
  const markers: MapMarker[] = jobs?.map(job => ({
    id: job.id,
    position: { lat: job.latitude || 36.6484, lng: job.longitude || -80.2737 },
    title: job.title,
    status: job.status,
    type: job.type,
    address: job.address,
    description: job.description,
    estimatedCost: job.estimatedCost,
  })) || [];

  const handleMarkerClick = (marker: MapMarker) => {
    const job = jobs?.find(j => j.id === marker.id);
    if (job) {
      setSelectedJob(job);
      setShowJobDialog(true);
    }
  };

  const handleMapClick = (lat: number, lng: number, address?: string) => {
    setNewJobLocation({ lat, lng, address });
    setShowJobDialog(true);
  };

  const handleJobSaved = () => {
    setShowJobDialog(false);
    setSelectedJob(null);
    setNewJobLocation(undefined);
    fetchJobs(); // Refresh jobs
  };

  const handleEstimate = (job: any) => {
    setSelectedJob(job);
    setShowEstimateDialog(true);
  };

  const handleDirections = (job?: any) => {
    if (job) {
      setSelectedJobForDirections(job.id);
    }
    setShowDirectionsPanel(true);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Wrap callbacks in useCallback to prevent infinite loops
  const handleMapLoad = useCallback((map: google.maps.Map, center: google.maps.LatLng) => {
    setMapInstance(map);
    setMapCenter(center);
  }, []); // Empty deps - only set once

  const handleRadarToggle = useCallback((enabled: boolean, radius: number) => {
    setRadarEnabled(enabled);
    setRadarRadius(radius);
  }, []); // Empty deps - can update state directly

  const handleAreaMeasured = useCallback((area: number) => {
    console.log('Area measured:', area, 'sq ft');
    // Auto-update selected job with measured area
    if (selectedJob) {
      setSelectedJob({...selectedJob, squareFootage: area});
    }
  }, [selectedJob]); // Depends on selectedJob

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Advanced UI Effects */}
      <ScanLine enabled={true} />
      
      <DashboardHeader 
        onTimesheetClick={() => setShowTimesheetDialog(true)}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onDirectionsClick={() => handleDirections()}
        onSettingsClick={handleSettings}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <CollapsibleSidebar 
          jobs={jobs}
          onJobSelect={(job) => {
            setSelectedJob(job);
            setShowJobDialog(true);
          }}
          onNewJob={() => setShowJobDialog(true)}
          onEstimate={handleEstimate}
          onDirections={handleDirections}
        />
        
        <main className="flex-1 overflow-hidden relative">
          <GoogleMaps
            markers={markers}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            enableMeasuring={true}
            enableAISurfaceDetection={true}
            jobId={selectedJob?.id}
            onAreaMeasured={handleAreaMeasured}
            onMapLoad={handleMapLoad}
          />
          
          {/* Rain Radar Overlay */}
          <RainRadarOverlay
            map={mapInstance}
            center={mapCenter}
            radius={radarRadius}
            enabled={radarEnabled}
          />
          
          {/* Enhanced Weather Widget - Floating overlay */}
          <div className="absolute top-4 right-4 z-10 w-96 max-w-full">
            <EnhancedWeatherWidget 
              location="Richmond,VA,US"
              showRadar={true}
              onRadarToggle={handleRadarToggle}
            />
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <JobDialog
        open={showJobDialog}
        onOpenChange={setShowJobDialog}
        job={selectedJob}
        initialLocation={newJobLocation}
        onSaved={handleJobSaved}
      />

      <EstimateDialog
        open={showEstimateDialog}
        onOpenChange={setShowEstimateDialog}
        job={selectedJob}
      />

      <TimesheetDialog
        open={showTimesheetDialog}
        onOpenChange={setShowTimesheetDialog}
      />

      <DirectionsPanel
        isOpen={showDirectionsPanel}
        onClose={() => setShowDirectionsPanel(false)}
        jobs={jobs}
        selectedJobId={selectedJobForDirections}
        onJobSelect={(jobId) => setSelectedJobForDirections(jobId)}
      />
    </div>
  );
}
