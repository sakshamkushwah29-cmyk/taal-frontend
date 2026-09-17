"use client";

import React from "react";

export default function ProductPrice({ product, selectedVariant }) {
  const price = selectedVariant?.price || product?.price || 0;
  const mrp = selectedVariant?.mrp || product?.mrp || 0;
  const discount =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : null;

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-bold text-gray-900">
        ₹{price.toLocaleString("en-IN")}
      </span>
      {mrp > price && (
        <>
          <span className="text-base line-through text-gray-400">
            ₹{mrp.toLocaleString("en-IN")}
          </span>
          <span className="text-sm font-semibold text-brand">
            {discount}% OFF
          </span>
        </>
      )}
    </div>
  );
}
