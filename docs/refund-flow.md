# Refund Flow

1. Admin triggers `POST /api/orders/:id/refund`.
2. The API calls Airwallex to refund the related payment intent.
3. Product stock is incremented and the order status set to `REFUNDED` in a single transaction when the refund webhook confirms success.
4. The UI refreshes order data after the refund completes.
