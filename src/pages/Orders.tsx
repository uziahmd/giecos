import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Order } from '@/lib/types';

const Orders: React.FC = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('401 error, Please Log in');
        }
        throw new Error('Failed to fetch orders');
      }
      return res.json();
    },
    retry: 1
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading orders: {error.message}
        </div>
      </div>
    );
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
            const statusClass =
              order.status === 'PAID'
                ? 'bg-green-100 text-green-800'
                : order.status === 'CANCELLED'
                ? 'bg-gray-100 text-gray-800'
                : order.status === 'REFUNDED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800';
            return (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between flex-1 gap-2">
                    <div className="flex flex-col text-left">
                      <span>Order #{order.orderNumber || order.id.slice(0, 8)}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
                      {order.status}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Items:</h4>
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

                    {/* Shipping Information */}
                    {(order.firstName || order.address1) && (
                      <div className="space-y-2 border-t pt-4">
                        <h4 className="font-semibold">Shipping Information:</h4>
                        <div className="text-sm space-y-1">
                          {order.firstName && (
                            <div>
                              <strong>Name:</strong> {order.firstName} {order.lastName}
                            </div>
                          )}
                          {order.phone && (
                            <div>
                              <strong>Phone:</strong> {order.phone}
                            </div>
                          )}
                          {order.secondaryPhone && (
                            <div>
                              <strong>Secondary Phone:</strong> {order.secondaryPhone}
                            </div>
                          )}
                          {order.address1 && (
                            <div>
                              <strong>Address:</strong> {order.address1}
                              {order.address2 && <span>, {order.address2}</span>}
                            </div>
                          )}
                          {order.city && (
                            <div>
                              <strong>City:</strong> {order.city}
                              {order.state && <span>, {order.state}</span>}
                              {order.postalCode && <span> {order.postalCode}</span>}
                            </div>
                          )}
                          {order.country && (
                            <div>
                              <strong>Country:</strong> {order.country}
                            </div>
                          )}
                          {order.instructions && (
                            <div>
                              <strong>Instructions:</strong> {order.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
