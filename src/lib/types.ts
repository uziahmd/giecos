
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  inStock: boolean;
  category: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  isAdmin: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface AuthForm {
  email: string;
  password: string;
  name?: string;
}
