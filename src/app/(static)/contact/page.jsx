"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionHeader from "@/components/typography/SectionHeader";
import {
  Headphones,
  Map,
  Package,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { useAppDialog } from "@/contexts/AppDialogContext";

// ✅ Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(5, "Message should be at least 5 characters"),
});

export default function ContactPage() {
  const { request: apiRequest, loading } = useAxios();

  const { showDialog } = useAppDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values) => {
    const { data, error } = await apiRequest({
      url: "/user/contact-us",
      method: "POST",
      payload: values,
    });

    if (error) {
      console.error("Error sending message:", error);
      showDialog({
        type: "error",
        title: "Submission Failed",
        description: error || "Failed to send your message. Please try again.",
      });
      return;
    }
    showDialog({
      type: "success",
      title: "Message Sent",
      description:
        data.message ||
        "Thank you for reaching out! We'll get back to you soon.",
    });
    reset();
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Title */}
        <SectionHeader
          title="Get in Touch"
          icon={Headphones}
          iconColor="text-orange-600 dark:text-yellow-300"
          gradientFrom="from-orange-500"
          gradientTo="to-yellow-500"
        />

        {/* Intro */}
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
          Have a question, feedback, or just want to say hello? We’d love to
          hear from you. Whether it’s about events, partnerships, or technical
          support — our team is always ready to connect.
        </p>

        {/* Contact Form */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-10 mb-20 transition hover:shadow-2xl">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Your Message
              </label>
              <textarea
                placeholder="Write your message..."
                rows={6}
                {...register("message")}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* Other Ways to Contact */}
        <SectionHeader
          title="Other Ways to Reach Us"
          icon={Map}
          iconColor="text-orange-600 dark:text-yellow-300"
          gradientFrom="from-orange-500"
          gradientTo="to-yellow-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          {/* Email */}
          <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition">
            <Mail className="w-10 h-10 mx-auto mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Email
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              taaleventss@gmail.com{" "}
            </p>
          </div>

          {/* Phone */}
          {/* <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition">
            <Phone className="w-10 h-10 mx-auto mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Phone
            </h3>
            <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
          </div> */}

          {/* Socials */}
          <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700 transition"
              >
                <Instagram className="w-6 h-6 text-orange-500" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700 transition"
              >
                <Facebook className="w-6 h-6 text-orange-500" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-700 transition"
              >
                <Twitter className="w-6 h-6 text-orange-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-20">
          <SectionHeader
            title="Need Help?"
            icon={Package}
            iconColor="text-orange-600 dark:text-yellow-300"
            gradientFrom="from-orange-500"
            gradientTo="to-yellow-500"
          />
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            For quick answers, visit our{" "}
            <a
              href="/faq"
              className="text-orange-600 font-semibold hover:underline"
            >
              FAQ Page
            </a>{" "}
            or reach out to our support team. We usually respond within{" "}
            <span className="font-semibold">24 hours</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
