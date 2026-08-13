// 1画面完結ツール（/doko・/kawaii）用の出題ロジック。
//
// 事実の扱いについて（2026-08 見直し / DICT_AUDIT.md）:
// - 出題に使う語は lib/data.ts / lib/words_extra.ts に収録済みのものだけ。新しく方言を創作しない。
// - 以前は「辞典で1方言にしか載っていない語」を自動で出題プールにしていたが、
//   辞典側の収録漏れがそのまま“正解”になってしまい、実際には複数地方で使う語
//   （なおす／ねぶる／たまげる など）が出題されていた。ユーザーの答えを外すクイズで
//   これは致命的なので、出題プールは lib/doko_pool.ts の出典照合済みリストに限定する。
// - さらに、隣接する地方は言葉が連続していて“どちらでも使う”ことが多いため、
//   ダミー選択肢には正解の地方と隣接しない地方だけを使う。

import { DIALECTS, REGIONS, STANDARD, WordEntry, shuffle, wordsOf } from "./data";
import { DOKO_SEEDS } from "./doko_pool";

/** 方言名 → 地方名（「近畿」「九州・沖縄」など） */
export const REGION_OF: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const r of REGIONS) for (const d of r.dialects) m[d] = r.name;
  return m;
})();

export const REAL_DIALECTS = DIALECTS.filter((d) => d !== STANDARD);

/**
 * 隣り合う地方。方言は県境でぷつりと切れないので、隣接地方はダミー選択肢に使わない。
 * （例：「はぶてる」は広島の語だが山口・北九州でも通じる。九州をダミーに出すと
 *   実際に使っている人が“外れ”になってしまう）
 */
const ADJACENT_REGIONS: Record<string, string[]> = {
  "北海道・東北": ["関東", "甲信越・北陸"],
  関東: ["北海道・東北", "甲信越・北陸", "東海"],
  "甲信越・北陸": ["北海道・東北", "関東", "東海", "近畿"],
  東海: ["関東", "甲信越・北陸", "近畿"],
  近畿: ["甲信越・北陸", "東海", "中国", "四国"],
  中国: ["近畿", "四国", "九州・沖縄"],
  四国: ["近畿", "中国", "九州・沖縄"],
  "九州・沖縄": ["中国", "四国"],
};

export type DokoQ = {
  word: string;
  meaning: string;
  example: string;
  answer: string; // 方言名
  /** 同じ地方の中で、辞典が同じ語を収録している他の方言（あれば画面で補足する） */
  sameRegionAlso: string[];
  choices: string[]; // 方言名 × 4（answerを含む・地方は全て別かつ隣接なし）
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type PoolItem = { entry: WordEntry; dialect: string; sameRegionAlso: string[] };

let curatedPool: Record<string, PoolItem[]> | null = null;

/** 出典照合済みリスト（lib/doko_pool.ts）を辞典と突き合わせて出題プールを作る */
function buildCuratedPool(): Record<string, PoolItem[]> {
  if (curatedPool) return curatedPool;
  const out: Record<string, PoolItem[]> = {};
  for (const seed of DOKO_SEEDS) {
    // 辞典に無い語は出さない（辞典を直したときに勝手に食い違わないようにする）
    const entry = wordsOf(seed.dialect).find((w) => w.word === seed.word);
    if (!entry) continue;
    const region = REGION_OF[seed.dialect];
    const sameRegionAlso = REAL_DIALECTS.filter(
      (d) => d !== seed.dialect && REGION_OF[d] === region && wordsOf(d).some((w) => w.word === seed.word),
    );
    (out[seed.dialect] ??= []).push({ entry, dialect: seed.dialect, sameRegionAlso });
  }
  curatedPool = out;
  return out;
}

/** 出題プールに実際に残っている語数（監査・開発用） */
export function dokoPoolStats(): { total: number; byRegion: Record<string, number> } {
  const pool = buildCuratedPool();
  const byRegion: Record<string, number> = {};
  let total = 0;
  for (const d of Object.keys(pool)) {
    const r = REGION_OF[d] ?? "その他";
    byRegion[r] = (byRegion[r] ?? 0) + pool[d].length;
    total += pool[d].length;
  }
  return { total, byRegion };
}

/**
 * 「この方言どこの言葉？」の出題を作る。
 * - 出題語は出典照合済みプールのみ
 * - 同じ地方に偏らないよう、1地方あたり最大2問まで
 * - ダミー選択肢は「正解の地方と隣接しない地方」から1つずつ取る
 */
export function buildDokoQuestions(n = 8): DokoQ[] {
  const pool = buildCuratedPool();
  const candidates = shuffle(Object.keys(pool));

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

    const answerRegion = REGION_OF[d] ?? "その他";
    const near = ADJACENT_REGIONS[answerRegion] ?? [];
    const farRegions = shuffle(
      REGIONS.map((r) => r.name).filter((r) => r !== answerRegion && !near.includes(r)),
    ).slice(0, 3);
    const distractors = farRegions
      .map((rn) => {
        const rd = REGIONS.find((r) => r.name === rn)?.dialects ?? [];
        return rd.length ? pick(rd) : null;
      })
      .filter((x): x is string => !!x);
    if (distractors.length < 3) continue;

    usedWords.add(item.entry.word);
    qs.push({
      word: item.entry.word,
      meaning: item.entry.meaning,
      example: item.entry.example,
      answer: d,
      sameRegionAlso: item.sameRegionAlso,
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
