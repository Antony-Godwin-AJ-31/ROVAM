import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
