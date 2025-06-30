
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PromoBanner from '@/components/PromoBanner';
import TrendingSection from '@/components/TrendingSection';
import FeaturedCollection from '@/components/FeaturedCollection';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for subscribing!",
        description: "You'll receive our latest updates and offers.",
      });
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-homeglow-primary to-homeglow-accent text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              Premium Home Appliances for Modern Living
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Transform your home with our carefully curated collection of premium appliances that combine style, efficiency, and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="bg-white text-homeglow-primary px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-block text-center text-lg"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-homeglow-primary transition-colors inline-block text-center text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <TrendingSection />

      {/* Featured Collections */}
      <FeaturedCollection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-homeglow-primary mb-4">
              Why Choose GIECOS SOLUTION?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and premium products for your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-homeglow-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-homeglow-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Fast & Free Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Free shipping on orders over $200. Quick and reliable delivery to your door with tracking updates.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-homeglow-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-homeglow-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">Your payment information is protected with bank-level security and encrypted transactions.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-homeglow-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-homeglow-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">Our customer service team is here to help you anytime, anywhere with expert guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-homeglow-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive offers, and home improvement tips delivered to your inbox
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-homeglow-accent"
              required
            />
            <button
              type="submit"
              className="bg-homeglow-accent hover:bg-opacity-90 px-6 py-3 rounded-md font-semibold transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
