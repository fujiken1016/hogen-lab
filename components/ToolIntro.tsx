import Link from "next/link";

/**
 * ツールページ下部の静的解説（SSR本文の増強）。
 * 背景: 2026-08-30 の品質監査で、ツール系ページのSSR可視テキストが200〜430字と薄く、
 * AdSense審査中の弱点になり得ると判明。ツール体験を邪魔しない最下部に、
 * 遊び方・仕組み・関連ツールを静的テキストで置く（SEOの受け皿も兼ねる）。
 *
 * 2026-09-14 追加: steps / facts / faq を任意で受け取れるようにした。
 * 理由＝2回目のAdSense否認（「有用性の低いコンテンツ」）の実体が、
 * 看板ツール面のHTML可読テキストが400〜750字しか無いことだったため。
 * **面ごとに違う中身を書くこと**（同じ文章を複数面に貼るのは、まさに否認された型）。
 */
export function ToolIntro({
  heading,
  paragraphs,
  steps,
  facts,
  faq,
  related,
}: {
  heading: string;
  paragraphs: string[];
  /** 使い方の手順。画面に実際に出ている言葉で書く */
  steps?: { t: string; d: string }[];
  /** そのツール固有の中身（データの出どころ・判定の材料など） */
  facts?: { h: string; body: string[] }[];
  /** よくある質問。実際に来そうなものだけ。捏造しない */
  faq?: { q: string; a: string }[];
  related: { href: string; label: string }[];
}) {
  return (
    <section className="max-w-2xl mx-auto mt-14 pt-8 border-t border-line text-left">
      <h2 className="font-display text-2xl font-bold mb-3">{heading}</h2>
      {paragraphs.map((t, i) => (
        <p key={i} className="text-base leading-[1.95] text-ink/80 mb-3">
          {t}
        </p>
      ))}

      {steps && steps.length > 0 && (
        <>
          <h3 className="font-display text-xl font-bold mt-8 mb-3">使い方</h3>
          <ol className="list-decimal pl-6 space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="text-base leading-[1.95] text-ink/80">
                <b className="font-bold text-ink">{s.t}</b>
                <span className="block">{s.d}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {facts &&
        facts.map((f, i) => (
          <div key={i}>
            <h3 className="font-display text-xl font-bold mt-8 mb-3">{f.h}</h3>
            {f.body.map((t, j) => (
              <p key={j} className="text-base leading-[1.95] text-ink/80 mb-3">
                {t}
              </p>
            ))}
          </div>
        ))}

      {faq && faq.length > 0 && (
        <>
          <h3 className="font-display text-xl font-bold mt-8 mb-3">よくある質問</h3>
          <dl className="space-y-4">
            {faq.map((f, i) => (
              <div key={i}>
                <dt className="text-base font-bold leading-[1.8]">{f.q}</dt>
                <dd className="text-base leading-[1.95] text-ink/80 mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <div className="flex flex-wrap gap-2 mt-8">
        {related.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="chip inline-flex min-h-[48px] items-center bg-primary/10 text-primary-text font-bold hover:bg-primary/20 transition-colors"
          >
            {r.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
