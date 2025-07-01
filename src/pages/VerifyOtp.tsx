import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/apiPost';
import { useAuth } from '@/contexts/AuthContext';

const VerifyOtp: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const email = params.get('email') || '';
  const [code, setCode] = useState('');
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('/api/otp/verify', { email, code });
      const me = await fetch('/api/me', { credentials: 'include' });
      if (me.ok) {
        setUser(await me.json());
      }
      toast({
        title: 'Account verified!',
        description: 'Welcome to GIECOS SOLUTION.',
      });
      navigate('/');
    } catch (err) {
      toast({ title: 'Verification failed', description: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-homeglow-bg">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-homeglow-primary">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <div className="bg-white rounded-md shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                We've sent a verification code to<br />
                <strong>{email}</strong>
              </p>
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <button
              type="submit"
              disabled={code.length !== 6}
              className="w-full bg-homeglow-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-homeglow-accent transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Verify Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
