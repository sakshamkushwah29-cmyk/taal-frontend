"use client";

import React, { useEffect, useState } from "react";
import { User, Users } from "lucide-react";
import SectionHeader from "@/components/typography/SectionHeader";
import useAxios from "@/hooks/useAxios";
import EventCard from "@/components/_cards/EventCard";
import FestivalLoading from "@/components/common/FestivalLoading";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [pageError, setPageError] = useState(null);

  const { request: getAllEvents, loading, error } = useAxios();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await getAllEvents({
        method: "GET",
        url: "/user/get-all-events",
      });

      if (error) {
        setPageError("Failed to fetch events");
      } else {
        setEvents(data?.data || []);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <FestivalLoading />;

  if (pageError || error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 font-semibold text-lg">
          {pageError || error}
        </p>
      </div>
    );
  }

  // ✅ Filter only events where isVisible is true
  const visibleEvents = events.filter((e) => e.isVisible);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-14">
          <SectionHeader
            title="Upcoming Events"
            icon={User}
            iconColor="text-indigo-600 dark:text-yellow-400"
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-500"
          />
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join us for a series of exciting events that celebrate culture,
            community, and creativity.
          </p>
        </div>

        {visibleEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-5 lg:mx-16">
            {visibleEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="h-12 w-12 text-purple-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
              No events available right now.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Check back later for new cultural and community events.
            </p>
          </div>
        )}

        <div className="mt-20 text-center">
          <SectionHeader
            title="Join Our Community"
            icon={Users}
            iconColor="text-indigo-600 dark:text-yellow-400"
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-500"
          />
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
            Stay updated with the latest events, festivals, and workshops. Be a
            part of a growing cultural movement.
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}
