"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import ROUTE_PATH from "@/libs/route-path";

export default function EmailVerificationPage() {
  const { token } = useParams(); // ✅ extract token from params
  const router = useRouter();
  const { request } = useAxios();

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      setStatus("loading");
      const { data, error } = await request({
        method: "PUT",
        url: "/user/verify-email-with-link",
        payload: { token },
        authRequired: false,
      });

      if (error) {
        setStatus("error");
        setMessage(error || "Verification failed. Try again.");
        showToast("error", error);
      } else {
        setStatus("success");
        setMessage(data?.message || "Email verified successfully!");
        showToast("success", data?.message || "Verified!");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-white border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-brand">
            Email Verification
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Verifying your email securely...
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <p className="text-lg font-semibold text-brand-secondary">
                {message}
              </p>
              <Button
                onClick={() => router.push(ROUTE_PATH.AUTH.LOGIN)}
                className="mt-3 w-full rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-2 text-center">
              <XCircle className="h-12 w-12 text-red-600" />
              <p className="text-lg font-semibold text-red-600">{message}</p>
              <Link
                href={ROUTE_PATH.AUTH.SIGNUP}
                className="mt-2 text-brand hover:underline"
              >
                Try Signing Up Again
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
