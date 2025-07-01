import React, { useState } from 'react';
import { Plus, Edit, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { fetcher } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProductModal from '@/components/ProductModal';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery<Product[]>(
    ['/api/products'],
    () => fetcher<Product[]>('/api/products')
  );
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      toast({ title: 'Product deleted!' });
      queryClient.invalidateQueries(['/api/products']);
    } else {
      toast({ title: 'Deletion failed', description: `${res.status}` });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-playfair font-bold text-homeglow-primary">
          Product Management
        </h1>
        <button
          onClick={handleAdd}
          className="bg-homeglow-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-homeglow-accent transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-homeglow-primary hover:text-homeglow-accent"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={editingProduct}
      />
    </div>
  );
};

export default Admin;
