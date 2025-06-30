
import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-homeglow-primary to-homeglow-accent text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              🚚 Free shipping on orders over $200
            </span>
            <span className="hidden md:block text-sm opacity-75">|</span>
            <span className="hidden md:block text-sm font-medium">
              ⚡ Fast delivery nationwide
            </span>
            <Link 
              to="/shop" 
              className="ml-4 bg-white text-homeglow-primary px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
