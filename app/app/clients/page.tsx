
'use client';

import { ClientsList } from '@/components/clients/clients-list';

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground mt-2">
          Manage your client database, track relationships, and view client history.
        </p>
      </div>
      
      <ClientsList />
    </div>
  );
}
