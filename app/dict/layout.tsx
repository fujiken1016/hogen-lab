import type { Metadata } from "next";

// このページは "use client" のため page.tsx から metadata を export できない。
// Next.js の作法どおり、ルート単位の layout でメタデータを持たせる。
const BASE = "https://hogen.mainichi-lab.com";

export const metadata: Metadata = {
  title: "みんなの方言辞書｜地元の言い回しを投稿して集める | 方言ラボ",
  description:
    "地元で使う言い回しを登録して、自分だけの方言辞書を育てられます。投稿した言葉は端末内に保存され、全国の方言データと見比べられます。",
  alternates: { canonical: `${BASE}/dict` },
  openGraph: {
    title: "みんなの方言辞書｜地元の言い回しを投稿して集める | 方言ラボ",
    description: "地元の言い回しを登録して、自分の方言辞書を育てる。",
    url: `${BASE}/dict`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
