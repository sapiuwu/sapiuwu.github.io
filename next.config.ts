import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true, // Required: GitHub Pages cannot run the Next.js image optimization server
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  basePath: process.env.NODE_ENV === "production" ? "/sapiuwu.github.io" : "", 
};

export default nextConfig;
