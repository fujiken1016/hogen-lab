import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "この方言どこの言葉？｜全国方言あてクイズ（全8問・1分） | 方言ラボ";
const DESC =
  "「あずましい」「じょんならん」…この方言、どこの言葉？ 全国35方言から8問を出題する方言あてクイズ。4択タップで約1分、結果はそのままシェアできます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://hogen.mainichi-lab.com/doko" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://hogen.mainichi-lab.com/doko",
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function DokoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
