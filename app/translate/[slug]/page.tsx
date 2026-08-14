import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TranslateTool from "@/components/TranslateTool";
import { DIALECT_NOTES, wordsOf } from "@/lib/data";
import { quizSlug } from "@/lib/quiz_meta";
import { REGION_OF } from "@/lib/tools";
import {
  TRANSLATE_AREA_OF,
  TRANSLATE_DIALECTS,
  phrasePairs,
  translateDialectOf,
  translateSampleWords,
  translateSiblings,
  translateSlug,
} from "@/lib/translate_meta";
import { typeByDialect } from "@/lib/types";

const BASE = "https://hogen.mainichi-lab.com";

// 方言ごとに1URL。「○○弁 変換」「○○弁 翻訳」は方言ごとに検索され、
// 変換の中身も方言ごとに全く違う（＝分割の2条件を満たす）。/translate は全方言の索引として残す。
//
// generateStaticParams は使わない。Cloudflare Workers（OpenNext）ではSSGした動的ルートのHTMLが
// インクリメンタルキャッシュ側に入り、キャッシュ未設定のこの環境では404になる（/quiz/[slug] と同じ）。

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dialect = translateDialectOf(slug);
  if (!dialect) return {};
  const area = TRANSLATE_AREA_OF[dialect] ?? "";
  const pairs = phrasePairs(dialect, 3);
  const title = `${dialect} 変換｜標準語を${dialect}に変換する（${area}）| 方言ラボ`;
  const description = `標準語の文を入力するだけで${dialect}（${area}）に変換します。逆に${dialect}を標準語へ戻すこともできます。${pairs
    .map((p) => `「${p.standard}」→「${p.dialect}」`)
    .join("")}など、よく使う言い換えも一覧で確認できます。登録不要・スマホで数秒。`;
  const url = `${BASE}/translate/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "方言ラボ", locale: "ja_JP", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TranslateDialectPage({ params }: Props) {
  const { slug } = await params;
  const dialect = translateDialectOf(slug);
  if (!dialect) notFound();

  const area = TRANSLATE_AREA_OF[dialect] ?? "";
  const region = REGION_OF[dialect] ?? "";
  const pairs = phrasePairs(dialect);
  const samples = translateSampleWords(dialect, 6);
  const siblings = translateSiblings(dialect);
  const wordCount = wordsOf(dialect).length;
  const type = typeByDialect(dialect);
  const qSlug = quizSlug(dialect);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "方言ラボ", item: BASE },
      { "@type": "ListItem", position: 2, name: "方言変換", item: `${BASE}/translate` },
      { "@type": "ListItem", position: 3, name: `${dialect} 変換`, item: `${BASE}/translate/${slug}` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="text-center space-y-2">
        <Link href="/translate" className="text-xs font-bold text-primary hover:underline">
          ← 方言変換（全{TRANSLATE_DIALECTS.length}方言）の一覧
        </Link>
        <h1 className="section-title">🗣️ {dialect} 変換</h1>
        <p className="text-sub text-sm leading-relaxed">
          標準語の文を入力すると、{area}のことば「{dialect}」に変換します。
          ⇄ を押せば {dialect} → 標準語の向きにも変えられます。
        </p>
        <p className="text-xs text-sub leading-relaxed">
          方言ラボの辞典に収録された{dialect}の語（{wordCount}語）を置き換えるしくみです。
          語尾や活用は変えないので、置き換えられなかった部分はそのまま残ります。
        </p>
      </div>

      <TranslateTool dialect={dialect} slug={slug} />

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-sm">📝 {dialect}でよく使う言い換え（{pairs.length}）</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {pairs.map((p) => (
            <li key={p.key} className="bg-paper border border-line rounded-xl px-3 py-2 text-sm">
              <span className="text-sub">{p.standard}</span>
              <span className="text-sub mx-1.5">→</span>
              <b className="text-primary break-words">{p.dialect}</b>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-sub leading-relaxed">
          ※ 方言ラボの辞書データに収録している言い方です。方言は地域・世代で差があり、
          ここに載っている形が唯一の言い方というわけではありません。
        </p>
      </section>

      <section className="card p-5 space-y-2">
        <h2 className="font-bold text-sm">
          📚 {dialect}とは（{area}）
        </h2>
        <p className="text-sm leading-relaxed">{DIALECT_NOTES[dialect]}</p>
        <p className="text-xs text-sub leading-relaxed">
          方言ラボの辞典には{dialect}の語を{wordCount}語収録しています。
        </p>
        <ul className="grid sm:grid-cols-2 gap-1.5 pt-1">
          {samples.map((w) => (
            <li key={w.word} className="text-xs">
              <b>{w.word}</b>
              <span className="text-sub"> … {w.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      {siblings.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-bold text-sm text-center">同じ{region}の変換ツール</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {siblings.map((d) => (
              <Link
                key={d}
                href={`/translate/${translateSlug(d)}`}
                className="btn-secondary text-sm min-h-[44px] inline-flex items-center"
              >
                {d} 変換
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {qSlug && (
          <Link href={`/quiz/${qSlug}`} className="btn-ghost">
            🏅 {dialect}検定に挑戦
          </Link>
        )}
        {type && (
          <Link href={`/c/${type.slug}`} className="btn-ghost">
            {type.emoji} {dialect}のキャラを見る
          </Link>
        )}
        <Link href="/translate" className="btn-ghost">
          🗣️ 全{TRANSLATE_DIALECTS.length}方言の変換
        </Link>
        <Link href="/kurabe" className="btn-ghost">
          🔤 全国方言くらべ
        </Link>
        <Link href="/dict" className="btn-ghost">
          📖 方言辞典
        </Link>
      </div>
    </div>
  );
}
