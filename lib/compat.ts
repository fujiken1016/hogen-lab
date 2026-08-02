// 相性コード＆多角相性エンジン
// 診断結果（方言タイプ×性格アーキタイプ×強さレベル）を4文字コードに符号化し、
// コード同士で「診断し直さずに」多角的な相性コンテンツを生成する。
// すべて決定論的（同じペアなら常に同じ結果・A×BとB×Aも同じ）。

import { ARCHETYPES } from "./data";
import { DIALECT_GOGYO, GOGYO } from "./fortune";
import { DialectType, MASCOT_NAMES, TYPES, affinity } from "./types";

// 性格アーキタイプの固定順（コード符号化に使う。順番を変えると既存コードが壊れる）
export const CLUSTERS = ["nigiyaka", "shokunin", "dandori", "jiyu", "jouhin", "iyashi", "nekketsu"] as const;

const B36 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export type DecodedCode = {
  type: DialectType;
  cluster: string; // アーキタイプkey
  level: number; // 1〜5
  code: string; // 正規化済みコード
};

// タイプ×性格×レベル → 4文字コード（3文字base36＋チェック文字）
export function encodeCode(slug: string, cluster: string, level: number): string {
  const t = TYPES.findIndex((x) => x.slug === slug);
  const c = Math.max(0, CLUSTERS.indexOf(cluster as (typeof CLUSTERS)[number]));
  const l = Math.min(5, Math.max(1, level)) - 1;
  const id = t * 35 + c * 5 + l;
  const body = id.toString(36).toUpperCase().padStart(3, "0");
  const sum = [...body].reduce((a, ch) => a + B36.indexOf(ch), 0);
  return body + B36[(sum * 7 + id) % 36];
}

// 4文字を厳密に検証（チェック文字込み）
function parseCode(code: string): DecodedCode | null {
  const body = code.slice(0, 3);
  const id = parseInt(body, 36);
  if (Number.isNaN(id)) return null;
  const sum = [...body].reduce((a, ch) => a + B36.indexOf(ch), 0);
  if (B36[(sum * 7 + id) % 36] !== code[3]) return null;
  const t = Math.floor(id / 35);
  const rest = id % 35;
  if (t < 0 || t >= TYPES.length) return null;
  return {
    type: TYPES[t],
    cluster: CLUSTERS[Math.floor(rest / 5)],
    level: (rest % 5) + 1,
    code,
  };
}

// コード → 結果（不正なら null）
// まず入力そのままで検証し、ダメな時だけ O→0 / I→1 の打ち間違い救済を試す
// （最初から置換すると、正規のO/Iを含むコードが壊れる）
export function decodeCode(raw: string): DecodedCode | null {
  const cleaned = raw.trim().toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (cleaned.length !== 4) return null;
  return parseCode(cleaned) ?? parseCode(cleaned.replace(/O/g, "0").replace(/I/g, "1"));
}

// 自分の結果の保存（診断し直し不要のための端末保存）
export const MY_RESULT_KEY = "hogen-my-result";
export type MyResult = { code: string; slug: string; cluster: string; level: number; name: string };

export function saveMyResult(r: MyResult): void {
  try {
    localStorage.setItem(MY_RESULT_KEY, JSON.stringify(r));
  } catch {}
}
export function loadMyResult(): MyResult | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(MY_RESULT_KEY) ?? "null");
  } catch {
    return null;
  }
}

// ---------- 多角相性コンテンツ ----------
function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
// ペアで対称（A×B = B×A）になるシード
function pairSeed(a: string, b: string): string {
  return [a, b].sort().join("×");
}
function pick<T>(arr: T[], seed: string, key: string): T {
  return arr[hashOf(seed + "|" + key) % arr.length];
}

export type CompatAxis = { label: string; icon: string; n: number; text: string };
export type CompatResult = {
  score: number;
  title: string;
  comment: string;
  axes: CompatAxis[];
  gogyo: { label: string; text: string };
  clusterRel: string | null; // 片方の性格が不明（?with=リンク等）なら null
  luckyA: string; // Aの方言のふたりのラッキー方言
  luckyB: string;
  kenka: string;
  nakanaori: { phrase: string; dialect: string };
  action: string;
};

const AXES_DEF = [
  { key: "tempo", label: "会話のテンポ", icon: "💬" },
  { key: "value", label: "価値観", icon: "🧭" },
  { key: "love", label: "恋愛相性", icon: "💘" },
  { key: "work", label: "コンビ仕事力", icon: "🤝" },
  { key: "kenka", label: "ケンカ耐性", icon: "🔥" },
];

// 星の数(1-5)ごとの軸別ひとこと
const AXIS_TEXTS: Record<string, string[]> = {
  tempo: [
    "テンポは正反対。でも「間」の違いは慣れれば心地よい余白になります。",
    "話すスピードに差あり。相手の句点を待ってから話すと噛み合います。",
    "ほどよい掛け合い。沈黙も気まずくならない安定ペースです。",
    "ツッコミとボケが自然に成立する好テンポ。会話が伸びます。",
    "息ぴったりの漫才コンビ級。初対面でも旧知のように転がります。",
  ],
  value: [
    "大事にするものが違う2人。だからこそ視野が2倍になります。",
    "価値観は別方向。「なるほどそっちか」を楽しめれば強い組み合わせ。",
    "要所の価値観が一致。細部の違いはスパイスです。",
    "根っこの優先順位がよく似ています。決断の場面で揉めにくい2人。",
    "人生の地図がほぼ同じ縮尺。長い付き合いになる価値観の双子です。",
  ],
  love: [
    "恋愛は難易度高め。ただし乗り越えた分だけ他にない絆になります。",
    "恋の温度差に注意。ペースの主導権を交互に渡すのがコツ。",
    "安定感のある関係を築けるペア。焦らず育てるのが吉。",
    "自然体でいられる相性。長続きの条件が最初から揃っています。",
    "運命級。出会った季節をふたりの記念日にしていいレベルです。",
  ],
  work: [
    "役割がぶつかりがち。担当を最初に分けると別チーム級に化けます。",
    "仕事の進め方に流儀の差。締切だけ共有して各自流でどうぞ。",
    "補い合える実務ペア。片方の苦手をもう片方が拾えます。",
    "得意分野が噛み合う好コンビ。企画×実行の分業が最強。",
    "2人で1つの脳。文化祭前夜のテンションが毎日続きます。",
  ],
  kenka: [
    "こじれると長引くペア。その日のうちの「ごめん」をルールに。",
    "火種は小さいうちに。違和感は24時間以内に言葉にすると安全です。",
    "ケンカしても翌日に持ち越さないタイプ同士。回復力あり。",
    "そもそも衝突が起きにくい組み合わせ。たまの本音対決はむしろ吉。",
    "ケンカがそのまま漫才になる稀有なペア。周りが笑って終わります。",
  ],
};

// 五行の関係（相生・相剋・比和）
const SEISEI: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const SOUKOKU: Record<string, string> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

function gogyoRelation(dialectA: string, dialectB: string): { label: string; text: string } {
  const ea = DIALECT_GOGYO[dialectA] ?? "火";
  const eb = DIALECT_GOGYO[dialectB] ?? "水";
  const na = `「${ea}」の${dialectA}`;
  const nb = `「${eb}」の${dialectB}`;
  if (ea === eb)
    return {
      label: `比和 — ${ea} × ${eb}`,
      text: `${na}と${nb}は同じ気を持つ「比和」の間柄。波長が合いやすく、良い時は倍良く、落ち込む時は一緒に沈みがち。どちらかが晴れ役を引き受けると最強です。`,
    };
  if (SEISEI[ea] === eb)
    return {
      label: `相生 — ${ea}が${eb}を生む`,
      text: `五行では${na}が${nb}を生み育てる「相生」の関係。${dialectA}側といると${dialectB}側は自然と元気になります。育てる側が疲れた日は、遠慮なく甘えるのが長続きのコツ。`,
    };
  if (SEISEI[eb] === ea)
    return {
      label: `相生 — ${eb}が${ea}を生む`,
      text: `五行では${nb}が${na}を生み育てる「相生」の関係。${dialectB}側が土台となって${dialectA}側の魅力を引き出します。感謝を言葉にすると、この循環はさらに強くなります。`,
    };
  if (SOUKOKU[ea] === eb || SOUKOKU[eb] === ea)
    return {
      label: `相剋 — ${ea} × ${eb}`,
      text: `五行では「相剋」＝刺激し合う緊張関係。ぶつかると火花が出ますが、実は互いを鍛え合う成長ペアでもあります。相手の一言が刺さった時ほど、伸びしろに触れた合図です。`,
    };
  return {
    label: `中和 — ${ea} × ${eb}`,
    text: `${na}と${nb}は直接生みも剋しもしない、ほどよい距離の関係。依存せず干渉せず、長く安定して続く組み合わせです。`,
  };
}

// 性格アーキタイプ同士の関係
const CLUSTER_PAIRS: Record<string, string> = {
  "nigiyaka×nekketsu": "お祭りコンビ。2人が揃った瞬間、その場が本祭になります。ブレーキ役だけ外注しましょう。",
  "shokunin×dandori": "実務最強タッグ。段取りが道を引き、職人が完璧に仕上げる。仕事で組むと敵なしです。",
  "jouhin×iyashi": "空気清浄機ペア。2人の周りだけ気圧が優しい。せかせかした世界の避難所になれます。",
  "nigiyaka×shokunin": "しゃべる人と聞く人の黄金比。にぎやかが話し、職人が要点だけ拾う。実は理想の分業です。",
  "jiyu×dandori": "自由人と幹事長。振り回す側と回収する側ですが、旅の思い出は毎回2倍になります。",
  "nekketsu×iyashi": "炎と水風呂。熱くなりすぎた心を癒しがちょうどよく冷ます、整いサウナ的関係です。",
};

function clusterRelation(ca: string, cb: string): string {
  if (ca === cb) {
    const a = ARCHETYPES[ca];
    return `2人とも「${a?.label ?? ca}」タイプ。長所も地雷も同じ場所にあるので、お互いの取扱説明書は読み終わっている状態からスタートできます。`;
  }
  const key = [ca, cb].sort().join("×");
  if (CLUSTER_PAIRS[key]) return CLUSTER_PAIRS[key];
  const a = ARCHETYPES[ca]?.label ?? ca;
  const b = ARCHETYPES[cb]?.label ?? cb;
  return `「${a}」×「${b}」。似ていないからこそ、相手の当たり前が新鮮に映る組み合わせ。違いを面白がれた日から、一気に距離が縮まります。`;
}

const KENKA_TEXTS = [
  "ケンカの火種は「連絡の頻度」になりがち。既読スルーの基準だけ先に共有を。",
  "揉めるとしたら「時間の感覚」。集合時間は10分バッファを標準装備に。",
  "地雷は「食の好みへの一言」。相手のソウルフードは絶対にけなさない事。",
  "危ないのは「冗談の賞味期限切れ」。同じイジリは3回まで、が安全ラインです。",
  "火種は「お金の使いどころ」。ケチる場所と奮発する場所が逆なだけ、と知っておくと平和です。",
  "揉めポイントは「計画変更」。片方の「まあいっか」がもう片方の「は？」。変更は早めに一報を。",
];

const PAIR_ACTIONS = [
  "月イチで「地元の味」を交換する（お取り寄せ可）",
  "お互いの方言をひとつずつ覚えて、次に会った時に使う",
  "2人の「勝負日」を合わせて大事な誘いはその日に",
  "写真を撮る時のかけ声を2人の方言ミックスにする",
  "喧嘩したら先に方言で謝った方が勝ち、というルールにする",
  "旅行はお互いの地元を交互に案内し合う",
];

export function buildCompat(
  a: { type: DialectType; cluster?: string; level?: number },
  b: { type: DialectType; cluster?: string; level?: number },
  luckyWordOf: (dialect: string, seed: string) => string,
): CompatResult {
  const base = affinity(a.type, b.type);
  const seed = pairSeed(a.type.slug, b.type.slug);
  // 軸スコア: 相性スコアを中心に、軸ごとの決定論ジッターで散らす（1〜5）
  const axes: CompatAxis[] = AXES_DEF.map((ax) => {
    let n = Math.round((base.score / 100) * 4 + 1 + ((hashOf(seed + ax.key) % 3) - 1));
    // 性格情報があるときの補正: 同アーキタイプは価値観+1、にぎやか/熱血ペアはテンポ+1
    if (a.cluster && b.cluster) {
      if (ax.key === "value" && a.cluster === b.cluster) n += 1;
      if (ax.key === "tempo" && [a.cluster, b.cluster].every((c) => c === "nigiyaka" || c === "nekketsu")) n += 1;
    }
    n = Math.min(5, Math.max(1, n));
    return { label: ax.label, icon: ax.icon, n, text: AXIS_TEXTS[ax.key][n - 1] };
  });
  return {
    score: base.score,
    title: base.title,
    comment: base.comment,
    axes,
    gogyo: gogyoRelation(a.type.dialect, b.type.dialect),
    clusterRel: a.cluster && b.cluster ? clusterRelation(a.cluster, b.cluster) : null,
    luckyA: luckyWordOf(a.type.dialect, seed + "A"),
    luckyB: luckyWordOf(b.type.dialect, seed + "B"),
    kenka: pick(KENKA_TEXTS, seed, "kenka"),
    nakanaori: { phrase: "", dialect: b.type.dialect }, // 呼び出し側でSHINDAN_PHRASESから補完
    action: pick(PAIR_ACTIONS, seed, "action"),
  };
}

export { MASCOT_NAMES };
