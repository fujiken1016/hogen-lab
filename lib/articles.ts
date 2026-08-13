// 読みもの（ブログ）記事のメタデータ。記事本体は app/blog/<slug>/page.tsx。
// sitemap.ts と一覧ページがここを唯一の正とする。

export type Article = {
  slug: string;
  title: string;
  /** 一覧・OGP用の短い説明 */
  description: string;
  /** 一覧カードの導入文（説明より少し長い） */
  lead: string;
  emoji: string;
  category: string;
  /** ISO日付（sitemapのlastModifiedにも使う） */
  date: string;
  readMin: number;
};

export const ARTICLES: Article[] = [
  {
    slug: "kawaii-hogen-ranking",
    title: "かわいい方言ランキングTOP10｜音のやわらかさで選んだ全国10選",
    description:
      "「かわいい方言」を音のまるさ・語尾の余韻・使いやすさの3基準でランキング。博多弁から沖縄方言まで、実際の言い回しと例文つきで紹介します。",
    lead: "語尾がふわっとほどける方言には、理由があります。音のまるさ・余韻・マネしやすさの3基準で選んだ全国TOP10。",
    emoji: "🌸",
    category: "ランキング",
    date: "2026-08-12",
    readMin: 6,
  },
  {
    slug: "hyoujungo-dato-omotteta",
    title: "標準語だと思ってた方言10選｜上京して初めて通じなかった言葉",
    description:
      "「こわい」「なおす」「なげる」——全国どこでも通じると思っていたのに、実は方言だった言葉を10個。意味・使う地域・例文つきで解説します。",
    lead: "「体がこわい」「服をなおす」。標準語だと信じて疑わなかった言葉が、県境を越えたとたん通じなくなる瞬間があります。",
    emoji: "😳",
    category: "コラム",
    date: "2026-08-12",
    readMin: 7,
  },
  {
    slug: "tohoku-kansai-hakata",
    title: "東北弁・関西弁・博多弁の特徴と例文｜三大方言をやさしく比較",
    description:
      "東北弁・関西弁・博多弁の音の特徴、語尾、否定形のちがいを例文つきで比較。そもそも「東北弁」という単一の方言はない、という話から始めます。",
    lead: "同じ「ありがとう、また明日ね」も、地域が変わると音のリズムごと変わります。三大方言の文法と音を、例文で並べて見比べます。",
    emoji: "🗾",
    category: "解説",
    date: "2026-08-12",
    readMin: 8,
  },
  {
    slug: "naze-hogen-umareru",
    title: "方言はなぜ生まれるのか｜方言周圏論からわかる日本語の地図",
    description:
      "方言はなまりではなく、それぞれ体系を持ったことば。柳田國男の方言周圏論、東西の境界線、共通語の成立まで、言語学の入門知識をやさしく解説します。",
    lead: "方言は「くずれた標準語」ではありません。むしろ京都から広がった古い言葉が、地方に残っていることさえあります。",
    emoji: "📚",
    category: "言語学入門",
    date: "2026-08-12",
    readMin: 8,
  },
  {
    slug: "shindan-guide",
    title: "方言タイプ診断の使い方と結果の読み解き方｜相性コードの仕組みも解説",
    description:
      "14問で決まる方言キャラ診断の遊び方を、結果画面の見方・相性コードの使い方・シークレットキャラの出現率まで一通り解説します。",
    lead: "2分の診断で出てくるキャラ・ことだま鑑定・4桁コード。それぞれ何を意味していて、どう遊べばいちばん面白いのかをまとめました。",
    emoji: "🎯",
    category: "使い方ガイド",
    date: "2026-08-12",
    readMin: 6,
  },
  {
    slug: "arigatou-zenkoku",
    title: "「ありがとう」の方言めぐり｜おおきに・だんだん・もっけだの語源",
    description:
      "おおきに（関西）、だんだん（出雲）、きのどくな（北陸）、もっけだ（庄内）、にふぇーでーびる（沖縄）。全国の感謝のことばを語源から読み解きます。",
    lead: "「ありがとう」の言い方は、地域によってまったく違う言葉になります。しかも語源をたどると、感謝の表し方そのものが3つの型に分かれていました。",
    emoji: "🙏",
    category: "語源",
    date: "2026-08-13",
    readMin: 7,
  },
  {
    slug: "hogen-accent-chizu",
    title: "「橋」と「箸」が逆になる県境｜方言アクセントの日本地図",
    description:
      "東京式・京阪式・無アクセント・一型・二型。同じ単語なのに高低が変わる理由と、アクセントが日本地図の上でどう分布しているのかを解説します。",
    lead: "単語も文法も標準語なのに「なまってる」と言われる。その正体はたいてい、語彙ではなくアクセントです。",
    emoji: "🎼",
    category: "言語学入門",
    date: "2026-08-13",
    readMin: 8,
  },
  {
    slug: "yobina-chiiki-sa",
    title: "呼び名が地域で変わるもの図鑑｜ばんそうこう・今川焼き・ものもらい",
    description:
      "カットバンかリバテープか、今川焼きか回転焼きか、ものもらいかめばちこか。調査データをもとに分布を整理し、方言と商品名の境目を考えます。",
    lead: "「サビオ持ってる？」が通じなかった経験はありませんか。実は方言ではなく、地元メーカーの商品名だったというケースがあります。",
    emoji: "🩹",
    category: "コラム",
    date: "2026-08-13",
    readMin: 7,
  },
  {
    slug: "okinawa-ryukyu-kotoba",
    title: "沖縄のことばは「方言」なのか｜うちなーぐちと琉球諸語の入門",
    description:
      "めんそーれ・ちゅら・にふぇーでーびるの語源から、母音の対応法則、ユネスコが指定した8つの危機言語まで。南の島のことばを言語学の目線で見ていきます。",
    lead: "「ちゅら」はもともと平安時代の日本語でした。うちなーぐちは、崩れた日本語どころか、古い日本語をよく保存していることばです。",
    emoji: "🌺",
    category: "解説",
    date: "2026-08-13",
    readMin: 8,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/**
 * 自分以外の記事を n 件。自分の次の記事から巡回して選ぶので、
 * 記事が増えても関連リンクが特定の数本に偏らない。
 */
export function otherArticles(slug: string, n = 3): Article[] {
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  const start = i < 0 ? 0 : i + 1;
  const out: Article[] = [];
  for (let k = 0; k < ARTICLES.length && out.length < n; k++) {
    const a = ARTICLES[(start + k) % ARTICLES.length];
    if (a.slug !== slug) out.push(a);
  }
  return out;
}
