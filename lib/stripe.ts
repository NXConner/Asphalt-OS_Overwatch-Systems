import Stripe from 'stripe';

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key, { apiVersion: '2024-06-20' });
  return client;
}

export async function createPaymentIntent(amountCents: number, currency = 'usd') {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe not configured');
  return stripe.paymentIntents.create({ amount: amountCents, currency, automatic_payment_methods: { enabled: true } });
}
