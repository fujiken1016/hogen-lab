import type { Metadata } from "next";

// このページは "use client" のため page.tsx から metadata を export できない。
// Next.js の作法どおり、ルート単位の layout でメタデータを持たせる。
const BASE = "https://hogen.mainichi-lab.com";

export const metadata: Metadata = {
  title: "みんなの方言辞書｜地元の言い回しを投稿して集める | 方言ラボ",
  // 🔴 2026-10-08：以前ここは「全国の方言データと見比べられます」と書いていたが、
  // この面に照合の実装は無い（投稿は端末内に貯まるだけ・辞典データは別物）。
  // 同型＝/today の「バッジが集まります」（2026-10-05 修正）。約束は実装に在るものだけ書く。
  description:
    "地元で使う言い回しを、意味と例文つきで登録して、自分だけの方言辞書を育てられます。投稿はこの端末のブラウザの中だけに保存され、サーバーには送られません。登録不要。",
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
