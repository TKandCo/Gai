import type { MetadataRoute } from "next";
import { ALL_LESSONS } from "@gai/learning";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thuankhoi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/learn", "/lab", "/analyze", "/coach", "/journal"];
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...ALL_LESSONS.map((l) => ({ url: `${SITE}/learn/${l.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
