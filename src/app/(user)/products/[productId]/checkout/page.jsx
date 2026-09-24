"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useAxios from "@/hooks/useAxios";
import AddressList from "@/components/_sections/AddressList";
import { useAppDialog } from "@/contexts/AppDialogContext";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function ProductCheckoutPage() {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showDialog } = useAppDialog();
  const { request: apiRequest, loading } = useAxios();

  const [productDetails, setProductDetails] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loadingProduct, setLoadingProduct] = useState(false);

  const initialQty = parseInt(searchParams.get("qty") || "1", 10);
  const paramVariantId = searchParams.get("variantId");
  const [qty, setQty] = useState(initialQty > 0 ? initialQty : 1);

  const variant = useMemo(() => {
    if (!productDetails) return null;
    if (paramVariantId && productDetails.variants?.length) {
      const match = productDetails.variants.find(
        (v) => (v.variantId || v._id) === paramVariantId
      );
      if (match) return match;
    }
    return productDetails.selectedVariant;
  }, [productDetails, paramVariantId]);

  const { subtotal, shippingCharges, total } = useMemo(() => {
    if (!variant) return { subtotal: 0, shippingCharges: 0, total: 0 };
    const sub = variant.effectivePrice * qty;
    const shipping = 0;
    return { subtotal: sub, shippingCharges: shipping, total: sub + shipping };
  }, [variant, qty]);

  const fetchProductDetails = async () => {
    setLoadingProduct(true);
    try {
      const { data, error } = await apiRequest({
        url: `/user/get-product-details?productId=${productId}`,
        method: "GET",
      });
      if (!error) {
        setProductDetails(data?.data ?? null);
      }
    } finally {
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    if (productId) fetchProductDetails();
  }, [productId]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showDialog({
        type: "error",
        title: "No Address Selected",
        description: "Please select an address before placing the order.",
      });
      return;
    }

    try {
      const payload = {
        productId: productDetails._id,
        variantId: variant?.variantId || variant?.raw?._id || variant?._id || productDetails.selectedVariant?.variantId,
        qty,
        addressId: selectedAddress._id,
        paymentMethod,
        gateway: paymentMethod === "online" ? "razorpay" : null,
      };

      const { data, error } = await apiRequest({
        url: "/user/buy-now",
        method: "POST",
        authRequired: true,
        payload,
      });

      if (error || !data?.data?.order) {
        showDialog({
          type: "error",
          title: "Order Failed",
          description: error || data?.message,
        });
        return;
      }

      if (paymentMethod === "cod") {
        showDialog({
          type: "success",
          title: "Order Placed",
          description: data.message,
        });
        return;
      }

      const order = data.data.order;
      const razorpayOrder = data.data.payment.razorpayOrder;
      const loaded = await loadRazorpay();
      if (!loaded) {
        showDialog({
          type: "error",
          title: "Payment SDK Failed",
          description: "Razorpay SDK failed to load. Please try again.",
        });
        return;
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RJ78sILs64v88G",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Taal",
        description: productDetails.title,
        image: productDetails?.images?.[0],
        order_id: razorpayOrder.id,
        prefill: {
          name: selectedAddress.name,
          email: selectedAddress.email,
          contact: selectedAddress.phone,
        },
        theme: { color: "#5A0117" },
        handler: async (response) => {
          try {
            const { data, error } = await apiRequest({
              url: "/user/verify-razorpay-payment",
              method: "POST",
              authRequired: true,
              payload: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              },
            });

            if (error) {
              showDialog({ type: "error", title: "Payment Verification Failed", description: error });
              return;
            }

            if (data?.status === 200) {
              showDialog({ type: "success", title: "Payment Successful", description: data.message });
            }
          } catch (err) {
            showDialog({ type: "error", title: "Payment Verification Failed", description: err.message });
          }
        },
        modal: {
          ondismiss: () => {
            showDialog({ type: "info", title: "Payment Cancelled", description: "You cancelled the payment process." });
          },
        },
      });

      rzp.open();
    } catch (err) {
      showDialog({ type: "error", title: "Order Failed", description: err.message });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left - Order Summary */}
          <div>
            <div className="border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">
                Order Summary
              </h2>

              {loadingProduct ? (
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-20" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ) : (
                variant && (
                  <div className="flex gap-4">
                    <div className="relative h-24 w-20 overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={variant.images?.[0]}
                        alt={productDetails?.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {productDetails?.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {variant.color} / {variant.size}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <div className="inline-flex items-center border border-gray-200 rounded">
                            <button
                              type="button"
                              onClick={() => setQty((q) => Math.max(1, q - 1))}
                              disabled={qty <= 1}
                              className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-medium text-gray-900">{qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty((q) => Math.min(variant.stock || 99, q + 1))}
                              disabled={variant.stock && qty >= variant.stock}
                              className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(variant.effectivePrice * qty)?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )
              )}

              <Separator className="my-5" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCharges === 0 ? "Free" : `₹${shippingCharges}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-gray-900 text-base pt-1">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Address + Payment */}
          <div className="space-y-6">
            <div className="border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">
                Delivery Address
              </h2>
              <AddressList mode="selectable" onSelect={setSelectedAddress} />
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
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="text-sm text-gray-700">Pay Online (Razorpay)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="text-sm text-gray-700">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={loading || loadingProduct}
              className="w-full h-12 rounded-none bg-brand text-white text-sm font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors"
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCheckoutPage;
