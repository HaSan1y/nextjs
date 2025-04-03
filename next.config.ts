import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['example.com,http://localhost:3000/'], // Add domains for optimized images
  },
};

export default nextConfig;
