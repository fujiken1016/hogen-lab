// 1画面完結ツール（/doko・/kawaii）用の出題ロジック。
//
// 事実の扱いについて:
// - 出題に使う語は lib/data.ts / lib/words_extra.ts に収録済みのものだけ。新しく方言を創作しない。
// - 「どこの言葉か」の正解は、方言ラボ辞典で“その方言にだけ”収録されている語に限定する
//   （複数方言に収録がある語は出題しない）。方言は地域差・世代差があり隣接地域でも
//   使われることがあるため、選択肢は必ず別の地方から取り、画面でもその旨を注記する。

import { DIALECTS, REGIONS, STANDARD, WordEntry, shuffle, wordsOf } from "./data";

/** 方言名 → 地方名（「近畿」「九州・沖縄」など） */
export const REGION_OF: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const r of REGIONS) for (const d of r.dialects) m[d] = r.name;
  return m;
})();

export const REAL_DIALECTS = DIALECTS.filter((d) => d !== STANDARD);

type Indexed = { entry: WordEntry; dialect: string };

/** 語 → その語を収録している方言。重い処理なのでモジュール内で1度だけ作る。 */
let uniqueIndex: Map<string, Indexed[]> | null = null;

function buildIndex(): Map<string, Indexed[]> {
  if (uniqueIndex) return uniqueIndex;
  const byWord = new Map<string, Indexed[]>();
  for (const d of REAL_DIALECTS) {
    for (const entry of wordsOf(d)) {
      // 「〜っちゃ」のような語尾は隣接地域と重なりやすく、1方言に限定できない。
      // 辞典の収録が1件でも“どこの言葉か”の出題には向かないので外す。
      if (entry.word.startsWith("〜") || entry.word.length <= 1) continue;
      const list = byWord.get(entry.word);
      if (list) list.push({ entry, dialect: d });
      else byWord.set(entry.word, [{ entry, dialect: d }]);
    }
  }
  // 1方言にしか出てこない語だけ残す
  const only = new Map<string, Indexed[]>();
  for (const [w, list] of byWord) if (list.length === 1) only.set(w, list);
  uniqueIndex = only;
  return only;
}

/** 方言名 → その方言だけに収録されている語 */
function uniqueWordsByDialect(): Record<string, Indexed[]> {
  const out: Record<string, Indexed[]> = {};
  for (const [, list] of buildIndex()) {
    const it = list[0];
    (out[it.dialect] ??= []).push(it);
  }
  return out;
}

export type DokoQ = {
  word: string;
  meaning: string;
  example: string;
  answer: string; // 方言名
  choices: string[]; // 方言名 × 4（answerを含む・地方は全て別）
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 「この方言どこの言葉？」の出題を作る。
 * - 同じ地方に偏らないよう、1地方あたり最大2問まで
 * - 選択肢4つは全て別の地方から取る（隣県で同じ語を使う可能性を避けるため）
 */
export function buildDokoQuestions(n = 8): DokoQ[] {
  const pool = uniqueWordsByDialect();
  const candidates = shuffle(REAL_DIALECTS.filter((d) => (pool[d]?.length ?? 0) > 0));

  const chosen: string[] = [];
  const perRegion: Record<string, number> = {};
  for (const d of candidates) {
    if (chosen.length >= n) break;
    const r = REGION_OF[d] ?? "その他";
    if ((perRegion[r] ?? 0) >= 2) continue;
    perRegion[r] = (perRegion[r] ?? 0) + 1;
    chosen.push(d);
  }
  // 地方上限で足りなければ緩めて埋める
  for (const d of candidates) {
    if (chosen.length >= n) break;
    if (!chosen.includes(d)) chosen.push(d);
  }

  const usedWords = new Set<string>();
  const qs: DokoQ[] = [];
  for (const d of chosen) {
    const list = (pool[d] ?? []).filter((x) => !usedWords.has(x.entry.word));
    if (list.length === 0) continue;
    const item = pick(list);
    usedWords.add(item.entry.word);

    const answerRegion = REGION_OF[d] ?? "その他";
    const otherRegions = shuffle(REGIONS.map((r) => r.name).filter((r) => r !== answerRegion)).slice(0, 3);
    const distractors = otherRegions
      .map((rn) => {
        const rd = REGIONS.find((r) => r.name === rn)?.dialects ?? [];
        return rd.length ? pick(rd) : null;
      })
      .filter((x): x is string => !!x);
    if (distractors.length < 3) continue;

    qs.push({
      word: item.entry.word,
      meaning: item.entry.meaning,
      example: item.entry.example,
      answer: d,
      choices: shuffle([d, ...distractors]),
    });
  }
  return qs.slice(0, n);
}

export type DokoRank = { title: string; comment: string; emoji: string };

/** 正解数から称号を決める（8問想定） */
export function dokoRank(correct: number, total: number): DokoRank {
  const rate = total ? correct / total : 0;
  if (rate >= 1) return { title: "方言マイスター", comment: "全問正解。もはや全国行脚した人の耳です。", emoji: "🏆" };
  if (rate >= 0.75) return { title: "方言ツウ", comment: "地方ごとの手ざわりが、しっかり分かっています。", emoji: "🎓" };
  if (rate >= 0.5) return { title: "旅なれびと", comment: "半分以上正解。よく耳にする言葉は押さえています。", emoji: "🧳" };
  if (rate >= 0.25) return { title: "方言みならい", comment: "ここからが面白いところ。辞典をのぞいてみましょう。", emoji: "🌱" };
  return { title: "まっさら耳", comment: "日本の方言は、思っているよりずっと広い。", emoji: "🫧" };
}

// ───────────────────────── かわいい方言トーナメント ─────────────────────────

/**
 * トーナメントの出場語。辞典に収録がある「その方言らしい語」を1方言1語ずつ選んだ固定プール。
 * 意味・例文はここには書かず、辞典データから引く（表示と辞典で内容がズレないようにするため）。
 */
const KAWAII_POOL: { dialect: string; word: string }[] = [
  { dialect: "北海道弁", word: "めんこい" },
  { dialect: "津軽弁", word: "あずましい" },
  { dialect: "仙台弁", word: "いずい" },
  { dialect: "富山弁", word: "きのどくな" },
  { dialect: "金沢弁", word: "がんこ" },
  { dialect: "飛騨弁", word: "ずつない" },
  { dialect: "名古屋弁", word: "ときんときん" },
  { dialect: "伊勢弁", word: "てれこ" },
  { dialect: "京都弁", word: "はんなり" },
  { dialect: "大阪弁", word: "ぬくい" },
  { dialect: "神戸弁", word: "べっちょない" },
  { dialect: "出雲弁", word: "だんだん" },
  { dialect: "岡山弁", word: "もんげー" },
  { dialect: "広島弁", word: "ぶち" },
  { dialect: "山口弁", word: "おいでませ" },
  { dialect: "讃岐弁", word: "じょんならん" },
  { dialect: "土佐弁", word: "こじゃんと" },
  { dialect: "博多弁", word: "とっとーと" },
  { dialect: "熊本弁", word: "あとぜき" },
  { dialect: "鹿児島弁", word: "わっぜ" },
  { dialect: "沖縄方言", word: "ちばりよー" },
];

export type KawaiiEntry = {
  word: string;
  dialect: string;
  region: string;
  meaning: string;
  example: string;
};

/** プールのうち、辞典に実在が確認できるものだけを返す（データ側の削除に強くする） */
export function kawaiiCandidates(): KawaiiEntry[] {
  const out: KawaiiEntry[] = [];
  for (const p of KAWAII_POOL) {
    const hit = wordsOf(p.dialect).find((w) => w.word === p.word);
    if (!hit) continue;
    out.push({
      word: hit.word,
      dialect: p.dialect,
      region: REGION_OF[p.dialect] ?? "",
      meaning: hit.meaning,
      example: hit.example,
    });
  }
  return out;
}

/** 8語を抽選してトーナメント表（1回戦4試合ぶんの並び）を作る */
export function buildKawaiiBracket(size = 8): KawaiiEntry[] {
  return shuffle(kawaiiCandidates()).slice(0, size);
}
