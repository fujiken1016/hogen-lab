// OGP / Twitter Card の共通部品（2026-11-08 J365）。
// 子ページが openGraph を定義すると親（layout）の openGraph は丸ごと置き換わるため、
// 各ページで同じ形を作れるようにここに集約した。
//
// 🔴 OG_IMAGE は画像の実体ができるまで null のまま出す（実在しない URL を og:image に書かない）。
//    1200x630 の PNG/JPG を public/ に置いたら、そのパス（例 "/og.png"）をここに入れるだけで
//    ogMeta() を使う全ページに og:image / twitter:image が付く。
//    ※ 既存のツール系ページ（shindan・quiz・translate 等）は自前の openGraph を持つので、画像を入れたら
//       そちらも ogMeta() へ寄せるか images を足す（J365 成果物の「残り」参照）。
import type { Metadata } from "next";

export const SITE_URL = "https://hogen.mainichi-lab.com";
export const OG_IMAGE: string | null = null;

export function ogMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const images = OG_IMAGE ? [{ url: `${SITE_URL}${OG_IMAGE}`, width: 1200, height: 630 }] : undefined;
  return {
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      siteName: "方言ラボ",
      locale: "ja_JP",
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
