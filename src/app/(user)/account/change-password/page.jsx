"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

// ✅ Schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export default function ChangePasswordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
  });

  const { request: changePasswordRequest, loading: changePasswordLoading } =
    useAxios();

  // 🔒 Show/Hide states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (payload) => {
    setSubmitting(true);
    const { data, error } = await changePasswordRequest({
      method: "PUT",
      url: "/user/change-password",
      payload,
      authRequired: true,
    });

    if (error) {
      showToast("error", error);
      setSubmitting(false);
    } else {
      showToast("success", data.message || "Password changed successfully!");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-yellow-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-purple-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
            Change Password
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Secure your account with a new password.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(handleChangePassword)}
            className="space-y-4"
          >
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Controller
                  name="currentPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showCurrent ? "text" : "password"}
                      id="currentPassword"
                      placeholder="Enter current password"
                      disabled={changePasswordLoading || submitting}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex={-1}
                >
                  {showCurrent ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Controller
                  name="newPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showNew ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter new password"
                      disabled={changePasswordLoading || submitting}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex={-1}
                >
                  {showNew ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className="relative">
                <Controller
                  name="confirmNewPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      id="confirmNewPassword"
                      placeholder="Confirm new password"
                      disabled={changePasswordLoading || submitting}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-yellow-500 hover:opacity-90"
              disabled={changePasswordLoading || submitting}
            >
              {changePasswordLoading || submitting
                ? "Updating..."
                : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
