import { clerkMiddleware } from "@clerk/nextjs/server";

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZW5hYmxlZC1yZWluZGVlci00NjczLmNsZXJrLmFjY291bnRzLmRldiQ";
const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_lpsPMpPEIXprcvopUJUloSqZdhEdwt9OKWElNVdf3l";

export default clerkMiddleware(undefined, {
  publishableKey,
  secretKey,
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
