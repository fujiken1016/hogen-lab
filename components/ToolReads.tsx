"use client";

import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { track } from "@/lib/ga";
import { readsFor } from "@/lib/tool_reads";

/**
 * 勝ち面（/translate/<地域>・/quiz/<地域>）から読みもの記事へ送る枠。
 *
 * 🔴 ここに置くのは自サイト内の記事リンクだけ。アフィリエイトリンクは1本も置かない
 *    （司令塔裁定10：ツール/診断ページには収益導線を置かない）。
 *
 * クリックは GA4 の `tool_to_article` で計測する（既存の char_to_tool と同じ命名流儀）。
 */
export default function ToolReads({
  dialect,
  from,
  slug,
}: {
  dialect: string;
  /** どのツール面から来たか（translate / quiz） */
  from: string;
  /** 遷移元の地域slug */
  slug: string;
}) {
  const reads = readsFor(dialect);
  if (reads.length === 0) return null;

  return (
    <section className="card p-5 space-y-3">
      <h2 className="font-bold text-2xl">📖 {dialect}を、読みものでもう一歩</h2>
      <p className="text-sm text-sub leading-relaxed">
        方言ラボが書いた解説記事です。ことばの背景を知ってから使うと、変換の結果の見え方も変わります。
      </p>
      <div className="grid gap-2.5">
        {reads.map((r) => (
          <Link
            key={r.article.slug}
            href={`/blog/${r.article.slug}`}
            onClick={() =>
              track("tool_to_article", {
                from,
                article_slug: r.article.slug,
                dialect,
                dialect_slug: slug,
              })
            }
            className="card p-3.5 min-h-[64px] flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
          >
            <span className="text-2xl shrink-0" aria-hidden>
              {r.article.emoji}
            </span>
            <span className="min-w-0">
              <span className="block text-base font-bold leading-snug break-words">
                {r.article.title}
              </span>
              <span className="block text-sm text-sub mt-1 leading-[1.7] break-words">
                {r.reason}
              </span>
              <span className="block text-sm text-sub mt-1">
                {r.article.category}・約{r.article.readMin}分
              </span>
            </span>
          </Link>
        ))}
      </div>
      <p className="text-center pt-0.5">
        <Link
          href="/blog"
          onClick={() => track("tool_to_article", { from, article_slug: "index", dialect, dialect_slug: slug })}
          className="btn-ghost text-sm min-h-[48px] inline-flex items-center"
        >
          読みもの一覧（全{ARTICLES.length}本）へ →
        </Link>
      </p>
    </section>
  );
}
