// 辞典ベースの方言変換。
//
// 方針（AI生成をやめて辞典置換にした理由）:
// - 無料ツールで従量課金APIを回すと、使われるほど赤字になる
// - 手元に35方言3,362語の辞典データがある（lib/data.ts + lib/words_extra.ts）
// - 即時に返る（APIの往復待ちが無い）
//
// できることの範囲をはっきりさせる:
// - 辞典に「載っている語」だけを置き換える。語尾・活用・語順は触らない
// - 置き換えられなかった部分はそのまま残す（それが誠実な出力）
// - どの語を何に置き換えたかを必ず提示する（辞典ベースの強み）
// - 「これが正しい○○弁です」とは言わない。辞典に収録された言い方の提示にとどめる

import {
  SHINDAN_PHRASES,
  SHINDAN_QUESTIONS,
  STANDARD,
  wordsOf,
} from "./data.ts";

/** 置き換え1件の記録（どこが・何に・何を根拠に変わったか） */
export type Hit = {
  /** 入力にあった語 */
  source: string;
  /** 置き換えた語 */
  target: string;
  /** 辞典に書かれている意味 */
  meaning: string;
  /** 辞典の用例（無いこともある） */
  example: string;
  /** 出典データの種別 */
  origin: "辞典" | "定型句";
  /** その語が載っている辞典の方言名（出典表示用） */
  dict: string;
  /** 同じ意味で辞典に載っている別の言い方 */
  alts: string[];
};

/** 出力を「そのまま残した部分」と「置き換えた部分」に分けたもの（ハイライト表示用） */
export type Segment = { text: string; hit?: Hit };

export type ConvertResult = {
  /** 変換後の文（プレーンテキスト。読み上げ・シェア用） */
  output: string;
  segments: Segment[];
  hits: Hit[];
  /** 1語も置き換えられなかったときに出す「この方言で使える語」の例 */
  suggestions: { input: string; output: string; meaning: string }[];
};

type IndexEntry = {
  target: string;
  meaning: string;
  example: string;
  origin: "辞典" | "定型句";
  dict: string;
  alts: string[];
};

/** 見出し語として扱わない汎用語（何にでも当たってしまい、置換が雑になる） */
const STOP_GLOSS = new Set([
  "する",
  "した",
  "して",
  "ある",
  "いる",
  "なる",
  "いう",
  "言う",
  "こと",
  "もの",
  "ため",
  "とき",
  "ところ",
  "それ",
  "これ",
  "そう",
  "よう",
  "です",
  "ます",
  "など",
  "意味",
  "様子",
  "状態",
  "感じ",
]);

const MIN_KEY = 2;
const MAX_KEY = 12;

/**
 * 辞典の「意味」欄から、標準語の見出し語を取り出す。
 * 例: "（手が）届く" → ["届く"] / "てこずる、手を焼く" → ["てこずる", "手を焼く"]
 * 説明文（"紙などをくしゃくしゃに丸める"）は長すぎるので落ちる＝当たらない。それでよい。
 */
export function glossesOf(meaning: string): string[] {
  const cleaned = meaning.replace(/[（(][^）)]*[）)]/g, "");
  const out: string[] = [];
  for (const raw of cleaned.split(/[、,・／/。]/)) {
    const s = raw.trim();
    if (s.length < MIN_KEY || s.length > 8) continue;
    if (/[ 　]/.test(s)) continue;
    if (/[〜～?？!！]/.test(s)) continue;
    if (/こと$/.test(s)) continue;
    if (STOP_GLOSS.has(s)) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

function addKey(map: Map<string, IndexEntry>, key: string, entry: IndexEntry) {
  if (!key || key === entry.target) return;
  if (key.length < MIN_KEY || key.length > MAX_KEY) return;
  const prev = map.get(key);
  if (!prev) {
    map.set(key, { ...entry, alts: [...entry.alts] });
    return;
  }
  // 同じ意味に複数の言い方があるときは、最初の1つを採用して残りは「別の言い方」に回す
  if (prev.target !== entry.target && !prev.alts.includes(entry.target) && prev.alts.length < 4) {
    prev.alts.push(entry.target);
  }
}

/** その方言の定型句（SHINDAN_PHRASES）。標準語キー → 方言の言い方 */
function phraseMap(dialect: string): Record<string, string> {
  return SHINDAN_PHRASES[dialect] ?? {};
}

/**
 * from → to の置換辞書を組む。
 * - 標準語 → 方言 : 辞典の「意味」を見出しにして方言語へ
 * - 方言 → 標準語 : 辞典の「語」を見出しにして意味へ
 * - 方言 → 方言   : 意味を経由して直接つなぐ（＋標準語の見出しも受け付ける）
 */
function buildIndex(from: string, to: string): Map<string, IndexEntry> {
  const map = new Map<string, IndexEntry>();
  const stdPhrases = phraseMap(STANDARD);

  if (to === STANDARD) {
    // 方言 → 標準語
    const fromPhrases = phraseMap(from);
    for (const q of SHINDAN_QUESTIONS) {
      const d = fromPhrases[q.key];
      const s = stdPhrases[q.key] ?? q.key;
      if (d && s) {
        addKey(map, d, { target: s, meaning: s, example: "", origin: "定型句", dict: from, alts: [] });
      }
    }
    for (const w of wordsOf(from)) {
      const g = glossesOf(w.meaning);
      const target = g[0];
      if (!target) continue;
      addKey(map, w.word, {
        target,
        meaning: w.meaning,
        example: w.example ?? "",
        origin: "辞典",
        dict: from,
        alts: g.slice(1, 3),
      });
    }
    return map;
  }

  // → 方言（to）
  const toPhrases = phraseMap(to);
  for (const q of SHINDAN_QUESTIONS) {
    const d = toPhrases[q.key];
    if (!d) continue;
    const s = stdPhrases[q.key] ?? q.key;
    addKey(map, s, { target: d, meaning: `「${s}」にあたる言い方`, example: "", origin: "定型句", dict: to, alts: [] });
    if (s !== q.key) {
      addKey(map, q.key, { target: d, meaning: `「${q.key}」にあたる言い方`, example: "", origin: "定型句", dict: to, alts: [] });
    }
  }

  // 標準語の見出し → to の方言語
  const byGloss = new Map<string, IndexEntry>();
  for (const w of wordsOf(to)) {
    for (const g of glossesOf(w.meaning)) {
      const entry: IndexEntry = {
        target: w.word,
        meaning: w.meaning,
        example: w.example ?? "",
        origin: "辞典",
        dict: to,
        alts: [],
      };
      addKey(map, g, entry);
      if (!byGloss.has(g)) byGloss.set(g, entry);
    }
  }

  // 方言 → 方言: from の語も、意味が一致すれば直接 to の語へ
  if (from !== STANDARD) {
    const fromPhrases = phraseMap(from);
    for (const q of SHINDAN_QUESTIONS) {
      const fd = fromPhrases[q.key];
      const td = toPhrases[q.key];
      if (fd && td) {
        addKey(map, fd, { target: td, meaning: `「${stdPhrases[q.key] ?? q.key}」にあたる言い方`, example: "", origin: "定型句", dict: to, alts: [] });
      }
    }
    for (const w of wordsOf(from)) {
      for (const g of glossesOf(w.meaning)) {
        const hit = byGloss.get(g);
        if (hit) {
          addKey(map, w.word, { ...hit, meaning: `${g}（${from}「${w.word}」と同じ意味）` });
          break;
        }
      }
    }
  }

  return map;
}

const CACHE = new Map<string, Map<string, IndexEntry>>();

function indexFor(from: string, to: string): Map<string, IndexEntry> {
  const key = `${from}→${to}`;
  let idx = CACHE.get(key);
  if (!idx) {
    idx = buildIndex(from, to);
    CACHE.set(key, idx);
  }
  return idx;
}

/** 置き換えられなかったときに出す「この方言なら使える語」の例（辞典から実在の語だけ） */
function suggestionsFrom(idx: Map<string, IndexEntry>, n: number) {
  const out: { input: string; output: string; meaning: string }[] = [];
  const seen = new Set<string>();
  for (const [key, entry] of idx) {
    if (entry.origin !== "辞典") continue;
    if (key.length < 2 || key.length > 5) continue;
    if (seen.has(entry.target)) continue;
    seen.add(entry.target);
    out.push({ input: key, output: entry.target, meaning: entry.meaning });
    if (out.length >= n) break;
  }
  return out;
}

/**
 * 本体。最長一致で左から走査し、辞典に載っている語だけを置き換える。
 * 置き換えた位置は飛ばすので、置換結果に再度置換がかかることはない。
 */
export function convert(text: string, from: string, to: string): ConvertResult {
  const idx = indexFor(from, to);
  const segments: Segment[] = [];
  const hits: Hit[] = [];
  let plain = "";
  let buffer = "";

  const flush = () => {
    if (buffer) {
      segments.push({ text: buffer });
      buffer = "";
    }
  };

  let i = 0;
  while (i < text.length) {
    let matched: { key: string; entry: IndexEntry } | null = null;
    const max = Math.min(MAX_KEY, text.length - i);
    for (let len = max; len >= MIN_KEY; len--) {
      const sub = text.slice(i, i + len);
      const entry = idx.get(sub);
      if (entry) {
        matched = { key: sub, entry };
        break;
      }
    }
    if (matched) {
      flush();
      const hit: Hit = {
        source: matched.key,
        target: matched.entry.target,
        meaning: matched.entry.meaning,
        example: matched.entry.example,
        origin: matched.entry.origin,
        dict: matched.entry.dict,
        alts: matched.entry.alts,
      };
      segments.push({ text: matched.entry.target, hit });
      hits.push(hit);
      plain += matched.entry.target;
      i += matched.key.length;
    } else {
      buffer += text[i];
      plain += text[i];
      i++;
    }
  }
  flush();

  return {
    output: plain,
    segments,
    hits,
    suggestions: hits.length === 0 ? suggestionsFrom(idx, 6) : [],
  };
}

/** 収録語数（「この方言は◯語から探しています」の表示用） */
export function dictSize(from: string, to: string): number {
  return indexFor(from, to).size;
}
