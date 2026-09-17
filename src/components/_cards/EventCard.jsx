"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Info,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function EventCard({ event }) {
  const [showSessions, setShowSessions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Sort sessions by date
  const sortedSessions = event.sessions
    ? [...event.sessions].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <Link href={`/events/view-details?eventId=${event._id}`}>
      <div className="group bg-white/90 backdrop-blur-xl rounded-2xl transition-all duration-300 overflow-hidden">
        {/* Banner */}
        <div className="relative">
          {event.banner ? (
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-48 object-cover group-hover:opacity-95 transition"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-purple-200 to-yellow-100 flex items-center justify-center text-purple-700 font-semibold">
              No Banner Available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            <span className="line-clamp-1">{event.title}</span>
          </h2>

          {/* Date & Venue */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-xl text-gray-800 dark:text-gray-200 text-sm border border-purple-100 dark:border-purple-800">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                {dayjs.utc(event.startDate).format("DD MMM YYYY")} –{" "}
                {dayjs.utc(event.endDate).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-xl text-gray-800 dark:text-gray-200 text-sm border border-yellow-100 dark:border-yellow-800">
              <MapPin className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="truncate">
                {event.venueName}, {event.address?.city}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex items-center gap-2">
              <p className={showDescription ? "" : "line-clamp-1 flex-1"}>
                {event.description}
              </p>
              {event.description.length > 80 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDescription(!showDescription);
                  }}
                  className="text-purple-600 dark:text-purple-400 text-xs font-semibold hover:underline flex items-center gap-1 shrink-0"
                >
                  {showDescription ? (
                    <>
                      Show Less <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Sessions info */}
          {sortedSessions.length > 0 && (
            <div className="mt-1 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-purple-500" />
                <span>
                  {sortedSessions.length}{" "}
                  {sortedSessions.length === 1 ? "Session" : "Sessions"}{" "}
                  Scheduled
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowSessions(!showSessions);
                }}
                className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                {showSessions ? (
                  <>
                    Hide <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Show <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Expand sessions */}
          {showSessions && sortedSessions.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {sortedSessions.map((session) => {
                const statusClasses =
                  session.status === "scheduled"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : session.status === "cancelled"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

                return (
                  <div
                    key={session._id}
                    className="flex justify-between items-center px-4 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {session.specialNameOfDay} •{" "}
                      {dayjs.utc(session.date).format("DD MMM YYYY, h:mm A")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses}`}
                    >
                      {session.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer CTA */}
          {event.address?.maplink && (
            <div className="mt-4 flex justify-end">
              <a
                href={event.address.maplink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 bg-gradient-to-r from-purple-600 to-yellow-500 text-white text-sm font-medium rounded-full shadow-lg hover:scale-105 transition"
              >
                View on Map
              </a>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
