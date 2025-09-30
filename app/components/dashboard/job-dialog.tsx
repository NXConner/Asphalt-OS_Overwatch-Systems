
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Square,
  Ruler,
  Loader2,
  Save,
  Trash2,
  Calculator,
} from 'lucide-react';

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: any;
  initialLocation?: { lat: number; lng: number; address?: string } | undefined;
  onSaved: () => void;
}

export function JobDialog({ 
  open, 
  onOpenChange, 
  job, 
  initialLocation,
  onSaved 
}: JobDialogProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    type: 'SEALCOATING',
    status: 'POSSIBLE',
    description: '',
    notes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    squareFootage: '',
    linearFootage: '',
    numberOfStalls: '',
    hasOilSpots: false,
    crackSeverity: 'MEDIUM',
    scheduledDate: '',
    estimatedCost: '',
  });

  // Initialize form data
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        address: job.address || '',
        latitude: job.latitude,
        longitude: job.longitude,
        type: job.type || 'SEALCOATING',
        status: job.status || 'POSSIBLE',
        description: job.description || '',
        notes: job.notes || '',
        contactName: job.contactName || '',
        contactEmail: job.contactEmail || '',
        contactPhone: job.contactPhone || '',
        squareFootage: job.squareFootage?.toString() || '',
        linearFootage: job.linearFootage?.toString() || '',
        numberOfStalls: job.numberOfStalls?.toString() || '',
        hasOilSpots: job.hasOilSpots || false,
        crackSeverity: job.crackSeverity || 'MEDIUM',
        scheduledDate: job.scheduledDate ? 
          new Date(job.scheduledDate).toISOString().split('T')[0] : '',
        estimatedCost: job.estimatedCost?.toString() || '',
      });
    } else if (initialLocation) {
      setFormData(prev => ({
        ...prev,
        address: initialLocation.address || `${initialLocation.lat.toFixed(6)}, ${initialLocation.lng.toFixed(6)}`,
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
      }));
    }
  }, [job, initialLocation]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        address: '',
        latitude: null,
        longitude: null,
        type: 'SEALCOATING',
        status: 'POSSIBLE',
        description: '',
        notes: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        squareFootage: '',
        linearFootage: '',
        numberOfStalls: '',
        hasOilSpots: false,
        crackSeverity: 'MEDIUM',
        scheduledDate: '',
        estimatedCost: '',
      });
    }
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        squareFootage: formData.squareFootage ? parseFloat(formData.squareFootage) : null,
        linearFootage: formData.linearFootage ? parseFloat(formData.linearFootage) : null,
        numberOfStalls: formData.numberOfStalls ? parseInt(formData.numberOfStalls) : null,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
      };

      const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
      const method = job ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      onSaved();
    } catch (error) {
      console.error('Error saving job:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job || !confirm('Are you sure you want to delete this job?')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      onSaved();
    } catch (error) {
      console.error('Error deleting job:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'POSSIBLE': return 'bg-yellow-100 text-yellow-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canDelete = session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {job ? 'Edit Job' : 'New Job'}
            </DialogTitle>
            {job && (
              <Badge className={getStatusColor(job.status)}>
                {job.status.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Walmart Parking Lot Sealcoating"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEALCOATING">Sealcoating</SelectItem>
                      <SelectItem value="CRACK_REPAIR">Crack Repair</SelectItem>
                      <SelectItem value="ASPHALT_PATCHING">Asphalt Patching</SelectItem>
                      <SelectItem value="LINE_STRIPING">Line Striping</SelectItem>
                      <SelectItem value="COMBINATION">Combination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Job site address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POSSIBLE">Possible</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the work to be done..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Private notes for internal use..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="John Smith"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="squareFootage"
                      type="number"
                      placeholder="0"
                      value={formData.squareFootage}
                      onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linearFootage">Linear Footage</Label>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linearFootage"
                      type="number"
                      placeholder="0"
                      value={formData.linearFootage}
                      onChange={(e) => setFormData({ ...formData, linearFootage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfStalls">Parking Stalls</Label>
                  <Input
                    id="numberOfStalls"
                    type="number"
                    placeholder="0"
                    value={formData.numberOfStalls}
                    onChange={(e) => setFormData({ ...formData, numberOfStalls: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crackSeverity">Crack Severity</Label>
                  <Select
                    value={formData.crackSeverity}
                    onValueChange={(value) => setFormData({ ...formData, crackSeverity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIGHT">Light</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HEAVY">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimatedCost"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOilSpots"
                  checked={formData.hasOilSpots}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, hasOilSpots: checked as boolean })
                  }
                />
                <Label htmlFor="hasOilSpots">Has oil spots (requires prep seal)</Label>
              </div>

              {job && job.createdAt && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <div>{new Date(job.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Updated:</span>
                          <div>{new Date(job.updatedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {job && canDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !formData.title || !formData.address}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              <Save className="h-4 w-4 mr-1" />
              {job ? 'Update' : 'Create'} Job
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
