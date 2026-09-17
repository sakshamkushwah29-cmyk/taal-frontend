"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";

// ✅ Validation Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
    .optional()
    .or(z.literal("")),
});

export default function EditProfilePage() {
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(profileSchema),
  });

  const { request: getProfile } = useAxios();
  const { request: updateProfile, loading: updating } = useAxios();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      const { data, error } = await getProfile({
        method: "GET",
        url: "/user/get-user-profile",
        authRequired: true,
      });

      if (error) {
        showToast("error", "Failed to load profile");
      } else {
        setValue("name", data?.data?.name || "");
        setValue("email", data?.data?.email || "");
        setValue("phone", data?.data?.phone || "");
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (payload) => {
    const { data, error } = await updateProfile({
      method: "PUT",
      url: "/user/update-user-profile",
      payload,
      authRequired: true,
    });

    if (error) {
      showToast("error", error);
    } else {
      showToast("success", data.message || "Profile updated successfully!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-yellow-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-purple-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
            Edit Profile
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Update your account information
          </p>
        </CardHeader>

        <CardContent>
          {loadingProfile ? (
            <p className="text-center text-gray-500">Loading profile...</p>
          ) : (
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} id="name" placeholder="Enter your name" />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      placeholder="Enter 10-digit phone number"
                      type="tel"
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-yellow-500 hover:opacity-90"
                disabled={updating}
              >
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
