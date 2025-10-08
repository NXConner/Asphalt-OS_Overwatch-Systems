
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from './client-form';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';

export function ClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/clients?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch clients');

      const data = await response.json();
      setClients(data);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete client');

      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedClient(null);
    fetchClients();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Clients Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No clients found. Create your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.companyName}</TableCell>
                  <TableCell>{client.contactName}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                      )}
                      {client.city && client.state && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {client.city}, {client.state}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.businessType || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{client._count?.jobs || 0}</TableCell>
                  <TableCell>
                    {client.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedClient ? 'Edit Client' : 'Create New Client'}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            client={selectedClient}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
