"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "../typography/SectionHeader";
import useAxios from "@/hooks/useAxios";
import LoadingDots from "./LoadingDots";
import EventCard from "../_cards/EventCard";

export default function AppEventCardGrid() {
  const { request: apiRequest, loading } = useAxios();
  const [events, setEvents] = useState([]);

  const fetchAllEvents = async () => {
    const { data, error } = await apiRequest({
      url: "/user/get-all-events",
      method: "GET",
    });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    const visibleEvents = (data?.data || []).filter((event) => event.isVisible);
    setEvents(visibleEvents);
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionHeader title="Upcoming Events" />

        {loading ? (
          <LoadingDots dotClassName="bg-brand" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
