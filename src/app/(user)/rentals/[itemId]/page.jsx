"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, Calendar, Loader2, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import AddressList from "@/components/_sections/AddressList";
import { showToast } from "@/components/_ui/toast-utils";

export default function RentalProductDetailsPage() {
  const { itemId } = useParams();
  const { request, loading } = useAxios();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch product details
  const fetchDetails = async () => {
    const { data, error } = await request({
      url: `/user/get-rent-product-details`,
      method: "GET",
      authRequired: false,
      params: { productId: itemId },
    });
    if (!error && data?.data) {
      setProduct(data.data);
      setSelectedVariant(data.data.selectedVariant);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Rent + Razorpay payment flow
  const handleRentNow = async () => {
    if (!selectedVariant || !startDate || !endDate || !selectedAddress) {
      showToast("error", "Please fill all checkout details before payment.");
      return;
    }

    const payload = {
      productId: product._id,
      variantId: selectedVariant.variantId,
      qty,
      startDate,
      endDate,
      addressId: selectedAddress._id,
      paymentMethod: "online",
      gateway: "razorpay",
    };

    const { data, error } = await request({
      url: "/user/rent-now",
      method: "POST",
      payload,
      authRequired: true,
    });

    if (!error && data?.status === 201) {
      const orderData = data.data.booking;
      const razorpayPaymentData = data.data.payment.razorpayOrder;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RJ78sILs64v88G",
        amount: razorpayPaymentData.amount,
        currency: "INR",
        name: product.title,
        description: "Rental Payment",
        order_id: razorpayPaymentData.id,
        handler: async function (response) {
          const verifyPayload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData._id,
          };

          const { data, error } = await request({
            url: "/user/verify-rent-payment",
            method: "POST",
            payload: verifyPayload,
            authRequired: true,
          });

          if (data?.status === 200) {
            showToast(
              "success",
              data.message ||
                "Payment verification successful! Booking confirmed."
            );
          } else {
            showToast("error", error || "Payment verification failed.");
          }
        },
        theme: { color: "#ec4899" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left - Gallery */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-0">
            {selectedVariant?.images?.length ? (
              <img
                src={selectedVariant.images[0]}
                alt={product.title}
                className="w-full h-[400px] object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-md">
                No Image
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right - Product Info + Checkout */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold text-pink-600">
            ₹{selectedVariant?.effectivePrice || product.pricing.minPrice}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span>4.5</span>
          </div>
        </div>

        {/* Variants */}
        <Card>
          <CardHeader className="font-medium">Choose Variant</CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {product.variants.map((variant) => (
              <Button
                key={variant.variantId}
                size="sm"
                variant={
                  selectedVariant?.variantId === variant.variantId
                    ? "default"
                    : "outline"
                }
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.color} / {variant.size}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Rental Period */}
        <Card>
          <CardHeader className="font-medium">Select Rental Period</CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" /> Start Date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" /> End Date
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Checkout Section */}
        <Card>
          <CardHeader className="font-medium">Checkout</CardHeader>
          <CardContent className="space-y-6">
            {/* Qty */}
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-24 mt-2"
              />
            </div>

            {/* Address */}
            <AddressList mode="selectable" onSelect={setSelectedAddress} />

            {/* Payment */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" /> Payment
              </Label>
              <p className="text-gray-600 text-sm">
                Online payment via Razorpay
              </p>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleRentNow}
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={
                !selectedVariant || !startDate || !endDate || !selectedAddress
              }
            >
              Pay & Confirm
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="col-span-2 mt-8">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <p className="text-gray-600">{product.description}</p>
          </TabsContent>
          <TabsContent value="reviews">
            <p className="text-gray-600">No reviews yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
