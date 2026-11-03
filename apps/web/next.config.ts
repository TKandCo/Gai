import type { NextConfig } from "next";

/**
 * Hai cách triển khai:
 * - Mặc định (Vercel / máy chủ Node): đủ tính năng, kể cả Gai AI (/api/coach).
 * - STATIC_EXPORT=1 (GitHub Pages): xuất website tĩnh vào thư mục `out/`. Không có máy chủ,
 *   nên bỏ qua file API (đuôi .api.ts) và Gai Coach tự chạy chế độ cơ bản.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@gai/gt-core", "@gai/schema", "@gai/learning", "@gai/calibration", "@gai/coach"],
  poweredByHeader: false,
  // File API dùng đuôi .api.ts: chỉ được tính là route khi có máy chủ
  pageExtensions: isStatic ? ["tsx", "ts"] : ["tsx", "ts", "api.ts"],
  ...(isStatic
    ? { output: "export" as const, images: { unoptimized: true } }
    : {
        async headers() {
          return [
            { source: "/(.*)", headers: securityHeaders },
            {
              source: "/sw.js",
              headers: [
                { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                { key: "Service-Worker-Allowed", value: "/" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
