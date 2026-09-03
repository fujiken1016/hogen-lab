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
  annotatedQuiz,
  dictEntry,
  exclusiveWords,
  inDokoPool,
  quizDialectOf,
  quizSampleWords,
  quizSlug,
  quizSourceOf,
  sharedWords,
  siblingDialects,
  siblingOverlap,
  verifiedCount,
} from "@/lib/quiz_meta";
import { REAL_DIALECTS, REGION_OF } from "@/lib/tools";
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
//
// 2026-09-03: このページのHTMLに「方言ごとに違う実データ」を載せた。
//   それまでの本文は地域名と語数を差し替えただけで、35ページのペア間文字列一致率は 76.8%
//   （固有部分 259字／実測）＝「軽微な改変のみのページの大量生成」に外形が一致していた。
//   /translate/[slug] で収録語をSSR公開したら 30.4% まで下がったので、同じ手を検定にも当てる。
//   載せたのは (1) 8問の設問・選択肢・答え・解説 (2) 出題語1語ずつの出典（照合メモ）
//   (3) 辞典の語釈と例文 (4) その方言だけに収録がある語 (5) 近隣方言との語の重なり。
//   すべて既存データで、方言ごとに中身が全く違う＝変数差し替えでは作れない。
//   ⚠️ noindex は選ばない。/quiz/ は検索の受け皿として生かす。

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
  const description = `「${samples.join("」「")}」…${dialect}（${area}）の言葉、意味がわかる？ 全8問の4択クイズで${dialect}検定に挑戦。8割正解で合格バッジ。出題した8語は意味・例文・出典つきで全部公開しています。${aliasSentence(
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

  // ── 方言ごとに中身が違う実データ（SSRで本文に出す） ──
  const questions = annotatedQuiz(dialect);
  // 語数の多い方言（沖縄方言は139語）で全部並べると、同じ辞典データを載せている
  // /translate/[slug] とページの中身がほぼ重なってしまう。1画面で読める量に切って、
  // 残りは変換ページの語一覧へ送る（実測：無制限だと /translate/okinawa と62%一致した）。
  const onlyHereAll = exclusiveWords(dialect);
  const onlyHere = onlyHereAll.slice(0, 55);
  const shared = sharedWords(dialect);
  const overlaps = siblingOverlap(dialect).filter((o) => o.count > 0);

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
          辞典には{dialect}を{wordCount}語収録。8問中{verified}問は出典と1語ずつ突き合わせた語です
          （
          <Link href="/doko" className="text-primary underline underline-offset-2">
            この方言どこの言葉？
          </Link>
          の出題プールと検定用の照合リストから出題）。<b>どの資料で確かめたかは下に1語ずつ書いています。</b>
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

      {/* ── 出題した8語の全文・答え・解説・出典 ──
          検定を遊ぶ前に答えが目に入らないよう <details> で閉じておく（ネタバレを明示して手動で開かせる）。
          閉じていてもHTMLには入っているので、検索エンジンからは本文として読める。 */}
      <details className="card p-5">
        <summary className="font-bold text-sm cursor-pointer min-h-[44px] flex items-center leading-relaxed">
          📋 出題した8語の答え・解説・出典を見る（ネタバレを含みます）
        </summary>
        <div className="pt-3 space-y-4">
          <p className="text-xs text-sub leading-relaxed">
            ここでの「答え」は<b>辞典の語釈</b>で、あなたの言葉が間違いという意味ではありません。
          </p>
          <ol className="space-y-4">
            {questions.map((q, i) => {
              const entry = dictEntry(dialect, q.word);
              const src = quizSourceOf(dialect, q.word);
              const doko = inDokoPool(dialect, q.word);
              return (
                <li key={`${q.q}-${i}`} className="border-t border-line pt-3 space-y-1.5">
                  <p className="text-sm font-bold break-words">
                    第{i + 1}問　{q.q}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {q.choices.map((c, ci) => (
                      <li
                        key={c}
                        className={`text-xs rounded-lg px-2 py-1 border ${
                          ci === q.answer
                            ? "border-primary text-primary font-bold"
                            : "border-line text-sub"
                        }`}
                      >
                        {c}
                        {ci === q.answer && "（正解）"}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs leading-relaxed">{q.explain}</p>
                  {entry && (
                    <p className="text-xs text-sub leading-relaxed break-words">
                      辞典の語釈：<b className="text-primary">{entry.word}</b> … {entry.meaning}
                      {entry.example && <>／例：{entry.example}</>}
                    </p>
                  )}
                  {src && (
                    <p className="text-[11px] text-sub leading-relaxed break-words">
                      出典・照合メモ：{src}
                    </p>
                  )}
                  {!src && doko && (
                    <p className="text-[11px] text-sub leading-relaxed">
                      出典・照合メモ：「この方言どこの言葉？」の出題プールに収録（出典照合済み）。
                    </p>
                  )}
                  {!src && !doko && (
                    <p className="text-[11px] text-sub leading-relaxed">
                      出典・照合メモ：辞典には収録していますが、この語はまだ出典の照合が済んでいません。
                    </p>
                  )}
                  {q.also.length > 0 && (
                    <p className="text-[11px] text-sub leading-relaxed break-words">
                      ※ 辞典は同じ語を{q.also.join("・")}にも収録しています（{dialect}だけの言葉ではありません）。
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </details>

      {/* 検定 → 読みものへの回遊。記事側だけが書籍PR枠を持つ（裁定10：ツール面には置かない）。 */}
      <ToolReads dialect={dialect} from="quiz" slug={slug} />

      {/* ── その方言だけに収録がある語 ──
          出題語は除いてあるのでネタバレにならない＝折りたたまずそのまま見せる。
          方言ごとに語数も中身も違うので、35ページが同じ形になるのを構造的に防ぐ。 */}
      {onlyHere.length > 0 && (
        <section className="card p-5 space-y-3">
          <h2 className="font-bold text-sm">
            🔤 {dialect}だけに収録がある語（{onlyHereAll.length}語）
          </h2>
          <p className="text-xs text-sub leading-relaxed">
            全{REAL_DIALECTS.length}方言の辞典で<b>{dialect}にしか立項が無い語</b>が、
            {wordCount}語中{onlyHereAll.length}語。出題語はネタバレを避けて外しています
            {onlyHereAll.length > onlyHere.length && <>（ここでは{onlyHere.length}語まで表示）</>}。
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {onlyHere.map((w) => (
              <li key={w.word} className="text-xs leading-relaxed break-words">
                <b className="text-primary">{w.word}</b>
                <span className="text-sub"> … {w.meaning}</span>
                {w.example && <span className="text-sub">／例：{w.example}</span>}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-sub leading-relaxed">
            ※ この辞典に限った話で、近隣で同じ語を使うことはあります（方言は県境で切れません）。
          </p>
          {tSlug && onlyHereAll.length > onlyHere.length && (
            <p className="text-xs">
              <Link href={`/translate/${tSlug}#words`} className="text-primary font-bold hover:underline">
                → 残りを含む{wordCount}語の一覧（意味と例文つき）を見る
              </Link>
            </p>
          )}
        </section>
      )}

      {/* ── 他の方言にも収録がある語 ── onlyHere の裏返し。意味は載せない（/translate の語一覧と同文にしないため） */}
      {shared.length > 0 && (
        <section className="card p-5 space-y-3">
          <h2 className="font-bold text-sm">
            🗾 {dialect}と他の方言に共通する語（{shared.length}語）
          </h2>
          <p className="text-xs text-sub leading-relaxed">
            {dialect}として収録しているが、辞典が他の方言にも同じ語を立てているもの。
            検定でも「{dialect}だけの言葉ではありません」と設問ごとに書き添えています。
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {shared.map((w) => (
              <li key={w.word} className="text-xs leading-relaxed break-words">
                <b className="text-primary">{w.word}</b>
                <span className="text-sub"> … {w.others.join("・")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 近隣方言との重なり ── 方言ごとに相手も語数も違う実データ */}
      {overlaps.length > 0 && (
        <section className="card p-5 space-y-2">
          <h2 className="font-bold text-sm">
            🧭 同じ{region}の方言と重なっている語
          </h2>
          <ul className="space-y-1.5">
            {overlaps.map((o) => (
              <li key={o.dialect} className="text-xs leading-relaxed break-words">
                <b>{o.dialect}</b>と共通して収録している語：<b className="text-primary">{o.count}語</b>
                {o.samples.length > 0 && <span className="text-sub">（{o.samples.join("・")}など）</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {type && (
        <section className="card p-5 space-y-2">
          <h2 className="font-bold text-sm">
            {type.emoji} {dialect}のキャラ「{type.name}」
          </h2>
          <p className="text-xs text-sub leading-relaxed">{type.tagline}</p>
          <p className="text-sm leading-relaxed">{type.desc}</p>
          <p className="text-xs text-sub leading-relaxed">恋愛・人間関係：{type.love}</p>
          <p className="text-xs text-sub leading-relaxed">あるある：{type.aruaru}</p>
          <p className="text-xs pt-1">
            <Link href="/shindan" className="text-primary font-bold hover:underline">
              → 方言タイプ診断で自分のタイプを調べる
            </Link>
          </p>
        </section>
      )}

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
