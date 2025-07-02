import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Product } from '@/lib/types';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery<Order[]>(
    ['/api/orders'],
    async () => {
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      return res.json();
    }
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-8">
        My Orders
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            return (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between flex-1">
                    <span>Order #{order.id.slice(0, 8)}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 text-right font-semibold">
                      Total: ${total.toFixed(2)}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default Orders;
