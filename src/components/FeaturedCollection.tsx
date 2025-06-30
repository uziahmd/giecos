
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedCollection: React.FC = () => {
  const collections = [
    {
      title: "Kitchen Essentials",
      description: "Transform your cooking experience with premium kitchen appliances",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      link: "/shop?category=kitchen"
    },
    {
      title: "Smart Home",
      description: "Upgrade to intelligent appliances for modern living",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      link: "/shop?category=home"
    }
  ];

  return (
    <section className="py-16 bg-homeglow-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-homeglow-primary mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated collections of premium appliances for every room in your home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <Link to={collection.link} className="block">
                <div className="relative h-80">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                    <div>
                      <h3 className="text-2xl font-playfair font-bold mb-3">
                        {collection.title}
                      </h3>
                      <p className="text-lg mb-4 opacity-90">
                        {collection.description}
                      </p>
                      <span className="inline-block bg-white text-homeglow-primary px-6 py-2 rounded-md font-semibold group-hover:bg-homeglow-accent group-hover:text-white transition-colors">
                        Explore Collection
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
