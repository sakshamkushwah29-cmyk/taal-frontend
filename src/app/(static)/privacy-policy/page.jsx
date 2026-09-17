"use client";

import useAxios from "@/hooks/useAxios";
import React, { useEffect, useState } from "react";

export default function PrivacyPolicyPage() {
  const { request: apiRequest, loading } = useAxios();
  const [policyHtml, setPolicyHtml] = useState("");

  useEffect(() => {
    const fetchPolicy = async () => {
      const { data, error } = await apiRequest({
        url: "/user/get-policy?type=privacy_policy",
        method: "GET",
      });

      if (error) {
        console.error("Error fetching privacy policy:", error);
        return;
      }

      if (data?.data?.content) {
        setPolicyHtml(data.data.content);
      }
    };

    fetchPolicy();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="py-12 px-4 sm:px-6 text-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Learn how we collect, use, and safeguard your personal information
          while ensuring your rights and privacy.
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading privacy policy...
          </p>
        ) : (
          <div
            className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: policyHtml }}
          />
        )}
      </div>
    </div>
  );
}
