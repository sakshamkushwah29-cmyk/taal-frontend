"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AddressList from "./AddressList";
import useAxios from "@/hooks/useAxios";
import { useAppDialog } from "@/contexts/AppDialogContext";
import { getRazorpayKey } from "@/lib/razorpay";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Checkout() {
  const cart = useSelector((state) => state.cart);
  const { request: apiRequest, loading } = useAxios();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { showDialog } = useAppDialog();

  const totals = useMemo(() => {
    const subtotal =
      cart?.items?.reduce(
        (sum, item) => sum + (item.variant?.sellPrice ?? 0) * (item.qty ?? 0),
        0
      ) ?? 0;

    const discount = cart?.discount ?? 0;
    const delivery = cart?.freeDelivery ? 0 : cart?.deliveryCharge ?? 0;
    const total = subtotal - discount + delivery;

    return { subtotal, discount, delivery, total };
  }, [cart]);

  const handlePlaceOrder = useCallback(async () => {
    if (!cart?.items?.length) {
      showDialog({ type: "error", title: "Cart Empty", description: "Your cart is empty." });
      return;
    }
    if (!selectedAddress) {
      showDialog({ type: "error", title: "Address Required", description: "Please select an address." });
      return;
    }

    try {
      const { data, error } = await apiRequest({
        url: "/user/buy-from-cart",
        method: "POST",
        payload: {
          addressId: selectedAddress._id,
          paymentMethod,
          gateway: "razorpay",
        },
        authRequired: true,
      });

      if (error || !data?.status) {
        showDialog({ type: "error", title: "Order Creation Failed", description: error || "Order creation failed" });
        return;
      }

      if (paymentMethod === "cod") {
        showDialog({ type: "success", title: "Order Placed", description: data.message || "Your order has been placed successfully!" });
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        showDialog({ type: "error", title: "Razorpay SDK Failed", description: "Razorpay SDK failed to load. Are you online?" });
        return;
      }

      const order = data?.data?.order;
      const paymentData = data?.data?.payment?.razorpayOrder;
      if (!paymentData || !paymentData.amount) {
        showDialog({ type: "error", title: "Payment Failed", description: data?.data?.payment?.error || "Could not initialize Razorpay order. Please try again." });
        return;
      }

      const rzp = new window.Razorpay({
        key: getRazorpayKey(data?.data?.payment?.keyId),
        amount: paymentData.amount,
        currency: paymentData.currency || "INR",
        name: "Taal Events",
        description: "Order Payment",
        order_id: paymentData.id,
        prefill: {
          name: selectedAddress?.name,
          email: selectedAddress?.email,
          contact: selectedAddress?.phone,
        },
        theme: { color: "#5A0117" },
        handler: async (response) => {
          try {
            const { data, error } = await apiRequest({
              url: "/user/verify-razorpay-payment",
              method: "POST",
              payload: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              },
              authRequired: true,
            });

            if (error) {
              showDialog({ type: "error", title: "Payment Verification Failed", description: error || "Payment verification failed." });
              return;
            }

            showDialog({ type: "success", title: "Order Placed", description: data.message || "Your order has been placed successfully!" });
          } catch (err) {
            showDialog({ type: "error", title: "Payment Verification Failed", description: err.message || "Payment verification failed." });
          }
        },
      });

      rzp.open();
    } catch (err) {
      showDialog({ type: "error", title: "Order Failed", description: err.message || "Something went wrong" });
    }
  }, [apiRequest, cart, selectedAddress, paymentMethod]);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left - Order Summary */}
      <div className="lg:col-span-2">
        <div className="border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">
            Order Summary
          </h2>

          {cart?.items?.length ? (
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => {
                const unitPrice = item.variant?.sellPrice ?? 0;
                const qty = item.qty ?? 0;
                const lineTotal = unitPrice * qty;
                return (
                  <div
                    key={`${item.productId}-${item.variant?.id}`}
                    className="flex justify-between items-start py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {qty} × ₹{unitPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          )}

          <Separator className="my-4" />

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-brand">
                <span>Discount</span>
                <span>−₹{totals.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>{cart?.freeDelivery ? "Free" : `₹${totals.delivery}`}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-semibold text-gray-900 text-base">
            <span>Total</span>
            <span>₹{totals.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Right - Address + Payment */}
      <div className="space-y-6">
        <div className="border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">
            Select Address
          </h2>
          <AddressList
            mode="selectable"
            selected={selectedAddress}
            onSelect={setSelectedAddress}
          />
        </div>

        <div className="border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">
            Payment Method
          </h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="text-sm text-gray-700">Cash on Delivery</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="text-sm text-gray-700">Pay Online</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={!cart?.items?.length || loading}
          className="w-full h-12 rounded-none bg-brand text-white text-sm font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors"
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}

export default Checkout;
