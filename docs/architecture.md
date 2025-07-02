# Architecture

## Stock Handling Transaction Flow

1. A customer posts cart items to `/api/checkout`.
2. The API verifies each item's stock before creating a `PENDING` order and Airwallex payment intent.
3. When the `payment_intent.succeeded` webhook fires, the server runs a Prisma transaction:
   - Update the order status to `PAID` and include associated items and user.
   - Decrease the `stock` field of each purchased product accordingly.
4. After the transaction commits an order receipt email is sent.

This ensures product quantities remain consistent even if webhook processing fails or multiple items are purchased.
