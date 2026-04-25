import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Ensure Prisma is treated as an external package in the server runtime
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
