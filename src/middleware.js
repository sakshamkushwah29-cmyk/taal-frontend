import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

let clerkHandler;
try {
  clerkHandler = clerkMiddleware();
} catch (e) {
  clerkHandler = () => NextResponse.next();
}

export default async function middleware(req, ev) {
  try {
    return await clerkHandler(req, ev);
  } catch (err) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
