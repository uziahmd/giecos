
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getCartTotal } from '@/lib/cart';
import { apiPost } from '@/lib/apiPost';
import { useToast } from '@/hooks/use-toast';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const total = getCartTotal(items);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      const session = await apiPost<{ url: string }>('/api/checkout', {
        items: items.map((i) => ({ id: i.product.id, qty: i.quantity })),
      });
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      toast({
        title: 'Checkout failed',
        description: (err as Error).message,
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/shop"
          className="bg-homeglow-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-homeglow-accent transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    loading="lazy"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-homeglow-primary font-bold">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-md shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-homeglow-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-homeglow-primary text-white py-3 rounded-md font-semibold hover:bg-homeglow-accent transition-colors mb-4"
            >
              Proceed to Checkout
            </button>
            
            <Link
              to="/shop"
              className="block text-center text-homeglow-primary hover:text-homeglow-accent transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
