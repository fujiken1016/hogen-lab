import type { Metadata } from "next";
import Link from "next/link";
import { OG_IMAGES } from "@/lib/og";
import TranslateTool from "@/components/TranslateTool";
import { PageDates } from "@/components/PageDates";
import { STANDARD } from "@/lib/data";
import { convert } from "@/lib/translate_dict";
import {
  MIYAZAKI_DIALECT,
  MIYAZAKI_ENTRIES,
  MIYAZAKI_FEATURES,
  MIYAZAKI_SLUG,
  MIYAZAKI_SOURCES,
} from "@/lib/miyazaki";

// 宮崎弁 変換（J669・2026-11-24 新設）。
// 根拠＝GSC「宮崎弁 変換」88表示／順位4.9・「宮崎弁変換」8表示（seo_loop/gap_queries_2026-11-24.md §1-A）。専用ページが無かった。
// 辞典35方言の仕組み（DIALECTS／TYPES／QUIZZES）には入れず、一次資料で確認できた語だけの独立1面にしてある
// （理由は lib/miyazaki.ts の冒頭）。共通テンプレート・共通CSSは触らない。
// 判定日＝公開の14日後（2026-12-08 以降に GSC で「宮崎弁 変換」の表示・順位を見る）。

const BASE = "https://hogen.mainichi-lab.com";
const PATH = `/translate/${MIYAZAKI_SLUG}`;
const WORD_COUNT = MIYAZAKI_ENTRIES.length;

const TITLE = "宮崎弁変換・宮崎弁翻訳ツール｜標準語⇄宮崎弁を無料で双方向に変換（宮崎県）| 方言ラボ";
const DESCRIPTION = `宮崎弁 変換ツール。標準語を宮崎弁に、宮崎弁を標準語に変換。「てげ」「よだきい」など資料で確認できた${WORD_COUNT}語を意味と出典つきで一覧にしています。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE}${PATH}` },
  openGraph: {
    images: OG_IMAGES,
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE}${PATH}`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// 変換の実例（ビルド時に、このページのツールと同じ関数で実際に変換した結果を出す）
const SAMPLES = [
  "今日はとても面倒だけど、部屋を片付ける",
  "それで、本当にそんなに疲れたの？ いいえ、おじいさんは草履を履く",
  "あの人も行くだろう。でも私は行かない",
];

export default function MiyazakiTranslatePage() {
  const samples = SAMPLES.map((t) => ({ input: t, ...convert(t, STANDARD, MIYAZAKI_DIALECT) }));
  const byKey = Object.fromEntries(MIYAZAKI_SOURCES.map((s) => [s.key, s]));

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "方言ラボ", item: BASE },
      { "@type": "ListItem", position: 2, name: "方言変換", item: `${BASE}/translate` },
      { "@type": "ListItem", position: 3, name: "宮崎弁 変換", item: `${BASE}${PATH}` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="text-center space-y-2">
        <Link href="/translate" className="inline-flex min-h-[48px] items-center justify-center text-sm font-bold text-primary-text hover:underline">
          ← 方言変換の一覧
        </Link>
        <h1 className="section-title">🗣️ 宮崎弁変換</h1>
        <p className="text-sub text-sm leading-relaxed">
          <b>標準語 ⇄ 宮崎弁</b> の<b>両方向</b>に変換できます。標準語の文を入れれば宮崎県のことば「宮崎弁」に、
          「⇄ 逆向き」を押せば<b>宮崎弁を標準語に</b>変換します（宮崎弁の翻訳としても使えます）。
        </p>
        <p className="text-sm text-sub leading-relaxed">
          このページは、国立国語研究所の談話データや宮崎大学の研究者の論文など、
          <b>資料で意味が確認できた{WORD_COUNT}語</b>だけを置き換えるしくみです。確認できなかった言い方は入れていないので、
          語尾や活用はそのまま残り、置き換えられなかった部分は元の文のままです。
        </p>
        <a href="#words" className="btn-ghost min-h-[48px] inline-flex items-center justify-center text-sm font-bold">
          ↓ 宮崎弁の言葉一覧（{WORD_COUNT}語・意味と出典つき）
        </a>
      </div>

      <TranslateTool dialect={MIYAZAKI_DIALECT} slug={MIYAZAKI_SLUG} />

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">📝 変換するとこうなる（実例）</h2>
        <p className="text-sm text-sub leading-relaxed">
          上のツールと同じ処理で、標準語の文を宮崎弁に変換した結果です。置き換わった語は下に並べています。
        </p>
        <ul className="space-y-3">
          {samples.map((s) => (
            <li key={s.input} className="bg-paper border border-line rounded-xl px-3 py-3 space-y-1.5">
              <p className="text-sm text-sub break-words">標準語：{s.input}</p>
              <p className="text-sm break-words">
                宮崎弁：<b className="text-primary-text">{s.output}</b>
              </p>
              <p className="text-sm text-sub break-words">
                置き換わった語：
                {s.hits.length > 0 ? s.hits.map((h) => `${h.source}→${h.target}`).join("、") : "なし"}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          語尾（「〜けど」「〜の？」など）はそのままです。宮崎弁らしい語尾や助詞は、下の「宮崎弁の特徴」に資料で確認できた形をまとめています。
        </p>
      </section>

      <section id="words" className="card p-5 space-y-3 scroll-mt-4">
        <h2 className="font-bold text-2xl">📖 宮崎弁の言葉一覧（{WORD_COUNT}語）</h2>
        <p className="text-sm text-sub leading-relaxed">
          変換ツールが置き換えている語を、意味・確認した資料・根拠つきで全部載せています。
          出典の記号（A〜F）は、このページ下の「出典」に対応します。用例は資料に載っている文だけで、こちらで作った例文は入れていません。
        </p>
        <ul className="divide-y divide-line">
          {MIYAZAKI_ENTRIES.map((w) => (
            <li key={w.word} className="py-2.5 space-y-1">
              <p className="text-sm break-words">
                <b className="text-primary-text">{w.word}</b>
                <span className="text-sub"> … {w.meaning}</span>
                <span className="text-sub">（出典 {w.src.join("・")}）</span>
              </p>
              {w.example && <p className="text-sm text-sub break-words leading-relaxed">用例：{w.example}</p>}
              <p className="text-sm text-sub break-words leading-relaxed">根拠：{w.note}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          ※ 方言は地域・世代で差があります。同じ語を近隣の県で使うこともあり、ここに載っている形が宮崎だけの言い方とは限りません。
        </p>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">🔎 宮崎弁の特徴（標準語との違い）</h2>
        <p className="text-sm text-sub leading-relaxed">
          国立国語研究所が宮崎市青島で1981年に収録した談話の「方言の特色」の解説から、変換の前に知っておくと読みやすい形をまとめました。
          このツールは語の置き換えだけで、ここに挙げた文法の変化までは自動では変えません。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <thead>
              <tr className="text-left text-sub border-b border-line">
                <th scope="col" className="py-2 pr-3">項目</th>
                <th scope="col" className="py-2 pr-3">標準語</th>
                <th scope="col" className="py-2 pr-3">宮崎弁（宮崎市青島）</th>
              </tr>
            </thead>
            <tbody>
              {MIYAZAKI_FEATURES.map((f) => (
                <tr key={f.label} className="border-b border-line align-top">
                  <th scope="row" className="py-2 pr-3 font-bold text-left">{f.label}</th>
                  <td className="py-2 pr-3 break-words">{f.std}</td>
                  <td className="py-2 pr-3 break-words">
                    <b className="text-primary-text">{f.dia}</b>
                    {f.note && <span className="block text-sub mt-0.5">{f.note}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">📌 使う前に知っておきたいこと</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
          <li>
            宮崎県の方言は、かつての日向にあたる地域の「日向方言」と、鹿児島藩に属していた諸県地方（都城など）の「諸県方言」に大きく分かれます。
            このページの資料は主に宮崎市の日向方言で、都城など県南西部では言い方が違うことがあります。
          </li>
          <li>
            宮崎大学の研究者は、宮崎県でも標準語化が進み、多くの伝統方言が消えていると報告しています。たとえば「かわいい」の
            「むぞらしい」、「カエル」の「びきたろ」は、現在は共通語に置き換わったと書かれています。若い世代は使わない語も多いので、
            会話の中で使うときは、地元の人に確かめてください。
          </li>
          <li>
            「なおす（片付ける）」「はわく（掃く）」「からう（背負う）」のように、宮崎の人が標準語だと思って使っている語もあります
            （研究では「地方共通語」と呼ばれます）。宮崎日日新聞も、標準語だと思っていた宮崎弁として「なおす」「はわく」「からう」を紹介しています（記事は会員限定で、本文は見出しと冒頭のみ確認）。
          </li>
          <li>
            「てげ」は「とても」、「てげてげ」は「ほどほどに・適当に」と意味が違います。九州4紙のアンケートでは「てげてげ」が
            後世に残したい宮崎弁の1位でした。
          </li>
          <li>
            「よだきい」「のさん」は、やる気が起きない・きつい・おっくうだ、といった意味合いの語で、国立国語研究所の談話の注記は、
            宮崎では消極的な県民性が話題になるときによく引き合いに出される語だと書いています。
          </li>
        </ul>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">❓ よくある質問</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold">宮崎弁を標準語に翻訳できますか？</h3>
            <p className="text-sub">
              できます。ツール中央の「⇄ 逆向き」を押すと向きが「宮崎弁 → 標準語」に変わり、上の{WORD_COUNT}語を標準語に戻します。
              載っていない語はそのまま残ります。
            </p>
          </div>
          <div>
            <h3 className="font-bold">他の方言ページと違って語が少ないのはなぜですか？</h3>
            <p className="text-sub">
              方言ラボの他の方言ページは、辞典に収録した語を使っています。宮崎弁は、資料で意味まで確かめられた語だけに絞って作りました。
              資料で確認できた語が増えたら、出典と一緒に足していきます。
            </p>
          </div>
          <div>
            <h3 className="font-bold">「〜ちゃ」「〜げな」などの語尾も変換されますか？</h3>
            <p className="text-sub">
              語尾や助詞は自動では変えません。資料で確認できた形（「〜じゃ」「〜じゃろ」「〜けんどん」「〜かい」「〜さね」など）は、
              上の「宮崎弁の特徴」の表で見られます。
            </p>
          </div>
        </div>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">📚 出典（確認日 2026-11-24）</h2>
        <ul className="space-y-2 text-sm leading-relaxed">
          {MIYAZAKI_SOURCES.map((s) => (
            <li key={s.key} className="break-words">
              <b>{s.key}</b>　{s.label}
              <br />
              <a href={s.url} className="text-primary-text underline break-all inline-flex min-h-[48px] items-center" rel="noopener">
                {s.url}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          語の意味はA〜Eの資料に書かれているものを採用しました。{byKey["F"].label.replace(/（.*$/, "")}は、他の資料と一致した語の補助確認だけに使い、
          これだけを根拠にした語は入れていません。
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <Link href="/translate" className="btn-ghost">🗣️ 全方言の変換</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/dict" className="btn-ghost">📖 方言辞典</Link>
        <Link href="/quiz" className="btn-ghost">🏅 方言クイズ検定</Link>
      </div>

      <PageDates route={PATH} type="WebApplication" name="宮崎弁 変換｜方言ラボ" />
    </div>
  );
}
