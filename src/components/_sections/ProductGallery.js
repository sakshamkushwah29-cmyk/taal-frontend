"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductGallery({
  product,
  selectedColor,
  selectedVariant,
  onColorSelect,
}) {
  const colorImages = product?.matrix?.[selectedColor]?.images || [];
  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : colorImages.length
      ? colorImages
      : product?.images || [];

  const [activeImage, setActiveImage] = useState(images[0] || null);

  useEffect(() => {
    setActiveImage(images[0] || null);
  }, [selectedVariant, selectedColor]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3">
      {/* Thumbnails - vertical strip on desktop, horizontal on mobile */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`relative w-16 h-16 lg:w-[72px] lg:h-[72px] shrink-0 border transition-all
                ${
                  activeImage === img
                    ? "border-brand opacity-100"
                    : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              onClick={() => setActiveImage(img)}
            >
              <Image
                src={img}
                alt={`${product?.title || "Product"} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={product?.title || "Product"}
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            No Image Available
          </div>
        )}
      </div>
    </div>
  );
}
