export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  /**
   * Current inventory quantity for this product
   */
  stock: number;
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

export interface ShippingData {
  orderNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  secondaryPhone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  instructions?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  // Shipping fields
  orderNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  secondaryPhone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  instructions?: string;
}
