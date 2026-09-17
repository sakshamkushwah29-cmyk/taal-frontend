"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AppPromoBanner() {
  return (
    <section className="py-4 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-brand p-10 md:p-16"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Festive Season Sale
              </h2>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Get up to 40% off on traditional wear, accessories, and festive
                decor. Limited time only.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand text-sm font-semibold tracking-wide uppercase hover:bg-gray-100 transition-colors"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                href="/rentals"
                className="inline-flex items-center gap-2 px-8 py-3 border border-white/40 text-white text-sm font-semibold tracking-wide uppercase hover:bg-white/10 transition-colors"
              >
                Explore Rentals
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
