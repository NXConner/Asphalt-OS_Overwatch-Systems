"use client";
import { Button } from '@/components/ui/button';
import { apiPost } from '@/lib/api-client';
import { isEnabled } from '@/lib/flags';
import { toast } from 'sonner';

export function CheckoutButton({ amountCents = 5000 }: { amountCents?: number }) {
  const disabled = !isEnabled('stripe_payments');

  const checkout = async () => {
    try {
      const { clientSecret } = await apiPost('/api/stripe/create-intent', { amountCents, currency: 'usd' });
      toast.success('Payment intent created', { description: clientSecret ? 'Client secret received' : 'No client secret' });
    } catch (e: any) {
      toast.error(e.message || 'Payment failed');
    }
  };

  return (
    <Button onClick={checkout} disabled={disabled}>Create Payment Intent</Button>
  );
}
