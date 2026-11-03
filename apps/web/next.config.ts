import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gai/gt-core", "@gai/schema", "@gai/learning", "@gai/calibration", "@gai/coach"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Header bảo mật cơ bản cho mọi trang
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
