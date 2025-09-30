
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Truck,
  Plus,
  Calendar,
  Wrench,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Shield,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  BarChart3,
  Loader2,
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'TRUCK' | 'TRAILER' | 'EQUIPMENT' | 'OTHER';
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  registrationExpiration?: Date;
  inspectionExpiration?: Date;
  insuranceExpiration?: Date;
  lastOilChange?: Date;
  oilChangeInterval: number; // miles
  currentMileage: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'OIL_CHANGE' | 'INSPECTION' | 'REPAIR' | 'PREVENTIVE' | 'OTHER';
  description: string;
  cost: number;
  mileage?: number;
  performedBy?: string;
  performedAt?: Date;
  nextDueDate?: Date;
  nextDueMileage?: number;
  notes?: string;
  createdAt: Date;
}

interface InspectionItem {
  id: string;
  name: string;
  category: string;
  required: boolean;
  description?: string;
}

interface InspectionResult {
  id: string;
  vehicleId: string;
  inspectorName: string;
  inspectionDate: Date;
  mileage: number;
  results: {
    itemId: string;
    status: 'PASS' | 'FAIL' | 'NEEDS_ATTENTION' | 'N/A';
    notes?: string;
  }[];
  overallStatus: 'PASS' | 'FAIL' | 'CONDITIONAL';
  notes?: string;
  createdAt: Date;
}

const DEFAULT_INSPECTION_ITEMS: InspectionItem[] = [
  { id: '1', name: 'Engine Oil Level', category: 'Engine', required: true },
  { id: '2', name: 'Coolant Level', category: 'Engine', required: true },
  { id: '3', name: 'Brake Fluid', category: 'Brakes', required: true },
  { id: '4', name: 'Tire Condition', category: 'Tires', required: true },
  { id: '5', name: 'Tire Pressure', category: 'Tires', required: true },
  { id: '6', name: 'Lights (All)', category: 'Electrical', required: true },
  { id: '7', name: 'Horn', category: 'Safety', required: true },
  { id: '8', name: 'Mirrors', category: 'Safety', required: true },
  { id: '9', name: 'Windshield Wipers', category: 'Safety', required: true },
  { id: '10', name: 'Seat Belts', category: 'Safety', required: true },
  { id: '11', name: 'Emergency Equipment', category: 'Safety', required: true },
  { id: '12', name: 'Exhaust System', category: 'Engine', required: true },
  { id: '13', name: 'Suspension', category: 'Chassis', required: true },
  { id: '14', name: 'Steering', category: 'Chassis', required: true },
  { id: '15', name: 'Body/Frame Condition', category: 'Body', required: false },
];

export default function FleetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [inspectionResults, setInspectionResults] = useState<InspectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
    if (status === 'authenticated' && session?.user?.role === 'EMPLOYEE') {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  // Fetch data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchVehicles();
      fetchMaintenanceRecords();
      fetchInspectionResults();
    }
  }, [status]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/fleet/vehicles');
      if (response.ok) {
        const vehicleData = await response.json();
        setVehicles(vehicleData);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceRecords = async () => {
    try {
      const response = await fetch('/api/fleet/maintenance');
      if (response.ok) {
        const maintenanceData = await response.json();
        setMaintenanceRecords(maintenanceData);
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const fetchInspectionResults = async () => {
    try {
      const response = await fetch('/api/fleet/inspections');
      if (response.ok) {
        const inspectionData = await response.json();
        setInspectionResults(inspectionData);
      }
    } catch (error) {
      console.error('Error fetching inspection results:', error);
    }
  };

  const getVehicleStatus = (vehicle: Vehicle) => {
    const today = new Date();
    const alerts = [];

    // Check registration
    if (vehicle.registrationExpiration) {
      const daysUntilReg = Math.ceil((new Date(vehicle.registrationExpiration).getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysUntilReg < 0) alerts.push('Registration Expired');
      else if (daysUntilReg <= 30) alerts.push('Registration Expiring');
    }

    // Check inspection
    if (vehicle.inspectionExpiration) {
      const daysUntilInsp = Math.ceil((new Date(vehicle.inspectionExpiration).getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysUntilInsp < 0) alerts.push('Inspection Expired');
      else if (daysUntilInsp <= 30) alerts.push('Inspection Due');
    }

    // Check oil change
    if (vehicle.lastOilChange && vehicle.oilChangeInterval) {
      const milesSinceOilChange = vehicle.currentMileage - (vehicle.lastOilChange ? new Date(vehicle.lastOilChange).getTime() : 0);
      const oilChangeOverdue = milesSinceOilChange > vehicle.oilChangeInterval;
      const oilChangeDue = milesSinceOilChange > (vehicle.oilChangeInterval * 0.9);
      
      if (oilChangeOverdue) alerts.push('Oil Change Overdue');
      else if (oilChangeDue) alerts.push('Oil Change Due');
    }

    return {
      status: vehicle.status,
      alerts,
      isOverdue: alerts.some(alert => alert.includes('Expired') || alert.includes('Overdue'))
    };
  };

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Needs Attention</Badge>;
    }
    
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'MAINTENANCE': return <Badge className="bg-yellow-100 text-yellow-800"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case 'OUT_OF_SERVICE': return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Out of Service</Badge>;
      case 'RETIRED': return <Badge className="bg-gray-100 text-gray-800">Retired</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = `${vehicle.name} ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.licensePlate}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading fleet dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSettingsClick={() => router.push('/settings')}
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
        
        <main className="flex-1 overflow-hidden bg-muted/50">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b bg-background p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Truck className="h-8 w-8" />
                    Fleet Management
                  </h1>
                  <p className="text-muted-foreground">
                    Manage vehicles, maintenance, and inspections
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowInspectionDialog(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    New Inspection
                  </Button>
                  <Button onClick={() => setShowVehicleDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <Tabs defaultValue="vehicles" className="h-full flex flex-col">
                <TabsList>
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="inspections">Inspections</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="vehicles" className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => {
                      const vehicleStatus = getVehicleStatus(vehicle);
                      
                      return (
                        <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                {vehicle.name}
                              </CardTitle>
                              {getStatusBadge(vehicleStatus.status, vehicleStatus.isOverdue)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-1 text-sm">
                              <div><strong>License Plate:</strong> {vehicle.licensePlate || 'N/A'}</div>
                              <div><strong>Mileage:</strong> {vehicle.currentMileage.toLocaleString()} miles</div>
                              {vehicle.registrationExpiration && (
                                <div><strong>Registration:</strong> {new Date(vehicle.registrationExpiration).toLocaleDateString()}</div>
                              )}
                              {vehicle.inspectionExpiration && (
                                <div><strong>Inspection:</strong> {new Date(vehicle.inspectionExpiration).toLocaleDateString()}</div>
                              )}
                            </div>

                            {vehicleStatus.alerts.length > 0 && (
                              <div className="space-y-1">
                                <strong className="text-sm text-red-600">Alerts:</strong>
                                {vehicleStatus.alerts.map((alert, index) => (
                                  <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {alert}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedVehicle(vehicle);
                                  setShowVehicleDialog(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedVehicle(vehicle);
                                  setShowMaintenanceDialog(true);
                                }}
                              >
                                <Wrench className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedVehicle(vehicle);
                                  setShowInspectionDialog(true);
                                }}
                              >
                                <FileText className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="maintenance" className="flex-1">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Maintenance History</CardTitle>
                        <Button onClick={() => setShowMaintenanceDialog(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Record
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Vehicle</th>
                              <th className="text-left p-3">Type</th>
                              <th className="text-left p-3">Description</th>
                              <th className="text-left p-3">Date</th>
                              <th className="text-left p-3">Cost</th>
                              <th className="text-left p-3">Next Due</th>
                            </tr>
                          </thead>
                          <tbody>
                            {maintenanceRecords.map((record) => {
                              const vehicle = vehicles.find(v => v.id === record.vehicleId);
                              return (
                                <tr key={record.id} className="border-b hover:bg-muted/50">
                                  <td className="p-3">
                                    <div className="font-medium">{vehicle?.name}</div>
                                    <div className="text-sm text-muted-foreground">{vehicle?.licensePlate}</div>
                                  </td>
                                  <td className="p-3">{record.type.replace('_', ' ')}</td>
                                  <td className="p-3">{record.description}</td>
                                  <td className="p-3">
                                    {record.performedAt ? new Date(record.performedAt).toLocaleDateString() : 'Scheduled'}
                                  </td>
                                  <td className="p-3">${record.cost.toFixed(2)}</td>
                                  <td className="p-3">
                                    {record.nextDueDate ? new Date(record.nextDueDate).toLocaleDateString() : 
                                     record.nextDueMileage ? `${record.nextDueMileage.toLocaleString()} mi` : 'N/A'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inspections" className="flex-1">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Vehicle Inspections</CardTitle>
                        <Button onClick={() => setShowInspectionDialog(true)}>
                          <FileText className="h-4 w-4 mr-2" />
                          New Inspection
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inspectionResults.map((inspection) => {
                          const vehicle = vehicles.find(v => v.id === inspection.vehicleId);
                          const passCount = inspection.results.filter(r => r.status === 'PASS').length;
                          const totalCount = inspection.results.length;
                          
                          return (
                            <Card key={inspection.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm">{vehicle?.name}</CardTitle>
                                  <Badge className={
                                    inspection.overallStatus === 'PASS' ? 'bg-green-100 text-green-800' :
                                    inspection.overallStatus === 'CONDITIONAL' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {inspection.overallStatus}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(inspection.inspectionDate).toLocaleDateString()}
                                </p>
                              </CardHeader>
                              <CardContent className="text-sm space-y-2">
                                <div><strong>Inspector:</strong> {inspection.inspectorName}</div>
                                <div><strong>Mileage:</strong> {inspection.mileage.toLocaleString()}</div>
                                <div><strong>Results:</strong> {passCount}/{totalCount} passed</div>
                                {inspection.notes && (
                                  <div><strong>Notes:</strong> {inspection.notes}</div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Vehicles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{vehicles.length}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Active Vehicles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {vehicles.filter(v => v.status === 'ACTIVE').length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Needs Attention</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {vehicles.filter(v => getVehicleStatus(v).isOverdue).length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">This Month's Maintenance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${maintenanceRecords
                            .filter(r => r.performedAt && new Date(r.performedAt).getMonth() === new Date().getMonth())
                            .reduce((sum, r) => sum + r.cost, 0)
                            .toFixed(0)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Vehicle Dialog */}
      <VehicleDialog
        open={showVehicleDialog}
        onOpenChange={setShowVehicleDialog}
        vehicle={selectedVehicle}
        onSave={(data) => {
          // Handle save logic here
          fetchVehicles();
          setShowVehicleDialog(false);
          setSelectedVehicle(null);
        }}
      />

      {/* Maintenance Dialog */}
      <MaintenanceDialog
        open={showMaintenanceDialog}
        onOpenChange={setShowMaintenanceDialog}
        vehicle={selectedVehicle}
        onSave={(data) => {
          // Handle save logic here
          fetchMaintenanceRecords();
          setShowMaintenanceDialog(false);
          setSelectedVehicle(null);
        }}
      />

      {/* Inspection Dialog */}
      <InspectionDialog
        open={showInspectionDialog}
        onOpenChange={setShowInspectionDialog}
        vehicle={selectedVehicle}
        vehicles={vehicles}
        inspectionItems={DEFAULT_INSPECTION_ITEMS}
        onSave={(data) => {
          // Handle save logic here
          fetchInspectionResults();
          setShowInspectionDialog(false);
          setSelectedVehicle(null);
        }}
      />
    </div>
  );
}

// Vehicle Dialog Component
function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (data: Partial<Vehicle>) => void;
}) {
  // Implementation for vehicle dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </DialogTitle>
        </DialogHeader>
        {/* Vehicle form content */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave({})}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Maintenance Dialog Component
function MaintenanceDialog({
  open,
  onOpenChange,
  vehicle,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (data: Partial<MaintenanceRecord>) => void;
}) {
  // Implementation for maintenance dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>
        {/* Maintenance form content */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave({})}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Inspection Dialog Component
function InspectionDialog({
  open,
  onOpenChange,
  vehicle,
  vehicles,
  inspectionItems,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  inspectionItems: InspectionItem[];
  onSave: (data: Partial<InspectionResult>) => void;
}) {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [mileage, setMileage] = useState('');
  const [results, setResults] = useState<{[key: string]: 'PASS' | 'FAIL' | 'NEEDS_ATTENTION' | 'N/A'}>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (vehicle && open) {
      setSelectedVehicleId(vehicle.id);
      setMileage(vehicle.currentMileage.toString());
    }
  }, [vehicle, open]);

  const handleResultChange = (itemId: string, status: 'PASS' | 'FAIL' | 'NEEDS_ATTENTION' | 'N/A') => {
    setResults(prev => ({ ...prev, [itemId]: status }));
  };

  const getOverallStatus = (): 'PASS' | 'FAIL' | 'CONDITIONAL' => {
    const resultValues = Object.values(results);
    if (resultValues.some(r => r === 'FAIL')) return 'FAIL';
    if (resultValues.some(r => r === 'NEEDS_ATTENTION')) return 'CONDITIONAL';
    return 'PASS';
  };

  const handleSave = () => {
    const inspectionData: Partial<InspectionResult> = {
      vehicleId: selectedVehicleId,
      inspectorName,
      inspectionDate: new Date(),
      mileage: parseInt(mileage),
      results: inspectionItems.map(item => ({
        itemId: item.id,
        status: results[item.id] || 'N/A',
        notes: ''
      })),
      overallStatus: getOverallStatus(),
      notes
    };

    onSave(inspectionData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Inspection</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} - {v.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspector">Inspector Name</Label>
              <Input
                id="inspector"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Inspection Items</h4>
            <div className="space-y-4">
              {['Engine', 'Brakes', 'Tires', 'Electrical', 'Safety', 'Chassis', 'Body'].map(category => {
                const categoryItems = inspectionItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-3">{category}</h5>
                    <div className="space-y-3">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {item.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {(['PASS', 'NEEDS_ATTENTION', 'FAIL', 'N/A'] as const).map(status => (
                              <Button
                                key={status}
                                size="sm"
                                variant={results[item.id] === status ? 'default' : 'outline'}
                                className={`text-xs ${
                                  status === 'PASS' ? 'data-[state=checked]:bg-green-500' :
                                  status === 'NEEDS_ATTENTION' ? 'data-[state=checked]:bg-yellow-500' :
                                  status === 'FAIL' ? 'data-[state=checked]:bg-red-500' :
                                  'data-[state=checked]:bg-gray-500'
                                }`}
                                onClick={() => handleResultChange(item.id, status)}
                              >
                                {status.replace('_', ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Overall Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional inspection notes..."
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status:</span>
              <Badge className={
                getOverallStatus() === 'PASS' ? 'bg-green-100 text-green-800' :
                getOverallStatus() === 'CONDITIONAL' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {getOverallStatus()}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedVehicleId || !inspectorName || !mileage}
          >
            Save Inspection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
