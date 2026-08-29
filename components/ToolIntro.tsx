import Link from "next/link";

/**
 * ツールページ下部の静的解説（SSR本文の増強）。
 * 背景: 2026-08-30 の品質監査で、ツール系ページのSSR可視テキストが200〜430字と薄く、
 * AdSense審査中の弱点になり得ると判明。ツール体験を邪魔しない最下部に、
 * 遊び方・仕組み・関連ツールを静的テキストで置く（SEOの受け皿も兼ねる）。
 */
export function ToolIntro({
  heading,
  paragraphs,
  related,
}: {
  heading: string;
  paragraphs: string[];
  related: { href: string; label: string }[];
}) {
  return (
    <section className="max-w-2xl mx-auto mt-14 pt-8 border-t border-line text-left">
      <h2 className="font-display text-lg font-bold mb-3">{heading}</h2>
      {paragraphs.map((t, i) => (
        <p key={i} className="text-[13.5px] leading-[1.95] text-ink/80 mb-3">
          {t}
        </p>
      ))}
      <div className="flex flex-wrap gap-2 mt-4">
        {related.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="chip bg-primary/10 text-primary-deep font-bold hover:bg-primary/20 transition-colors"
          >
            {r.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
