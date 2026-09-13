import type { Metadata } from "next";
import Link from "next/link";
import { PageDates } from "@/components/PageDates";
import { wordsOf } from "@/lib/data";
import { AREA_OF, QUIZ_DIALECTS, exclusiveWords, homographs, quizSlug, sharedWords, verifiedCount } from "@/lib/quiz_meta";
import { REAL_DIALECTS } from "@/lib/tools";

const BASE = "https://hogen.mainichi-lab.com";

// ── なぜこのページがあるか（2026-09-14）──
// 方言検定は35方言ぶんのページがある。そこに「出題の決め方」「出典照合とは何か」
// 「判定の限界」「図の読み方」といった**どの方言でも同じ文章**を各ページに置いていた。
// 35面に同じ説明を配ると、ページ同士の文字列一致率が上がる（9/13 実測 44.7%）。
// 内容は必要なので消さず、**1ページに集約して各検定から1本リンクする**形に変えた。
// ＝各検定ページに残すのは「その方言の語・出典・対訳・数」だけ。
const TITLE = "方言検定の作り方と読み方｜出題・出典照合・判定の基準 | 方言ラボ";
const DESC =
  "方言ラボの方言検定は、どの語を、どの資料と突き合わせて出題しているのか。出典照合の進め方、8割合格の判定基準、「辞典の語釈」と「あなたの言葉」の関係、図と表の読み方をまとめました。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/quiz/about` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/quiz/about`, siteName: "方言ラボ", locale: "ja_JP", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FIG_W = 296;

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
  bars: { label: string; value: number; color: string }[];
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
        const w = Math.max(4, Math.round((b.value / max) * 180));
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

const TOC = [
  { id: "genre", label: "どの語から出題しているか" },
  { id: "source", label: "出典照合とは何をしているか" },
  { id: "hantei", label: "合否の判定基準（8問中6問）" },
  { id: "gokai", label: "「答え」は辞典の語釈であって、正解ではない" },
  { id: "doukei", label: "同じ語形・同じ意味をどう扱っているか" },
  { id: "zu", label: "図と表の読み方" },
  { id: "data", label: `全${QUIZ_DIALECTS.length}方言の収録語数と照合の進み具合` },
  { id: "yakuwari", label: "検定ページと変換ページの役割分担" },
  { id: "matome", label: "まとめ" },
];

export default function QuizAboutPage() {
  // ── 全方言を横断した実測集計。1方言ぶんのページには出しようがない数字なので、
  //    この集約ページ固有の中身になる（＝重複を移しただけで終わらせない）。 ──
  const rows = QUIZ_DIALECTS.map((d) => ({
    dialect: d,
    slug: quizSlug(d),
    area: AREA_OF[d] ?? "",
    words: wordsOf(d).length,
    only: exclusiveWords(d).length,
    shared: sharedWords(d).length,
    homo: homographs(d).length,
    verified: verifiedCount(d),
  })).sort((a, b) => b.words - a.words);

  const totalWords = rows.reduce((a, r) => a + r.words, 0);
  const totalOnly = rows.reduce((a, r) => a + r.only, 0);
  const totalQ = rows.length * 8;
  const totalVerified = rows.reduce((a, r) => a + r.verified, 0);
  const fullyVerified = rows.filter((r) => r.verified >= 8).length;
  const top = rows.slice(0, 6);
  // 「同じ語形なのに他の方言では意味が違う語」が多い方言＝検定で判断が割れやすい方言
  const topHomo = [...rows].sort((a, b) => b.homo - a.homo).slice(0, 6);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Link href="/quiz" className="inline-flex min-h-[48px] items-center justify-center text-sm font-bold text-primary-text hover:underline">
          ← 方言検定の一覧
        </Link>
        <h1 className="section-title">📐 方言検定の作り方と読み方</h1>
        <p className="text-sub text-sm leading-relaxed">
          方言ラボの検定は全{QUIZ_DIALECTS.length}方言ぶんあります。どの検定でも共通する
          「出題の決め方」「出典の照合」「判定の基準」「図の読み方」をこのページにまとめました。
          各検定ページには、その方言の語と出典だけが載っています。
        </p>
      </div>

      <nav aria-label="目次" className="card p-5">
        <h2 className="font-bold text-2xl">🧭 このページの目次</h2>
        <ol className="pt-1 list-decimal pl-5 marker:text-sub marker:text-sm">
          {TOC.map((s) => (
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

      <section id="genre" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">📚 どの語から出題しているか</h2>
        <p className="text-sm leading-relaxed">
          出題するのは<strong>方言ラボ辞典に立項している語</strong>だけです。思いついた言い回しを
          その場で足したり、他サイトの語彙リストをそのまま引き写したりはしていません。
        </p>
        <p className="text-sm leading-relaxed">
          並べる順番も決めてあります。<strong>出典を1語ずつ照合し終えた語を先に出し</strong>、
          足りないぶんを「辞典に立項はあるが照合が済んでいない語」から補います。
          だから同じ方言でも、照合が進むほど出題の中身は入れ替わります。
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li className="text-sm leading-relaxed">
            出題数は1方言あたり8問。4択で、選ぶのは語の意味です。
          </li>
          <li className="text-sm leading-relaxed">
            辞典が他の方言にも同じ語形を立てている場合は、設問ごとに
            「この方言だけの言葉ではありません」と書き添えます。
          </li>
          <li className="text-sm leading-relaxed">
            出題した8語は、答えも解説も出典も各検定ページに全文載せています。隠していません。
          </li>
        </ul>
      </section>

      <section id="source" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">🔍 出典照合とは何をしているか</h2>
        <p className="text-sm leading-relaxed">
          「出典照合済み」と書いてある語は、<strong>辞典の語釈を、外部の資料と1語ずつ突き合わせた</strong>
          という意味です。突き合わせに使っているのは、方言辞典サイト・自治体が公開している方言集・
          Wikipedia / Wiktionary（CC BY-SA）などで、どの資料で確かめたかは各検定ページの
          「答え・解説・出典」の中に語ごとに書いてあります。
        </p>
        <p className="text-sm leading-relaxed">
          照合が済んでいない語には、はっきり<strong>「この語はまだ出典の照合が済んでいません」</strong>と
          書きます。済んでいないものを済んだように見せない、というだけの話ですが、
          方言は資料が地域ごとにばらばらなので、ここを曖昧にすると全体が信用できなくなります。
        </p>
        <p className="text-sm leading-relaxed">
          「この方言どこの言葉？」の出題プールに入っている語も照合済みとして扱っています。
          こちらは先に出典を当たってからプールに入れているためです。
        </p>
        <p className="text-sm">
          <Link href="/doko" className="inline-flex min-h-[48px] items-center text-primary-text font-bold underline underline-offset-2">
            → この方言どこの言葉？
          </Link>
        </p>
      </section>

      <section id="hantei" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">🏅 合否の判定基準（8問中6問）</h2>
        <p className="text-sm leading-relaxed">
          <strong>8問中6問（80%）が辞典の語釈と一致すると合格バッジ</strong>が出ます。
          方言ごとに難易度は変わりますが、基準は全{QUIZ_DIALECTS.length}方言で同じ8割です。
          方言によって合格ラインを上げ下げすると、検定同士を比べられなくなるためです。
        </p>
        <p className="text-sm leading-relaxed">
          採点はブラウザの中だけで行っていて、結果はどこにも送っていません。
          登録もログインも要りません。1回にかかる時間はおよそ1分です。
        </p>
      </section>

      <section id="gokai" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">⚖️ 「答え」は辞典の語釈であって、正解ではない</h2>
        <p className="text-sm leading-relaxed">
          検定の「答え」は<strong>方言ラボ辞典がその方言に与えている語釈</strong>です。
          <strong>あなたの言葉が間違いという意味ではありません</strong>。
          方言には地域差と世代差があり、同じ県内でも市が違えば語釈がずれます。
          辞典はその中の1つの立場を採っているにすぎません。
        </p>
        <p className="text-sm leading-relaxed">
          「自分の家ではこう使う」と食い違ったときは、たいてい<strong>どちらも実在する用法</strong>です。
          誤りを見つけたときは「みんなの辞書」から指摘してください。指摘は辞典に反映します。
        </p>
        <p className="text-sm">
          <Link href="/dict" className="inline-flex min-h-[48px] items-center text-primary-text font-bold underline underline-offset-2">
            → 方言辞典を見る
          </Link>
        </p>
      </section>

      <section id="doukei" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">🔤 同じ語形・同じ意味をどう扱っているか</h2>
        <p className="text-sm leading-relaxed">
          各検定ページには「その方言だけに立項がある語」「他の方言にも収録がある語」
          「同じ語形でも意味が違う語」が並びます。判定の前提はこうです。
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li className="text-sm leading-relaxed">
            <strong>「◯◯だけの語」は、この辞典に限った話</strong>です。全{REAL_DIALECTS.length}方言を
            横断して他に立項が無かった、という意味であって、近隣で同じ語を使うことはあります。
            方言は県境で切れません。
          </li>
          <li className="text-sm leading-relaxed">
            <strong>「同義」は辞典の語釈が一致した語</strong>で、ニュアンスまで同じとは限りません。
            言い換えの候補として読んでください。
          </li>
          <li className="text-sm leading-relaxed">
            <strong>「同じ語形で意味が違う」は、辞典に立項がある方言だけを比べた結果</strong>です。
            同じ語形が地方で別の意味になるのは方言では珍しくなく、どちらかが誤りという話ではありません。
            出身地が違う人と話が食い違うのは、たいていこの型です。
          </li>
        </ul>
      </section>

      <section id="zu" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">📊 図と表の読み方</h2>
        <p className="text-sm leading-relaxed">
          各検定ページの横帯グラフは、すべて<strong>その方言の実測値</strong>です。
          推計や目安ではなく、辞典に入っている語をその場で数えた数字を出しています。
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li className="text-sm leading-relaxed">
            <strong>語数の内訳</strong>＝辞典がその方言として立てている語を、
            他の方言と重なるかどうかで3つに分けたものです。
          </li>
          <li className="text-sm leading-relaxed">
            <strong>語形が同じ語の内訳</strong>＝他の方言と語形が重なる語のうち、
            語釈まで一致するものと食い違うものの数です。
          </li>
          <li className="text-sm leading-relaxed">
            <strong>近隣方言との重なり</strong>＝同じ地方の方言と、辞典が同じ語形を立てている語の数です。
            数が多い相手ほど、検定でも判断が割れやすくなります。
          </li>
        </ul>
        <p className="text-sm leading-relaxed">
          表は375px幅の画面では横にスクロールします。本文は動かず、表だけが動きます。
        </p>
      </section>

      <section id="data" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">🗾 全{QUIZ_DIALECTS.length}方言の収録語数と照合の進み具合</h2>
        <p className="text-sm leading-relaxed">
          検定を用意している{QUIZ_DIALECTS.length}方言を横断して数えた実測値です。
          辞典に入っている語は合計{totalWords}語、そのうち{totalOnly}語は1つの方言にしか立項がありません。
          出題{totalQ}問のうち出典照合が済んでいるのは{totalVerified}問で、
          8問すべてが照合済みの方言は{fullyVerified}方言です。
        </p>

        <figure className="overflow-x-auto pt-1">
          <BarChart
            id="fig-top"
            title={`辞典の収録語数が多い${top.length}方言`}
            desc={top.map((r) => `${r.dialect}が${r.words}語`).join("、")}
            bars={top.map((r, i) => ({
              label: r.dialect,
              value: r.words,
              color: i % 2 === 0 ? "var(--indigo)" : "var(--primary-deep)",
            }))}
          />
          <figcaption className="text-sm text-sub leading-relaxed pt-2">
            図1：収録語数が多い順に{top.length}方言。語数の差は「その方言が豊かかどうか」ではなく、
            参照できた資料の量の差です。
          </figcaption>
        </figure>

        <figure className="overflow-x-auto pt-1">
          <BarChart
            id="fig-homo-all"
            title={`同じ語形で意味が違う語が多い${topHomo.length}方言`}
            desc={topHomo.map((r) => `${r.dialect}が${r.homo}語`).join("、")}
            bars={topHomo.map((r, i) => ({
              label: r.dialect,
              value: r.homo,
              color: i % 2 === 0 ? "var(--indigo)" : "var(--primary-deep)",
            }))}
          />
          <figcaption className="text-sm text-sub leading-relaxed pt-2">
            図2：他の方言と語形が同じなのに語釈が食い違う語が多い順に{topHomo.length}方言。
            ここが多い方言ほど、出身地が違う人との会話がすれ違います。
          </figcaption>
        </figure>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm border-collapse">
            <caption className="text-left text-sm text-sub leading-relaxed pb-2">
              方言ごとの収録語数・その方言にしか立項が無い語・他の方言と語形が重なる語・語形は同じで語釈が違う語（収録語数の多い順）
            </caption>
            <thead>
              <tr className="border-b border-line text-left align-bottom">
                <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">方言</th>
                <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">地域</th>
                <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">収録語</th>
                <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">固有語</th>
                <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">共通語形</th>
                <th scope="col" className="py-2 font-bold whitespace-nowrap">同形異義</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.dialect} className="border-b border-line align-top">
                  <th scope="row" className="py-2 pr-3 text-left font-bold text-primary-text whitespace-nowrap">
                    {r.slug ? (
                      <Link
                        href={`/quiz/${r.slug}`}
                        className="inline-flex min-h-[48px] items-center underline underline-offset-2"
                      >
                        {r.dialect}
                      </Link>
                    ) : (
                      r.dialect
                    )}
                  </th>
                  <td className="py-2 pr-3 text-sub leading-relaxed">{r.area}</td>
                  <td className="py-2 pr-3 leading-relaxed whitespace-nowrap">{r.words}語</td>
                  <td className="py-2 pr-3 text-sub leading-relaxed whitespace-nowrap">{r.only}語</td>
                  <td className="py-2 pr-3 text-sub leading-relaxed whitespace-nowrap">{r.shared}語</td>
                  <td className="py-2 text-sub leading-relaxed whitespace-nowrap">{r.homo}語</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-sub leading-relaxed">
          数はこのページを開いた時点で辞典を数え直したものです。手で書き写した値ではありません。
        </p>
      </section>

      <section id="yakuwari" className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">🗣️ 検定ページと変換ページの役割分担</h2>
        <p className="text-sm leading-relaxed">
          同じ方言に、検定（<code>/quiz/</code>）と変換（<code>/translate/</code>）の2ページがあります。
          中身が重ならないよう、載せるものを分けてあります。
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li className="text-sm leading-relaxed">
            <strong>変換ページ</strong>＝その方言の語を、意味と<strong>例文つき</strong>で一覧にする場所。
            語をひとつずつ引きたいときはこちら。
          </li>
          <li className="text-sm leading-relaxed">
            <strong>検定ページ</strong>＝出題した語の答え・解説・出典と、
            <strong>全{REAL_DIALECTS.length}方言を横断して初めて分かること</strong>（他の方言での言い方、
            同じ語形で意味が違う語、近隣方言との重なり）を置く場所。
          </li>
        </ul>
        <p className="text-sm">
          <Link href="/translate" className="inline-flex min-h-[48px] items-center text-primary-text font-bold underline underline-offset-2">
            → 方言変換の一覧を見る
          </Link>
        </p>
      </section>

      <section id="matome" className="card p-5 space-y-2">
        <h2 className="font-bold text-2xl">📝 まとめ</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li className="text-sm leading-relaxed">
            出題は辞典に立項している語だけ。出典を照合し終えた語から先に出しています。
          </li>
          <li className="text-sm leading-relaxed">
            合格は8問中6問（8割）。全{QUIZ_DIALECTS.length}方言で基準は同じです。
          </li>
          <li className="text-sm leading-relaxed">
            「答え」は辞典の語釈です。あなたの言葉が間違いという意味ではありません。
          </li>
        </ul>
        <p className="text-sm leading-relaxed pt-1">
          次の1アクション：気になる方言の検定を1つ開いてみてください。1分で終わります。
        </p>
        <p>
          <Link href="/quiz" className="btn-primary text-sm">
            🏅 方言検定の一覧へ
          </Link>
        </p>
      </section>

      <PageDates route="/quiz/about" type="WebPage" name="方言検定の作り方と読み方｜方言ラボ" />
    </div>
  );
}
