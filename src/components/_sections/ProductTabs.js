"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const sections = [
  { key: "details", label: "Product Details" },
  { key: "tags", label: "Tags" },
  { key: "shipping", label: "Shipping & Returns" },
];

export default function ProductTabs({ product }) {
  const [openSection, setOpenSection] = useState("details");

  const toggle = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const getContent = (key) => {
    switch (key) {
      case "details":
        return product?.description || "No description available.";
      case "tags":
        return product?.tags?.length
          ? product.tags.join(", ")
          : "No tags available.";
      case "shipping":
        return (
          product?.shippingInfo || "Standard shipping within 5–7 business days. Free shipping on orders above ₹2000. Easy returns within 7 days of delivery."
        );
      default:
        return null;
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {sections.map((section) => {
        const isOpen = openSection === section.key;
        return (
          <div key={section.key}>
            <button
              onClick={() => toggle(section.key)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">
                {section.label}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                {getContent(section.key)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
