import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const prefetch = () => {
    fetch(`/product/${product.slug}`).catch(() => {});
  };
  return (
    <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product.slug}`} onMouseEnter={prefetch}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-homeglow-primary">
              ${product.price.toFixed(2)}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              In Stock: {product.stock}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
