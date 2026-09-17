"use client";

import React from "react";

export default function ProductVariantSelectors({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Colors */}
      {product?.availableColors?.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-3">
            Color{" "}
            {selectedColor && (
              <span className="text-gray-900 normal-case tracking-normal font-medium">
                — {selectedColor}
              </span>
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2.5 text-xs font-medium border transition-all
                  ${
                    selectedColor === color
                      ? "border-brand text-brand bg-brand/5"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product?.availableSizes?.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-3">
            Size{" "}
            {selectedSize && (
              <span className="text-gray-900 normal-case tracking-normal font-medium">
                — {selectedSize}
              </span>
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center text-xs font-medium border transition-all
                  ${
                    selectedSize === size
                      ? "border-brand text-brand bg-brand/5"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
