"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import ROUTE_PATH from "@/libs/route-path";
import { useSelector } from "react-redux";

const publicRoutes = [
  // AUTH
  ROUTE_PATH.AUTH.LOGIN,
  ROUTE_PATH.AUTH.LOGOUT,
  ROUTE_PATH.AUTH.SIGNUP,
  ROUTE_PATH.AUTH.EMAIL_VERIFICATION,
  ROUTE_PATH.AUTH.FORGOT_PASSWORD,
  ROUTE_PATH.AUTH.RESET_PASSWORD,
  // STATIC
  ROUTE_PATH.STATIC.PRIVACY_POLICY,
  ROUTE_PATH.STATIC.TERMS_OF_USE,
  ROUTE_PATH.STATIC.FAQs,
  ROUTE_PATH.STATIC.HELP,
  // MAIN
  ROUTE_PATH.MAIN.HOME,
  ROUTE_PATH.MAIN.ABOUT,
  ROUTE_PATH.MAIN.CONTACT,
  ROUTE_PATH.MAIN.CART,
  ROUTE_PATH.MAIN.PRODUCTS,
  ROUTE_PATH.MAIN.PRODUCTS_DETAILS,
  ROUTE_PATH.MAIN.RENTALS,
  ROUTE_PATH.MAIN.EVENTS_VIEW_DETAILS,
  ROUTE_PATH.MAIN.EVENTS,
];

export default function ProtectedRoute({ children }) {
  const authUser = useSelector((state) => state.auth.authUser);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(":")) {
      const baseRoute = route.split("/:")[0];
      return pathname.startsWith(`${baseRoute}/`);
    }
    const cleanRoute = route.split("?")[0];
    return pathname === cleanRoute;
  });

  useEffect(() => {
    if (!authUser?.isAuthenticated && !isPublicRoute) {
      router.replace(ROUTE_PATH.AUTH.LOGIN);
    }
  }, [authUser, pathname, isPublicRoute, router]);

  if (!authUser?.isAuthenticated && !isPublicRoute) {
    return null; // or loader
  }

  // ✅ Fragment ensures a single React element
  return <>{children}</>;
}
