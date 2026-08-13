import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "かわいい方言トーナメント｜好きな方言を7回タップで決める | 方言ラボ";
const DESC =
  "「めんこい」「はんなり」「とっとーと」…全国のかわいい方言8語をトーナメント形式で1対1対決。2つから好きな方を選ぶだけ、約1分であなたの“優勝方言”が決まります。結果はシェアできます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://hogen.mainichi-lab.com/kawaii" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://hogen.mainichi-lab.com/kawaii",
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function KawaiiLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
