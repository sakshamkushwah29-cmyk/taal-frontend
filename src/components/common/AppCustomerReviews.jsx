"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../typography/SectionHeader";

export default function AppCustomerReviews() {
  const reviews = [
    {
      text: "Amazing quality chaniya choli! The fabric and mirror work are stunning. Will definitely order again.",
      name: "Priya S.",
    },
    {
      text: "Rented decor for our Diwali party — everything arrived on time and looked gorgeous. Highly recommend!",
      name: "Rahul M.",
    },
    {
      text: "Fast delivery, great packaging, and the dandiya sticks were exactly as shown. Love shopping here!",
      name: "Neha P.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionHeader title="What Our Customers Say" />

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 p-8 flex flex-col justify-between"
            >
              <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
                {review.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
