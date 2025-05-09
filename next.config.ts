import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api-sandbox.sebgroup.com'],
  },
};

export default nextConfig;
