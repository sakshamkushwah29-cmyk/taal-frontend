"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "/assets/images/taal_home_banner.png",
    title: "Your Festival, Your Style",
    subtitle: "Shop traditional wear, accessories & festive decor",
    cta: "Shop Now",
    href: "/products",
  },
];

export default function AppCarousal() {
  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect="fade"
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand/60 to-transparent" />

              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="max-w-xl"
                  >
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-white/85 max-w-md drop-shadow">
                      {slide.subtitle}
                    </p>
                    <Link href={slide.href}>
                      <button className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-white text-brand font-semibold hover:bg-gray-100 transition-colors text-sm tracking-wide uppercase shadow-lg">
                        {slide.cta} <ArrowRight size={16} />
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
