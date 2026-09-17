"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function FestivalLoading() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-6 px-6 bg-white">
      <Loader2 className="w-8 h-8 text-brand animate-spin" />
      <p className="text-sm text-gray-500 tracking-wide">Loading...</p>
    </div>
  );
}
