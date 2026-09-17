"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const offers = [
  { text: "Free Shipping on orders above ₹999", link: "/products" },
  { text: "New Arrivals — Shop the latest festive collection", link: "/products" },
  { text: "Rent premium decor & outfits for your next event", link: "/rentals" },
];

function TopHeaderStrip() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const nextOffer = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % offers.length);
      setFade(true);
    }, 200);
  };

  const prevOffer = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + offers.length) % offers.length);
      setFade(true);
    }, 200);
  };

  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(nextOffer, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand text-white text-sm py-2 relative">
      <div className="container mx-auto flex items-center justify-center relative">
        {/* Prev Button - fixed left */}
        <button
          onClick={prevOffer}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Centered Offer Text with Fade */}
        <Link
          href={offers[index].link}
          className={`transition-opacity duration-300 text-center hover:text-yellow-300 px-12 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {offers[index].text}
        </Link>

        {/* Next Button - fixed right */}
        <button
          onClick={nextOffer}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TopHeaderStrip;
