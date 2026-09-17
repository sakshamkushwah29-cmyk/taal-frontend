"use client";

import AppCarousal from "@/components/common/AppCarousal";
import AppTrustBadges from "@/components/common/AppTrustBadges";
import AppCategories from "@/components/common/AppCategories";
import AppTopSellers from "@/components/common/AppTopSellers";
import AppDealsOfTheDay from "@/components/common/AppDealsOfTheDay";
import AppFreshArrivals from "@/components/common/AppFreshArrivals";
import AppPromoBanner from "@/components/common/AppPromoBanner";
import AppRentalShowcase from "@/components/common/AppRentalShowcase";
import AppEventCardGrid from "@/components/common/AppEventCardGrid";
import AppSponsors from "@/components/common/AppSponsors";
import AppCustomerReviews from "@/components/common/AppCustomerReviews";
import AppAboutUs from "@/components/common/AppAboutUs";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <AppCarousal />

      {/* Trust signals */}
      <AppTrustBadges />

      {/* Browse by category */}
      <AppCategories />

      {/* Best sellers */}
      <AppTopSellers />

      {/* Hot deals */}
      <AppDealsOfTheDay />

      {/* Mid-page promo CTA */}
      <AppPromoBanner />

      {/* Latest products */}
      <AppFreshArrivals />

      {/* Rental products */}
      <AppRentalShowcase />

      {/* Events */}
      <AppEventCardGrid />

      {/* Brand partners */}
      <AppSponsors />

      {/* Social proof */}
      <AppCustomerReviews />

      {/* Brand story */}
      <AppAboutUs />
    </>
  );
}
