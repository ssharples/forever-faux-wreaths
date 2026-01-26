import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    root: import.meta.dirname,
  },

  // Image optimization with WebP/AVIF conversion
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
    ],
    // Optimize quality for smaller file sizes
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Security headers
  poweredByHeader: false,

  // Strict mode for catching potential issues
  reactStrictMode: true,
};

export default nextConfig;
