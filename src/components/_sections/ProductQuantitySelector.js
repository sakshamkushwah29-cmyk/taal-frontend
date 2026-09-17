"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

export default function ProductQuantitySelector({
  quantity,
  setQuantity,
  selectedVariant,
}) {
  const inStock = selectedVariant?.inStock ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium">Quantity</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-lg border bg-gray-50 hover:bg-gray-100"
        >
          <Minus size={18} />
        </button>
        <span className="w-10 text-center font-medium">{quantity}</span>
        <button
          onClick={() =>
            setQuantity(inStock ? Math.min(quantity + 1, inStock) : quantity + 1)
          }
          className="w-10 h-10 flex items-center justify-center rounded-lg border bg-gray-50 hover:bg-gray-100"
        >
          <Plus size={18} />
        </button>
      </div>
      {inStock ? (
        <span className="text-sm text-green-600">{inStock} in stock</span>
      ) : (
        <span className="text-sm text-red-500">Out of stock</span>
      )}
    </div>
  );
}
