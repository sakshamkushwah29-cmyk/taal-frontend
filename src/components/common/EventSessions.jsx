"use client";

import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Clock, IndianRupeeIcon, Ticket } from "lucide-react";
import EventSessionBooking from "@/components/common/EventSessionBooking";
import { useSearchParams, useRouter } from "next/navigation";

dayjs.extend(utc);

export default function EventSessions({
  eventDetails,
  sessionDetails,
  sessionLoading,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingRef = useRef(null);

  const [selectedTickets, setSelectedTickets] = useState(1);

  const isAllPass = searchParams.get("type") === "all";
  const sessionId = searchParams.get("sessionId");

  const firstSession = eventDetails.sessions?.[0] || null;
  const lastSession =
    eventDetails.sessions?.[eventDetails.sessions.length - 1] || null;

  // Determine active session (single or all-pass)
  const activeSession = isAllPass
    ? lastSession
    : eventDetails.sessions?.find((s) => s._id === sessionId) || null;

  // Handle selecting a session or all-pass
  const handleSessionSelect = (id, type = "single") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sessionId", id);
    if (type === "all") params.set("type", "all");
    else params.delete("type");

    router.push(`?${params.toString()}`, { scroll: false });

    setTimeout(() => {
      bookingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  // Display info safely
  const displayDate = activeSession
    ? isAllPass
      ? firstSession && lastSession
        ? `${dayjs.utc(firstSession.date).format("dddd, MMM D, YYYY")} → ${dayjs
            .utc(lastSession.date)
            .format("dddd, MMM D, YYYY")}`
        : "N/A"
      : dayjs.utc(activeSession.date).format("dddd, MMM D, YYYY")
    : null;

  const displaySessionName = isAllPass
    ? "All Sessions Pass"
    : activeSession?.specialNameOfDay || "Session";

  const unitPrice = isAllPass
    ? eventDetails.sessions?.reduce(
        (sum, s) => sum + (s.pricePerTicket || 0),
        0
      ) || 0
    : activeSession?.pricePerTicket || 0;

  const totalPrice = unitPrice * selectedTickets;
  const currency = lastSession?.currency || "INR";

  return (
    <>
      {/* ======= Session List ======= */}
      {eventDetails.sessions?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            Event Sessions
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* All Sessions Pass */}
            {lastSession && (
              <div
                onClick={() => handleSessionSelect(lastSession._id, "all")}
                className={`p-5 rounded-2xl text-left border-2 transition cursor-pointer ${
                  isAllPass ? "ring-2 ring-purple-500 scale-[1.02]" : ""
                } bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Season Pass
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    All
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  For All {eventDetails.sessions.length} Days
                </p>
                <p className="mt-1 font-bold flex justify-end items-center text-purple-700 dark:text-purple-300">
                  <IndianRupeeIcon className="w-4 h-4" />
                  {totalPrice ||
                    lastSession?.pricePerTicket *
                      eventDetails.sessions.length}{" "}
                  - {currency} - Per Ticket
                </p>
              </div>
            )}

            {/* Single Sessions */}
            {eventDetails.sessions
              .sort(
                (a, b) =>
                  dayjs.utc(a.date).valueOf() - dayjs.utc(b.date).valueOf()
              )
              .map((session) => {
                const sessionDate = dayjs.utc(session.date);
                const isPast = sessionDate.isBefore(dayjs.utc(), "day");
                const isFull = session.remainingCapacity <= 0;

                const statusColor =
                  session.status === "scheduled"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : session.status === "cancelled"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";

                const disabled =
                  isPast ||
                  isFull ||
                  session.status === "cancelled" ||
                  session.status === "completed";
                const active = sessionId === session._id && !isAllPass;

                return (
                  <div
                    key={session._id}
                    onClick={() =>
                      !disabled && handleSessionSelect(session._id)
                    }
                    className={`p-5 rounded-2xl text-left border-2 transition cursor-pointer ${
                      disabled
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-yellow-50"
                    } ${active ? "ring-2 ring-purple-500 scale-[1.02]" : ""}`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-base font-semibold ${
                          disabled
                            ? "line-through"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {session.specialNameOfDay}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}
                      >
                        {session.status}
                      </span>
                    </div>

                    <p
                      className={`mt-2 text-sm ${
                        disabled
                          ? "text-gray-500 line-through"
                          : "text-gray-600"
                      }`}
                    >
                      {dayjs.utc(session.date).format("dddd, MMM D, YYYY")}
                    </p>

                    <p
                      className={`mt-1 font-bold flex justify-end items-center ${
                        disabled
                          ? "text-gray-400"
                          : "text-purple-700 dark:text-purple-300"
                      }`}
                    >
                      <IndianRupeeIcon className="w-4 h-4" />
                      {session.pricePerTicket} - {session.currency} - Per Ticket
                    </p>

                    {isFull && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        Fully Booked
                      </p>
                    )}
                    {isPast && !isFull && (
                      <p className="mt-1 text-xs text-gray-500 font-medium">
                        Past Session
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======= Session Details & Booking ======= */}
      {activeSession && (
        <div
          ref={bookingRef}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-purple-600" />
            {displaySessionName}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Date:</strong> {displayDate}
              </p>

              {!isAllPass && activeSession && (
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  <strong>Time:</strong> {activeSession.startTime} –{" "}
                  {activeSession.endTime}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Price:</strong> {totalPrice} {currency}
              </p>

              {!isAllPass && activeSession && (
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{activeSession.status}</span>
                </p>
              )}
            </div>
          </div>

          <p className="mt-6 font-bold text-xl text-gray-900 text-center dark:text-gray-300">
            Hurry up! Only few tickets left
          </p>

          <div className="border border-dashed border-gray-400 mt-6" />

          <div className="mt-6">
            <EventSessionBooking
              eventDetails={eventDetails}
              sessionDetails={activeSession}
              maxTickets={5}
              singleName
              isSessionPass={isAllPass}
              selectedTickets={selectedTickets}
              setSelectedTickets={setSelectedTickets}
              onSuccess={(data) => console.log("Booking success:", data)}
              onError={(err) => console.error("Booking failed:", err)}
            />
          </div>
        </div>
      )}

      {sessionLoading && (
        <div className="mt-8 flex justify-center">
          <p className="text-purple-500 font-medium">Loading session...</p>
        </div>
      )}
    </>
  );
}
