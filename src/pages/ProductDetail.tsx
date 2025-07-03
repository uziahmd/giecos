import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Navigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => fetcher<Product[]>("/api/products"),
    retry: 1
  });

  const product = products.find((p) => p.slug === slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} - GIECOS SOLUTION`}</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square mb-4 overflow-hidden rounded-md">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 overflow-hidden rounded border-2 ${
                      selectedImage === index
                        ? "border-homeglow-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-playfair font-bold text-homeglow-primary mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-homeglow-primary">
                ${product.price.toFixed(2)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                In Stock: {product.stock}
              </span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                product.stock > 0
                  ? "bg-homeglow-primary text-white hover:bg-homeglow-accent"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Product Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold mb-4">Product Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Premium quality materials</li>
                <li>• 2-year manufacturer warranty</li>
                <li>• Free shipping on orders over $200</li>
                <li>• 30-day return policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
