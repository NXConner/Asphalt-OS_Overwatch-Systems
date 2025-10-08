
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Plus, Edit, Trash2, Package, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  supplier: string;
  unit: string;
  costPerUnit: number;
  description?: string;
  category?: string;
}

export default function MaterialsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
    if (status === 'authenticated' && session?.user?.role === 'EMPLOYEE') {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMaterials();
    }
  }, [status]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials');
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (materialData: Partial<Material>) => {
    try {
      const url = selectedMaterial ? `/api/materials/${selectedMaterial.id}` : '/api/materials';
      const method = selectedMaterial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) throw new Error('Failed to save material');

      toast.success(selectedMaterial ? 'Material updated' : 'Material added');
      fetchMaterials();
      setShowDialog(false);
      setSelectedMaterial(null);
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error('Failed to save material');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete material');

      toast.success('Material deleted');
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = `${material.name} ${material.supplier} ${material.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || material.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading materials...</p>
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

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Materials Catalog</h1>
                <p className="text-muted-foreground">Manage materials, suppliers, and pricing</p>
              </div>
              <Button onClick={() => {
                setSelectedMaterial(null);
                setShowDialog(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="SEALER">Sealer</SelectItem>
                  <SelectItem value="SAND">Sand</SelectItem>
                  <SelectItem value="ADDITIVE">Additive</SelectItem>
                  <SelectItem value="CRACK_FILLER">Crack Filler</SelectItem>
                  <SelectItem value="STRIPING">Striping</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {material.name}
                        </CardTitle>
                        {material.category && (
                          <Badge variant="outline" className="mt-2">
                            {material.category.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <div><strong>Supplier:</strong> {material.supplier}</div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          ${material.costPerUnit.toFixed(2)} / {material.unit}
                        </span>
                      </div>
                      {material.description && (
                        <div className="text-muted-foreground line-clamp-2">
                          {material.description}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMaterial(material);
                          setShowDialog(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(material.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Material Dialog */}
            <MaterialDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              material={selectedMaterial}
              onSave={handleSave}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function MaterialDialog({
  open,
  onOpenChange,
  material,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  onSave: (data: Partial<Material>) => void;
}) {
  const [formData, setFormData] = useState({
    name: material?.name || '',
    supplier: material?.supplier || '',
    unit: material?.unit || 'gallon',
    costPerUnit: material?.costPerUnit?.toString() || '',
    description: material?.description || '',
    category: material?.category || 'SEALER',
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        supplier: material.supplier,
        unit: material.unit,
        costPerUnit: material.costPerUnit.toString(),
        description: material.description || '',
        category: material.category || 'SEALER',
      });
    } else {
      setFormData({
        name: '',
        supplier: '',
        unit: 'gallon',
        costPerUnit: '',
        description: '',
        category: 'SEALER',
      });
    }
  }, [material, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{material ? 'Edit Material' : 'Add Material'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Material Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., SealMaster Premium Sealer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., SealMaster"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEALER">Sealer</SelectItem>
                  <SelectItem value="SAND">Sand</SelectItem>
                  <SelectItem value="ADDITIVE">Additive</SelectItem>
                  <SelectItem value="CRACK_FILLER">Crack Filler</SelectItem>
                  <SelectItem value="STRIPING">Striping</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallon">Gallon</SelectItem>
                  <SelectItem value="pound">Pound</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="unit">Unit</SelectItem>
                  <SelectItem value="each">Each</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cost Per Unit *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Material description and notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                ...formData,
                costPerUnit: parseFloat(formData.costPerUnit),
              });
            }}
            disabled={!formData.name || !formData.supplier || !formData.costPerUnit}
          >
            {material ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
