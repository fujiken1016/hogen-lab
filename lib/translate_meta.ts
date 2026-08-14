// 方言別「○○弁 変換／翻訳」ページ（/translate/[slug]）のメタ情報。
//
// URL分割の判断（tool_traffic_playbook.md の2条件）:
// (a) 「博多弁 変換」「関西弁 翻訳」のように、方言名＋変換/翻訳が実際に検索されている
// (b) 変換の中身（言い回し・語彙・語尾）が方言ごとに全く違う
// → 両方YESなので、検定（/quiz/[slug]）と同じく方言別に分割する。
//
// 薄いページを作らないための足切り:
// - 変換の指示に使う DIALECT_NOTES がある
// - 「よく使う言い換え」を出せる SHINDAN_PHRASES が12キーそろっている
// - 辞典の収録語が MIN_WORDS 語以上ある
// この3つを満たさない方言はページを作らない（実測では35方言すべてが通過）。

import { DIALECT_NOTES, SHINDAN_PHRASES, SHINDAN_QUESTIONS, STANDARD, WordEntry, wordsOf } from "./data";
import { REAL_DIALECTS, REGION_OF } from "./tools";
import { TYPES } from "./types";

/** 辞典の最低収録語数。これ未満は「変換が成立しない」とみなしてページを作らない */
export const MIN_WORDS = 30;
/** 「よく使う言い換え」の最低件数 */
export const MIN_PHRASES = 8;

const SLUG_BY_DIALECT: Record<string, string> = Object.fromEntries(TYPES.map((t) => [t.dialect, t.slug]));
const DIALECT_BY_SLUG: Record<string, string> = Object.fromEntries(TYPES.map((t) => [t.slug, t.dialect]));

function phraseCount(dialect: string): number {
  const m = SHINDAN_PHRASES[dialect];
  if (!m) return 0;
  return SHINDAN_QUESTIONS.filter((q) => !!m[q.key]).length;
}

/** 変換ページを用意する方言（足切りを通ったものだけ） */
export const TRANSLATE_DIALECTS: string[] = REAL_DIALECTS.filter(
  (d) =>
    !!SLUG_BY_DIALECT[d] &&
    !!DIALECT_NOTES[d] &&
    wordsOf(d).length >= MIN_WORDS &&
    phraseCount(d) >= MIN_PHRASES,
);

export function translateSlug(dialect: string): string | undefined {
  return SLUG_BY_DIALECT[dialect];
}

export function translateDialectOf(slug: string): string | undefined {
  const d = DIALECT_BY_SLUG[slug];
  return d && TRANSLATE_DIALECTS.includes(d) ? d : undefined;
}

/** 都道府県名（title / description に入れて「どこの言葉か」を伝える） */
export const TRANSLATE_AREA_OF: Record<string, string> = {
  北海道弁: "北海道",
  津軽弁: "青森県西部",
  南部弁: "岩手県・青森県東部",
  秋田弁: "秋田県",
  仙台弁: "宮城県",
  山形弁: "山形県",
  福島弁: "福島県",
  茨城弁: "茨城県",
  新潟弁: "新潟県",
  富山弁: "富山県",
  金沢弁: "石川県",
  信州弁: "長野県",
  静岡弁: "静岡県",
  名古屋弁: "愛知県",
  飛騨弁: "岐阜県北部",
  伊勢弁: "三重県",
  京都弁: "京都府",
  大阪弁: "大阪府",
  神戸弁: "兵庫県",
  和歌山弁: "和歌山県",
  鳥取弁: "鳥取県",
  出雲弁: "島根県東部",
  岡山弁: "岡山県",
  広島弁: "広島県",
  山口弁: "山口県",
  讃岐弁: "香川県",
  阿波弁: "徳島県",
  伊予弁: "愛媛県",
  土佐弁: "高知県",
  博多弁: "福岡県",
  大分弁: "大分県",
  熊本弁: "熊本県",
  長崎弁: "長崎県",
  鹿児島弁: "鹿児島県",
  沖縄方言: "沖縄県",
};

export type PhrasePair = { standard: string; dialect: string; key: string };

/** 標準語 → その方言の言い換え例（辞書データそのまま。創作しない） */
export function phrasePairs(dialect: string, n = 12): PhrasePair[] {
  const std = SHINDAN_PHRASES[STANDARD] ?? {};
  const dia = SHINDAN_PHRASES[dialect] ?? {};
  return SHINDAN_QUESTIONS.filter((q) => !!dia[q.key])
    .slice(0, n)
    .map((q) => ({ key: q.key, standard: std[q.key] ?? q.key, dialect: dia[q.key] }));
}

/** 辞典から代表的な語をいくつか（ページ内の実例＋description用） */
export function translateSampleWords(dialect: string, n = 6): WordEntry[] {
  return wordsOf(dialect).slice(0, n);
}

/** 同じ地方の他の方言（相互リンク用） */
export function translateSiblings(dialect: string): string[] {
  const region = REGION_OF[dialect];
  return TRANSLATE_DIALECTS.filter((d) => d !== dialect && REGION_OF[d] === region);
}

/** 地方ごとにまとめた一覧（/translate の索引用） */
export function translateByRegion(): { region: string; dialects: string[] }[] {
  const order: string[] = [];
  const map: Record<string, string[]> = {};
  for (const d of TRANSLATE_DIALECTS) {
    const r = REGION_OF[d] ?? "その他";
    if (!map[r]) {
      map[r] = [];
      order.push(r);
    }
    map[r].push(d);
  }
  return order.map((r) => ({ region: r, dialects: map[r] }));
}
