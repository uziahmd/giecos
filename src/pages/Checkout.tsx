import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Airwallex, { type Element } from 'airwallex-payment-elements';
import { useToast } from '@/hooks/use-toast';

const Checkout: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const intentId = params.get('id');
  const clientSecret = params.get('client_secret');
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<Element | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!intentId || !clientSecret || cardRef.current) return;
    Airwallex.loadAirwallex({ env: 'demo' }).then(() => {
      cardRef.current = Airwallex.createElement('card', {
        intent: { id: intentId, client_secret: clientSecret },
      });
      cardRef.current.mount(containerRef.current!);
    });
  }, [intentId, clientSecret]);

  if (!intentId || !clientSecret) {
    return <Navigate to="/cart" replace />;
  }

  const handlePay = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      await cardRef.current.confirm({
        intent_id: intentId,
        client_secret: clientSecret,
      });
      navigate('/success');
    } catch (err) {
      toast({ title: 'Payment failed', description: (err as Error).message });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - GIECOS SOLUTION</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-8">Checkout</h1>
        <div ref={containerRef} className="mb-6" />
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-homeglow-primary text-white py-3 rounded-md font-semibold hover:bg-homeglow-accent transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </>
  );
};

export default Checkout;
