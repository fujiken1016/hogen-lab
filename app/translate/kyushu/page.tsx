import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/og";
import RegionTranslatePage from "@/components/RegionTranslatePage";
import { REGIONS_PAGE, regionDescription, regionTitle } from "@/lib/translate_region";

// 地方まとめの変換ページ（J671・2026-11-24 新設）。設計＝副業/seo_loop/design_tohoku_kyushu_2026-11-24.md
// 静的ルートなのでビルド時にプリレンダされる（Workers の CPU 制限のため動的 SSR に落とさない）。
// 判定日＝公開の14日後・28日後（GSC で「東北弁 変換」「九州弁 変換」系の表示・クリック・順位と、個別面のクリック合計を見る）。

const BASE = "https://hogen.mainichi-lab.com";
const cfg = REGIONS_PAGE.kyushu;
const TITLE = regionTitle(cfg);
const DESCRIPTION = regionDescription(cfg);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE}/translate/kyushu` },
  openGraph: {
    images: OG_IMAGES,
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE}/translate/kyushu`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <RegionTranslatePage cfg={cfg} />;
}
