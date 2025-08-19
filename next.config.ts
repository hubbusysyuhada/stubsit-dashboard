import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: []
  },
  reactStrictMode: true
  /* config options here */
};

export default nextConfig;
