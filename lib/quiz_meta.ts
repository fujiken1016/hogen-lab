// 方言別「○○弁検定」ページ（/quiz/[slug]）のためのメタ情報と出題の注記。
//
// 事実の扱いについて（DICT_AUDIT.md と /doko の方針に合わせる）:
// - 検定の設問は lib/data.ts の QUIZZES（手書き・8問/方言）だけを使う。新しく方言を作らない。
// - 出典照合済みの語（lib/doko_pool.ts に載っている語）を先に出す。
// - 辞典が複数の方言に同じ語を収録している場合は、その旨を設問ごとに明示する。
//   「○○弁だけの言葉」と誤解させないため。方言は県境で切れない。
// - 判定の文言は「不正解」と断定せず「辞典では〜として収録」に寄せる（画面側で実装）。

import { QUIZZES, QuizQ, wordsOf } from "./data";
import { DOKO_SEEDS } from "./doko_pool";
import { REAL_DIALECTS, REGION_OF } from "./tools";
import { TYPES } from "./types";

/** 検定を用意している方言（＝QUIZZES に8問そろっているもの） */
export const QUIZ_DIALECTS: string[] = REAL_DIALECTS.filter((d) => (QUIZZES[d]?.length ?? 0) > 0);

const SLUG_BY_DIALECT: Record<string, string> = Object.fromEntries(
  TYPES.map((t) => [t.dialect, t.slug]),
);
const DIALECT_BY_SLUG: Record<string, string> = Object.fromEntries(
  TYPES.map((t) => [t.slug, t.dialect]),
);

export function quizSlug(dialect: string): string | undefined {
  return SLUG_BY_DIALECT[dialect];
}

export function quizDialectOf(slug: string): string | undefined {
  const d = DIALECT_BY_SLUG[slug];
  return d && QUIZ_DIALECTS.includes(d) ? d : undefined;
}

/** 検索・タイトル用の地域名（都道府県）。方言名だけでは伝わらない人向け */
export const AREA_OF: Record<string, string> = {
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

/** 出典を1語ずつ照合した語（/doko の出題プールと同じリスト） */
const VERIFIED_WORDS = new Set(DOKO_SEEDS.map((s) => s.word));

/** 語 → その語を収録している方言の一覧（辞典全体から作る。初回だけ構築） */
let wordIndex: Map<string, string[]> | null = null;
function getWordIndex(): Map<string, string[]> {
  if (wordIndex) return wordIndex;
  const m = new Map<string, string[]>();
  for (const d of REAL_DIALECTS) {
    for (const w of wordsOf(d)) {
      const list = m.get(w.word) ?? [];
      if (!list.includes(d)) list.push(d);
      m.set(w.word, list);
    }
  }
  wordIndex = m;
  return m;
}

/** 設問文「「◯◯」の意味は？」から見出し語を取り出す */
function wordOfQuestion(q: string): string | null {
  const m = q.match(/「([^」]+)」/);
  if (!m) return null;
  return m[1].replace(/^[〜～]/, "").trim() || null;
}

/** 辞典で、この方言以外にも同じ語を収録している方言 */
function alsoRecordedIn(dialect: string, word: string | null): string[] {
  if (!word) return [];
  const idx = getWordIndex();
  let hit = idx.get(word);
  if (!hit && word.length <= 8) {
    // 「ゴミをなげる」のような句の場合、末尾の見出し語で引き直す
    for (const [k, v] of idx) {
      if (k.length >= 3 && k !== word && word.endsWith(k)) {
        hit = v;
        break;
      }
    }
  }
  return (hit ?? []).filter((d) => d !== dialect);
}

export type AnnotatedQ = QuizQ & {
  /** 設問の見出し語 */
  word: string | null;
  /** 出典照合済みリストに載っている語か */
  verified: boolean;
  /** 辞典が同じ語を収録している他の方言 */
  also: string[];
};

/**
 * その方言の検定8問。出典照合済みの語を先頭に寄せ、
 * 「他の方言にも収録がある語」には注記用の情報を付ける。
 */
export function annotatedQuiz(dialect: string): AnnotatedQ[] {
  const qs = QUIZZES[dialect] ?? [];
  const annotated: AnnotatedQ[] = qs.map((q) => {
    const word = wordOfQuestion(q.q);
    return {
      ...q,
      word,
      verified: word ? VERIFIED_WORDS.has(word) : false,
      also: alsoRecordedIn(dialect, word),
    };
  });
  // 出典照合済み → 他方言との重なりが少ない順（同点は元の並びを保つ安定ソート）
  return annotated
    .map((q, i) => ({ q, i }))
    .sort((a, b) => {
      if (a.q.verified !== b.q.verified) return a.q.verified ? -1 : 1;
      if (a.q.also.length !== b.q.also.length) return a.q.also.length - b.q.also.length;
      return a.i - b.i;
    })
    .map((x) => x.q);
}

/** 検定ページの導入・meta description に使う見出し語のサンプル */
export function quizSampleWords(dialect: string, n = 3): string[] {
  return annotatedQuiz(dialect)
    .map((q) => q.word)
    .filter((w): w is string => !!w)
    .slice(0, n);
}

/** 出典照合済みの設問数（ページ上で正直に出す） */
export function verifiedCount(dialect: string): number {
  return annotatedQuiz(dialect).filter((q) => q.verified).length;
}

/** 同じ地方にある他の方言（回遊導線用） */
export function siblingDialects(dialect: string): string[] {
  const region = REGION_OF[dialect];
  return QUIZ_DIALECTS.filter((d) => d !== dialect && REGION_OF[d] === region);
}
