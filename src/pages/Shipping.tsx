import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { apiPost } from '@/lib/apiPost';
import { useToast } from '@/hooks/use-toast';
import type { ShippingData } from '@/lib/types';

const Shipping: React.FC = () => {
  const { items } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingData>({
    defaultValues: {
      orderNumber: '',
      firstName: '',
      lastName: '',
      phone: '',
      secondaryPhone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      instructions: '',
    },
  });

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const onSubmit = async (values: ShippingData) => {
    try {
      const intent = await apiPost<{ id: string; client_secret: string }>(
        '/api/checkout',
        {
          items: items.map((i) => ({ id: i.product.id, qty: i.quantity })),
          ...values,
        },
      );
      navigate(
        `/checkout?id=${encodeURIComponent(intent.id)}&client_secret=${encodeURIComponent(
          intent.client_secret,
        )}`,
      );
    } catch (err) {
      toast({ title: 'Checkout failed', description: (err as Error).message });
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-8">
        Shipping Information
      </h1>
      <div className="bg-white rounded-md shadow-md p-8 max-w-xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Order Number
            </label>
            <input id="orderNumber" type="text" {...register('orderNumber')} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input id="firstName" type="text" {...register('firstName')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input id="lastName" type="text" {...register('lastName')} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input id="phone" type="tel" {...register('phone')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Phone
              </label>
              <input id="secondaryPhone" type="tel" {...register('secondaryPhone')} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            <input id="address1" type="text" {...register('address1')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input id="address2" type="text" {...register('address2')} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input id="city" type="text" {...register('city')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input id="state" type="text" {...register('state')} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input id="postalCode" type="text" {...register('postalCode')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input id="country" type="text" {...register('country')} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Instructions
            </label>
            <textarea id="instructions" rows={3} {...register('instructions')} className={inputClass} />
          </div>
          <button type="submit" className="w-full bg-homeglow-primary text-white py-3 rounded-md font-semibold hover:bg-homeglow-accent transition-colors">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
