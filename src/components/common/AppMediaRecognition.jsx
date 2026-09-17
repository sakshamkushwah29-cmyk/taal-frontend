"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../typography/SectionHeader";
import { Megaphone } from "lucide-react";

export default function AppMediaRecognition() {
  const partners = [
    "Rolling Stone",
    "Times of India",
    "MTV Beats",
    "Radio Mirchi",
    "The Hindu",
    "Indian Express",
    "BBC Music",
    "VH1 India",
  ];

  // Duplicate list for seamless loop
  const repeatedPartners = [...partners, ...partners];

  return (
    <section className="relative py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <SectionHeader
          title="Media Recognition"
          icon={Megaphone}
          gradientFrom="from-blue-600"
          gradientTo="to-cyan-400"
          iconColor="text-blue-500 dark:text-blue-300"
        />

        {/* Scrolling marquee */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
          >
            {repeatedPartners.map((name, index) => (
              <span
                key={index}
                className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-300"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
