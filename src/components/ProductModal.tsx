import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

interface FormValues {
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  images: { value: string }[];
}

const defaultValues: FormValues = {
  name: '',
  price: 0,
  description: '',
  category: '',
  inStock: true,
  images: [{ value: '' }],
};

const ProductModal: React.FC<ProductModalProps> = ({ open, onOpenChange, product }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'images' });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        inStock: product.inStock,
        images: product.images.map((img) => ({ value: img })),
      });
    } else {
      reset(defaultValues);
    }
  }, [product, reset]);

  const submit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      price: Number(values.price),
      description: values.description,
      category: values.category,
      inStock: values.inStock,
      images: values.images.map((i) => i.value).filter(Boolean),
      slug: values.name.toLowerCase().replace(/\s+/g, '-'),
    };

    const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
      method: product ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast({ title: 'Error', description: `Request failed with status ${res.status}` });
      return;
    }

    onOpenChange(false);
    queryClient.invalidateQueries(['/api/products']);
    toast({
      title: product ? 'Product updated!' : 'Product added!',
      description: product
        ? 'The product has been successfully updated.'
        : 'The new product has been successfully added.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <Input {...register('name', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <Input type="number" step="0.01" {...register('price', { valueAsNumber: true, required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Input {...register('category', { required: true })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea rows={3} {...register('description', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center mb-2 gap-2">
                <Input type="url" placeholder="Image URL" {...register(`images.${index}.value` as const)} />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-900">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append({ value: '' })} className="text-homeglow-primary hover:text-homeglow-accent text-sm">
              + Add another image
            </button>
          </div>
          <label className="flex items-center space-x-2">
            <Checkbox {...register('inStock')} />
            <span>In Stock</span>
          </label>
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
