
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getCartItemCount } from '@/lib/cart';

const Header: React.FC = () => {
  const { items, setIsDrawerOpen } = useCart();
  const itemCount = getCartItemCount(items);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-playfair font-bold text-homeglow-primary">
            GIECOS SOLUTION
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/shop" className="text-gray-700 hover:text-homeglow-primary transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-homeglow-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-homeglow-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Sign In Button */}
            <Link 
              to="/login" 
              className="flex items-center space-x-1 text-gray-700 hover:text-homeglow-primary transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-gray-700 hover:text-homeglow-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-homeglow-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 flex space-x-4">
          <Link to="/shop" className="text-gray-700 hover:text-homeglow-primary transition-colors text-sm">
            Shop
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-homeglow-primary transition-colors text-sm">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-homeglow-primary transition-colors text-sm">
            Contact
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-homeglow-primary transition-colors text-sm">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
