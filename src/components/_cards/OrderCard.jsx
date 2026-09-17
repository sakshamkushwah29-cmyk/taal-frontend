"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format } from "date-fns";
import { CreditCard, Truck, RefreshCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";

export default function OrderCard({ order }) {
  const router = useRouter();
  const { request: apiRequest } = useAxios();
  const [reordering, setReordering] = useState(false);

  const handleReorder = async (e) => {
    e.stopPropagation();
    if (reordering) return;
    setReordering(true);
    try {
      const { data, error } = await apiRequest({
        url: "/user/order-details",
        method: "GET",
        authRequired: true,
        params: { orderId: order._id },
      });

      if (error || !data?.data?.items?.length) {
        showToast("error", error || "Unable to load order items");
        return;
      }

      let added = 0;
      let failed = 0;
      for (const item of data.data.items) {
        const { error: addError } = await apiRequest({
          url: "/user/add-to-cart",
          method: "POST",
          authRequired: true,
          payload: {
            productId: item.product,
            variantId: item.variantId,
            qty: item.qty,
          },
        });
        if (addError) failed += 1;
        else added += 1;
      }

      if (added === 0) {
        showToast("error", "Could not add items to cart");
        return;
      }

      showToast(
        "success",
        failed
          ? `${added} item(s) added to cart, ${failed} unavailable`
          : "Items added to cart"
      );
      router.push("/cart");
    } catch (err) {
      showToast("error", err?.message || "Reorder failed");
    } finally {
      setReordering(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <Card
      key={order._id}
      className={cn(
        "overflow-hidden border rounded-xl hover:shadow-lg transition cursor-pointer"
      )}
      onClick={() => router.push(`/account/my-orders/${order._id}`)}
    >
      <CardContent className="p-5">
        {/* Product Section */}
        <div className="flex gap-5">
          <div className="relative h-32 w-28 flex-shrink-0 rounded-lg overflow-hidden border">
            <Image
              src={order.coverImage}
              alt={order.firstItem?.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h2 className="font-semibold text-base line-clamp-2">
                {order.firstItem?.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {order.firstItem?.qty} × {order.firstItem?.size},{" "}
                {order.firstItem?.color}
              </p>
            </div>

            {/* Status chips */}
            <div className="flex items-center gap-2 mt-3">
              <Badge
                variant="outline"
                className={`${getStatusBadge(order.paymentStatus)} text-xs`}
              >
                {order.paymentStatus}
              </Badge>
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-700 border-slate-200 text-xs"
              >
                {order.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Details */}
        <div className="flex justify-between text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium">Order ID</p>
            <p className="text-gray-500 truncate text-xs">{order._id}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-medium">Total</p>
            <p className="text-purple-600 font-semibold text-base">
              ₹{order.total}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            {order.paymentGateway}
          </div>
          <p>{format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}</p>
        </div>

        {/* Actions (don’t bubble click to parent) */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/account/my-orders/${order._id}`);
            }}
          >
            <Truck className="w-4 h-4" /> Track
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-lg flex items-center gap-2"
            disabled={reordering}
            onClick={handleReorder}
          >
            {reordering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}{" "}
            Reorder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
