"use client";

import useAxios from "@/hooks/useAxios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Phone,
  IndianRupee,
  CreditCard,
  Clock,
  BadgeCheck,
  MapPin,
  Info,
  Receipt,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FestivalLoading from "@/components/common/FestivalLoading";

function BookingDetailsPage() {
  const { bookingId } = useParams();
  const { request: getBookingDetails, loading } = useAxios();
  const [selectedQR, setSelectedQR] = useState(null);

  const [booking, setBooking] = useState(null);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await getBookingDetails({
        method: "GET",
        url: "/user/get-booking-by-id",
        authRequired: true,
        params: { bookingId },
      });

      if (!error && data?.success) {
        setBooking(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const handleDownloadTicketFile = (ticket) => {
    // ticket.pdfPath looks like "/uploads/tickets/TAAL-2025-777e8c2f.png"
    // we only need the part after "/uploads/tickets/"
    const fileName = ticket.pdfPath.replace("/uploads/tickets/", "");

    // Open our proxy API route in a new tab so browser shows a download dialog
    window.open(`/api/download-ticket/${fileName}`, "_blank");
  };

  if (loading) {
    return <FestivalLoading />;
  }

  if (!booking) {
    return (
      <div className="text-center text-gray-500 py-20">Booking not found.</div>
    );
  }

  const { event, eventSession, attendeeDetails, tickets } = booking;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:grid lg:grid-cols-3 lg:gap-8">
      {/* LEFT MAIN CONTENT */}
      <div className="space-y-8 lg:col-span-2">
        {/* Event Summary */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {event.title}
            </h2>
            {/* <button
              onClick={() => handleDownloadTicket(booking._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              Download All
            </button> */}
          </div>

          {/* Status & Booking ID */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                booking.ticketStatus === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              {booking.ticketStatus}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Booking ID: {booking._id}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 font-medium">
            <span className="flex items-center gap-1 text-purple-600">
              <IndianRupee className="w-4 h-4" />
              {booking.totalAmount} {booking.currency}
            </span>
            <span className="text-sm text-gray-500">
              Qty: {booking.quantity}
            </span>
          </div>
        </section>

        {/* Event & Session */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Event & Session
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-medium">{event.venueName}</p>
              <p className="text-sm">{event.address.address}</p>
              <p className="text-sm">
                {event.address.city}, {event.address.state},{" "}
                {event.address.country}
              </p>
              <a
                href={event.address.maplink}
                target="_blank"
                className="flex items-center gap-1 text-purple-600 text-sm underline"
              >
                <MapPin className="w-4 h-4" />
                View on Map
              </a>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                {new Date(eventSession.date).toDateString()}
              </p>
              <p className="text-sm">
                {eventSession.startTime} - {eventSession.endTime}
              </p>
            </div>
          </div>
        </section>

        {/* Attendees */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Attendees
          </h3>
          <div className="grid gap-3">
            {attendeeDetails.map((attendee, i) => (
              <div
                key={attendee._id}
                className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
              >
                <div>
                  <p className="font-medium">
                    #{i + 1} {attendee.name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    {attendee.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tickets */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-600" />
            Tickets
          </h3>

          <div className="grid gap-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
              >
                {/* Left: Attendee & Ticket Info */}
                <div className="flex items-center gap-4">
                  {ticket.pdfPath && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${ticket.pdfPath}`}
                      width={100}
                      height={100}
                      alt="Ticket PDF"
                      className="w-14 h-14 rounded-md border border-gray-200 dark:border-gray-700"
                    />
                  )}
                  <div>
                    <p className="font-medium">{ticket.attendeeName}</p>
                    <p className="text-sm text-gray-500">{ticket.ticketId}</p>
                  </div>
                </div>

                {/* Right: Download Icon Button */}
                <Button
                  onClick={() => handleDownloadTicketFile(ticket)}
                  className="p-2 transition"
                  title="Download Ticket"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="space-y-8 mt-8 lg:mt-0">
        {/* Payment Info */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Payment Info
          </h3>
          <p>
            Method:{" "}
            <span className="font-medium capitalize">
              {booking.paymentMethod}
            </span>
          </p>
          <p>
            Status:{" "}
            <span
              className={`font-medium ${
                booking.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {booking.paymentStatus}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Order ID: {booking.razorpayOrderId}
          </p>
          <p className="text-sm text-gray-500">
            Payment ID: {booking.razorpayPaymentId}
          </p>
        </section>

        {/* Metadata */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            Booking Metadata
          </h3>
          <p>
            Booked At:{" "}
            <span className="font-medium">
              {new Date(booking.createdAt).toLocaleString("en-IN")}
            </span>
          </p>
          <p>
            Last Updated:{" "}
            <span className="font-medium">
              {new Date(booking.updatedAt).toLocaleString("en-IN")}
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default BookingDetailsPage;
