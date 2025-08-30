import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "swfgvfhpmicwptupjyko.supabase.co", // Supabase storage domain
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  webpack: (config, { isServer }) => {
    // Fix for Prisma client in production builds
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
