"use client";

import React, { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { Package } from "lucide-react";
import FestivalLoading from "@/components/common/FestivalLoading";
import OrderCard from "@/components/_cards/OrderCard";

function MyOrdersPage() {
  const { request: getAllOrders, loading } = useAxios();
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await getAllOrders({
        url: "/user/my-orders",
        method: "GET",
        authRequired: true,
      });
      if (error) {
        console.error("fetchAllOrders error", error);
        return;
      }
      setOrders(data?.data?.items ?? []);
    } catch (err) {
      console.error("fetchAllOrders", err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <FestivalLoading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm">Start shopping to see your orders here.</p>
        </div>
      )}

      {/* Orders list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;
