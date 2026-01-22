import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    root: import.meta.dirname,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
    ],
  },

  // Security headers
  poweredByHeader: false,

  // Strict mode for catching potential issues
  reactStrictMode: true,
};

export default nextConfig;
