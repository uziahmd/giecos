import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-md shadow-md overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  </div>
)

export default ProductCardSkeleton
