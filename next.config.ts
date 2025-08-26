import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/config.ts");

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

export default withNextIntl(nextConfig);
