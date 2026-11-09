import { ARTICLES } from "@/lib/articles";
// 記事のアイキャッチ（カテゴリ別・ローカル ComfyUI で生成した文字なしイラスト。2026-11-09 weekly-design-refresh）
// 画像は public/eye/<key>-{1280,640}.webp（16:9）。画像はイメージ（AI生成のイラスト）。
const MAP: Record<string, { key: string; alt: string }> = {
  解説: { key: "kaisetsu", alt: "切り絵風の日本列島と吹き出しのイラスト" },
  言語学入門: { key: "gengogaku", alt: "ノートと虫めがね、音の波のイラスト" },
  コラム: { key: "column", alt: "山のふもとの町並みのイラスト" },
  語源: { key: "gogen", alt: "花びらが舞う木のイラスト" },
  ランキング: { key: "ranking", alt: "表彰台に並んだ吹き出しのイラスト" },
  使い方ガイド: { key: "guide", alt: "クイズ画面を表示したスマートフォンのイラスト" },
};

const ORDER = ["kaisetsu", "column", "gengogaku", "ranking", "gogen", "guide"];
const BY_KEY = Object.fromEntries(Object.values(MAP).map((m) => [m.key, m]));

/** 記事ごとの画像。公開順の番号で6枚をローテーション＝一覧で同じ画像が隣り合わない。一覧・記事・関連で同じ画像になる */
export function eyeFor(slug: string) {
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  const m = i < 0 ? MAP["解説"] : BY_KEY[ORDER[i % ORDER.length]];
  return {
    src: `/eye/${m.key}-1280.webp`,
    small: `/eye/${m.key}-640.webp`,
    srcSet: `/eye/${m.key}-640.webp 640w, /eye/${m.key}-1280.webp 1280w`,
    alt: m.alt,
  };
}
