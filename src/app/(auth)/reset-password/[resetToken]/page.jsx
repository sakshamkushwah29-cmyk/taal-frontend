"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // 👁 eye icons
import ROUTE_PATH from "@/libs/route-path";

// ✅ Schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const { resetToken } = useParams(); // ✅ extract token from params
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });

  const { request: resetPasswordRequest, loading: resetPasswordLoading } =
    useAxios();

  const handleResetPassword = async (payload) => {
    if (!resetToken) {
      return showToast("error", "Invalid or missing reset token.");
    }

    setSubmitting(true);
    const { data, error } = await resetPasswordRequest({
      method: "PUT",
      url: "/user/reset-password",
      payload: { ...payload, token: resetToken },
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
            Reset Password
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Enter your new password below.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter new password"
                      disabled={resetPasswordLoading || submitting}
                      className="pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      disabled={resetPasswordLoading || submitting}
                      className="pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer bg-brand text-white hover:bg-brand-light transition"
              disabled={resetPasswordLoading || submitting}
            >
              {resetPasswordLoading || submitting
                ? "Submitting..."
                : "Reset Password"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Back to{" "}
            <Link
              href={ROUTE_PATH.AUTH.LOGIN}
              className="text-brand hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
