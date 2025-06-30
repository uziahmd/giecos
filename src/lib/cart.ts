
import { CartItem, Product } from './types';

const CART_KEY = 'homeglow_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (product: Product, quantity: number = 1): CartItem[] => {
  const currentCart = getCart();
  const existingItem = currentCart.find(item => item.product.id === product.id);
  
  let updatedCart: CartItem[];
  if (existingItem) {
    updatedCart = currentCart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    updatedCart = [...currentCart, { product, quantity }];
  }
  
  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const currentCart = getCart();
  const updatedCart = currentCart.filter(item => item.product.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const updateQuantity = (productId: string, quantity: number): CartItem[] => {
  const currentCart = getCart();
  const updatedCart = currentCart.map(item =>
    item.product.id === productId
      ? { ...item, quantity: Math.max(0, quantity) }
      : item
  ).filter(item => item.quantity > 0);
  
  saveCart(updatedCart);
  return updatedCart;
};

export const getCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};
