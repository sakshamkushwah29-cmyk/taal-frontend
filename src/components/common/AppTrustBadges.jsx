"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% safe checkout" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
];

export default function AppTrustBadges() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <badge.icon className="w-6 h-6 text-brand" strokeWidth={1.5} />
              <h3 className="font-semibold text-gray-900 text-sm">
                {badge.title}
              </h3>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
