"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RentalProductCard({ item }) {
  const router = useRouter();

  const price =
    item.minPrice === item.maxPrice
      ? `₹${item.minPrice?.toLocaleString("en-IN")}`
      : `₹${item.minPrice?.toLocaleString("en-IN")} – ₹${item.maxPrice?.toLocaleString("en-IN")}`;

  return (
    <div
      className="group relative flex flex-col bg-white cursor-pointer"
      onClick={() => router.push(`/rentals/${item._id}`)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <Image
          src={item.thumbnail || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.maxDiscountPct > 0 && (
          <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase">
            {Math.round(item.maxDiscountPct)}% Off
          </span>
        )}
        {item.totalStock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 pb-4 flex flex-col gap-1.5">
        <Link href={`/rentals/${item._id}`} onClick={(e) => e.stopPropagation()}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-brand transition-colors">
            {item.title}
          </h3>
        </Link>

        <p className="text-sm font-semibold text-gray-900">{price}</p>

        {item.totalStock > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/rentals/${item._id}`);
            }}
            className="mt-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium tracking-wide uppercase border border-brand text-brand hover:bg-brand hover:text-white transition-colors"
          >
            Rent Now
          </button>
        )}
      </div>
    </div>
  );
}
