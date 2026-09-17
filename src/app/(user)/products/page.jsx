"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tag } from "lucide-react";
import SectionHeader from "@/components/typography/SectionHeader";
import useAxios from "@/hooks/useAxios";
import FestivalLoading from "@/components/common/FestivalLoading";
import ProductCard from "@/components/_cards/ProductCard";

export default function ProductsPage() {
  const { request: getSaleProducts, loading, error } = useAxios();
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await getSaleProducts({
        method: "GET",
        url: "/user/get-products",
        params: q ? { q } : undefined,
      });
      if (data?.success) {
        setProducts(data.data.items);
      }
    }
    fetchProducts();
  }, [q]);

  if (loading && products.length === 0) return <FestivalLoading />;
  if (error) return <p>Error loading products</p>;

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <SectionHeader
            title={q ? `Search results for "${q}"` : "Our Product Collection"}
            icon={Tag}
            iconColor="text-indigo-600 dark:text-yellow-400"
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-500"
          />
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {q
              ? `Showing products matching your search.`
              : "Discover premium handcrafted, eco-friendly, and festive products to light up your celebrations and everyday lifestyle."}
          </p>
        </div>

        {products.length === 0 && !loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {q
              ? `No products found for "${q}".`
              : "No products available at the moment."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-5 lg:mx-16">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Want exclusive offers?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Subscribe now to get the latest arrivals, festive deals, and special
            discounts.
          </p>
          <button className="px-8 h-11 bg-brand text-white text-sm font-semibold tracking-wide uppercase shadow hover:bg-brand-light transition-colors">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}
