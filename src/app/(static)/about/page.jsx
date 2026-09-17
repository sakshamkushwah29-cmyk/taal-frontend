"use client";

import React from "react";
import {
  CalendarHeart,
  Store,
  Package,
  Headphones,
  BookOpen,
  Map,
} from "lucide-react";
import SectionHeader from "@/components/typography/SectionHeader";

// Simple reusable section heading for local sections
function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="text-orange-600 dark:text-yellow-300" size={24} />
      <h2 className="text-2xl font-semibold text-orange-600 dark:text-yellow-300">
        {title}
      </h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-[#1a120b] dark:to-[#2b1b12] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Title */}
        <SectionHeader
          title="About Us"
          icon={BookOpen}
          iconColor="text-orange-600 dark:text-yellow-300"
          gradientFrom="bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text"
          gradientTo="bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text"
        />

        {/* Intro */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
          Welcome to <strong>taal.live</strong> — where every celebration finds
          its perfect rhythm. We are India’s first platform dedicated to making
          festivals, events, and special occasions effortless, exciting, and
          unforgettable.
        </p>

        {/* Our Story */}
        <section className="mb-12">
          <SectionHeading icon={BookOpen} title="Our Story" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Like every Indian, we grew up surrounded by colors, lights, music,
            and traditions. But we also saw how stressful planning a celebration
            could be — finding reliable vendors, booking event spaces, renting
            decor, and shopping for festival essentials often felt like a
            never-ending checklist.
            <br />
            That’s when we decided to create <strong>taal.live</strong>, a
            one-stop destination where you can book events, rent items, and shop
            everything you need for your special moments — all in one place.
          </p>
        </section>

        {/* Our Journey */}
        <section className="mb-12">
          <SectionHeading icon={Map} title="Our Journey" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We started small — just helping friends and family organize Garba
            nights and Diwali parties. Soon, word spread, and we began
            connecting with local artisans, decor suppliers, event organizers,
            and performers across India.
            <br />
            Today, <strong>taal.live</strong> has grown into a trusted community
            that celebrates everything from traditional festivals to modern
            gatherings, all while supporting small businesses and keeping our
            cultural spirit alive.
          </p>
        </section>

        {/* What We Do */}
        <section>
          <SectionHeading icon={CalendarHeart} title="What We Do for You" />
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <CalendarHeart
                size={20}
                className="text-orange-600 dark:text-yellow-300 mt-1"
              />
              <span>
                <strong>Book Events:</strong> From Garba nights to Diwali melas,
                find and book upcoming celebrations near you.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Store
                size={20}
                className="text-orange-600 dark:text-yellow-300 mt-1"
              />
              <span>
                <strong>Festival Shop:</strong> Browse curated collections of
                decor, clothing, gifts, and essentials.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Package
                size={20}
                className="text-orange-600 dark:text-yellow-300 mt-1"
              />
              <span>
                <strong>Rent Items:</strong> Get beautiful decorations, sound
                systems, and furniture for your event without the hassle of
                buying.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Headphones
                size={20}
                className="text-orange-600 dark:text-yellow-300 mt-1"
              />
              <span>
                <strong>Personal Support:</strong> Our team helps you at every
                step so your celebration is smooth and stress-free.
              </span>
            </li>
          </ul>
        </section>

        {/* Closing Note */}
        <div className="mt-12 p-6 bg-orange-100 dark:bg-[#3a261a] rounded-lg shadow-md">
          <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
            At <strong>taal.live</strong>, we believe that every moment is worth
            celebrating — and we’re here to make it magical, memorable, and
            truly yours.
            <br />
            Let’s celebrate, together. ✨
          </p>
        </div>
      </div>
    </div>
  );
}
