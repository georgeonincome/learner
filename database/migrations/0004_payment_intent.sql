-- M7: store the Stripe PaymentIntent id on the order so charge.refunded and
-- dispute events can reconcile the order without trusting client metadata.
ALTER TABLE orders ADD COLUMN payment_intent_id TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
