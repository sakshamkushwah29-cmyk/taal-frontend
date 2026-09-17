"use client";

import React, { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import SectionHeader from "@/components/typography/SectionHeader";
import useAxios from "@/hooks/useAxios";
import FestivalLoading from "@/components/common/FestivalLoading";
import RentalProductCard from "@/components/_cards/RentalProductCard";

export default function RentalsPage() {
  const { request: fetchRentals, loading, error } = useAxios();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    async function loadRentals() {
      const { data } = await fetchRentals({
        url: "/user/get-rent-products",
        method: "GET",
        authRequired: false,
      });
      if (data?.data?.items) {
        setRentals(data.data.items);
      }
    }
    loadRentals();
  }, []);

  if (loading && rentals.length === 0) return <FestivalLoading />;
  if (error) return <p>Error loading rentals</p>;

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <SectionHeader
            title="Festive Rentals Collection"
            icon={Tag}
            iconColor="text-indigo-600 dark:text-yellow-400"
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-500"
          />
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From Garba nights to Diwali parties and Holi celebrations — rent
            dresses, dandiya, décor, and more. Celebrate in style without the
            heavy costs!
          </p>
        </div>

        {rentals.length === 0 && !loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No rentals available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-5 lg:mx-16">
            {rentals.map((item) => (
              <RentalProductCard key={item._id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Planning a big festive event?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We offer bulk rentals and custom festive packages for societies,
            colleges, and parties. Make your celebration unforgettable!
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:opacity-90 transition rounded-lg">
            Get a Custom Package
          </button>
        </div>
      </div>
    </div>
  );
}
