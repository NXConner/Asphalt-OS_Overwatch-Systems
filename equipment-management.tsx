
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
import { Plus, Edit, Trash2, Package, Wrench, Search, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EquipmentItem {
  id: string;
  name: string;
  itemNumber: string;
  category: string;
  description?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  status: string;
  condition?: string;
  location?: string;
  purchasePrice?: number;
  replacementCost?: number;
}

interface EquipmentCheckout {
  id: string;
  equipmentId: string;
  checkedOutBy: string;
  checkedOutAt: string;
  expectedReturnDate?: string;
  returnedAt?: string;
  status: string;
  equipment: EquipmentItem;
}

export function EquipmentManagement() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [checkouts, setCheckouts] = useState<EquipmentCheckout[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/equipment/items');
      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckouts = async () => {
    try {
      const response = await fetch('/api/equipment/checkout');
      if (response.ok) {
        const data = await response.json();
        setCheckouts(data);
      }
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    }
  };

  const handleSaveItem = async (itemData: Partial<EquipmentItem>) => {
    try {
      const url = selectedItem ? `/api/equipment/items/${selectedItem.id}` : '/api/equipment/items';
      const method = selectedItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error('Failed to save equipment');

      toast.success(selectedItem ? 'Equipment updated' : 'Equipment added');
      fetchEquipment();
      setShowItemDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error('Failed to save equipment');
    }
  };

  const handleCheckout = async (checkoutData: any) => {
    try {
      const response = await fetch('/api/equipment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) throw new Error('Failed to checkout equipment');

      toast.success('Equipment checked out successfully');
      fetchEquipment();
      fetchCheckouts();
      setShowCheckoutDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error checking out equipment:', error);
      toast.error('Failed to checkout equipment');
    }
  };

  const handleReturn = async (checkoutId: string) => {
    try {
      const response = await fetch(`/api/equipment/checkout/${checkoutId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnedAt: new Date().toISOString(),
          conditionAtReturn: 'GOOD',
        }),
      });

      if (!response.ok) throw new Error('Failed to return equipment');

      toast.success('Equipment returned successfully');
      fetchEquipment();
      fetchCheckouts();
    } catch (error) {
      console.error('Error returning equipment:', error);
      toast.error('Failed to return equipment');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      AVAILABLE: 'bg-green-100 text-green-800',
      CHECKED_OUT: 'bg-blue-100 text-blue-800',
      IN_MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      OUT_OF_SERVICE: 'bg-red-100 text-red-800',
      LOST: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={statusColors[status] || ''}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = `${item.name} ${item.itemNumber} ${item.brand} ${item.model}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Equipment Inventory</h2>
          <p className="text-muted-foreground">Manage tools, equipment, and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchEquipment()}>
            <Package className="h-4 w-4 mr-2" />
            Inventory Check
          </Button>
          <Button onClick={() => {
            setSelectedItem(null);
            setShowItemDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            className="pl-10"
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
            <SelectItem value="HAND_TOOL">Hand Tools</SelectItem>
            <SelectItem value="POWER_TOOL">Power Tools</SelectItem>
            <SelectItem value="SAFETY_EQUIPMENT">Safety Equipment</SelectItem>
            <SelectItem value="SEALING_EQUIPMENT">Sealing Equipment</SelectItem>
            <SelectItem value="STRIPING_EQUIPMENT">Striping Equipment</SelectItem>
            <SelectItem value="CRACK_REPAIR_EQUIPMENT">Crack Repair</SelectItem>
            <SelectItem value="MEASURING_TOOL">Measuring Tools</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
            <SelectItem value="IN_MAINTENANCE">In Maintenance</SelectItem>
            <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="checkouts">Checkouts</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono mt-1">
                        {item.itemNumber}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <div><strong>Category:</strong> {item.category.replace('_', ' ')}</div>
                    {item.brand && <div><strong>Brand:</strong> {item.brand}</div>}
                    {item.model && <div><strong>Model:</strong> {item.model}</div>}
                    {item.location && <div><strong>Location:</strong> {item.location}</div>}
                    {item.condition && <div><strong>Condition:</strong> {item.condition}</div>}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowItemDialog(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {item.status === 'AVAILABLE' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowCheckoutDialog(true);
                        }}
                      >
                        <Package className="h-3 w-3 mr-1" />
                        Checkout
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checkouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Checkouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checkouts.filter(c => c.status === 'CHECKED_OUT').map((checkout) => (
                  <div
                    key={checkout.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{checkout.equipment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Item #: {checkout.equipment.itemNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Checked out by: {checkout.checkedOutBy}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(checkout.checkedOutAt).toLocaleDateString()}
                      </p>
                      {checkout.expectedReturnDate && (
                        <p className="text-sm text-muted-foreground">
                          Expected return: {new Date(checkout.expectedReturnDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button onClick={() => handleReturn(checkout.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Return
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No maintenance scheduled</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Dialog */}
      <EquipmentItemDialog
        open={showItemDialog}
        onOpenChange={setShowItemDialog}
        item={selectedItem}
        onSave={handleSaveItem}
      />

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckoutDialog}
        onOpenChange={setShowCheckoutDialog}
        item={selectedItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

function EquipmentItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EquipmentItem | null;
  onSave: (data: Partial<EquipmentItem>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    itemNumber: '',
    category: '',
    description: '',
    brand: '',
    model: '',
    serialNumber: '',
    status: 'AVAILABLE',
    condition: 'GOOD',
    location: '',
    purchasePrice: '',
    replacementCost: '',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Equipment Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Crack Router"
              />
            </div>
            <div className="space-y-2">
              <Label>Item Number *</Label>
              <Input
                value={formData.itemNumber}
                onChange={(e) => setFormData({ ...formData, itemNumber: e.target.value })}
                placeholder="e.g., EQ-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HAND_TOOL">Hand Tool</SelectItem>
                <SelectItem value="POWER_TOOL">Power Tool</SelectItem>
                <SelectItem value="SAFETY_EQUIPMENT">Safety Equipment</SelectItem>
                <SelectItem value="SEALING_EQUIPMENT">Sealing Equipment</SelectItem>
                <SelectItem value="STRIPING_EQUIPMENT">Striping Equipment</SelectItem>
                <SelectItem value="CRACK_REPAIR_EQUIPMENT">Crack Repair Equipment</SelectItem>
                <SelectItem value="MEASURING_TOOL">Measuring Tool</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Equipment description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Warehouse, Truck 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_MAINTENANCE">In Maintenance</SelectItem>
                  <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Purchase Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Replacement Cost</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.replacementCost}
                onChange={(e) => setFormData({ ...formData, replacementCost: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave({
              ...formData,
              purchasePrice: parseFloat(formData.purchasePrice) || undefined,
              replacementCost: parseFloat(formData.replacementCost) || undefined,
            });
          }}>
            {item ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CheckoutDialog({
  open,
  onOpenChange,
  item,
  onCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EquipmentItem | null;
  onCheckout: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    checkedOutBy: '',
    checkoutLocation: '',
    jobSiteId: '',
    expectedReturnDate: '',
    notes: '',
  });

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout Equipment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">Item #: {item.itemNumber}</p>
          </div>

          <div className="space-y-2">
            <Label>Checked Out By *</Label>
            <Input
              value={formData.checkedOutBy}
              onChange={(e) => setFormData({ ...formData, checkedOutBy: e.target.value })}
              placeholder="Employee name"
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.checkoutLocation}
              onChange={(e) => setFormData({ ...formData, checkoutLocation: e.target.value })}
              placeholder="e.g., Job Site, Truck 1"
            />
          </div>

          <div className="space-y-2">
            <Label>Expected Return Date</Label>
            <Input
              type="date"
              value={formData.expectedReturnDate}
              onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onCheckout({
                equipmentId: item.id,
                ...formData,
                checkedOutAt: new Date().toISOString(),
              });
            }}
            disabled={!formData.checkedOutBy}
          >
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
