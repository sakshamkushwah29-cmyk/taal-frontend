"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit mobile number"),
  label: z.enum(["Home", "Work", "Other"]),
  line1: z.string().min(3, "Address Line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z
    .string()
    .min(1, "State is required")
    .refine((val) => INDIAN_STATES.includes(val), "Select a valid state"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  isDefault: z.boolean(),
});

function AddressAddEditDialog({
  open,
  setOpen,
  initialForm,
  onSave,
  loading,
  editing,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      label: "Home",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialForm || {
          fullName: "",
          phone: "",
          label: "Home",
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        }
      );
    }
  }, [open, initialForm, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-none sm:rounded-none p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-5 border-b border-gray-200">
          <DialogTitle className="text-sm font-semibold text-gray-900">
            {editing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => onSave({ ...data, country: "India" }))}
          className="flex flex-col max-h-[70vh]"
        >
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
            {/* Label selector */}
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setValue("label", lbl)}
                  className={`px-4 py-2 text-xs font-medium tracking-wide uppercase transition ${
                    watch("label") === lbl
                      ? "bg-brand text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              {[
                { name: "fullName", label: "Full Name", placeholder: "Enter full name" },
                { name: "phone", label: "Phone Number", placeholder: "Enter phone number" },
                { name: "line1", label: "Address Line 1", placeholder: "Flat / House No., Building" },
                { name: "line2", label: "Address Line 2", placeholder: "Landmark / Street" },
                { name: "city", label: "City", placeholder: "City" },
                { name: "pincode", label: "Pincode", placeholder: "Postal code" },
              ].map((field) => {
                const isNumeric = field.name === "phone" || field.name === "pincode";
                const maxLength = field.name === "phone" ? 10 : field.name === "pincode" ? 6 : undefined;
                return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs font-medium text-gray-600">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    inputMode={isNumeric ? "numeric" : undefined}
                    maxLength={maxLength}
                    onInput={
                      isNumeric
                        ? (e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, maxLength);
                          }
                        : undefined
                    }
                    className="w-full rounded-none border-gray-200 focus:ring-brand focus:border-brand text-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
                );
              })}

              {/* State dropdown */}
              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-xs font-medium text-gray-600">
                  State
                </Label>
                <Select
                  value={watch("state") || ""}
                  onValueChange={(val) =>
                    setValue("state", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    id="state"
                    className="w-full rounded-none border-gray-200 focus:ring-brand focus:border-brand text-sm"
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none max-h-60">
                    {INDIAN_STATES.map((st) => (
                      <SelectItem key={st} value={st} className="text-sm">
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-red-500 text-xs">{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Default checkbox */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="isDefault"
                {...register("isDefault")}
                className="w-4 h-4 accent-brand rounded-none"
              />
              <Label htmlFor="isDefault" className="text-xs text-gray-600">
                Set as default address
              </Label>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="p-4 sm:p-5 border-t border-gray-200">
            <Button
              type="submit"
              className="w-full h-11 rounded-none bg-brand text-white text-xs font-semibold tracking-wide uppercase hover:bg-brand-light transition-colors"
              disabled={loading}
            >
              {editing ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddressAddEditDialog;
