/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      "pk_test_ZW5hYmxlZC1yZWluZGVlci00NjczLmNsZXJrLmFjY291bnRzLmRldiQ",
    CLERK_SECRET_KEY:
      process.env.CLERK_SECRET_KEY ||
      "sk_test_lpsPMpPEIXprcvopUJUloSqZdhEdwt9OKWElNVdf3l",
  },
  // reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "medlivurr.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "ondseller.co",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      { protocol: "https", hostname: "media.istockphoto.com" },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "backend.taal.life",
      },
      {
        protocol: "https",
        hostname: "taal.life",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "taal-backend-yjs9.onrender.com",
      },
    ],
  },
};

export default nextConfig;
