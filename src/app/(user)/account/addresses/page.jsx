"use client";

import React from "react";
import { Home } from "lucide-react";
import SectionHeader from "@/components/typography/SectionHeader";
import AddressList from "@/components/_sections/AddressList";

function MyAddressesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center mb-14">
        <SectionHeader
          title="My Addresses"
          icon={Home}
          iconColor={"text-purple-600 dark:text-purple-400"}
          gradientFrom={"from-purple-500"}
          gradientTo={"to-pink-500"}
        />
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Manage your addresses and ensure accurate delivery.
        </p>
      </div>

      {/* Address List (reusable) */}
      <AddressList mode="view" />
      {/*
        🔹 if you want selection version:
        <AddressList mode="selectable" onSelect={(addr) => console.log(addr)} />
      */}
    </div>
  );
}

export default MyAddressesPage;
