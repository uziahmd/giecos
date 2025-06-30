
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';
import type { Product } from '@/lib/types';

const TrendingSection: React.FC = () => {
  const { data: products = [], isLoading } = useQuery<Product[]>(
    ['/api/products'],
    () => fetcher<Product[]>('/api/products')
  );

  const trendingProducts = products.slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-homeglow-primary mb-4">
            Trending Now
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular appliances that are making homes more efficient and beautiful
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingProducts.map((product) => (
            <div key={product.id} className="group">
              <Link to={`/product/${product.slug}`} className="block">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-homeglow-primary text-white px-3 py-1 text-sm rounded-full">
                      Trending
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-homeglow-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block bg-homeglow-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-homeglow-accent transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
