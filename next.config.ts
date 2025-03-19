import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['example.com'], // Add domains for optimized images
  },
};

export default nextConfig;
