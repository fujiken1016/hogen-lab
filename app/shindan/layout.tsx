import type { Metadata } from "next";

// このページは "use client" のため page.tsx から metadata を export できない。
// Next.js の作法どおり、ルート単位の layout でメタデータを持たせる。
const BASE = "https://hogen.mainichi-lab.com";

export const metadata: Metadata = {
  title: "方言タイプ診断｜あなたの言葉は何弁？（全問無料） | 方言ラボ",
  description:
    "育った地域とふだんの言い回しから、あなたの方言タイプを診断します。全国の方言キャラで結果を表示し、友達との相性チェックにも使えます。登録不要・スマホで1分。",
  alternates: { canonical: `${BASE}/shindan` },
  openGraph: {
    title: "方言タイプ診断｜あなたの言葉は何弁？（全問無料） | 方言ラボ",
    description: "育った地域と言い回しから方言タイプを診断。登録不要・1分。",
    url: `${BASE}/shindan`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
