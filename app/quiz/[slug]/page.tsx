import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageDates } from "@/components/PageDates";
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
  homographs,
  inDokoPool,
  quizDialectOf,
  quizSampleWords,
  quizSlug,
  quizSourceOf,
  sharedWords,
  siblingDialects,
  siblingOverlap,
  synonymsOf,
  verifiedCount,
} from "@/lib/quiz_meta";
import { REAL_DIALECTS, REGION_OF } from "@/lib/tools";
import { translateDialectOf, translateSlug } from "@/lib/translate_meta";
import { typeByDialect } from "@/lib/types";

const BASE = "https://hogen.mainichi-lab.com";

// ── 図（SVG）の作法は memory/design_guidelines.md §S-5 / §S-6 の実体値に従う ──
//   viewBox 幅 = 296（375px 端末の本文カラム 343px − カード左右 padding 40px = 303px に収まる幅）。
//   width も 296 で固定する＝縮尺 1.000。font-size 14 が画面上でも 14px で出る。
//   width:100% にすると 320px 端末で 0.8 倍に縮んで実効 11px になる（雀トレで実際に踏んだ型）。
//   はみ出しは親の <figure class="overflow-x-auto"> で受ける＝図だけ横に動き、本文は動かない。
const FIG_W = 296;

type Bar = { label: string; value: number; color: string };

/** 数量の大小をそのまま横帯にする。色だけで区別させず、各行にラベルと数値のテキストを置く（§D-5） */
function BarChart({
  id,
  title,
  desc,
  bars,
  unit = "語",
}: {
  id: string;
  title: string;
  desc: string;
  bars: Bar[];
  unit?: string;
}) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  const H = 8 + bars.length * 46;
  return (
    <svg
      viewBox={`0 0 ${FIG_W} ${H}`}
      width={FIG_W}
      height={H}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
      style={{ display: "block" }}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      {bars.map((b, i) => {
        const y = 8 + i * 46;
        const w = Math.max(4, Math.round((b.value / max) * 190));
        return (
          <g key={b.label}>
            <text x={0} y={y + 12} fontSize={14} fill="var(--ink)">
              {b.label}
            </text>
            <rect x={0} y={y + 20} width={w} height={16} rx={8} fill={b.color} />
            <text x={w + 8} y={y + 33} fontSize={14} fill="var(--sub)">
              {b.value}
              {unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

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
  // /translate/[slug] とページの中身が重なる。2026-09-03（2回目）の実測では
  // 同一方言の /quiz/X × /translate/X が平均41.7%・最大46.6%まで一致していて、
  // 重なっていた実体は「語 … 意味／例：例文」の一覧そのものだった。
  //   → 例文は変換ページの役割に寄せて検定側からは外す（変換ページは1文字も削らない）
  //   → 代わりに「他の方言では何と言うか（同義）」を1語ずつ添える。これは35方言の辞典を
  //     横断して初めて出る情報で、/translate/[slug] には無い＝検定固有の中身になる
  // 打ち切りは80語（重複が下がったぶん55→80に戻した）。残りは変換ページの語一覧へ送る。
  const onlyHereAll = exclusiveWords(dialect);
  const onlyHere = onlyHereAll.slice(0, 80);
  const shared = sharedWords(dialect);
  const homos = homographs(dialect);
  const overlaps = siblingOverlap(dialect).filter((o) => o.count > 0);

  // 2026-09-07: 1つの h2 の下が 2,089字あった（article_quality_playbook W7 の上限1,400字）。
  //   字数で機械的に割らず、意味で割る。「他の方言に別の言い方がある語」と
  //   「他の方言に対応する語が見つからない語」は、辞典を横断して初めて分かれる区別で、
  //   読者にとっても意味が違う（前者は言い換えられる／後者はその土地固有の言い回し）。
  const onlySyn = onlyHere.filter((w) => synonymsOf(dialect, w).length > 0);
  const onlyNoSyn = onlyHere.filter((w) => synonymsOf(dialect, w).length === 0);
  // 出題語は onlyHere / shared のどちらからも外してあるので、その差が「検定で出す語」
  const quizOnly = Math.max(0, wordCount - onlyHereAll.length - shared.length);

  // 目次。実際に描画する節だけを並べる（方言によって出ない節がある）
  const toc: { id: string; label: string }[] = [
    { id: "about", label: `${dialect}とは（${area}）` },
    { id: "answers", label: `出題した${questions.length}語の答え・解説・出典` },
    ...(onlySyn.length > 0 ? [{ id: "only-syn", label: `${dialect}だけの語（他の方言に言い換えがある）` }] : []),
    ...(onlyNoSyn.length > 0 ? [{ id: "only-nosyn", label: `${dialect}だけの語（言い換えが見つからない）` }] : []),
    ...(shared.length > 0 ? [{ id: "shared", label: "他の方言にも収録がある語" }] : []),
    ...(homos.length > 0 ? [{ id: "homograph", label: "同じ語形でも意味が違う語" }] : []),
    ...(overlaps.length > 0 ? [{ id: "overlap", label: `同じ${region}の方言との重なり` }] : []),
    ...(type ? [{ id: "chara", label: `${dialect}のキャラ` }] : []),
    { id: "matome", label: `${dialect}検定のまとめ` },
  ];

  // 構造化データ Education Q&A（schema.org Quiz）。
  //   2026-09-07 に Google の検索ギャラリーを実読して「Practice problems / Quiz」は消滅、
  //   「Education Q&A」が現存することを確認したうえで入れている（FAQPage・HowTo は入れない）。
  //   仕様上 eduQuestionType は "Flashcard" のみ。だから4択の設問ではなく、
  //   **折りたたまずにページに出ている語彙リスト**（語→語釈）をそのままフラッシュカードにする。
  //   <details> の中（答え）は使わない＝「利用者に見えている内容だけをマークアップする」を守る。
  const flashcards = [...onlySyn, ...onlyNoSyn].slice(0, 30);
  const quizLd =
    flashcards.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: `${dialect}検定（${area}）`,
          about: { "@type": "Thing", name: `${dialect}` },
          url: `${BASE}/quiz/${slug}`,
          hasPart: flashcards.map((w) => ({
            "@type": "Question",
            eduQuestionType: "Flashcard",
            text: `${dialect}の「${w.word}」はどういう意味？`,
            acceptedAnswer: { "@type": "Answer", text: w.meaning },
          })),
        }
      : null;

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
      {quizLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />
      )}

      <div className="text-center space-y-2">
        <Link href="/quiz" className="inline-flex min-h-[48px] items-center justify-center text-sm font-bold text-primary-text hover:underline">
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

      <div id="quiz">
        <QuizRunner dialect={dialect} />
      </div>

      {/* 目次。検定を遊んだあとに「どこに何が書いてあるか」を1画面で示す。
          タップ標的は48px以上（design_guidelines §5-2）。 */}
      <nav aria-label="目次" className="card p-5">
        <h2 className="font-bold text-2xl">🧭 このページの目次</h2>
        <ol className="pt-1 list-decimal pl-5 marker:text-sub marker:text-sm">
          {toc.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-[48px] items-center text-sm text-primary-text underline underline-offset-2"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="about" className="card p-5 space-y-2">
        <h2 className="font-bold text-2xl">📚 {dialect}とは（{area}）</h2>
        <p className="text-sm leading-relaxed">{DIALECT_NOTES[dialect]}</p>
        {aliasSentence(dialect, area) && (
          <p className="text-sm text-sub leading-relaxed">{aliasSentence(dialect, area)}</p>
        )}
        <p className="text-sm text-sub leading-relaxed">
          辞典には{dialect}を{wordCount}語収録。{questions.length}問中{verified}問は出典と1語ずつ突き合わせた語です
          （「この方言どこの言葉？」の出題プールと検定用の照合リストから出題）。どの資料で確かめたかは下に1語ずつ書いています。
        </p>

        <figure className="overflow-x-auto pt-1">
          <BarChart
            id="fig-breakdown"
            title={`${dialect}${wordCount}語の内訳`}
            desc={`${dialect}だけに立項がある語が${onlyHereAll.length}語、他の方言にも同じ語形があるものが${shared.length}語、検定の出題語が${quizOnly}語。`}
            bars={[
              { label: `${dialect}だけに立項がある語`, value: onlyHereAll.length, color: "var(--indigo)" },
              { label: "他の方言にも同じ語形がある語", value: shared.length, color: "var(--primary-deep)" },
              { label: "検定で出す語", value: quizOnly, color: "var(--ink)" },
            ]}
          />
          <figcaption className="text-sm text-sub leading-relaxed pt-2">
            図1：辞典が{dialect}として立てている{wordCount}語を、他の方言と重なるかどうかで3つに分けたもの。
            数はこの辞典の中での実測値です。
          </figcaption>
        </figure>
        <p>
          <Link href="/doko" className="inline-flex min-h-[48px] items-center text-sm text-primary-text underline underline-offset-2">
            → この方言どこの言葉？
          </Link>
        </p>
        <p className="text-sm text-sub leading-relaxed">
          出題語の例：{samples.join("・")}
        </p>
        {tSlug && (
          <p className="text-sm pt-1">
            <Link href={`/translate/${tSlug}#words`} className="inline-flex min-h-[48px] items-center text-primary-text font-bold hover:underline">
              → {dialect}の言葉一覧（{wordCount}語・意味と例文つき）を見る
            </Link>
          </p>
        )}
      </section>

      {/* ── 出題した8語の全文・答え・解説・出典 ──
          検定を遊ぶ前に答えが目に入らないよう <details> で閉じておく（ネタバレを明示して手動で開かせる）。
          閉じていてもHTMLには入っているので、検索エンジンからは本文として読める。 */}
      <section id="answers" className="card p-5 space-y-2">
        <h2 className="font-bold text-2xl">
          📋 {dialect}検定の答え・解説・出典（{questions.length}語）
        </h2>
        <p className="text-sm text-sub leading-relaxed">
          出題した{questions.length}語は、答えも解説も出典も隠していません。
          先に見ると検定の答えが分かってしまうので、開くかどうかは自分で決めてください。
        </p>
        <details>
        <summary className="font-bold text-sm cursor-pointer min-h-[48px] flex items-center leading-relaxed text-primary-text underline underline-offset-2">
          📋 {questions.length}語の答え・解説・出典を開く（ネタバレを含みます）
        </summary>
        <div className="pt-3 space-y-4">
          <p className="text-sm text-sub leading-relaxed">
            ここでの「答え」は辞典の語釈で、あなたの言葉が間違いという意味ではありません。
          </p>
          <ol className="space-y-4">
            {questions.map((q, i) => {
              const entry = dictEntry(dialect, q.word);
              const src = quizSourceOf(dialect, q.word);
              const doko = inDokoPool(dialect, q.word);
              // 「同じ意味を他の方言では何と言うか」。答えを見る人向けの追加情報なので
              // <details> の中（ここ）にだけ置く。変換ページには無い横断データ。
              const syn = synonymsOf(dialect, entry);
              return (
                <li key={`${q.q}-${i}`} className="border-t border-line pt-3 space-y-1.5">
                  <p className="text-sm font-bold break-words">
                    第{i + 1}問　{q.q}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {q.choices.map((c, ci) => (
                      <li
                        key={c}
                        className={`text-sm rounded-lg px-2 py-1 border ${
                          ci === q.answer
                            ? "border-primary text-primary-text font-bold"
                            : "border-line text-sub"
                        }`}
                      >
                        {c}
                        {ci === q.answer && "（正解）"}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-relaxed">{q.explain}</p>
                  {entry && (
                    <p className="text-sm text-sub leading-relaxed break-words">
                      辞典の語釈：<b className="text-primary-text">{entry.word}</b> … {entry.meaning}
                      {entry.example && <>／例：{entry.example}</>}
                    </p>
                  )}
                  {src && (
                    <p className="text-sm text-sub leading-relaxed break-words">
                      出典・照合メモ：{src}
                    </p>
                  )}
                  {!src && doko && (
                    <p className="text-sm text-sub leading-relaxed">
                      出典・照合メモ：「この方言どこの言葉？」の出題プールに収録（出典照合済み）。
                    </p>
                  )}
                  {!src && !doko && (
                    <p className="text-sm text-sub leading-relaxed">
                      出典・照合メモ：辞典には収録していますが、この語はまだ出典の照合が済んでいません。
                    </p>
                  )}
                  {syn.length > 0 && (
                    <p className="text-sm text-sub leading-relaxed break-words">
                      同じ意味の語を、辞典はこの方言にも収録：
                      {syn.map((s) => `${s.dialect}「${s.word}」`).join("・")}
                    </p>
                  )}
                  {q.also.length > 0 && (
                    <p className="text-sm text-sub leading-relaxed break-words">
                      ※ 辞典は同じ語を{q.also.join("・")}にも収録しています（{dialect}だけの言葉ではありません）。
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        </details>
      </section>

      {/* 検定 → 読みものへの回遊。記事側だけが書籍PR枠を持つ（裁定10：ツール面には置かない）。 */}
      <ToolReads dialect={dialect} from="quiz" slug={slug} />

      {/* ── その方言だけに収録がある語 ──
          出題語は除いてあるのでネタバレにならない＝折りたたまずそのまま見せる。
          方言ごとに語数も中身も違うので、35ページが同じ形になるのを構造的に防ぐ。 */}
      {/* ── その方言だけに収録がある語 ──
          出題語は除いてあるのでネタバレにならない＝折りたたまずそのまま見せる。
          2026-09-07: 1節が2,089字あって W7（1h2＝1,400字まで）を超えていたので、
          「他の方言に言い換えがあるか」で2節に割った。字数調整ではなく、読者にとって意味の違う2種類。 */}
      {onlyHere.length > 0 && (
        <figure className="overflow-x-auto card p-5">
          <BarChart
            id="fig-onlyhere"
            title={`${dialect}だけに立項がある語の内訳`}
            desc={`表示している${onlyHere.length}語のうち、他の方言に同じ意味の別の語があるものが${onlySyn.length}語、辞典の中に対応する語が見つからないものが${onlyNoSyn.length}語。`}
            bars={[
              { label: "他の方言に言い換えがある", value: onlySyn.length, color: "var(--indigo)" },
              { label: "辞典の中に言い換えが無い", value: onlyNoSyn.length, color: "var(--primary-deep)" },
            ]}
          />
          <figcaption className="text-sm text-sub leading-relaxed pt-2">
            図2：{dialect}だけに立項がある語のうち、ここに出している{onlyHere.length}語の内訳。
            右の{onlyNoSyn.length}語は、全{REAL_DIALECTS.length}方言の辞典を見ても同じ語釈の語が出てこなかったものです。
          </figcaption>
        </figure>
      )}

      {onlySyn.length > 0 && (
        <section id="only-syn" className="card p-5 space-y-3">
          <h2 className="font-bold text-2xl">
            🔤 {dialect}だけの語で、他の方言に言い換えがあるもの（{onlySyn.length}語）
          </h2>
          <p className="text-sm text-sub leading-relaxed">
            全{REAL_DIALECTS.length}方言の辞典で{dialect}にしか立項が無い語が、{wordCount}語中{onlyHereAll.length}語。
            出題語はネタバレを避けて外しています
            {onlyHereAll.length > onlyHere.length && <>（ここでは合わせて{onlyHere.length}語まで表示）</>}。
            この節はそのうち、同じ意味の語が他の方言にもあるもの。語形は{dialect}固有でも、言いたいことは他の土地にも通じます。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-sm border-collapse">
              <caption className="text-left text-sm text-sub leading-relaxed pb-2">
                {dialect}にしか立項が無い語と、同じ語釈を持つ他の方言の語（{onlySyn.length}語）
              </caption>
              <thead>
                <tr className="border-b border-line text-left align-bottom">
                  <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">{dialect}の語</th>
                  <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">辞典の語釈</th>
                  <th scope="col" className="py-2 font-bold whitespace-nowrap">他の方言での言い方</th>
                </tr>
              </thead>
              <tbody>
                {onlySyn.map((w) => (
                  <tr key={w.word} className="border-b border-line align-top">
                    <th scope="row" className="py-2 pr-3 text-left font-bold text-primary-text break-words">
                      {w.word}
                    </th>
                    <td className="py-2 pr-3 leading-relaxed break-words">{w.meaning}</td>
                    <td className="py-2 text-sub leading-relaxed break-words">
                      {synonymsOf(dialect, w)
                        .map((sy) => `${sy.dialect}「${sy.word}」`)
                        .join("／")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-sub leading-relaxed">
            ※「同義」は辞典の語釈が一致した語で、ニュアンスまで同じとは限りません。
          </p>
        </section>
      )}

      {onlyNoSyn.length > 0 && (
        <section id="only-nosyn" className="card p-5 space-y-3">
          <h2 className="font-bold text-2xl">
            🗝️ {dialect}だけの語で、言い換えが見つからないもの（{onlyNoSyn.length}語）
          </h2>
          <p className="text-sm text-sub leading-relaxed">
            同じ語釈の語が、全{REAL_DIALECTS.length}方言の辞典のどこにも出てこなかった語です。
            {dialect}検定でいちばん{area}らしさが出るのはこの並びだと思います。
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {onlyNoSyn.map((w) => (
              <li key={w.word} className="text-sm leading-relaxed break-words">
                <b className="text-primary-text">{w.word}</b>
                <span className="text-sub"> … {w.meaning}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-sub leading-relaxed">
            ※ この辞典に限った話で、近隣で同じ語を使うことはあります（方言は県境で切れません）。
          </p>
          {tSlug && (
            <p className="text-sm text-sub leading-relaxed">
              例文つきの語釈は変換ページ側にまとめています。
            </p>
          )}
          {tSlug && (
            <p className="pt-1">
              <Link href={`/translate/${tSlug}#words`} className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
                → {dialect}の言葉一覧を見る
              </Link>
            </p>
          )}
          {tSlug && onlyHereAll.length > onlyHere.length && (
            <p className="text-sm">
              <Link href={`/translate/${tSlug}#words`} className="inline-flex min-h-[48px] items-center text-primary-text font-bold hover:underline">
                → 残りを含む{wordCount}語の一覧（意味と例文つき）を見る
              </Link>
            </p>
          )}
        </section>
      )}

      {/* ── 他の方言にも収録がある語 ── onlyHere の裏返し。意味は載せない（/translate の語一覧と同文にしないため） */}
      {shared.length > 0 && (
        <section id="shared" className="card p-5 space-y-3">
          <h2 className="font-bold text-2xl">
            🗾 {dialect}と他の方言に共通する語（{shared.length}語）
          </h2>
          <p className="text-sm text-sub leading-relaxed">
            {dialect}として収録しているが、辞典が他の方言にも同じ語を立てているもの。
            検定でも「{dialect}だけの言葉ではありません」と設問ごとに書き添えています。
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {shared.map((w) => (
              <li key={w.word} className="text-sm leading-relaxed break-words">
                <b className="text-primary-text">{w.word}</b>
                <span className="text-sub"> … {w.others.join("・")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 同形異義 ──
          「同じ語形なのに、他の方言では別の意味」＝検定でいちばん間違えやすいところ。
          35方言の辞典を横断して初めて出る情報なので、変換ページ（1方言分の語釈）には無い。 */}
      {homos.length > 0 && (
        <section id="homograph" className="card p-5 space-y-3">
          <h2 className="font-bold text-2xl">
            ⚠️ 同じ語形でも、他の方言では意味が違う語（{homos.length}語）
          </h2>
          <p className="text-sm text-sub leading-relaxed">
            {dialect}検定の答えは辞典の{dialect}の語釈で判定しています。
            下の語は同じ語形が別の方言にも立項されていますが、そちらでは意味が違います。
            他の地方の出身者と話が食い違うのは、たいていこの型です。
          </p>
          <figure className="overflow-x-auto">
            <BarChart
              id="fig-homograph"
              title={`${dialect}と他の方言で語形が同じ語のうち、意味が食い違うものの数`}
              desc={`語形が同じ${shared.length}語のうち、語釈まで一致するものが${shared.length - homos.length}語、語釈が食い違うものが${homos.length}語。`}
              bars={[
                { label: "語形が同じで、語釈も一致", value: Math.max(0, shared.length - homos.length), color: "var(--indigo)" },
                { label: "語形は同じだが、語釈が違う", value: homos.length, color: "var(--primary-deep)" },
              ]}
            />
            <figcaption className="text-sm text-sub leading-relaxed pt-2">
              図4：他の方言と語形が重なる{shared.length}語の内訳。
              語形が同じでも語釈が食い違う語が{homos.length}語あり、その中身が下の表です。
            </figcaption>
          </figure>
          {/* 2つの語釈を左右に並べて見比べる中身なので表にする（§3-2「比べるものは表」）。
              375px では3列が入りきらないので、表だけを横スクロールさせる（本文は動かさない）。 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-sm border-collapse">
              <caption className="text-left text-sm text-sub leading-relaxed pb-2">
                {dialect}と他の方言で語釈が食い違う{homos.length}語（辞典に立項がある方言だけの比較）
              </caption>
              <thead>
                <tr className="border-b border-line text-left align-bottom">
                  <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">語</th>
                  <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">{dialect}での意味</th>
                  <th scope="col" className="py-2 font-bold whitespace-nowrap">他の方言での意味</th>
                </tr>
              </thead>
              <tbody>
                {homos.map((h) => (
                  <tr key={h.word} className="border-b border-line align-top">
                    <th scope="row" className="py-2 pr-3 text-left font-bold text-primary-text break-words">
                      {h.word}
                    </th>
                    <td className="py-2 pr-3 leading-relaxed break-words">{h.meaning}</td>
                    <td className="py-2 text-sub leading-relaxed break-words">
                      {h.others.map((o) => `${o.dialect}では「${o.meaning}」`).join("／")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-sub leading-relaxed">
            ※ 辞典に立項がある方言だけを比べた結果です。同じ語形が地方で別の意味になるのは
            方言では珍しくなく、どちらかが誤りという話ではありません。
          </p>
        </section>
      )}

      {/* ── 近隣方言との重なり ── 方言ごとに相手も語数も違う実データ */}
      {overlaps.length > 0 && (
        <section id="overlap" className="card p-5 space-y-2">
          <h2 className="font-bold text-2xl">
            🧭 同じ{region}の方言と重なっている語
          </h2>
          <figure className="overflow-x-auto">
            <BarChart
              id="fig-overlap"
              title={`${dialect}と同じ${region}の方言で共通して収録している語数`}
              desc={overlaps.map((o) => `${o.dialect}と${o.count}語`).join("、")}
              bars={overlaps.map((o, i) => ({
                label: o.dialect,
                value: o.count,
                color: i % 2 === 0 ? "var(--indigo)" : "var(--primary-deep)",
              }))}
            />
            <figcaption className="text-sm text-sub leading-relaxed pt-2">
              図3：同じ{region}の方言と、辞典が同じ語形を立てている語の数。
              数が多い相手ほど、{dialect}検定でも判断が割れやすい語が多くなります。
            </figcaption>
          </figure>
          <ul className="space-y-1.5">
            {overlaps.map((o) => (
              <li key={o.dialect} className="text-sm leading-relaxed break-words">
                {o.dialect}と共通して収録している語：<b className="text-primary-text">{o.count}語</b>
                {o.samples.length > 0 && <span className="text-sub">（{o.samples.join("・")}など）</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {type && (
        <section id="chara" className="card p-5 space-y-2">
          <h2 className="font-bold text-2xl">
            {type.emoji} {dialect}のキャラ「{type.name}」
          </h2>
          <p className="text-sm text-sub leading-relaxed">{type.tagline}</p>
          <p className="text-sm leading-relaxed">{type.desc}</p>
          <p className="text-sm text-sub leading-relaxed">恋愛・人間関係：{type.love}</p>
          <p className="text-sm text-sub leading-relaxed">あるある：{type.aruaru}</p>
          <p className="text-sm pt-1">
            <Link href="/shindan" className="inline-flex min-h-[48px] items-center text-primary-text font-bold hover:underline">
              → 方言タイプ診断で自分のタイプを調べる
            </Link>
          </p>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-bold text-2xl text-center">同じ{region}の検定にも挑戦</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {siblings.map((d) => (
              <Link
                key={d}
                href={`/quiz/${quizSlug(d)}`}
                className="btn-secondary text-sm min-h-[48px] inline-flex items-center"
              >
                {d}検定
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── まとめ ──
          ここまでに出した実数だけで締める。新しい主張を足さない。
          最後に「次の1アクション」を1つだけ置く（article_quality_playbook M2）。 */}
      <section id="matome" className="card p-5 space-y-2">
        <h2 className="font-bold text-2xl">📝 {dialect}検定のまとめ</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li className="text-sm leading-relaxed">
            {dialect}検定は全{questions.length}問の4択。{verified}問は出典と1語ずつ突き合わせた語で、
            {questions.length}問中6問（8割）で合格バッジが出ます。
          </li>
          <li className="text-sm leading-relaxed">
            辞典の{dialect}は{wordCount}語。うち{onlyHereAll.length}語は、全{REAL_DIALECTS.length}方言の中で
            {dialect}にしか立項がありません。
          </li>
          {homos.length > 0 && (
            <li className="text-sm leading-relaxed">
              いちばん間違えやすいのは、同じ語形で意味が違う{homos.length}語。
              出身地が違う人と話が食い違うのは、たいていこの型です。
            </li>
          )}
          <li className="text-sm leading-relaxed">
            出題した{questions.length}語は、答え・解説・出典まで全部このページに書いてあります。
            {dialect}を知らなくても、読んでから受け直せば解けます。
          </li>
        </ul>
        <p className="text-sm leading-relaxed pt-1">
          次の1アクション：まず{questions.length}問だけ試してみてください。1分で終わります。
        </p>
        <p>
          <a
            href="#quiz"
            className="btn-primary text-sm"
          >
            🏅 {dialect}検定をはじめる
          </a>
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {tSlug && (
          <Link href={`/translate/${tSlug}`} className="btn-ghost">🗣️ {dialect}に変換してみる</Link>
        )}
        <Link href="/quiz" className="btn-ghost">🏅 検定の一覧（全{QUIZ_DIALECTS.length}方言）</Link>
        <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/shindan" className="btn-ghost">🎭 方言タイプ診断</Link>
        <Link href="/dict" className="btn-ghost">📖 方言辞典</Link>
      </div>

      <PageDates route={`/quiz/${slug}`} type="WebApplication" name={`${dialect}検定｜方言ラボ`} />
    </div>
  );
}
