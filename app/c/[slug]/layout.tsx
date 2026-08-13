import type { Metadata } from "next";
import type { ReactNode } from "react";

// キャラ個別ページは診断結果からの遷移で見るページ。
// テンプレートが共通で文章量も少ないため、検索エンジンには載せない（noindex）。
// リンクはたどってほしいので follow は残す。sitemap.ts からも除外している。
export const metadata: Metadata = {
  title: "キャラクター図鑑 | 方言ラボ",
  description:
    "方言タイプ診断に登場するご当地キャラのプロフィール。担当の方言・あいさつ・相性を紹介します。",
  robots: { index: false, follow: true },
};

export default function CharLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
