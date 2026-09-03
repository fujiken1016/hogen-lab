import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { QUIZ_DIALECTS, quizSlug } from "@/lib/quiz_meta";
import { TRANSLATE_DIALECTS, translateSlug } from "@/lib/translate_meta";
import { pageDates } from "@/lib/page_dates";

const BASE = "https://hogen.mainichi-lab.com";

/** lastmod は git 由来の実際の更新日を使う（lib/page_dates.json ← scripts/gen_page_dates.mjs） */
function lastmod(route: string): Date | undefined {
  const d = pageDates(route);
  return d ? new Date(`${d.modified}T00:00:00+09:00`) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: lastmod("/"), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/shindan`, lastModified: lastmod("/shindan"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: lastmod("/blog"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/aishou`, lastModified: lastmod("/aishou"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/translate`, lastModified: lastmod("/translate"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/quiz`, lastModified: lastmod("/quiz"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/doko`, lastModified: lastmod("/doko"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/kawaii`, lastModified: lastmod("/kawaii"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kurabe`, lastModified: lastmod("/kurabe"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/today`, lastModified: lastmod("/today"), changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/dict`, lastModified: lastmod("/dict"), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: lastmod("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: lastmod("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: lastmod("/disclaimer"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: lastmod("/contact"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const articles: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: lastmod(`/blog/${a.slug}`) ?? new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 方言別の検定（/quiz/[slug]）。「○○弁検定」の検索で個別に拾われるページなので全て載せる。
  const quizzes: MetadataRoute.Sitemap = QUIZ_DIALECTS.map((d) => ({
    url: `${BASE}/quiz/${quizSlug(d)}`,
    lastModified: lastmod(`/quiz/${quizSlug(d)}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 方言別の変換（/translate/[slug]）。「○○弁 変換」「○○弁 翻訳」の検索で個別に拾うページ。
  const translates: MetadataRoute.Sitemap = TRANSLATE_DIALECTS.map((d) => ({
    url: `${BASE}/translate/${translateSlug(d)}`,
    lastModified: lastmod(`/translate/${translateSlug(d)}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // キャラ個別ページ（/c/[slug]）は noindex にしたため sitemap には載せない。
  // → app/c/[slug]/layout.tsx の metadata.robots を参照。
  return [...staticPages, ...articles, ...quizzes, ...translates];
}
