import type { Metadata } from "next";
import type { ReactNode } from "react";

// SC実測（28日）: 「何弁」20表示・平均掲載順位6.6 でクリック0。
// この受け皿は本来このページだが、旧タイトルに「何弁」という言い方が入っておらず、
// トップページや /quiz が代わりに当たっていた。実際に検索されている言い方に合わせる。
const TITLE = "この方言、何弁？｜どこの言葉か当てる全国方言クイズ（全8問・1分） | 方言ラボ";
const DESC =
  "「あずましい」「じょんならん」…この方言は何弁？ どこの言葉かを4択で当てる全国方言クイズ。北海道弁から沖縄方言まで35方言から8問を出題。タップだけで約1分、結果はそのままシェアできます。";

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
