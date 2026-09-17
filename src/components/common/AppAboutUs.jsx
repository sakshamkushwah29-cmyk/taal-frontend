"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "../typography/SectionHeader";

export default function AppAboutUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader title="Our Story" />

        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 overflow-hidden"
          >
            <img
              src="/assets/images/taal_home_about_us.jpg"
              alt="About Taal"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              <span className="font-semibold text-brand">Taal</span> started
              with a simple dream — to be your one-stop destination for
              everything festive. From premium traditional wear and handcrafted
              accessories to decor rentals and event bookings, we bring the
              spirit of Indian celebrations to your doorstep. What began as
              Ujjain&apos;s most loved Garba festival has grown into a complete
              festive marketplace, serving thousands of happy customers across
              India.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-sm font-semibold tracking-wide uppercase text-brand hover:text-brand-light transition-colors"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
