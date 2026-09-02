import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuizRunner from "@/components/QuizRunner";
import ToolReads from "@/components/ToolReads";
import TypeAvatar from "@/components/TypeAvatar";
import { DIALECT_NOTES, wordsOf } from "@/lib/data";
import { aliasParen, aliasSentence } from "@/lib/dialect_alias";
import {
  AREA_OF,
  QUIZ_DIALECTS,
  quizDialectOf,
  quizSampleWords,
  quizSlug,
  siblingDialects,
  verifiedCount,
} from "@/lib/quiz_meta";
import { REGION_OF } from "@/lib/tools";
import { translateDialectOf, translateSlug } from "@/lib/translate_meta";
import { typeByDialect } from "@/lib/types";

const BASE = "https://hogen.mainichi-lab.com";

// 方言ごとに1URL。「○○弁検定」という検索クエリで個別に拾えるようにするため、
// 単一ページ（/quiz）の中で状態を切り替える方式から分割した。/quiz は一覧として残している。
//
// generateStaticParams は使わない（＝リクエスト時にサーバーで描画する）。
// Cloudflare Workers（OpenNext）ではSSGした動的ルートのHTMLはインクリメンタルキャッシュに
// 入るため、キャッシュ未設定のこの環境では 404 になる（2026-08 実測）。
// データは全てローカルの静的データなので、既存の /c/[slug] と同じくオンデマンド描画で足りる。

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dialect = quizDialectOf(slug);
  if (!dialect) return {};
  const area = AREA_OF[dialect] ?? "";
  const samples = quizSampleWords(dialect, 3);
  // 別名（「沖縄方言」→「沖縄弁・うちなーぐち」など）をタイトルに入れる。
  // SC実測で「うちなーぐち検定」が11表示・掲載順位9.0でクリック0だったため。
  const title = `${dialect}${aliasParen(dialect)}検定｜全8問・1分の${dialect}クイズ（${area}） | 方言ラボ`;
  const description = `「${samples.join("」「")}」…${dialect}（${area}）の言葉、意味がわかる？ 全8問の4択クイズで${dialect}検定に挑戦。8割正解で合格バッジ。${aliasSentence(
    dialect,
    area,
  )}登録不要・スマホで約1分。`;
  const url = `${BASE}/quiz/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "方言ラボ", locale: "ja_JP", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function QuizDialectPage({ params }: Props) {
  const { slug } = await params;
  const dialect = quizDialectOf(slug);
  if (!dialect) notFound();

  const area = AREA_OF[dialect] ?? "";
  const region = REGION_OF[dialect] ?? "";
  const type = typeByDialect(dialect);
  const samples = quizSampleWords(dialect, 5);
  const verified = verifiedCount(dialect);
  const siblings = siblingDialects(dialect);
  const wordCount = wordsOf(dialect).length;
  // 変換ページを用意している方言なら相互リンクする（「○○弁 変換」への回遊）
  const tSlug = translateDialectOf(slug) ? translateSlug(dialect) : undefined;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "方言ラボ", item: BASE },
      { "@type": "ListItem", position: 2, name: "方言クイズ検定", item: `${BASE}/quiz` },
      { "@type": "ListItem", position: 3, name: `${dialect}検定`, item: `${BASE}/quiz/${slug}` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="text-center space-y-2">
        <Link href="/quiz" className="text-xs font-bold text-primary hover:underline">
          ← 方言クイズ検定の一覧
        </Link>
        {type && (
          <div className="flex justify-center">
            <TypeAvatar type={type} size={72} />
          </div>
        )}
        <h1 className="section-title">🏅 {dialect}検定</h1>
        <p className="text-sub text-sm leading-relaxed">
          {area}のことば「{dialect}」から全8問。意味を4択で選ぶだけの検定です。
          8問中6問以上（80%）が辞典と一致すると「{dialect} 検定合格」バッジがもらえます。
        </p>
      </div>

      <QuizRunner dialect={dialect} />

      <section className="card p-5 space-y-2">
        <h2 className="font-bold text-sm">📚 {dialect}とは（{area}）</h2>
        <p className="text-sm leading-relaxed">{DIALECT_NOTES[dialect]}</p>
        {aliasSentence(dialect, area) && (
          <p className="text-xs text-sub leading-relaxed">{aliasSentence(dialect, area)}</p>
        )}
        <p className="text-xs text-sub leading-relaxed">
          方言ラボの辞典には{dialect}の語を{wordCount}語収録しています。
          この検定の8問のうち{verified}問は、辞典・自治体資料・地方紙などの出典と1語ずつ突き合わせて
          確認した語です（
          <Link href="/doko" className="text-primary underline underline-offset-2">
            この方言どこの言葉？
          </Link>
          の出題プールと、検定用に照合したリストの両方から出しています）。
        </p>
        <p className="text-xs text-sub leading-relaxed">
          出題語の例：{samples.join("・")}
        </p>
        {tSlug && (
          <p className="text-xs pt-1">
            <Link href={`/translate/${tSlug}#words`} className="text-primary font-bold hover:underline">
              → {dialect}の言葉一覧（{wordCount}語・意味と例文つき）を見る
            </Link>
          </p>
        )}
      </section>

      {/* 検定 → 読みものへの回遊。記事側だけが書籍PR枠を持つ（裁定10：ツール面には置かない）。 */}
      <ToolReads dialect={dialect} from="quiz" slug={slug} />

      {siblings.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-bold text-sm text-center">同じ{region}の検定にも挑戦</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {siblings.map((d) => (
              <Link
                key={d}
                href={`/quiz/${quizSlug(d)}`}
                className="btn-secondary text-sm min-h-[44px] inline-flex items-center"
              >
                {d}検定
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {tSlug && (
          <Link href={`/translate/${tSlug}`} className="btn-ghost">🗣️ {dialect}に変換してみる</Link>
        )}
        <Link href="/quiz" className="btn-ghost">🏅 検定の一覧（全{QUIZ_DIALECTS.length}方言）</Link>
        <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/shindan" className="btn-ghost">🎭 方言タイプ診断</Link>
        <Link href="/dict" className="btn-ghost">📖 方言辞典</Link>
      </div>
    </div>
  );
}
