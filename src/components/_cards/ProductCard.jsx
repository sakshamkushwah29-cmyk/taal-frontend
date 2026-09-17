"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";

export default function ProductCard({ product, variant = "detailed" }) {
  const router = useRouter();
  const isDetailed = variant === "detailed";
  const [adding, setAdding] = useState(false);
  const { request: apiRequest } = useAxios();

  const price =
    product.minPrice === product.maxPrice
      ? `₹${product.minPrice?.toLocaleString("en-IN")}`
      : `₹${product.minPrice?.toLocaleString("en-IN")} – ₹${product.maxPrice?.toLocaleString("en-IN")}`;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);

    try {
      const { data: detailData, error: detailError } = await apiRequest({
        method: "GET",
        url: `/user/get-product-details?productId=${product._id}`,
      });

      if (detailError || !detailData?.data?.defaultVariantId) {
        showToast("error", "Could not load product details. Please try from the product page.");
        return;
      }

      const variantId = detailData.data.defaultVariantId;

      const { data, error } = await apiRequest({
        method: "POST",
        url: "/user/add-to-cart",
        payload: { productId: product._id, variantId, qty: 1 },
        authRequired: true,
      });

      if (error) {
        showToast("error", error);
        return;
      }

      if (data?.success) {
        showToast("success", "Added to cart!");
      }
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <Image
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.maxDiscountPct > 0 && (
          <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase">
            {Math.round(product.maxDiscountPct)}% Off
          </span>
        )}
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Sold Out</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="pt-3 pb-4 flex flex-col gap-1.5">
        <Link href={`/products/${product._id}`} onClick={(e) => e.stopPropagation()}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-brand transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm font-semibold text-gray-900">{price}</p>

        {isDetailed && product.totalStock > 0 && (
          <button
            disabled={adding}
            onClick={handleAddToCart}
            className="mt-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium tracking-wide uppercase border border-brand text-brand hover:bg-brand hover:text-white transition-colors"
          >
            {adding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingBag size={14} />
            )}
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
