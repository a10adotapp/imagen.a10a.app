import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ngrok-free.app",
      },
      {
        protocol: "https",
        hostname: "**.line.me",
      },
    ],
  },
};

export default nextConfig;
