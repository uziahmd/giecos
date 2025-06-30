
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';
import { getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateQuantity as updateQuantityUtil } from '@/lib/cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    const updatedCart = addToCartUtil(product, quantity);
    setItems(updatedCart);
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = removeFromCartUtil(productId);
    setItems(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = updateQuantityUtil(productId, quantity);
    setItems(updatedCart);
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('homeglow_cart');
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
