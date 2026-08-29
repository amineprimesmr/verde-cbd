import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Vercel Image Optimization renvoie 402 sur ce plan — servir /public directement
    unoptimized: true,
  },
};

export default nextConfig;
