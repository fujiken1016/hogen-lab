import type { Metadata } from "next";

// このページは "use client" のため page.tsx から metadata を export できない。
// Next.js の作法どおり、ルート単位の layout でメタデータを持たせる。
const BASE = "https://hogen.mainichi-lab.com";

export const metadata: Metadata = {
  title: "今日の方言｜日替わりで全国の方言をひとつ覚える | 方言ラボ",
  description:
    "毎日ひとつ、全国の方言から言葉を紹介します。意味・使い方・どの地域の言葉かをまとめて確認でき、続けるとバッジが集まります。",
  alternates: { canonical: `${BASE}/today` },
  openGraph: {
    title: "今日の方言｜日替わりで全国の方言をひとつ覚える | 方言ラボ",
    description: "毎日ひとつ、全国の方言から言葉を紹介。意味と使い方つき。",
    url: `${BASE}/today`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
