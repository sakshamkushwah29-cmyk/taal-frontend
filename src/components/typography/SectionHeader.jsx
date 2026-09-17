"use client";

import React from "react";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-12 h-[2px] bg-brand" />
    </div>
  );
}
