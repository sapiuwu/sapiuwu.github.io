import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // GitHub Pages serves /page/ -> page/index.html
  images: {
    unoptimized: true, // Required: GitHub Pages cannot run the Next.js image optimization server
  },
};

export default nextConfig;