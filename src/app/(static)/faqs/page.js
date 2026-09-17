"use client";

import React, { useState } from "react";
import {
  Info,
  ShoppingBag,
  CreditCard,
  Shield,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import SectionHeader from "@/components/typography/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "General",
    icon: Info,
    questions: [
      {
        q: "What is this platform about?",
        a: "We provide a wide range of products, rentals, and cultural events to help you celebrate traditions and festivals with ease.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "Yes, creating an account ensures a personalized experience, secure checkout, and easy tracking of your orders.",
      },
    ],
  },
  {
    category: "Orders",
    icon: ShoppingBag,
    questions: [
      {
        q: "How can I track my order?",
        a: "Once your order is placed, you can track it in your account dashboard under 'My Orders'.",
      },
      {
        q: "Can I cancel or modify my order?",
        a: "Yes, you can cancel or modify an order within 24 hours of placing it. After that, it depends on the order status.",
      },
    ],
  },
  {
    category: "Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit/debit cards, net banking, and wallets for a smooth checkout experience.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, we use industry-standard encryption and do not store your payment details.",
      },
    ],
  },
  {
    category: "Policies",
    icon: Shield,
    questions: [
      {
        q: "Do you have a return policy?",
        a: "Yes, we have a 7-day return policy for eligible products. Please check product details for specific rules.",
      },
      {
        q: "What if I receive a damaged item?",
        a: "If you receive a damaged product, please contact support within 48 hours for a free replacement or refund.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        className="w-full flex justify-between items-center text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition">
          {q}
        </span>
        <span className="text-indigo-600 dark:text-yellow-400 text-xl font-bold">
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [search, setSearch] = useState("");

  const activeFaqs =
    faqs.find((f) => f.category === activeCategory)?.questions || [];

  const filteredFaqs = activeFaqs.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="relative h-[350px] bg-[url('/images/faq/faq-hero.jpg')] bg-cover bg-center rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/80 to-purple-700/80" />
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            How can we help?
          </h1>
          <p className="max-w-2xl text-lg text-gray-200">
            Explore the most common queries or reach out to our support team.
          </p>
          <div className="mt-6 relative w-full max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none shadow-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {faqs.map((section, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(section.category)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-md transition ${
                activeCategory === section.category
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.category}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, idx) => (
              <FAQItem key={idx} q={item.q} a={item.a} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No results found.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-20 relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center text-white shadow-xl">
          <SectionHeader
            title="Still need help?"
            icon={MessageCircle}
            iconColor="text-white"
            gradientFrom="from-white"
            gradientTo="to-white"
          />
          <p className="max-w-xl mx-auto mb-6 text-gray-200">
            Couldn’t find what you were looking for? Our support team is always
            here to help.
          </p>
          <button className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow hover:opacity-90 transition flex items-center gap-2 mx-auto">
            <Phone className="w-5 h-5" /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
