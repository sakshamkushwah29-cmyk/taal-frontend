"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ROUTE_PATH from "@/libs/route-path";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || ROUTE_PATH.MAIN.HOME;

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <SignIn
        routing="hash"
        signUpUrl="/signup"
        fallbackRedirectUrl={redirect}
        appearance={{
          variables: {
            colorPrimary: "#5A0117",
            colorTextOnPrimaryBackground: "#ffffff",
            borderRadius: "0.75rem",
            fontFamily: "inherit",
          },
          elements: {
            card: "shadow-2xl rounded-2xl border border-gray-100 bg-white",
            headerTitle: "text-2xl font-bold text-[#5A0117]",
            headerSubtitle: "text-sm text-gray-500",
            formButtonPrimary:
              "bg-[#5A0117] hover:bg-[#7A1A35] text-white shadow-md transition-all duration-200",
            footerActionLink: "text-[#5A0117] hover:text-[#7A1A35] font-semibold",
          },
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50/50 px-4 py-12">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm">Loading sign in...</p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
