import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "swfgvfhpmicwptupjyko.supabase.co", // Supabase storage domain
    ],
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
};

export default nextConfig;
