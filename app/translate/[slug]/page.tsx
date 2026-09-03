import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolReads from "@/components/ToolReads";
import TranslateTool from "@/components/TranslateTool";
import { DIALECT_NOTES, wordsOf } from "@/lib/data";
import { aliasParen, aliasSentence } from "@/lib/dialect_alias";
import { hasReverseDemand, reverseName } from "@/lib/translate_reverse";
import { quizSlug } from "@/lib/quiz_meta";
import { REGION_OF } from "@/lib/tools";
import {
  TRANSLATE_AREA_OF,
  TRANSLATE_DIALECTS,
  phrasePairs,
  translateDialectOf,
  translateSiblings,
  translateSlug,
} from "@/lib/translate_meta";
import { typeByDialect } from "@/lib/types";
import { PageDates } from "@/components/PageDates";

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
  const wordCount = wordsOf(dialect).length;
  // 別名（「伊勢弁」→「三重弁」など）をタイトルに入れる。実際に表示されているクエリに合わせるため。
  //
  // このページは最初から⇄で「方言→標準語」も動くのに、title/descriptionが順方向しか名乗っていなかった。
  // 2026-09-02のサジェスト実測で逆方向のクエリが実在した方言（lib/translate_reverse.ts）だけ、
  // 両方向をtitleに入れる。実在しなかった方言には付けない（推測で35方言に広げない）。
  const rev = hasReverseDemand(dialect);
  const revName = reverseName(dialect);
  const title = rev
    ? `${dialect}${aliasParen(dialect)} 変換｜${revName}を標準語に変換・標準語を${dialect}に変換（${area}）| 方言ラボ`
    : `${dialect}${aliasParen(dialect)} 変換｜標準語を${dialect}に変換する（${area}）| 方言ラボ`;
  const dirLine = rev
    ? `${revName}を標準語に変換できます。⇄ を押せば向きが変わり、標準語の文を${dialect}（${area}）に変換することもできます。`
    : `標準語の文を入力するだけで${dialect}（${area}）に変換します。⇄ を押せば${dialect}を標準語に戻す向きにも変えられます。`;
  const description = `${dirLine}${pairs
    .map((p) => `「${p.standard}」→「${p.dialect}」`)
    .join("")}など、よく使う言い換えと、辞典に収録した${dialect}${wordCount}語の一覧（意味・例文つき）も見られます。${aliasSentence(
    dialect,
    area,
  )}登録不要・スマホで数秒。`;
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
  const siblings = translateSiblings(dialect);
  const words = wordsOf(dialect);
  const wordCount = words.length;
  const alias = aliasSentence(dialect, area);
  const type = typeByDialect(dialect);
  const qSlug = quizSlug(dialect);
  const rev = hasReverseDemand(dialect);
  const revName = reverseName(dialect);

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
        <Link href="/translate" className="inline-flex min-h-[48px] items-center justify-center text-sm font-bold text-primary-text hover:underline">
          ← 方言変換（全{TRANSLATE_DIALECTS.length}方言）の一覧
        </Link>
        <h1 className="section-title">🗣️ {dialect} 変換</h1>
        <p className="text-sub text-sm leading-relaxed">
          <b>標準語 ⇄ {dialect}</b> の<b>両方向</b>に変換できます。
          標準語の文を入れれば{area}のことば「{dialect}」に、
          「⇄ 逆向き」を押せば<b>{dialect}を標準語に</b>変換します。
        </p>
        {alias && <p className="text-sm text-sub leading-relaxed">{alias}</p>}
        <p className="text-sm text-sub leading-relaxed">
          方言ラボの辞典に収録された{dialect}の語（{wordCount}語）を置き換えるしくみです。
          語尾や活用は変えないので、置き換えられなかった部分はそのまま残ります。
        </p>
        <a
          href="#words"
          className="btn-ghost min-h-[48px] inline-flex items-center justify-center text-sm font-bold"
        >
          ↓ {dialect}の言葉一覧（{wordCount}語・意味と例文つき）
        </a>
      </div>

      <TranslateTool dialect={dialect} slug={slug} quizSlug={qSlug ?? undefined} />

      {/* 逆方向（方言→標準語）のクエリが実測で実在した方言だけ、その言葉でページ内に説明を置く。
          機能は最初からあるのに「順方向のツール」としか書いていなかったので気づかれていなかった。
          新しいURLは作らない＝このページの中に書く。 */}
      {rev && (
        <section className="card p-5 space-y-2">
          <h2 className="font-bold text-2xl">🔁 {revName}を標準語に変換するには</h2>
          <p className="text-sm leading-relaxed">
            上のツールの中央にある「⇄ 逆向き」を押すと、向きが <b>{dialect} → 標準語</b> に変わります。
            聞き取れなかった{revName}の言い回しをそのまま貼り付ければ、
            辞典に収録している語を標準語に置き換えて返します。
          </p>
          <p className="text-sm text-sub leading-relaxed">
            置き換えた語は「どの語をどう変えたか」を意味・用例つきで一つずつ表示します。
            語尾や活用は変換しないので、置き換えられなかった部分は{dialect}のまま残ります。
            収録している{wordCount}語は、このページの言葉一覧で全部確認できます。
          </p>
          <a
            href="#words"
            className="btn-ghost min-h-[48px] inline-flex items-center justify-center text-sm font-bold"
          >
            ↓ 標準語に戻せる{dialect}の語（{wordCount}語）を見る
          </a>
        </section>
      )}

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">📝 {dialect}でよく使う言い換え（{pairs.length}）</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {pairs.map((p) => (
            <li key={p.key} className="bg-paper border border-line rounded-xl px-3 py-2 text-sm">
              <span className="text-sub">{p.standard}</span>
              <span className="text-sub mx-1.5">→</span>
              <b className="text-primary-text break-words">{p.dialect}</b>
            </li>
          ))}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          ※ 方言ラボの辞書データに収録している言い方です。方言は地域・世代で差があり、
          ここに載っている形が唯一の言い方というわけではありません。
        </p>
      </section>

      {/* 回遊導線。長い語一覧の「前」に置く（後ろだと最下部まで届かない）。
          SC実測で勝っているのは /translate/<地域> なので、同じ地域の別ツールへ送るのが最短。 */}
      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">
          🧭 {area}の{dialect}を、もう少し
        </h2>
        <div className="grid gap-2">
          {qSlug && (
            <Link
              href={`/quiz/${qSlug}`}
              className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
            >
              🏅 {dialect}検定に挑戦（全8問・約1分）
            </Link>
          )}
          {type && (
            <Link
              href={`/c/${type.slug}`}
              className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
            >
              {type.emoji} {dialect}のキャラを見る
            </Link>
          )}
          <Link
            href="/doko"
            className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
          >
            🗾 この方言、何弁？あてクイズ
          </Link>
        </div>
      </section>

      {/* 勝ち面（このページ）から読みもの記事への回遊。記事側には文脈の合う書籍PR枠があるので、
          ツール面に収益導線を置かずに（裁定10）収益へつながる唯一の道になる。 */}
      <ToolReads dialect={dialect} from="translate" slug={slug} />

      <section className="card p-5 space-y-2">
        <h2 className="font-bold text-2xl">
          📚 {dialect}とは（{area}）
        </h2>
        <p className="text-sm leading-relaxed">{DIALECT_NOTES[dialect]}</p>
        {alias && <p className="text-sm text-sub leading-relaxed">{alias}</p>}
      </section>

      {/* 「○○弁 一覧」「<言葉> 方言」「○○弁 例文」で検索している人の受け皿。
          新しいURLは増やさず、既に勝っているこのページを厚くする（薄いページを量産しない）。 */}
      <section id="words" className="card p-5 space-y-3 scroll-mt-4">
        <h2 className="font-bold text-2xl">
          📖 {dialect}の言葉一覧（{wordCount}語）
        </h2>
        <p className="text-sm text-sub leading-relaxed">
          方言ラボの辞典に収録している{dialect}の語を、意味と例文つきで全部載せています。
          変換ツールはここに載っている語を置き換えています。
        </p>
        <ul className="divide-y divide-line">
          {words.map((w) => (
            <li key={w.word} className="py-2.5">
              <p className="text-sm break-words">
                <b className="text-primary-text">{w.word}</b>
                <span className="text-sub"> … {w.meaning}</span>
              </p>
              {w.example && (
                <p className="text-sm text-sub mt-1 break-words leading-relaxed">例：{w.example}</p>
              )}
            </li>
          ))}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          ※ 方言は地域・世代で差があります。同じ語を近隣の方言でも使うことがあり、
          ここに載っている形が{dialect}だけの言い方とは限りません。
        </p>
      </section>

      {siblings.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-bold text-2xl text-center">同じ{region}の変換ツール</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {siblings.map((d) => (
              <Link
                key={d}
                href={`/translate/${translateSlug(d)}`}
                className="btn-secondary text-sm min-h-[48px] inline-flex items-center"
              >
                {d} 変換
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-2 text-sm">
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

      <PageDates route={`/translate/${slug}`} type="WebApplication" name={`${dialect} 変換｜方言ラボ`} />
    </div>
  );
}
