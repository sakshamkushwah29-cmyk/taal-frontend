"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import ROUTE_PATH from "@/libs/route-path";
import { showToast } from "@/components/_ui/toast-utils";
import { logoutUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { signOut } = useClerk();

  useEffect(() => {
    let isMounted = true;

    const handleLogout = async () => {
      try {
        await signOut();
      } catch (err) {
        console.warn("Clerk signOut error:", err);
      }

      dispatch(logoutUser());
      showToast("success", "Logged out successfully!");

      if (isMounted) {
        setTimeout(() => {
          router.replace(ROUTE_PATH.AUTH.LOGIN);
        }, 800);
      }
    };

    handleLogout();

    return () => {
      isMounted = false;
    };
  }, [dispatch, router, signOut]);

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 py-10">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-lg font-medium text-gray-700">Logging you out...</p>
      </div>
    </div>
  );
}
