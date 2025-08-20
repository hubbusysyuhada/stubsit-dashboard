import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: []
  },
  reactStrictMode: true
  /* config options here */
};

export default nextConfig;
