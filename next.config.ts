import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a fully static site in `out/` for static hosting (cPanel).
  output: "export",
  // Emit `/route/index.html` so Apache serves clean URLs on refresh/direct hit.
  trailingSlash: true,
  // next/image optimization needs a server; disable it for static export.
  images: { unoptimized: true },
};

export default nextConfig;
