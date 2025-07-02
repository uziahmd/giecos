
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/apiPost';
import { useAuth } from '@/contexts/AuthContext';

const Signup: React.FC = () => {
  type FormValues = {
    name: string;
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', email: '', password: '' },
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (values: FormValues) => {
    try {
      await apiPost('/api/signup', values);
      const me = await fetch('/api/me', { credentials: 'include' });
      if (me.ok) {
        setUser(await me.json());
      }
      toast({
        title: 'Verification code sent!',
        description: 'Check your email for the 6-digit verification code.',
      });
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      toast({ title: 'Signup failed', description: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-homeglow-bg">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-homeglow-primary">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join GIECOS SOLUTION and start shopping
          </p>
        </div>

        <div className="bg-white rounded-md shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /.+@.+\..+/, message: 'Invalid email' },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-homeglow-primary focus:border-transparent"
                />
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-homeglow-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-homeglow-accent transition-colors"
              >
                Create Account
              </button>
            </form>

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
