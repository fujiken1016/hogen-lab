import type { Metadata } from "next";
import type { ReactNode } from "react";

// 診断結果のシェアリンク着地先。コードごとに無数のURLが生まれ、
// 中身は共通テンプレート＝薄い重複ページになるので検索エンジンには載せない（noindex）。
// 送り主のリンクからたどってほしいので follow は残す。sitemap.ts にも載せていない。
export const metadata: Metadata = {
  title: "診断結果をみる | 方言ラボ",
  description:
    "方言タイプ診断の結果をシェアリンクから表示します。自分も診断していれば、ふたりの相性もそのまま鑑定できます。",
  robots: { index: false, follow: true },
};

export default function ResultViewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
