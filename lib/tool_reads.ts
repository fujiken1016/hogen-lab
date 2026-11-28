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
    slug: "hokkaido-ben-touhoku-hokuriku",
    reason: "辞典の北海道弁84語を、東北・北陸の方言と照らして数えました。「なまら」の使われ方と、文末の「べ」「しょ」も。",
  },
  神戸弁: {
    slug: "kobe-ben-osaka-chigai",
    reason: "神戸は「〜よう」と「〜とう」を言い分けます。辞典の例文を、大阪弁と並べて数えました。",
  },
  京都弁: {
    slug: "kyoto-kotoba-dosu-haru",
    reason: "「どす」を使うのは80代の約半数、10代の半数は聞いたこともない。「はる」と合わせて例文で数えました。",
  },
  伊予弁: {
    slug: "iyo-ben-zonamoshi",
    reason: "「ぞなもし」は今も使われるのか。辞典の例文99文の語尾と、東予・中予・南予の言い方の違いを読みます。",
  },
  名古屋弁: {
    slug: "nagoya-ben-gaya-gane-namo",
    reason: "「がや」「がね」は下町言葉、「なも」は上町言葉。辞典の例文85文の語尾を数え、尾張北部・瀬戸・知多との違いも読みます。",
  },
  茨城弁: {
    slug: "ibaraki-ben-tohoku-kanto",
    reason: "東北方言か、関東方言か。学者の説を並べ、「〜っぺ」の例文と、辞典の語が東北の方言とどれだけ重なるかを数えました。",
  },
  仙台弁: {
    slug: "sendai-ben-ccha-dakara",
    reason: "「だから」は同意の言葉。「〜っちゃ」「べ」「けろ」の例文と、宮城県内の4区分を読みます。",
  },
  新潟弁: {
    slug: "niigata-ben-te-rate-suke",
    reason: "例文100文のうち47文が「て」で終わる。「すけ」の語源と、新潟県内の方言区分も読みます。",
  },
  土佐弁: {
    slug: "media-to-hogen",
    reason: "ドラマやマンガの「龍馬語」がどう作られたか。役割語としての方言の話。",
  },
  讃岐弁: {
    slug: "sanuki-okiru-makeru",
    reason: "「お腹おきた」は満腹、「水がまける」はこぼれる。同じ音で意味が違う2語を、変換結果と一緒に読みます。",
  },
  静岡弁: {
    slug: "shizuoka-imani-oeru",
    reason: "「お茶によばれた」はごちそうになった話。「いまに」「おえる」「さばく」を1910年の辞典と変換結果で読みます。",
  },
  山形弁: {
    slug: "yamagata-udaru-kamasu",
    reason: "「ゴミをうだる」は捨てること。「おだる」「かます」を古い方言集と変換結果で読みます。",
  },
  秋田弁: {
    slug: "akita-kadaru-tagu",
    reason: "「遊びさかだる」は仲間に入ること。「たぐる」「きかね」を1929年の方言集と変換結果で読みます。",
  },
  長崎弁: {
    slug: "nagasaki-reibun-bunmatsu",
    reason: "辞典の例文103文を文末で数えました。「ばい」「たい」「とよ」と、変換ツールが直せない語尾の限界。",
  },
  岡山弁: {
    slug: "okayama-bizen-bitchu-mimasaka",
    reason: "備前・備中・美作で言葉は違うのか。辞典の語のうち、美作では使わないとされる語を数えました。",
  },
  伊勢弁: {
    slug: "mie-ise-ben-chigai",
    reason: "三重弁と伊勢弁は同じか。北三重・南三重の区画と、「〜とる」「〜に」の例文を数えました。",
  },
  福島弁: {
    slug: "fukushima-kowai-tsukareta",
    reason: "「こわい」は疲れた、の意味。福島県の3地方・10区画と、「〜べ」「〜っぺ」を変換結果と一緒に読みます。",
  },
  津軽弁: {
    slug: "tsugaru-ben-hande-ja",
    reason: "例文84文のうち23文が「〜じゃ」で終わる。「どさ」「ゆさ」の載り方と、理由の「はんで」、津軽と南部の違いを読みます。",
  },
  阿波弁: {
    slug: "awa-ben-jo-deyo-ken",
    reason: "文末の「〜んじょ」「〜でよ」と、理由の「けん」。辞典の例文97文を数え、近畿・四国の方言との重なりも読みます。",
  },
  富山弁: {
    slug: "toyama-ben-cha-nene-bayaku",
    reason: "例文95文のうち41文が「ちゃ」で終わる。呉東・呉西の区画と、「ねね」「ばやく」の意味も読みます。",
  },
  大阪弁: {
    slug: "media-to-hogen",
    reason: "テレビの「ニセ関西弁」はなぜ生まれたのか。役割語としての方言の話。",
  },
};

/** 2本目も方言固有の記事を出したい方言（1本目は DIALECT_SPECIFIC）。 */
const SPECIFIC_SECOND: Record<string, { slug: string; reason: string }> = {
  北海道弁: {
    slug: "ainugo-chimei",
    reason: "「〜内」「〜別」が多い理由。北海道の地名の多くはアイヌ語に漢字を当てたものです。",
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
  const second = SPECIFIC_SECOND[dialect];
  if (second) push(second.slug, second.reason);

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
