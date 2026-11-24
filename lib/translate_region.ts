// 地方まとめの変換ページ（/translate/tohoku・/translate/kyushu）の設定。J671（2026-11-24 新設）。
// 設計＝副業/seo_loop/design_tohoku_kyushu_2026-11-24.md
//
// 🔴 新しい方言語は一語も足さない。辞典（lib/data.ts の wordsOf）の語を、既存の convert() で
//    方言ごとに同時に置き換えて並べるだけの面。語数・例は表示のたびに実データから数える（手打ちしない）。
// 🔴 個別ページ（/translate/{tsugaru…}）に載せている語一覧は、この面には載せない（重複本文を作らない）。
//    代表語は 台帳（data_src/verified_words.json）で status=ok の語から3語ずつだけ選んである。
//    宮崎弁は台帳の対象外（lib/miyazaki.ts の資料で確認できた語だけ）なので、その37語から選ぶ。
//    検査＝node --experimental-strip-types scripts/check_translate_region.mjs

import { DIALECT_NOTES, wordsOf } from "./data.ts";
import { MIYAZAKI_DIALECT, MIYAZAKI_SLUG } from "./miyazaki.ts";

export type RegionDialect = {
  /** 辞典上の方言名（「津軽弁」） */
  name: string;
  /** 短い呼び名（「津軽」） */
  short: string;
  slug: string;
  area: string;
  /** 代表語（この語は台帳 ok または宮崎弁の資料確認済み） */
  picks: string[];
};

export type RegionConfig = {
  slug: "tohoku" | "kyushu";
  /** 「東北弁」 */
  label: string;
  dialects: RegionDialect[];
  /** 本文の注意書きで別ページに案内する、含めていない方言 */
  excluded: { name: string; slug: string; reason: string };
  articleHref: string;
  articleLabel: string;
  otherRegion: { slug: string; label: string };
  /** 同じ文の比較表に出す質問キー（lib/data.ts の SHINDAN_QUESTIONS）。8行以内 */
  phraseKeys: string[];
};

// slug・県名は lib/types.ts（TYPES）と lib/translate_meta.ts（TRANSLATE_AREA_OF）に合わせた値。
// ずれは scripts/check_translate_region.mjs が検出する（types.ts を読んで突合する）。
function d(name: string, short: string, slug: string, area: string, picks: string[]): RegionDialect {
  return { name, short, slug, area, picks };
}

const PHRASE_KEYS = [
  "捨てておいて",
  "とてもおいしい",
  "ダメだよ",
  "何してるの？",
  "疲れた",
  "本当に？",
  "ありがとう",
  "寒いね",
];

export const REGIONS_PAGE: Record<"tohoku" | "kyushu", RegionConfig> = {
  tohoku: {
    slug: "tohoku",
    label: "東北弁",
    dialects: [
      d("津軽弁", "津軽", "tsugaru", "青森県西部", ["わんつか", "めぐせ", "いだわし"]),
      d("南部弁", "南部", "iwate", "岩手県・青森県東部", ["わらし", "まなぐ", "せっこぎ"]),
      d("秋田弁", "秋田", "akita", "秋田県", ["じぇんこ", "おもしぇ", "だんぶり"]),
      d("仙台弁", "仙台", "sendai", "宮城県", ["いがす", "なじょする", "おぼこ"]),
      d("山形弁", "山形", "yamagata", "山形県", ["めんごい", "かます", "じぇね"]),
      d("福島弁", "福島", "fukushima", "福島県", ["あぐど", "うっつぁしい", "ずねー"]),
    ],
    excluded: { name: "北海道弁", slug: "hokkaido", reason: "北海道弁は東北弁とは別の方言として、この面には含めていません。" },
    articleHref: "/blog/tohoku-kansai-hakata",
    articleLabel: "東北弁・関西弁・博多弁の文法比較",
    otherRegion: { slug: "kyushu", label: "九州弁 変換" },
    phraseKeys: PHRASE_KEYS,
  },
  kyushu: {
    slug: "kyushu",
    label: "九州弁",
    dialects: [
      d("博多弁", "博多", "hakata", "福岡県", ["しろしか", "いぼる", "しょんなか"]),
      d("長崎弁", "長崎", "nagasaki", "長崎県", ["あぎ", "まっぽし", "でけん"]),
      d("大分弁", "大分", "oita", "大分県", ["うたちい", "かたぐる", "ひじい"]),
      d("熊本弁", "熊本", "kumamoto", "熊本県", ["むぞらしか", "たいぎゃ", "どぎゃん"]),
      d(MIYAZAKI_DIALECT, "宮崎", MIYAZAKI_SLUG, "宮崎県", ["てげ", "よだきい", "なおす"]),
      d("鹿児島弁", "鹿児島", "kagoshima", "鹿児島県", ["うんまか", "おじゃったもんせ", "がらっぱ"]),
    ],
    excluded: { name: "沖縄方言", slug: "okinawa", reason: "沖縄の言葉は九州の方言とは別の言語系統（琉球語）として扱われるため、この面には含めていません。" },
    articleHref: "/blog/kyushu-hogen-gradation",
    articleLabel: "九州弁を3区画で読む",
    otherRegion: { slug: "tohoku", label: "東北弁 変換" },
    phraseKeys: PHRASE_KEYS,
  },
};

export function regionWordCount(cfg: RegionConfig): number {
  return cfg.dialects.reduce((s, x) => s + wordsOf(x.name).length, 0);
}

export function regionNames(cfg: RegionConfig): string {
  return cfg.dialects.map((x) => x.short).join("・");
}

const TITLE_EXAMPLES: Record<string, string> = {
  tohoku: "津軽弁・秋田弁・仙台弁",
  kyushu: "博多弁・熊本弁・鹿児島弁",
};

export function regionTitle(cfg: RegionConfig): string {
  const n = cfg.dialects.length;
  return `${cfg.label}変換・翻訳ツール｜標準語⇄${TITLE_EXAMPLES[cfg.slug]}など${n}方言を一度に変換 | 方言ラボ`;
}

export function regionDescription(cfg: RegionConfig): string {
  const n = cfg.dialects.length;
  return `${cfg.label}を標準語に、標準語を${cfg.label}に変換。1回の入力で${regionNames(cfg)}の${n}方言に同時変換して比べられます。辞典${regionWordCount(cfg)}語ベース。`;
}

/** 方言ごとの説明（DIALECT_NOTES）。宮崎弁は DIALECT_NOTES に無いので undefined */
export function dialectNote(name: string): string | undefined {
  return DIALECT_NOTES[name];
}
