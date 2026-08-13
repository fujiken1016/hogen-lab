import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "全国方言くらべ｜同じひとことが47の地域でどう変わるか一覧 | 方言ラボ";
const DESC =
  "「ありがとう」「疲れた」「本当に？」…同じひとことが全国35方言でどう変わるかを一画面で見比べ。自分が使う言い方をタップすると、その言い方が収録されている地域が分かります。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://hogen.mainichi-lab.com/kurabe" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://hogen.mainichi-lab.com/kurabe",
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function KurabeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
