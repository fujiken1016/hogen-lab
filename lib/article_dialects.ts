// 記事 → その記事が実際に扱っている方言（＝ツール面への逆リンク用）。
//
// 背景（2026-09-03・Search Console 実測）:
// 「検出 - インデックス未登録」80件のうち 59件が /translate/<地域>・/quiz/<地域> で、
// 全件「前回のクロール＝該当なし」＝一度もクロールされていない。
// 一方でクロール済み・インデックス済みの面は トップ／記事13本／/blog／/dict／/quiz／/shindan だけ。
// その **記事13本から /translate/<地域>・/quiz/<地域> への内部リンクは実測0本** だった
// （2026-09-02 に足したのは逆向き＝ツール面→記事の ToolReads）。
//
// 🔴 対応関係を新しく創作しない。
//    lib/tool_reads.ts の readsFor()（ツール面→記事）を **そのまま逆引き** して作る。
//    つまり「記事Aが方言Dのページに出ている」ときだけ「方言Dは記事Aに関係する」とみなす。
//    根拠が tool_reads.ts 側の既存データ1本に集約されるので、二重管理にならない。

import { REAL_DIALECTS } from "./tools";
import { readsFor } from "./tool_reads";
import { quizSlug, QUIZ_DIALECTS } from "./quiz_meta";
import { translateSlug, TRANSLATE_DIALECTS } from "./translate_meta";

export type DialectLink = {
  dialect: string;
  /** /translate/<slug>（変換ページ）。無ければ undefined */
  translate?: string;
  /** /quiz/<slug>（検定ページ）。無ければ undefined */
  quiz?: string;
};

/**
 * article.slug → 方言名[]（readsFor の逆引き。キャッシュして毎回計算しない）
 *
 * 並び順＝readsFor() の中で「その記事が何番目に選ばれたか」が早い方言を先に出す。
 * readsFor は 固有記事 → かわいいランキング掲載 → 三大方言 → 地方の受け皿 の順に積むので、
 * この順序がそのまま「記事との関係の強さ」になる。
 * （これをやらないと、かわいい方言ランキングの記事で第1位の博多弁が
 *   単なる地方フォールバックの方言に押し出されて8件の枠から落ちる）
 */
const REVERSE: Record<string, string[]> = (() => {
  const m: Record<string, { dialect: string; rank: number }[]> = {};
  for (const d of REAL_DIALECTS) {
    readsFor(d).forEach((r, i) => {
      (m[r.article.slug] ??= []).push({ dialect: d, rank: i });
    });
  }
  return Object.fromEntries(
    Object.entries(m).map(([slug, arr]) => [
      slug,
      arr.sort((a, b) => a.rank - b.rank).map((x) => x.dialect),
    ]),
  );
})();

/**
 * 記事ページの末尾に置く「この記事に出てくる方言のページ」用のリンク一覧。
 * 対応が無い記事では空配列を返す（存在しない関係をでっち上げない）。
 *
 * @param max 出しすぎると定型リンクの塊になるので既定8件まで
 */
export function dialectLinksForArticle(articleSlug: string, max = 8): DialectLink[] {
  const dialects = REVERSE[articleSlug] ?? [];
  const out: DialectLink[] = [];
  for (const d of dialects) {
    if (out.length >= max) break;
    const translate = TRANSLATE_DIALECTS.includes(d) ? translateSlug(d) : undefined;
    const quiz = QUIZ_DIALECTS.includes(d) ? quizSlug(d) : undefined;
    if (!translate && !quiz) continue;
    out.push({ dialect: d, translate, quiz });
  }
  return out;
}
