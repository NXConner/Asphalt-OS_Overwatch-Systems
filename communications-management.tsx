
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, MessageSquare, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Communication {
  id: string;
  type: string;
  subject?: string;
  message: string;
  authorId: string;
  date?: string;
  status: string;
  priority: string;
  tasksCompleted?: any;
  problemsEncountered?: any;
  nextDayPlan?: string;
  hoursWorked?: number;
  jobsCompleted?: number;
  responseRequired: boolean;
  createdAt: string;
}

export function CommunicationsManagement() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showDebriefDialog, setShowDebriefDialog] = useState(false);
  const [showBriefingDialog, setShowBriefingDialog] = useState(false);
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);

  const fetchCommunications = async (type?: string) => {
    setLoading(true);
    try {
      const url = type && type !== 'all'
        ? `/api/communications/${type === 'DEBRIEF' ? 'debriefs' : 'briefings'}`
        : '/api/communications/debriefs'; // Default to debriefs
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCommunications(data);
      }
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast.error('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDebrief = async (debriefData: any) => {
    try {
      const response = await fetch('/api/communications/debriefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debriefData),
      });

      if (!response.ok) throw new Error('Failed to save debrief');

      toast.success('Debrief submitted successfully');
      fetchCommunications();
      setShowDebriefDialog(false);
    } catch (error) {
      console.error('Error saving debrief:', error);
      toast.error('Failed to save debrief');
    }
  };

  const handleSaveBriefing = async (briefingData: any) => {
    try {
      const response = await fetch('/api/communications/briefings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefingData),
      });

      if (!response.ok) throw new Error('Failed to save briefing');

      toast.success('Briefing sent successfully');
      fetchCommunications();
      setShowBriefingDialog(false);
    } catch (error) {
      console.error('Error saving briefing:', error);
      toast.error('Failed to save briefing');
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: { [key: string]: string } = {
      LOW: 'bg-gray-100 text-gray-800',
      NORMAL: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[priority] || colors.NORMAL}>
        {priority}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <Send className="h-4 w-4 text-blue-500" />;
      case 'READ': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'ACKNOWLEDGED': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'DRAFT': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communications</h2>
          <p className="text-muted-foreground">Briefings, debriefs, and team messages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowDebriefDialog(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Debrief
          </Button>
          <Button onClick={() => setShowBriefingDialog(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Briefing
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filterType} onValueChange={(value) => {
          setFilterType(value);
          fetchCommunications(value);
        }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Communications</SelectItem>
            <SelectItem value="DEBRIEF">Debriefs</SelectItem>
            <SelectItem value="BRIEFING">Briefings</SelectItem>
            <SelectItem value="ANNOUNCEMENT">Announcements</SelectItem>
            <SelectItem value="ALERT">Alerts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="debriefs">Debriefs</TabsTrigger>
          <TabsTrigger value="briefings">Briefings</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-3">
            {communications.slice(0, 10).map((comm) => (
              <Card key={comm.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedComm(comm)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getStatusIcon(comm.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{comm.type}</Badge>
                            {getPriorityBadge(comm.priority)}
                          </div>
                          {comm.subject && (
                            <h4 className="font-medium mt-2">{comm.subject}</h4>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {comm.message}
                      </p>
                      {comm.type === 'DEBRIEF' && (
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          {comm.hoursWorked && <span>Hours: {comm.hoursWorked}</span>}
                          {comm.jobsCompleted && <span>Jobs: {comm.jobsCompleted}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="debriefs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communications.filter(c => c.type === 'DEBRIEF').map((debrief) => (
              <Card key={debrief.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {debrief.date ? new Date(debrief.date).toLocaleDateString() : 'Daily Debrief'}
                    </CardTitle>
                    {getPriorityBadge(debrief.priority)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {debrief.hoursWorked && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Hours Worked:</span>
                        <span className="font-medium">{debrief.hoursWorked} hrs</span>
                      </div>
                    )}
                    {debrief.jobsCompleted !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Jobs Completed:</span>
                        <span className="font-medium">{debrief.jobsCompleted}</span>
                      </div>
                    )}
                  </div>

                  {debrief.message && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {debrief.message}
                    </p>
                  )}

                  {debrief.nextDayPlan && (
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">Tomorrow's Plan:</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {debrief.nextDayPlan}
                      </p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setSelectedComm(debrief)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="briefings" className="space-y-4">
          <div className="space-y-3">
            {communications.filter(c => c.type === 'BRIEFING').map((briefing) => (
              <Card key={briefing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityBadge(briefing.priority)}
                        <Badge variant="outline">{briefing.status}</Badge>
                      </div>
                      {briefing.subject && (
                        <h4 className="font-medium mb-2">{briefing.subject}</h4>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {briefing.message}
                      </p>
                      {briefing.responseRequired && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          Response Required
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(briefing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Debrief Dialog */}
      <DebriefDialog
        open={showDebriefDialog}
        onOpenChange={setShowDebriefDialog}
        onSave={handleSaveDebrief}
      />

      {/* Briefing Dialog */}
      <BriefingDialog
        open={showBriefingDialog}
        onOpenChange={setShowBriefingDialog}
        onSave={handleSaveBriefing}
      />

      {/* Detail Dialog */}
      {selectedComm && (
        <CommunicationDetailDialog
          communication={selectedComm}
          open={!!selectedComm}
          onOpenChange={(open) => !open && setSelectedComm(null)}
        />
      )}
    </div>
  );
}

function DebriefDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hoursWorked: '',
    jobsCompleted: '',
    message: '',
    problemsEncountered: '',
    nextDayPlan: '',
    priority: 'NORMAL',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>End of Day Debrief</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hours Worked</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                placeholder="8.0"
              />
            </div>
            <div className="space-y-2">
              <Label>Jobs Completed</Label>
              <Input
                type="number"
                value={formData.jobsCompleted}
                onChange={(e) => setFormData({ ...formData, jobsCompleted: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Daily Summary</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe today's work..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Problems Encountered</Label>
            <Textarea
              value={formData.problemsEncountered}
              onChange={(e) => setFormData({ ...formData, problemsEncountered: e.target.value })}
              placeholder="Any issues or challenges..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tomorrow's Plan</Label>
            <Textarea
              value={formData.nextDayPlan}
              onChange={(e) => setFormData({ ...formData, nextDayPlan: e.target.value })}
              placeholder="Plans for tomorrow..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave({
              type: 'DEBRIEF',
              ...formData,
              hoursWorked: parseFloat(formData.hoursWorked) || undefined,
              jobsCompleted: parseInt(formData.jobsCompleted) || undefined,
              status: 'SENT',
            });
          }}>
            Submit Debrief
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BriefingDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'NORMAL',
    responseRequired: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Briefing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Tomorrow's Schedule"
            />
          </div>

          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Briefing message..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="responseRequired"
              checked={formData.responseRequired}
              onChange={(e) => setFormData({ ...formData, responseRequired: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="responseRequired" className="cursor-pointer">
              Response Required
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                type: 'BRIEFING',
                ...formData,
                status: 'SENT',
              });
            }}
            disabled={!formData.subject || !formData.message}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Briefing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CommunicationDetailDialog({
  communication,
  open,
  onOpenChange,
}: {
  communication: Communication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{communication.type}</Badge>
              {communication.subject || 'Communication Details'}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={
              communication.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
              communication.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }>
              {communication.priority}
            </Badge>
            <Badge variant="outline">{communication.status}</Badge>
            <span className="text-sm text-muted-foreground ml-auto">
              {new Date(communication.createdAt).toLocaleString()}
            </span>
          </div>

          {communication.type === 'DEBRIEF' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              {communication.hoursWorked && (
                <div>
                  <p className="text-sm text-muted-foreground">Hours Worked</p>
                  <p className="text-xl font-bold">{communication.hoursWorked}</p>
                </div>
              )}
              {communication.jobsCompleted !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Jobs Completed</p>
                  <p className="text-xl font-bold">{communication.jobsCompleted}</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Message</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {communication.message}
            </p>
          </div>

          {communication.nextDayPlan && (
            <div className="space-y-2">
              <h4 className="font-medium">Tomorrow's Plan</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {communication.nextDayPlan}
              </p>
            </div>
          )}

          {communication.responseRequired && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Response Required</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
