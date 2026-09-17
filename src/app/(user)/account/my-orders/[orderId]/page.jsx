"use client";

import useAxios from "@/hooks/useAxios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Package,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import Image from "next/image";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const { request: getOrderDetails, loading } = useAxios();
  const [order, setOrder] = useState(null);

  const fetchOrderDetails = async () => {
    const { data } = await getOrderDetails({
      method: "GET",
      url: `/user/order-details`,
      authRequired: true,
      params: { orderId },
    });
    if (data?.success) setOrder(data.data);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <Badge variant="secondary" className="text-base capitalize">
          {order.orderStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="break-all">{order._id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Placed On</p>
                <p>{dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment</p>
                <p className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {order.paymentMethod} ({order.paymentStatus})
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="flex items-center gap-1 font-semibold">
                  <IndianRupee className="w-4 h-4" />
                  {order.total}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <Image
                    src={item.image}
                    alt={item.titleSnapshot}
                    width={80}
                    height={80}
                    className="rounded-md border"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.titleSnapshot}</h3>
                    <p className="text-sm text-muted-foreground">
                      Color: {item.colorSnapshot} | Size: {item.sizeSnapshot}
                    </p>
                    <p className="text-sm">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {item.total}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="flex items-start gap-4 text-sm">
              <MapPin className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{order.address.fullName}</p>
                <p>
                  {order.address.line1}, {order.address.line2}
                </p>
                <p>
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>
                <p>{order.address.country}</p>
                <p className="text-muted-foreground">
                  Phone: {order.address.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative flex flex-col space-y-8">
                {order.timeline.map((step, idx) => {
                  const isLast = idx === order.timeline.length - 1;
                  const done = step.done;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="relative flex items-start gap-4"
                    >
                      {/* Icon + Connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                            done
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Package className="w-4 h-4" />
                        </div>
                        {!isLast && (
                          <div
                            className={`flex-1 w-0.5 mt-1 ${
                              done ? "bg-green-400" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="flex flex-col">
                        <p
                          className={`font-medium ${
                            done ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.at
                            ? dayjs(step.at).format("DD MMM YYYY, hh:mm A")
                            : "Pending"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
