"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ROUTE_PATH from "@/libs/route-path";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { useAppDialog } from "@/contexts/AppDialogContext";

// ✅ Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || ROUTE_PATH.MAIN.HOME; // fallback

  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const authUserState = useSelector((state) => state.auth);

  const { showDialog } = useAppDialog();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const { request: loginRequest, loading: loginLoading } = useAxios();

  const {
    request: resendRequest,
    loading: resendLoading,
  } = useAxios();

  const handleResendVerification = async (email) => {
    const { data, error } = await resendRequest({
      method: "POST",
      url: "/user/resend-verification-email",
      payload: { email },
      authRequired: false,
    });

    if (error) {
      showToast("error", error);
    } else {
      showToast("success", data?.message || "Verification email sent!");
    }
  };

  const handleLogin = async (payload) => {
    setSubmitting(true);
    const { data, error } = await loginRequest({
      method: "POST",
      url: "/user/login-user",
      payload,
      authRequired: false,
    });

    if (error) {
      const isVerifyError = error && error.toLowerCase().includes("verify");
      showDialog({
        title: error || "Login Failed",
        description: isVerifyError ? (
          <p className="text-sm text-muted-foreground">
            Your email is not yet verified. Please check your inbox (and spam
            folder) for the verification email, or click below to resend it.
          </p>
        ) : null,
        buttons: [
          ...(isVerifyError
            ? [
                {
                  label: "Resend Verification Email",
                  variant: "outline",
                  onClick: () => handleResendVerification(payload.email),
                },
              ]
            : []),
          {
            label: "Ok",
            onClick: () => {},
          },
        ],
      });
      setSubmitting(false);
    } else {
      showToast("success", data?.message || "Logged in successfully");
      dispatch(loginUser(data.data));

      // ✅ Redirect to original page or fallback
      router.push(redirect);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand">
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground text-sm">Login to continue</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={loginLoading || submitting}
                    className="rounded-xl focus:ring-2 focus:ring-brand"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={loginLoading || submitting}
                      className="rounded-xl focus:ring-2 focus:ring-brand pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition"
              disabled={loginLoading || submitting}
            >
              {loginLoading || submitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Links */}
          <p className="text-sm text-center text-muted-foreground mt-4">
            <Link
              href={ROUTE_PATH.AUTH.FORGOT_PASSWORD}
              className="text-brand hover:underline"
            >
              Forgot Password?
            </Link>{" "}
            ·{" "}
            <Link
              href={ROUTE_PATH.AUTH.SIGNUP}
              className="text-brand hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
