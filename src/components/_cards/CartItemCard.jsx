"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="flex gap-4 border border-gray-200 p-4">
      {/* Image */}
      <div className="relative w-20 h-24 shrink-0 overflow-hidden bg-gray-50">
        <Image
          src={item.variant.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.variant.color} / {item.variant.size}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-300 hover:text-brand transition-colors shrink-0 ml-2"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty Controls */}
          <div className="flex items-center gap-0">
            <button
              onClick={onDecrease}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-8 flex items-center justify-center border-y border-gray-200 text-xs font-medium">
              {item.qty}
            </span>
            <button
              onClick={onIncrease}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            >
              <Plus size={14} />
            </button>
          </div>

          <p className="text-sm font-semibold text-gray-900">
            ₹{(item.variant.sellPrice * item.qty).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}
