import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface Order {
  id: string;
  total: number;
}

const Success: React.FC = () => {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    clearCart();

    const load = async () => {
      try {
        const res = await fetch('/api/orders/latest', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const total =
            data.total ??
            data.items?.reduce(
              (sum: number, item: { price: number; quantity: number }) =>
                sum + item.price * item.quantity,
              0,
            );
          setOrder({ id: data.id, total });
        }
      } catch {
        // ignore errors fetching optional order info
      }
    };

    load();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-4">
        Thank you for your purchase!
      </h1>
      {order ? (
        <p className="text-gray-600">
          Order ID: <strong>{order.id}</strong>
          <br />
          Total: ${order.total.toFixed(2)}
        </p>
      ) : (
        <p className="text-gray-600">Your order was placed successfully.</p>
      )}
    </div>
  );
};

export default Success;
