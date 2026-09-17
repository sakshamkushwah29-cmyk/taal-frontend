"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ROUTE_PATH from "@/libs/route-path";

// ✅ Schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { request: forgotPasswordRequest, loading: forgotPasswordLoading } =
    useAxios();

  const handleForgotPassword = async (payload) => {
    setSubmitting(true);
    const { data, error } = await forgotPasswordRequest({
      method: "POST",
      url: "/user/forget-password",
      payload: payload,
    });

    if (error) {
      showToast("error", error);
      setSubmitting(false);
    } else {
      showToast("success", data.message);
      router.push(ROUTE_PATH.AUTH.LOGIN);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-brand">
            Forgot Password
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Enter your email address to receive a password reset link.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="space-y-4"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    disabled={forgotPasswordLoading || submitting}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer bg-brand text-white hover:bg-brand-light transition"
              disabled={forgotPasswordLoading || submitting}
            >
              {forgotPasswordLoading || submitting ? "Submitting..." : "Submit"}
            </Button>
          </form>

          {/* Back to login */}
          <p className="text-sm text-center text-muted-foreground mt-4">
            Remembered your password?{" "}
            <Link
              href={ROUTE_PATH.AUTH.LOGIN}
              className="text-brand hover:underline font-medium"
            >
              Go back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
