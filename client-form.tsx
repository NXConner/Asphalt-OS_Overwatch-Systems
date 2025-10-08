
'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

interface ClientFormProps {
  client?: any;
  onSuccess?: (client: any) => void;
  onCancel?: () => void;
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    businessType: 'COMMERCIAL',
    taxId: '',
    preferredContact: 'EMAIL',
    notes: '',
    rating: 0,
    creditLimit: 0,
    paymentTerms: 'NET_30',
    isActive: true,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        companyName: client.companyName || '',
        contactName: client.contactName || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        businessType: client.businessType || 'COMMERCIAL',
        taxId: client.taxId || '',
        preferredContact: client.preferredContact || 'EMAIL',
        notes: client.notes || '',
        rating: client.rating || 0,
        creditLimit: client.creditLimit || 0,
        paymentTerms: client.paymentTerms || 'NET_30',
        isActive: client.isActive !== undefined ? client.isActive : true,
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = client ? `/api/clients/${client.id}` : '/api/clients';
      const method = client ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save client');
      }

      const savedClient = await response.json();
      toast.success(client ? 'Client updated successfully' : 'Client created successfully');
      
      if (onSuccess) {
        onSuccess(savedClient);
      }
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast.error(error.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Information */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4">Company Information</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name *</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Address Information */}
        <div className="col-span-2 mt-4">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          />
        </div>

        {/* Business Details */}
        <div className="col-span-2 mt-4">
          <h3 className="text-lg font-semibold mb-4">Business Details</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <Select
            value={formData.businessType}
            onValueChange={(value) => setFormData({ ...formData, businessType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
              <SelectItem value="RESIDENTIAL">Residential</SelectItem>
              <SelectItem value="GOVERNMENT">Government</SelectItem>
              <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredContact">Preferred Contact Method</Label>
          <Select
            value={formData.preferredContact}
            onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="PHONE">Phone</SelectItem>
              <SelectItem value="TEXT">Text/SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Financial Terms */}
        <div className="col-span-2 mt-4">
          <h3 className="text-lg font-semibold mb-4">Financial Terms</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit ($)</Label>
          <Input
            id="creditLimit"
            type="number"
            min="0"
            step="0.01"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select
            value={formData.paymentTerms}
            onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COD">Cash on Delivery</SelectItem>
              <SelectItem value="NET_15">Net 15</SelectItem>
              <SelectItem value="NET_30">Net 30</SelectItem>
              <SelectItem value="NET_60">Net 60</SelectItem>
              <SelectItem value="NET_90">Net 90</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Status */}
        <div className="col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="isActive">Active Client</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  );
}
