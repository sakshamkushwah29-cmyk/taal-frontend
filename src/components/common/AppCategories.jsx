"use client";

import React from "react";
import {
  Shirt,
  Gem,
  Sparkles,
  Gift,
  Palette,
  LayoutGrid,
} from "lucide-react";
import SectionHeader from "../typography/SectionHeader";
import { useRouter } from "next/navigation";

export default function AppCategories() {
  const router = useRouter();

  const categories = [
    { name: "Traditional Wear", icon: Shirt },
    { name: "Jewellery", icon: Gem },
    { name: "Decor & Lights", icon: Sparkles },
    { name: "Gifting", icon: Gift },
    { name: "Accessories", icon: Palette },
    { name: "Festive Essentials", icon: LayoutGrid },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader title="Shop by Category" />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={() => router.push("/products")}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-brand group-hover:bg-brand/5 transition-all">
                <cat.icon size={24} className="text-gray-600 group-hover:text-brand transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center group-hover:text-brand transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
