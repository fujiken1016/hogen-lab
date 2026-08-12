import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { TYPES } from "@/lib/types";
import { SECRETS } from "@/lib/secret";

const BASE = "https://hogen.mainichi-lab.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/shindan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/aishou`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/translate`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/quiz`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/today`, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/dict`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articles: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const characters: MetadataRoute.Sitemap = [
    ...TYPES.map((t) => t.slug),
    ...SECRETS.map((s) => s.slug),
  ].map((slug) => ({
    url: `${BASE}/c/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...articles, ...characters];
}
