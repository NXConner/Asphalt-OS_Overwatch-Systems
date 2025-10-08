
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, User } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CalendarViewProps {
  jobs: any[];
  onJobClick: (job: any) => void;
  onAddJob: (date: Date) => void;
}

export function CalendarView({ jobs, onJobClick, onAddJob }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = monthStart.getDay();
  
  // Calculate empty cells at the beginning
  const emptyCellsStart = Array(firstDayOfMonth).fill(null);

  // Get jobs for a specific date
  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      if (!job.scheduledDate) return false;
      return isSameDay(new Date(job.scheduledDate), date);
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const jobsOnDate = getJobsForDate(date);
    if (jobsOnDate.length === 0) {
      onAddJob(date);
    } else {
      setShowJobDialog(true);
    }
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => onAddJob(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month start */}
            {emptyCellsStart.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {/* Days of the month */}
            {days.map(day => {
              const dayJobs = getJobsForDate(day);
              const isCurrentDay = isToday(day);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square p-2 rounded-lg border transition-all
                    ${isCurrentDay ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                    ${dayJobs.length > 0 ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, 'd')}
                  </div>
                  {dayJobs.length > 0 && (
                    <div className="space-y-1">
                      {dayJobs.slice(0, 2).map(job => (
                        <div
                          key={job.id}
                          className={`
                            text-xs px-1 py-0.5 rounded truncate
                            ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'POSSIBLE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}
                          `}
                          title={job.title}
                        >
                          {job.title}
                        </div>
                      ))}
                      {dayJobs.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayJobs.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Job Details Dialog */}
      {selectedDate && showJobDialog && (
        <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Jobs on {format(selectedDate, 'MMMM d, yyyy')}</DialogTitle>
              <DialogDescription>
                {selectedDateJobs.length} job(s) scheduled for this date
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedDateJobs.map(job => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  onJobClick(job);
                  setShowJobDialog(false);
                }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <MapPin className="h-4 w-4" />
                          {job.address}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        job.status === 'COMPLETED' ? 'default' :
                        job.status === 'IN_PROGRESS' ? 'secondary' :
                        job.status === 'POSSIBLE' ? 'outline' :
                        'destructive'
                      }>
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{job.estimatedHours || 'N/A'} hours estimated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    {job.description && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        {job.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowJobDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                onAddJob(selectedDate);
                setShowJobDialog(false);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
