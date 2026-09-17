"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../typography/SectionHeader";

export default function AppSponsors() {
  const sponsors = [
    "/assets/sponsors/1.png",
    "/assets/sponsors/2.png",
    "/assets/sponsors/3.png",
    "/assets/sponsors/4.png",
    "/assets/sponsors/5.png",
    "/assets/sponsors/6.png",
    "/assets/sponsors/7.png",
    "/assets/sponsors/8.png",
    "/assets/sponsors/9.png",
    "/assets/sponsors/10.png",
    "/assets/sponsors/11.png",
    "/assets/sponsors/12.png",
    "/assets/sponsors/13.png",
    "/assets/sponsors/14.png",
    "/assets/sponsors/15.png",
    "/assets/sponsors/16.png",
    "/assets/sponsors/17.png",
    "/assets/sponsors/18.png",
  ];

  const marqueeStrip = [...sponsors, ...sponsors];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeader title="Our Partners" />
      </div>

      <div className="relative overflow-hidden mt-4">
        <motion.div
          className="flex min-w-max items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {marqueeStrip.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Partner ${(i % sponsors.length) + 1}`}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain mx-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
