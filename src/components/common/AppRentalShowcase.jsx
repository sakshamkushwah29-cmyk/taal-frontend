"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../typography/SectionHeader";
import useAxios from "@/hooks/useAxios";
import LoadingDots from "./LoadingDots";

export default function AppRentalShowcase() {
  const { request: getRentals, loading } = useAxios();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    async function fetchRentals() {
      try {
        const { data } = await getRentals({
          method: "GET",
          url: "/user/get-rent-products",
          params: { limit: 4 },
        });
        if (data?.success) {
          setRentals(data.data?.items ?? data.data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch rentals", err);
      }
    }
    fetchRentals();
  }, []);

  if (!loading && rentals.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader
          title="Rent for Your Event"
          subtitle="Premium decor, outfits & event supplies — rent and return hassle-free"
        />

        {loading ? (
          <LoadingDots dotClassName="bg-brand" />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {rentals.slice(0, 4).map((item) => (
                <Link key={item._id} href={`/rentals/${item._id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
                      <Image
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 bg-brand text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase">
                        ₹{item.rentPricePerDay}/day
                      </span>
                    </div>
                    <div className="pt-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-brand transition-colors">
                        {item.title}
                      </h3>
                      {item.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {item.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                href="/rentals"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-brand hover:text-brand-light transition-colors"
              >
                Browse All Rentals <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
