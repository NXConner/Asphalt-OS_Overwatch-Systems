
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Shield,
  Clock,
  DollarSign,
  Upload,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  hireDate: Date;
  hourlyRate: number;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  licenseNumber?: string;
  licenseExpiration?: Date;
  licenseClass?: string;
  licenseStatus: 'VALID' | 'EXPIRED' | 'PENDING' | 'NOT_PROVIDED';
  licenseDocumentUrl?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  certifications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function HRPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [uploading, setUploading] = useState(false);

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
    if (status === 'authenticated' && session?.user?.role === 'EMPLOYEE') {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  // Fetch employees
  useEffect(() => {
    if (status === 'authenticated') {
      fetchEmployees();
    }
  }, [status]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const employeeData = await response.json();
        setEmployees(employeeData);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const url = selectedEmployee ? `/api/employees/${selectedEmployee.id}` : '/api/employees';
      const method = selectedEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error('Failed to save employee');

      fetchEmployees();
      setShowEmployeeDialog(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleLicenseUpload = async (file: File, employeeId: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId);

      const response = await fetch('/api/employees/license-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload license');

      fetchEmployees();
    } catch (error) {
      console.error('Error uploading license:', error);
    } finally {
      setUploading(false);
    }
  };

  const validateLicense = (employee: Employee): 'VALID' | 'EXPIRED' | 'EXPIRING' | 'NOT_PROVIDED' => {
    if (!employee.licenseExpiration) return 'NOT_PROVIDED';
    
    const today = new Date();
    const expirationDate = new Date(employee.licenseExpiration);
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiration < 0) return 'EXPIRED';
    if (daysUntilExpiration <= 30) return 'EXPIRING';
    return 'VALID';
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case 'VALID': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Valid</Badge>;
      case 'EXPIRED': return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      case 'EXPIRING': return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
      case 'NOT_PROVIDED': return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="h-3 w-3 mr-1" />Not Provided</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.position}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading HR dashboard...</p>
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
                    <Users className="h-8 w-8" />
                    Human Resources
                  </h1>
                  <p className="text-muted-foreground">
                    Manage employees, licenses, and HR documentation
                  </p>
                </div>
                <Button onClick={() => setShowEmployeeDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <Tabs defaultValue="employees" className="h-full flex flex-col">
                <TabsList>
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                  <TabsTrigger value="licenses">Driver Licenses</TabsTrigger>
                  <TabsTrigger value="reports">HR Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                      <Card key={employee.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {employee.firstName} {employee.lastName}
                            </CardTitle>
                            <Badge className={
                              employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              employee.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {employee.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {employee.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            ${employee.hourlyRate}/hour
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IdCard className="h-4 w-4 text-muted-foreground" />
                            {getLicenseStatusBadge(validateLicense(employee))}
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowEmployeeDialog(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowLicenseDialog(true);
                              }}
                            >
                              <IdCard className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {employee.firstName} {employee.lastName}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="licenses" className="flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Driver License Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Employee</th>
                              <th className="text-left p-3">License #</th>
                              <th className="text-left p-3">Class</th>
                              <th className="text-left p-3">Expiration</th>
                              <th className="text-left p-3">Status</th>
                              <th className="text-left p-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employees.map((employee) => (
                              <tr key={employee.id} className="border-b hover:bg-muted/50">
                                <td className="p-3">
                                  <div>
                                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                                    <div className="text-sm text-muted-foreground">{employee.position}</div>
                                  </div>
                                </td>
                                <td className="p-3 font-mono text-sm">
                                  {employee.licenseNumber || 'Not provided'}
                                </td>
                                <td className="p-3">{employee.licenseClass || 'N/A'}</td>
                                <td className="p-3">
                                  {employee.licenseExpiration ? 
                                    new Date(employee.licenseExpiration).toLocaleDateString() : 
                                    'Not provided'
                                  }
                                </td>
                                <td className="p-3">
                                  {getLicenseStatusBadge(validateLicense(employee))}
                                </td>
                                <td className="p-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedEmployee(employee);
                                      setShowLicenseDialog(true);
                                    }}
                                  >
                                    <Upload className="h-3 w-3 mr-1" />
                                    Upload
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Employees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Active Employees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {employees.filter(e => e.status === 'ACTIVE').length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">License Expiring</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                          {employees.filter(e => validateLicense(e) === 'EXPIRING').length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Expired Licenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {employees.filter(e => validateLicense(e) === 'EXPIRED').length}
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

      {/* Employee Dialog */}
      <EmployeeDialog
        open={showEmployeeDialog}
        onOpenChange={setShowEmployeeDialog}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      {/* License Dialog */}
      <LicenseDialog
        open={showLicenseDialog}
        onOpenChange={setShowLicenseDialog}
        employee={selectedEmployee}
        onUpload={handleLicenseUpload}
        uploading={uploading}
      />
    </div>
  );
}

// Employee Dialog Component
function EmployeeDialog({ 
  open, 
  onOpenChange, 
  employee, 
  onSave 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (data: Partial<Employee>) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    hireDate: '',
    hourlyRate: '',
    status: 'ACTIVE',
    licenseNumber: '',
    licenseExpiration: '',
    licenseClass: '',
    notes: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        position: employee.position || '',
        department: employee.department || '',
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        hourlyRate: employee.hourlyRate?.toString() || '',
        status: employee.status || 'ACTIVE',
        licenseNumber: employee.licenseNumber || '',
        licenseExpiration: employee.licenseExpiration ? new Date(employee.licenseExpiration).toISOString().split('T')[0] : '',
        licenseClass: employee.licenseClass || '',
        notes: employee.notes || '',
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactPhone: employee.emergencyContactPhone || '',
      });
    } else {
      // Reset form for new employee
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        department: '',
        hireDate: '',
        hourlyRate: '',
        status: 'ACTIVE',
        licenseNumber: '',
        licenseExpiration: '',
        licenseClass: '',
        notes: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
    }
  }, [employee, open]);

  const handleSave = () => {
    const payload = {
      ...formData,
      hireDate: formData.hireDate ? new Date(formData.hireDate) : undefined,
      licenseExpiration: formData.licenseExpiration ? new Date(formData.licenseExpiration) : undefined,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="license">License & Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
              </div>
            </div>

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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="license" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseClass">License Class</Label>
                <Select
                  value={formData.licenseClass}
                  onValueChange={(value) => setFormData({ ...formData, licenseClass: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select license class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Class A (CDL)</SelectItem>
                    <SelectItem value="B">Class B (CDL)</SelectItem>
                    <SelectItem value="C">Class C (Regular)</SelectItem>
                    <SelectItem value="M">Class M (Motorcycle)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseExpiration">License Expiration</Label>
              <Input
                id="licenseExpiration"
                type="date"
                value={formData.licenseExpiration}
                onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {employee ? 'Update' : 'Create'} Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// License Dialog Component
function LicenseDialog({
  open,
  onOpenChange,
  employee,
  onUpload,
  uploading
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onUpload: (file: File, employeeId: string) => void;
  uploading: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && employee) {
      onUpload(selectedFile, employee.id);
      setSelectedFile(null);
      onOpenChange(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Driver License - {employee.firstName} {employee.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Current License Information</h4>
            <div className="space-y-1 text-sm">
              <div><strong>License #:</strong> {employee.licenseNumber || 'Not provided'}</div>
              <div><strong>Class:</strong> {employee.licenseClass || 'Not specified'}</div>
              <div><strong>Expiration:</strong> {employee.licenseExpiration ? new Date(employee.licenseExpiration).toLocaleDateString() : 'Not provided'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="license-file">Upload License Document</Label>
            <Input
              id="license-file"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: JPG, PNG, PDF (max 5MB)
            </p>
          </div>

          {selectedFile && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
            </div>
          )}

          {employee.licenseDocumentUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current License Document</span>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
          >
            {uploading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Upload License
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
