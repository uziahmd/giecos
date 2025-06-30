
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
  id: string;
  email: string;
  name: string;
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
