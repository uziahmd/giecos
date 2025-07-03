import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface Order {
  id: string;
  orderNumber?: string;
  total: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  secondaryPhone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  instructions?: string;
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
          setOrder({
            id: data.id,
            orderNumber: data.orderNumber,
            total,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
            instructions: data.instructions,
          });
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
        <div className="text-gray-600 space-y-2">
          <p>
            Order #: <strong>{order.orderNumber ?? order.id}</strong>
          </p>
          <p>Total: ${order.total.toFixed(2)}</p>
          {(order.firstName || order.address1) && (
            <div className="mt-4 space-y-1">
              {order.firstName && (
                <p>
                  {order.firstName} {order.lastName}
                </p>
              )}
              {order.address1 && <p>{order.address1}</p>}
              {order.address2 && <p>{order.address2}</p>}
              <p>
                {order.city} {order.state} {order.postalCode}
              </p>
              <p>{order.country}</p>
              {order.instructions && <p>Instructions: {order.instructions}</p>}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Your order was placed successfully.</p>
      )}
    </div>
  );
};

export default Success;
