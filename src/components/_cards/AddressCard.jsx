"use client";

import { MapPin, Phone, Edit, Trash2, CheckCircle2, User } from "lucide-react";

export default function AddressCard({ address, onEdit, onDelete }) {
  return (
    <div className="relative border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <span className="inline-block text-[10px] px-2 py-0.5 font-semibold tracking-wider uppercase bg-gray-100 text-gray-600">
            {address.label}
          </span>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">{address.fullName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {address.isDefault && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-brand/10 text-brand font-semibold tracking-wide uppercase">
              <CheckCircle2 className="w-3 h-3" /> Default
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 text-gray-400 hover:text-brand transition-colors"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Phone className="w-3.5 h-3.5 text-gray-400" />
        <span>{address.phone}</span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
        <span>
          {address.line1}
          {address.line2 && `, ${address.line2}`}, {address.city},{" "}
          {address.state} – {address.pincode}, {address.country}
        </span>
      </div>
    </div>
  );
}
