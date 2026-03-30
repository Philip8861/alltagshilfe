import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /* Konfigurator: nach CSS/HTML-Änderungen nicht aus CDN-Browser-Cache „tot“ laden */
  async headers() {
    return [
      {
        source: "/konfigurator/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
