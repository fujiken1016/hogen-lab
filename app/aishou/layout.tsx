import type { Metadata } from "next";

// このページは "use client" のため page.tsx から metadata を export できない。
// Next.js の作法どおり、ルート単位の layout でメタデータを持たせる。
const BASE = "https://hogen.mainichi-lab.com";

export const metadata: Metadata = {
  title: "方言の相性チェッカー｜相性コードで診断結果を比べる | 方言ラボ",
  description:
    "方言タイプ診断の結果に出る相性コードを2つ入れるだけで、ことばの相性を多角的に鑑定します。診断をやり直さずに友達や家族と比較できます。",
  alternates: { canonical: `${BASE}/aishou` },
  openGraph: {
    title: "方言の相性チェッカー｜相性コードで診断結果を比べる | 方言ラボ",
    description: "相性コード2つで、ことばの相性を多角的に鑑定。",
    url: `${BASE}/aishou`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
