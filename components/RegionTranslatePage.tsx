import Link from "next/link";
import RegionTranslateTool from "@/components/RegionTranslateTool";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";
import { STANDARD, SHINDAN_PHRASES, SHINDAN_QUESTIONS, wordsOf } from "@/lib/data";
import {
  REGIONS_PAGE,
  regionNames,
  regionWordCount,
  type RegionConfig,
} from "@/lib/translate_region";

// 地方まとめの変換ページ本体（/translate/tohoku・/translate/kyushu 共通）。J671（2026-11-24 新設）。
// 中身はすべて辞典（lib/data.ts）と lib/translate_region.ts から作る。手打ちの数字・語は置かない。
// 個別ページの「言葉の一覧」は載せない（重複本文を作らない）＝個別ページへ送客する。

const BASE = "https://hogen.mainichi-lab.com";

const SAMPLES: Record<string, string[]> = {
  tohoku: ["今日はとても寒いね。こっちにおいで", "かわいい子どもがいるね", "ありがとう。今日は寒いね"],
  kyushu: ["今日はとても寒いね。こっちにおいで", "とてもおいしい。本当に？", "ありがとう。今日は寒いね"],
};

export default function RegionTranslatePage({ cfg }: { cfg: RegionConfig }) {
  const n = cfg.dialects.length;
  const words = regionWordCount(cfg);
  const names = regionNames(cfg);
  const path = `/translate/${cfg.slug}`;
  const other = REGIONS_PAGE[cfg.otherRegion.slug as "tohoku" | "kyushu"];

  const std = SHINDAN_PHRASES[STANDARD] ?? {};
  const phraseRows = cfg.phraseKeys
    .map((k) => SHINDAN_QUESTIONS.find((q) => q.key === k))
    .filter((q): q is { key: string; label: string } => !!q)
    .map((q) => ({
      key: q.key,
      standard: std[q.key] ?? q.key,
      items: cfg.dialects
        .map((x) => ({ name: x.name, text: SHINDAN_PHRASES[x.name]?.[q.key] }))
        .filter((i): i is { name: string; text: string } => !!i.text),
    }));
  const noPhrase = cfg.dialects.filter((x) => !SHINDAN_PHRASES[x.name]).map((x) => x.name);

  // FAQ の例文は、比較表と同じデータから作る（可視テキストと JSON-LD は ToolIntro が同じ配列から出す）
  const exKey = "何してるの？";
  const ex = cfg.dialects
    .map((x) => ({ short: x.short, name: x.name, t: SHINDAN_PHRASES[x.name]?.[exKey] }))
    .filter((i): i is { short: string; name: string; t: string } => !!i.t);
  const exText = ex.map((i) => `${i.name}は「${i.t}」`).join("、");

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "方言ラボ", item: BASE },
      { "@type": "ListItem", position: 2, name: "方言変換", item: `${BASE}/translate` },
      { "@type": "ListItem", position: 3, name: `${cfg.label} 変換`, item: `${BASE}${path}` },
    ],
  };

  const faq = [
    {
      q: `${cfg.label}は1つの方言ですか？`,
      a: `1つではありません。方言ラボの辞典では、${cfg.label}を${names}の${n}つに分けています。同じ意味でも言い方が違い、たとえば「${exKey}」は${exText}（辞典のデータのまま）と、方言ごとに変わります。`,
    },
    {
      q: `結果は正しい${cfg.label}ですか？`,
      a: `辞典に載っている語だけを置き換える仕組みで、AIが文を作り直すことはしません。語尾や活用は変えないので、実際の話し方とは違うことがあります。人に向けて使うときは、その土地の人に確かめてください。`,
    },
    {
      q: `${cfg.label}を標準語に変換できますか？`,
      a: `できます。ツールの「${cfg.label} → 標準語」を選び、どの方言の文かを選んで入力すると、辞典に載っている語が標準語に置き換わります。`,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="text-center space-y-2">
        <Link href="/translate" className="inline-flex min-h-[48px] items-center justify-center text-sm font-bold text-primary-text hover:underline">
          ← 方言変換の一覧
        </Link>
        <h1 className="section-title">🗣️ {cfg.label} 変換</h1>
        <p className="text-sub text-sm">標準語⇄{n}方言（{names}）を一度に変換</p>
      </div>

      <section className="card p-5 space-y-2">
        <p className="text-sm leading-relaxed">
          「{cfg.label}」という1つの方言があるわけではなく、辞典では<b>{names}の{n}方言</b>に分けています。
          下のツールは、入力した1つの文を{n}方言に<b>同時に</b>変換して並べます。
          方言を標準語に直す向きにも使えます。
        </p>
        <p className="text-sm text-sub leading-relaxed">
          辞典（{n}方言・{words.toLocaleString()}語）に載っている語だけを置き換え、語尾や活用は変えません。{cfg.excluded.reason}
          {cfg.excluded.name === "沖縄方言" && (
            <>
              {" "}
              <Link href={`/translate/${cfg.excluded.slug}`} className="text-primary-text underline underline-offset-2">
                沖縄方言の変換はこちら
              </Link>
              。
            </>
          )}
          {cfg.excluded.name === "北海道弁" && (
            <>
              {" "}
              <Link href={`/translate/${cfg.excluded.slug}`} className="text-primary-text underline underline-offset-2">
                北海道弁の変換はこちら
              </Link>
              。
            </>
          )}
        </p>
      </section>

      <RegionTranslateTool
        region={cfg.slug}
        label={cfg.label}
        dialects={cfg.dialects.map((x) => ({ name: x.name, short: x.short, slug: x.slug }))}
        samples={SAMPLES[cfg.slug]}
      />

      <section className="space-y-3">
        <h2 className="font-bold text-2xl text-center">方言ごとの変換ページ</h2>
        <p className="text-sm text-sub leading-relaxed text-center">
          言葉の一覧（意味・例文つき）は、方言ごとのページにまとめています。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {cfg.dialects.map((x) => (
            <div key={x.name} className="card p-4 space-y-1">
              <h3 className="text-xl font-bold">
                {x.name}
                <span className="text-sm text-sub font-normal">（{x.area}）</span>
              </h3>
              <p className="text-sm text-sub">辞典{wordsOf(x.name).length}語</p>
              <Link
                href={`/translate/${x.slug}`}
                className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm w-full"
              >
                {x.name}の変換ページへ
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">{n}方言で言い比べる</h2>
        <p className="text-sm text-sub leading-relaxed">
          よく使うひとことを、方言ごとに並べました（辞典のデータのまま・{phraseRows.length}例）。
        </p>
        <ul className="space-y-3">
          {phraseRows.map((r) => (
            <li key={r.key} className="bg-paper border border-line rounded-xl px-3 py-3 space-y-1.5">
              <h3 className="text-sm font-bold text-sub">標準語：{r.standard}</h3>
              <dl className="space-y-1">
                {r.items.map((i) => (
                  <div key={i.name} className="flex gap-2 text-sm">
                    <dt className="text-sub shrink-0 w-[4.5rem]">{i.name}</dt>
                    <dd className="font-bold text-primary-text break-words min-w-0">{i.text}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          ※ 方言ラボの辞書データに収録している言い方です。方言は地域・世代で差があり、ここに載っている形が唯一の言い方というわけではありません。
          {noPhrase.length > 0 && `${noPhrase.join("・")}は資料で確認できた語だけの変換ページで、この言い比べには入れていません。`}
        </p>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">方言ごとの代表語</h2>
        <p className="text-sm text-sub leading-relaxed">
          出典の照合で確認できた語から、方言ごとに3語だけ選びました（意味・用例は辞典のまま）。全語は各ページにあります。
        </p>
        <ul className="divide-y divide-line">
          {cfg.dialects.map((x) => {
            const all = wordsOf(x.name);
            const picked = x.picks.map((w) => all.find((e) => e.word === w)).filter((e): e is NonNullable<typeof e> => !!e);
            return (
              <li key={x.name} className="py-3 space-y-1">
                <h3 className="text-base font-bold">{x.name}</h3>
                {picked.map((w) => (
                  <p key={w.word} className="text-sm break-words leading-relaxed">
                    <b className="text-primary-text">{w.word}</b>
                    <span className="text-sub"> … {w.meaning}</span>
                    {w.example && <span className="text-sub">（例：{w.example}）</span>}
                  </p>
                ))}
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-sub leading-relaxed">
          ※ 方言は地域・世代で差があります。同じ語を近隣の方言でも使うことがあり、ここに載っている形がその方言だけの言い方とは限りません。
        </p>
      </section>

      <ToolIntro
        heading={`${cfg.label}の変換のしくみと、使うときの注意`}
        paragraphs={[
          `この面は、${names}の${n}方言をまとめて扱うための入口です。変換の材料は方言ラボの辞典（${words.toLocaleString()}語）で、外部の翻訳APIは使っていません。処理は端末の中だけで完結するので、入力した文がどこかに送られることはありません。`,
          `辞典に無い語は置き換わらず、そのまま残ります。置き換わった語は、方言ごとに意味つきで一緒に出ます。1つの方言のページで言葉の一覧まで見たいときは、上の「方言ごとの変換ページ」から入ってください。`,
        ]}
        faq={faq}
        related={[
          { href: cfg.articleHref, label: `📖 ${cfg.articleLabel}` },
          { href: `/translate/${other.slug}`, label: `🗣️ ${other.label}` },
          { href: "/translate", label: "🗣️ 全方言の変換" },
          { href: "/quiz", label: "🏅 方言クイズ検定" },
          { href: "/kurabe", label: "🔤 全国方言くらべ" },
        ]}
      />

      <PageDates route={path} type="WebApplication" name={`${cfg.label} 変換｜方言ラボ`} />
    </div>
  );
}
