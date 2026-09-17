"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../typography/SectionHeader";
import useAxios from "@/hooks/useAxios";
import LoadingDots from "./LoadingDots";
import ProductCard from "../_cards/ProductCard";

export default function AppFreshArrivals() {
  const { request: getProducts, loading } = useAxios();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const { data } = await getProducts({
          method: "GET",
          url: "/user/get-products",
          params: { sort: "newest", limit: 8 },
        });
        if (data?.success) {
          setProducts(data.data.items);
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals", err);
      }
    }
    fetchNewArrivals();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionHeader title="New Arrivals" />

        {loading ? (
          <LoadingDots dotClassName="bg-brand" />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {products.slice(0, 8).map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                href="/products?sort=newest"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-brand hover:text-brand-light transition-colors"
              >
                See All New Arrivals <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
