"use client";

import {
  MapPin,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Clock,
} from "lucide-react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

function BookingCard({ booking }) {
  const router = useRouter();
  const {
    event,
    eventSession,
    attendeeDetails,
    totalAmount,
    paymentStatus,
    ticketStatus,
    currency,
  } = booking;

  // ✅ Status color mapping
  const paymentColor =
    paymentStatus === "paid"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  const ticketColor =
    ticketStatus === "confirmed"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all p-6 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      onClick={() => router.push(`/account/my-bookings/${booking._id}`)}
    >
      {/* Hover accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Event Title */}
      <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent line-clamp-1">
        {event.title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
        {event.venueName}
      </p>

      {/* Session Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
          {dayjs(eventSession.date).format("ddd, MMM D, YYYY")} •{" "}
          {eventSession.startTime} - {eventSession.endTime}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="line-clamp-1">
            {event.address.address}, {event.address.city}
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 my-4" />

      {/* Attendees */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Attendees
        </h3>
        <div className="flex flex-wrap gap-2 max-h-16 overflow-hidden">
          {attendeeDetails.slice(0, 3).map((attendee, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300"
            >
              <User className="w-3.5 h-3.5" /> {attendee.name}
            </span>
          ))}
          {attendeeDetails.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{attendeeDetails.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 my-4" />

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {currency} {totalAmount}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${paymentColor}`}
          >
            <CreditCard className="w-3.5 h-3.5" /> {paymentStatus}
          </span>
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${ticketColor}`}
          >
            {ticketStatus === "confirmed" ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {ticketStatus}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ✅ Memoized for perf (only re-renders when booking changes)
export default React.memo(BookingCard);
