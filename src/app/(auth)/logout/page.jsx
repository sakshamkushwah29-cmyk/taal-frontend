"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import ROUTE_PATH from "@/libs/route-path";
import { showToast } from "@/components/_ui/toast-utils";
import { logoutUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        dispatch(logoutUser());
        showToast("success", "Logged out successfully!");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.replace(ROUTE_PATH.AUTH.LOGIN);
        }, 2000);
      } catch (err) {
        console.error("Logout failed:", err);
        router.replace(ROUTE_PATH.AUTH.LOGIN);
      }
    };

    handleLogout();
  }, [dispatch, router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 py-10">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-lg font-medium text-gray-700">Logging you out...</p>
      </div>
    </div>
  );
}
