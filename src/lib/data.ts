
import { Product } from './types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Maker',
    price: 299.99,
    description: 'Professional-grade coffee maker with built-in grinder and programmable settings. Perfect for coffee enthusiasts who demand the best.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
    ],
    inStock: true,
    category: 'Kitchen',
    slug: 'premium-coffee-maker'
  },
  {
    id: '2',
    name: 'Smart Air Purifier',
    price: 199.99,
    description: 'Advanced HEPA filtration system with smart connectivity. Monitor and control air quality from your smartphone.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
    ],
    inStock: true,
    category: 'Home',
    slug: 'smart-air-purifier'
  },
  {
    id: '3',
    name: 'Deluxe Stand Mixer',
    price: 449.99,
    description: 'Heavy-duty stand mixer with multiple attachments. Perfect for baking enthusiasts and professional chefs.',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop',
    ],
    inStock: false,
    category: 'Kitchen',
    slug: 'deluxe-stand-mixer'
  }
];
