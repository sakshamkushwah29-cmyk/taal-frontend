"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons
import ROUTE_PATH from "@/libs/route-path";
import { useAppDialog } from "@/contexts/AppDialogContext";

// ✅ Validation schema
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();

  const { showDialog } = useAppDialog();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
  });

  const { request: signupRequest, loading: signupLoading } = useAxios();

  const handleSignup = async (payload) => {
    setSubmitting(true);
    const { data, error } = await signupRequest({
      method: "POST",
      url: "/user/create-user",
      payload,
      authRequired: false,
    });

    if (error) {
      showToast("error", error);
      setSubmitting(false);
    } else {
      showToast("success", data?.message || "Account created successfully");
      showDialog({
        title: data?.message || "Account Created",
        description: (
          <div className="font-bold text-xl">
            Please check your email to verify your account by clicking on the
            Verify button. Once verified, you can log in to your account.
          </div>
        ),
        buttons: [
          {
            label: "Ok",
            onClick: () => {
              router.push(ROUTE_PATH.AUTH.LOGIN);
            },
          },
        ],
      });
      // router.push(ROUTE_PATH.AUTH.LOGIN);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-white border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-brand">
            Create Account
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Join us and start your journey!
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter your full name"
                    disabled={signupLoading || submitting}
                    className="rounded-xl focus:ring-2 focus:ring-brand"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

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
                    disabled={signupLoading || submitting}
                    className="rounded-xl focus:ring-2 focus:ring-brand"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    disabled={signupLoading || submitting}
                    className="rounded-xl focus:ring-2 focus:ring-brand"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={signupLoading || submitting}
                      className="rounded-xl pr-10 focus:ring-2 focus:ring-brand"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your confirm password"
                      disabled={signupLoading || submitting}
                      className="rounded-xl pr-10 focus:ring-2 focus:ring-brand"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition"
              disabled={signupLoading || submitting}
            >
              {signupLoading || submitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          {/* Links */}
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              href={ROUTE_PATH.AUTH.LOGIN}
              className="text-brand hover:underline"
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
