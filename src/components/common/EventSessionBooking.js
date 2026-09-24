"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Minus,
  Plus,
  User,
  Phone,
  Calendar,
  Ticket,
  LogIn,
  IndianRupeeIcon,
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDialog } from "@/contexts/AppDialogContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getRazorpayKey } from "@/lib/razorpay";

dayjs.extend(utc);

// Razorpay loader
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function EventSessionBooking({ eventDetails, sessionDetails, isSessionPass }) {
  const authUser = useSelector((state) => state.auth.authUser);
  const router = useRouter();
  const { showDialog } = useAppDialog();
  const { request: apiRequest, loading } = useAxios();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 1,
      attendeeName: "",
      attendeePhone: "",
    },
  });

  const quantity = watch("quantity");

  // states for confirmation
  const [paymentData, setPaymentData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Razorpay handler
  const openRazorpay = useCallback(
    async (order, bookingId, formData, passedKey) => {
      try {
        const loaded = await loadRazorpay();
        if (!loaded) throw new Error("Razorpay SDK failed to load.");

        const activeKey = getRazorpayKey(passedKey || paymentData?.key);

        const rzp = new window.Razorpay({
          key: activeKey,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Taal Events",
          description: isSessionPass
            ? `All Sessions Pass for ${eventDetails?.title}`
            : `Tickets for ${eventDetails?.title}`,
          order_id: order.id,
          prefill: {
            name: formData.attendeeName || "Guest",
            contact: formData.attendeePhone || "",
          },
          theme: { color: "#7c3aed" },
          handler: async (response) => {
            try {
              const { data: verifyData, error: verifyError } = await apiRequest({
                url: "/user/verify-ticket-payment",
                method: "POST",
                payload: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: bookingId,
                },
                authRequired: true,
              });

              if (verifyError)
                return showDialog({
                  type: "error",
                  title: "Payment Verification Failed",
                  description: verifyError || "Unable to verify payment.",
                });

              if (verifyData?.status === 200) {
                showDialog({
                  type: "success",
                  title: "Booking Confirmed",
                  description:
                    verifyData.message ||
                    "Your booking is confirmed! Check your email for details.",
                });
              }
              reset();
            } catch (err) {
              showDialog({
                type: "error",
                title: "Payment Verification Failed",
                description: err.message || "Unable to verify payment.",
              });
            }
          },
        });

        rzp.open();
      } catch (err) {
        showDialog({
          type: "error",
          title: "Payment Error",
          description: err.message || "Failed to initiate payment.",
        });
      }
    },
    [apiRequest, eventDetails, showDialog, reset, isSessionPass, paymentData]
  );

  // booking API
  const handleBooking = useCallback(
    async (formData) => {
      try {
        const payload = {
          event: eventDetails._id,
          quantity: formData.quantity,
          attendeeDetails: [
            {
              name: formData.attendeeName,
              phone: formData.attendeePhone,
            },
          ],
        };

        if (isSessionPass) {
          payload.isSessionPass = true;
          payload.eventSession = sessionDetails._id; // last session id
        } else {
          payload.eventSession = sessionDetails._id;
        }

        const { data, error } = await apiRequest({
          url: "/user/book-tickets",
          method: "POST",
          payload,
          authRequired: true,
        });

        if (error || !data?.data?.order) {
          return showDialog({
            type: "error",
            title: "Booking Failed",
            description: error || data?.message || "Unable to book tickets.",
          });
        }

        setPaymentData({
          order: data.data.order,
          key: data?.data?.key,
          bookingId: data.data.bookingId,
          breakdown: data.data.breakdown,
          formData,
        });
        setShowConfirm(true);
      } catch (err) {
        toast.error("❌ Booking Failed", {
          description: err.message || "Something went wrong.",
        });
      }
    },
    [apiRequest, eventDetails, sessionDetails, showDialog, isSessionPass]
  );

  if (!authUser?.isAuthenticated || !authUser?.token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LogIn className="w-12 h-12 text-purple-600" />
        <h2 className="text-xl font-semibold">Please Login to Book Tickets</h2>
        <p className="text-gray-600 text-center max-w-xs">
          You need to login to reserve tickets.
        </p>
        <Button
          onClick={() =>
            router.push(
              `/login?redirect=/events/view-details?eventId=${eventDetails?._id}`
            )
          }
          className="bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-6"
        >
          Login
        </Button>
      </div>
    );
  }

  // display info
  const displayDate = isSessionPass
    ? `${dayjs
        .utc(eventDetails.sessions[0].date)
        .format("YYYY-MM-DD")} → ${dayjs
        .utc(eventDetails.sessions[eventDetails.sessions.length - 1].date)
        .format("YYYY-MM-DD")}`
    : dayjs.utc(sessionDetails?.date).format("YYYY-MM-DD HH:mm:ss");

  const displaySessionName = isSessionPass
    ? `All Sessions Pass`
    : sessionDetails?.specialNameOfDay;

  const displayPrice = isSessionPass
    ? eventDetails.sessions.reduce((sum, s) => sum + s.pricePerTicket, 0)
    : sessionDetails?.pricePerTicket;

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 flex items-center justify-center gap-2">
            <Ticket className="w-6 h-6 sm:w-7 sm:h-7" /> Book Your Tickets
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Reserve your spot for{" "}
            <span className="font-semibold text-gray-800">
              {eventDetails?.title}
            </span>
          </p>
        </header>

        <div className="space-y-5">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <Calendar className="w-6 h-6 text-purple-600 shrink-0" />
            <div>
              <p className="text-sm text-gray-600">
                {displayDate} • {displaySessionName}
              </p>
              <p className="text-purple-700 font-medium">Tickets: {quantity}</p>
              <p className="text-purple-700 font-medium flex items-center gap-1">
                Price: <IndianRupeeIcon className="w-4 h-4" />
                {displayPrice * quantity}{" "}
              </p>
              <p className="ml-10 text-xs italic text-gray-700 font-normal gap-1">
                (5% Platform Fee will be added at checkout)
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm">
            <Label className="text-gray-700 font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setValue("quantity", Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-lg">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setValue("quantity", Math.min(5, quantity + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Attendee Form */}
          <form onSubmit={handleSubmit(handleBooking)} className="space-y-5">
            <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
              <div>
                <Label
                  htmlFor="attendeeName"
                  className="flex gap-2 items-center text-gray-600"
                >
                  <User className="w-4 h-4 text-purple-600" /> Full Name
                </Label>
                <Input
                  {...register("attendeeName", {
                    required: "Name is required",
                  })}
                  placeholder="Enter attendee name"
                  className="mt-1"
                />
                {errors.attendeeName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.attendeeName.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="attendeePhone"
                  className="flex gap-2 items-center text-gray-600"
                >
                  <Phone className="w-4 h-4 text-purple-600" /> Phone
                </Label>
                <Input
                  {...register("attendeePhone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10-digit phone",
                    },
                  })}
                  placeholder="10-digit mobile number"
                  className="mt-1"
                />
                {errors.attendeePhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.attendeePhone.message}
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="reset"
                variant="outline"
                onClick={() => reset()}
                className="rounded-lg"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-6"
              >
                {loading ? "Processing..." : "Proceed to Pay"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
          </DialogHeader>

          {paymentData?.breakdown && (
            <div className="space-y-2 text-gray-700">
              <p>Ticket Amount: ₹{paymentData.breakdown.ticketSubtotal}</p>
              <p>Platform Fee(5%): ₹{paymentData.breakdown.platformFee}</p>
              <p className="font-bold text-purple-700">
                Total Payable: ₹{paymentData.breakdown.totalPayable}
              </p>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 text-white"
              onClick={() => {
                setShowConfirm(false);
                openRazorpay(
                  paymentData.order,
                  paymentData.bookingId,
                  paymentData.formData,
                  paymentData.key
                );
              }}
            >
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EventSessionBooking;
