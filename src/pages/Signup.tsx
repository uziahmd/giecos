
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

const Signup: React.FC = () => {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otpValue, setOtpValue] = useState('');
  const { toast } = useToast();

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup API call
    console.log('Signup attempt:', formData);
    setStep('otp');
    toast({
      title: "Verification code sent!",
      description: "Check your email for the 6-digit verification code.",
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length === 6) {
      // Simulate OTP verification
      console.log('OTP verification:', otpValue);
      toast({
        title: "Account created successfully!",
          description: "Welcome to GIECOS SOLUTION.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-homeglow-bg">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-homeglow-primary">
            {step === 'signup' ? 'Create your account' : 'Verify your email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'signup' 
              ? 'Join GIECOS SOLUTION and start shopping'
              : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>
        
        <div className="bg-white rounded-md shadow-md p-8">
          {step === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-homeglow-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-homeglow-accent transition-colors"
              >
                Create Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  We've sent a verification code to<br />
                  <strong>{formData.email}</strong>
                </p>
                
                <div className="flex justify-center mb-6">
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
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
                disabled={otpValue.length !== 6}
                className="w-full bg-homeglow-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-homeglow-accent transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Verify & Create Account
              </button>

              <button
                type="button"
                onClick={() => setStep('signup')}
                className="w-full text-homeglow-primary hover:text-homeglow-accent text-sm"
              >
                Back to signup
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-homeglow-primary hover:text-homeglow-accent font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
