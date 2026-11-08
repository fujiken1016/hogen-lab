import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { PageDates } from "@/components/PageDates";

const BASE = "https://hogen.mainichi-lab.com";

export const metadata: Metadata = {
  title: "方言ラボ | あなたの言葉は、何弁？",
  description:
    "方言タイプ診断・友達との相性診断・方言翻訳・方言クイズ検定。日本の方言を遊んで学ぶ「ことばの粋」体験。",
  alternates: { canonical: BASE },
  openGraph: {
    title: "方言ラボ | あなたの言葉は、何弁？",
    description:
      "方言タイプ診断・相性診断・方言変換・方言検定。日本の方言を遊んで学べる無料サービス。",
    url: BASE,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Google の「サイト名」用（検索結果でサイト名を方言ラボと出す）。WebSite は home のみに置く（J365）。
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "方言ラボ",
  url: `${BASE}/`,
  inLanguage: "ja",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_LD) }}
      />
      <HomeClient />
      <PageDates route="/" type="WebPage" name="方言ラボ" />
    </>
  );
}
