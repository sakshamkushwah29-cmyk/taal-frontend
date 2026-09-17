"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Loader2, Ticket } from "lucide-react";

import useAxios from "@/hooks/useAxios";
import BookingCard from "@/components/_cards/BookingCard";
import FestivalLoading from "@/components/common/FestivalLoading";
import SectionHeader from "@/components/typography/SectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyBookingsPage() {
  const { request: getMyBookings, loading } = useAxios();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("confirmed");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data, error } = await getMyBookings({
          method: "GET",
          url: "/user/get-all-ticket-bookings",
          authRequired: true,
        });
        if (!error && data?.success) setBookings(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- NO getMyBookings here

  const filteredBookings = useMemo(() => {
    if (filterStatus === "all") return bookings;
    return bookings.filter(
      (b) => b.ticketStatus?.toLowerCase() === filterStatus
    );
  }, [bookings, filterStatus]);

  if (loading) return <FestivalLoading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center mb-8">
        <SectionHeader
          title="My Tickets"
          icon={Ticket}
          iconColor="text-purple-600 dark:text-purple-400"
          gradientFrom="from-purple-500"
          gradientTo="to-pink-500"
        />
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find your booking details and manage your reservations easily.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <label className="mr-4 self-center font-medium text-gray-700 dark:text-gray-300">
          Filter by Status:
        </label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredBookings.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-20">
          No {filterStatus} bookings found.
        </div>
      )}
    </div>
  );
}
