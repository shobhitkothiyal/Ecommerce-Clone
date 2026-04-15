import React from "react";

function ProductSkeleton() {
  return (
    <div className="group animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative mb-3 overflow-hidden aspect-3/4 bg-gray-200 rounded-md">
        {/* Optional: Add a subtle loading shimmer effect if needed */}
      </div>

      {/* Product Info Skeleton */}
      <div>
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Price & Discount */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>

        {/* Color Variants (Small Circles) */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 border border-transparent"></div>
          <div className="w-7 h-7 rounded-full bg-gray-200 border border-transparent"></div>
          <div className="w-7 h-7 rounded-full bg-gray-200 border border-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
