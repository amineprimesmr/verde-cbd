-- Switch payment provider references from Stripe to Mollie (Stripe forbids CBD in production)

ALTER TABLE orders RENAME COLUMN stripe_payment_intent_id TO mollie_payment_id;
