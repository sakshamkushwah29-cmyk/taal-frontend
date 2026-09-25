"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Star, Calendar, Loader2, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import AddressList from "@/components/_sections/AddressList";
import { showToast } from "@/components/_ui/toast-utils";
import { getRazorpayKey, loadRazorpay } from "@/lib/razorpay";

export default function RentalProductDetailsPage() {
  const { itemId } = useParams();
  const router = useRouter();
  const authUser = useSelector((state) => state.auth?.authUser);
  const { request } = useAxios();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);

  // Set default dates: today and 2 days later
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const defaultEndStr = useMemo(
    () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    []
  );

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  // Pricing calculations
  const dailyRate = useMemo(() => {
    return (
      selectedVariant?.effectivePrice ||
      selectedVariant?.discountPrice ||
      selectedVariant?.price ||
      product?.rentPricePerDay ||
      product?.pricing?.minPrice ||
      50
    );
  }, [selectedVariant, product]);

  const depositPerUnit = useMemo(() => {
    return product?.deposit !== undefined && product?.deposit !== null
      ? Number(product.deposit)
      : 450;
  }, [product]);

  const totalRent = useMemo(() => {
    return dailyRate * rentalDays * qty;
  }, [dailyRate, rentalDays, qty]);

  const totalDeposit = useMemo(() => {
    return depositPerUnit * qty;
  }, [depositPerUnit, qty]);

  const totalPayable = useMemo(() => {
    return totalRent + totalDeposit;
  }, [totalRent, totalDeposit]);

  // Fetch product details
  const fetchDetails = async () => {
    try {
      setPageLoading(true);
      const { data, error } = await request({
        url: `/user/get-rent-product-details`,
        method: "GET",
        authRequired: false,
        params: { productId: itemId },
      });
      if (!error && data?.data) {
        setProduct(data.data);
        setSelectedVariant(data.data.selectedVariant || data.data.variants?.[0] || null);
      } else {
        showToast("error", error || data?.message || "Failed to load rental product.");
      }
    } catch (err) {
      showToast("error", err.message || "Failed to load rental product.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchDetails();
    }
  }, [itemId]);

  // Rent + Razorpay payment flow
  const handleRentNow = async () => {
    if (submitting) return;

    if (!authUser?.token) {
      showToast("error", "Please login to rent this product.");
      router.push(`/login?redirect=/rentals/${itemId}`);
      return;
    }

    if (!selectedVariant) {
      showToast("error", "Please select a product variant.");
      return;
    }

    if (!startDate) {
      showToast("error", "Please select a rental start date.");
      return;
    }

    if (!endDate) {
      showToast("error", "Please select a rental end date.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      showToast("error", "Rental end date must be after start date.");
      return;
    }

    if (!selectedAddress || !selectedAddress._id) {
      showToast("error", "Please select or add a delivery address.");
      return;
    }

    const targetVariantId = selectedVariant.variantId || selectedVariant._id;
    if (!targetVariantId) {
      showToast("error", "Invalid variant selected. Please choose another.");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Ensure Razorpay SDK script is loaded
      const loaded = await loadRazorpay();
      if (!loaded) {
        showToast("error", "Razorpay SDK failed to load. Please check your internet connection.");
        setSubmitting(false);
        return;
      }

      // 2. Call backend /user/rent-now
      const payload = {
        productId: product._id,
        variantId: String(targetVariantId),
        qty: Math.max(1, Number(qty) || 1),
        startDate,
        endDate,
        addressId: String(selectedAddress._id),
        paymentMethod: "online",
        gateway: "razorpay",
      };

      const { data, error } = await request({
        url: "/user/rent-now",
        method: "POST",
        payload,
        authRequired: true,
      });

      if (error || !data?.success) {
        showToast("error", error || data?.message || "Failed to create rental booking.");
        setSubmitting(false);
        return;
      }

      const orderData = data?.data?.booking;
      const razorpayPaymentData = data?.data?.payment?.razorpayOrder;
      if (!razorpayPaymentData || !razorpayPaymentData.amount) {
        showToast(
          "error",
          data?.data?.payment?.error || data?.message || "Could not initialize Razorpay order. Please try again."
        );
        setSubmitting(false);
        return;
      }

      const activeKey = getRazorpayKey(data?.data?.payment?.keyId);

      // 3. Initialize and open Razorpay modal
      const options = {
        key: activeKey,
        amount: razorpayPaymentData.amount,
        currency: razorpayPaymentData.currency || "INR",
        name: "Taal Events - Rentals",
        description: `Rental: ${product.title} (Rent ₹${totalRent} + Deposit ₹${totalDeposit})`,
        order_id: razorpayPaymentData.id,
        prefill: {
          name: selectedAddress.fullName || selectedAddress.name || authUser?.user?.name || "",
          email: authUser?.user?.email || authUser?.email || "",
          contact: selectedAddress.phone || authUser?.user?.phone || "",
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData._id,
            };

            const { data: vData, error: vError } = await request({
              url: "/user/verify-rent-payment",
              method: "POST",
              payload: verifyPayload,
              authRequired: true,
            });

            if (vError || (vData?.status !== 200 && !vData?.success)) {
              showToast("error", vError || vData?.message || "Payment verification failed.");
            } else {
              showToast(
                "success",
                vData?.message || "Rental booking confirmed successfully!"
              );
              router.push("/account/my-bookings");
            }
          } catch (err) {
            showToast("error", err.message || "Payment verification error.");
          } finally {
            setSubmitting(false);
          }
        },
        theme: { color: "#5A0117" },
      };

      if (typeof window === "undefined" || !window.Razorpay) {
        showToast("error", "Razorpay checkout SDK could not be loaded. Please reload the page.");
        setSubmitting(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (resp) {
        showToast("error", resp.error?.description || "Payment failed.");
        setSubmitting(false);
      });
      razorpay.open();
    } catch (err) {
      showToast("error", err.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (pageLoading || !product) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
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
            ) : product.images?.length ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-[400px] object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
                No Image Available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right - Product Info + Checkout */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand">
                ₹{dailyRate}
              </span>
              <span className="text-gray-500 text-sm">/ day</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Refundable Security Deposit: <span className="font-semibold text-emerald-700">₹{depositPerUnit}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span className="font-semibold text-gray-700">4.5</span>
          </div>
        </div>

        {/* Variants */}
        <Card>
          <CardHeader className="font-medium">Choose Variant</CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {product.variants?.map((variant) => {
              const vKey = variant.variantId || variant._id;
              const isSelected =
                (selectedVariant?.variantId || selectedVariant?._id) === vKey;
              return (
                <Button
                  key={vKey}
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={isSelected ? "bg-brand hover:bg-brand-light text-white" : ""}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.color} / {variant.size}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Rental Period */}
        <Card>
          <CardHeader className="font-medium">Select Rental Period</CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-brand" /> Start Date
              </Label>
              <Input
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-brand" /> End Date
              </Label>
              <Input
                type="date"
                min={startDate || todayStr}
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
              <Label className="text-sm font-medium text-gray-700">Quantity</Label>
              <Input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 mt-2"
              />
            </div>

            {/* Address */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Delivery Address
              </Label>
              <AddressList
                mode="selectable"
                selectedId={selectedAddress?._id}
                onSelect={setSelectedAddress}
              />
            </div>

            {/* Live Rental Bill & Deposit Breakdown */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 border-b border-amber-200/60 pb-2">
                <span>Rental Bill & Deposit Summary</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                  {rentalDays} {rentalDays === 1 ? "Day" : "Days"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Rental Charge ({qty} × ₹{dailyRate}/day × {rentalDays} {rentalDays === 1 ? "day" : "days"}):
                  </span>
                  <span className="font-medium text-gray-900">₹{totalRent}</span>
                </div>

                <div className="flex justify-between items-center text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <span>Refundable Security Deposit:</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                      100% Refundable
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-700">₹{totalDeposit}</span>
                </div>

                <p className="text-[11px] text-gray-500 italic bg-white/70 p-2 rounded border border-amber-100">
                  💡 <strong>How it works:</strong> You pay ₹{totalPayable} upfront today via Razorpay. When you return the product in good condition, the <strong>₹{totalDeposit} deposit</strong> will be refunded back to you — so your net cost is only <strong>₹{totalRent}</strong>.
                </p>
              </div>

              <div className="border-t border-amber-200/60 pt-2.5 flex justify-between items-center text-base font-bold text-gray-900">
                <span>Total Payable Now:</span>
                <span className="text-2xl text-brand font-black">₹{totalPayable}</span>
              </div>
            </div>

            {/* Payment */}
            <div>
              <Label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <CreditCard className="w-4 h-4 text-brand" /> Payment Method
              </Label>
              <p className="text-gray-600 text-xs">
                Secure online payment via Razorpay (UPI, Credit/Debit Cards, Net Banking)
              </p>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleRentNow}
              disabled={submitting}
              className="w-full bg-brand hover:bg-brand-light text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all text-base cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting to Razorpay...
                </>
              ) : (
                `Pay & Confirm • ₹${totalPayable}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="col-span-1 md:col-span-2 mt-8">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <p className="text-gray-600">{product.description || "Authentic handcrafted traditional Gujarati rental essentials for Navratri."}</p>
          </TabsContent>
          <TabsContent value="reviews">
            <p className="text-gray-600">No reviews yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
