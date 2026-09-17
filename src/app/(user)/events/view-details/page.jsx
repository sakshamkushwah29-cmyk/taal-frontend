"use client";

import useAxios from "@/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { Calendar, MapPin, ImageOff } from "lucide-react";
import FestivalLoading from "@/components/common/FestivalLoading";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import EventSessions from "@/components/common/EventSessions";

// ✅ enable UTC for all dayjs usage
dayjs.extend(utc);

function EventDetailsPage() {
  const [eventDetails, setEventDetails] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const { request: getEventDetails, loading, error } = useAxios();
  const { request: getSessionDetails, loading: sessionLoading } = useAxios();
  const [pageError, setPageError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch Event Details
  useEffect(() => {
    const fetchEventDetails = async () => {
      const { data, error } = await getEventDetails({
        method: "GET",
        url: "/user/get-event",
        params: {
          eventId: new URLSearchParams(window.location.search).get("eventId"),
        },
      });

      if (error) {
        setPageError("Failed to fetch event details");
      } else {
        setEventDetails(data?.data?.[0] || null);
      }
    };

    fetchEventDetails();
  }, []);

  // Fetch Session Details when sessionId is in URL
  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      setSessionDetails(null);
      return;
    }

    const fetchSessionDetails = async () => {
      const { data, error } = await getSessionDetails({
        method: "GET",
        url: "/user/get-event-session",
        params: { sessionId },
      });

      if (!error) {
        setSessionDetails(data?.data || null);
      }
    };

    fetchSessionDetails();
  }, [searchParams]);

  const updateSessionQuery = (sessionId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sessionId", sessionId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (loading) return <FestivalLoading />;
  if (error || pageError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 font-semibold text-lg">
          {pageError || error}
        </p>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 font-medium">No event details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="relative">
          {eventDetails.images?.length > 0 ? (
            <img
              src={eventDetails.banner}
              alt={eventDetails.title}
              className="w-full h-[300px] sm:h-[400px] object-cover"
            />
          ) : (
            <div className="w-full h-[300px] sm:h-[400px] bg-gradient-to-r from-purple-400 to-purple-300 flex items-center justify-center">
              <ImageOff className="w-12 h-12 text-white" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              {eventDetails.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-200">
              {eventDetails.venueName} • {eventDetails.address?.city},{" "}
              {eventDetails.address?.state}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {/* Dates & Location */}
          <div className="flex flex-wrap gap-6 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-medium">
                {dayjs.utc(eventDetails.startDate).format("MMM D, YYYY")} –{" "}
                {dayjs.utc(eventDetails.endDate).format("MMM D, YYYY")}
              </span>
            </div>
            <a
              href={eventDetails.address.maplink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="font-medium hover:underline">
                  {eventDetails.address?.address},{" "}
                  {eventDetails.address?.landmark},{" "}
                  {eventDetails.address?.pincode},{" "}
                  {eventDetails.address?.country}
                </span>
              </div>
            </a>
          </div>

          <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {eventDetails.description}
          </p>

          {/* Sessions */}
          <EventSessions
            eventDetails={eventDetails}
            sessionDetails={sessionDetails}
            sessionLoading={sessionLoading}
            onSessionSelect={(id) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("sessionId", id);
              router.push(`?${params.toString()}`, { scroll: false });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
