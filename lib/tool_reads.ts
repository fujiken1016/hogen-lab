// 勝ち面（/translate/<地域>・/quiz/<地域>）から「読みもの」への回遊マップ。
//
// 背景：SC実測（2026/08/03-28）でクリックの50%は /translate/<地域> に出ているのに、
// そこから /blog/* へのリンクが1本も無かった。読みものは記事ごとに文脈の合う書籍PR枠を持つので、
// ツール面 → 記事面の回遊が、そのまま収益への唯一の合法な道になる。
//
// 🔴 司令塔裁定10：ツール/診断ページには収益導線（アフィリエイトリンク）を置かない。
//    ここで張るのは **自サイト内の記事への内部リンク** だけ。アフィリリンクは1本も含まない。
//
// 選定ルール（推測で増やさない）：
//  - slot1 ＝ その方言に固有の記事があればそれ（無ければ地方の記事）
//  - slot2 ＝ 地方に対応する記事
//  - reason は「記事に実際に書いてある事実」しか書かない（第N位・扱っている地方など）

import { getArticle, type Article } from "@/lib/articles";
import { REGION_OF } from "@/lib/tools";

/** かわいい方言ランキング（/blog/kawaii-hogen-ranking）で実際に順位がついている方言 */
const KAWAII_RANK: Record<string, number> = {
  博多弁: 1,
  京都弁: 2,
  沖縄方言: 3,
  秋田弁: 4,
  仙台弁: 5,
  南部弁: 5,
  金沢弁: 6,
  土佐弁: 7,
  出雲弁: 8,
  神戸弁: 9,
  鹿児島弁: 10,
};

/** 三大方言比較（/blog/tohoku-kansai-hakata）が実際に扱っている範囲 */
const SANDAI_GROUP: Record<string, string> = {
  "北海道・東北": "東北のことば",
  近畿: "関西のことば",
};

/** 方言そのものを主題にした記事がある方言（ランキングより優先する） */
const DIALECT_SPECIFIC: Record<string, { slug: string; reason: string }> = {
  沖縄方言: {
    slug: "okinawa-ryukyu-kotoba",
    reason: "うちなーぐちは「方言」なのか。母音の対応法則と琉球諸語の入門。",
  },
  北海道弁: {
    slug: "ainugo-chimei",
    reason: "「〜内」「〜別」が多い理由。北海道の地名の多くはアイヌ語に漢字を当てたものです。",
  },
  土佐弁: {
    slug: "media-to-hogen",
    reason: "ドラマやマンガの「龍馬語」がどう作られたか。役割語としての方言の話。",
  },
  大阪弁: {
    slug: "media-to-hogen",
    reason: "テレビの「ニセ関西弁」はなぜ生まれたのか。役割語としての方言の話。",
  },
};

/** 地方ごとの受け皿（DIALECT_SPECIFIC が無いとき／2枠目に使う） */
const REGION_READS: Record<string, string[]> = {
  "北海道・東北": ["tohoku-kansai-hakata", "naze-hogen-umareru"],
  関東: ["naze-hogen-umareru", "higashi-nishi-kyoukai"],
  "甲信越・北陸": ["naze-hogen-umareru", "kawaii-hogen-ranking"],
  東海: ["higashi-nishi-kyoukai", "naze-hogen-umareru"],
  近畿: ["tohoku-kansai-hakata", "naze-hogen-umareru"],
  中国: ["naze-hogen-umareru", "kawaii-hogen-ranking"],
  四国: ["naze-hogen-umareru", "kawaii-hogen-ranking"],
  "九州・沖縄": ["kyushu-hogen-gradation", "naze-hogen-umareru"],
};

/** 記事ごとの汎用リード（方言名に依存しない事実だけ） */
const GENERIC_REASON: Record<string, string> = {
  "naze-hogen-umareru":
    "方言はなまりではなく体系を持ったことば。方言周圏論から日本語の地図を読み解きます。",
  "kawaii-hogen-ranking": "音のまるさ・語尾の余韻・マネしやすさの3基準で選んだ全国TOP10。",
  "tohoku-kansai-hakata": "東北弁・関西弁・博多弁の音・語尾・否定形を、例文で並べて比べます。",
  "media-to-hogen": "「〜じゃ」と話す博士はなぜ生まれたのか。役割語と方言コスプレの話。",
  "okinawa-ryukyu-kotoba": "うちなーぐちと琉球諸語の入門。「ちゅら」の語源は平安時代の日本語。",
  "higashi-nishi-kyoukai":
    "「いる／おる」「だ／や」が入れ替わる東西の境界線＝糸魚川‐浜名湖線とその周辺の話。",
  "kyushu-hogen-gradation": "「九州弁」はひとつではない。豊日・肥筑・薩隅の3区画とその境目。",
  "ainugo-chimei": "「〜内」「〜別」が多い理由。北海道の地名の多くはアイヌ語由来です。",
};

export type ToolRead = { article: Article; reason: string };

/**
 * ツール面（変換・検定）に置く「読みもの」2件。
 * 見つからない記事は黙って捨てる（存在しないslugを張らない）。
 */
export function readsFor(dialect: string): ToolRead[] {
  const picked: ToolRead[] = [];
  const push = (slug: string, reason: string) => {
    if (picked.length >= 2) return;
    if (picked.some((p) => p.article.slug === slug)) return;
    const article = getArticle(slug);
    if (!article) return;
    picked.push({ article, reason });
  };

  const specific = DIALECT_SPECIFIC[dialect];
  if (specific) push(specific.slug, specific.reason);

  const rank = KAWAII_RANK[dialect];
  if (rank) {
    push("kawaii-hogen-ranking", `かわいい方言ランキングで${dialect}を第${rank}位に選んでいます。`);
  }

  const region = REGION_OF[dialect] ?? "";
  const group = SANDAI_GROUP[region];
  if (group) {
    push(
      "tohoku-kansai-hakata",
      `${dialect}が属する${group}を、東北・関西・博多で並べて比べています。`,
    );
  }

  for (const slug of REGION_READS[region] ?? []) {
    push(slug, GENERIC_REASON[slug] ?? getArticle(slug)?.description ?? "");
  }

  // 地方マップに漏れがあっても必ず2枠埋まるようにする
  push("naze-hogen-umareru", GENERIC_REASON["naze-hogen-umareru"]);
  push("kawaii-hogen-ranking", GENERIC_REASON["kawaii-hogen-ranking"]);

  return picked;
}
