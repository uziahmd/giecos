import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, Clock } from 'lucide-react';

const HomeMinimal: React.FC = () => {
  console.log('HomeMinimal: Component rendering...');
  
  return (
    <div className="min-h-screen">
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
    </div>
  );
};

export default HomeMinimal;
