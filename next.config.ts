import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  basePath: '/app',
  images: {
    domains: ['example.com', 'localhost'],
    loader: 'default',
  },
};

export default nextConfig;
