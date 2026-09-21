import type { Metadata } from "next";
import Link from "next/link";
import TranslateTool from "@/components/TranslateTool";
import {
  MIN_PHRASES,
  MIN_WORDS,
  TRANSLATE_DIALECTS,
  translateByRegion,
  translateSlug,
} from "@/lib/translate_meta";
import { SHINDAN_QUESTIONS, wordsOf } from "@/lib/data";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

const BASE = "https://hogen.mainichi-lab.com";

// 全方言をここで選べる形は残したまま（既にインデックスされている可能性があるため）、
// 方言別ページ（/translate/[slug]）への索引を兼ねる。
// SC実測（28日）: 「方言翻訳」「方言 翻訳」でも表示が出ているが順位11〜24。
// 「変換」しか名乗っていなかったので「翻訳」も並記する。
const INDEX_TITLE = `方言変換・方言翻訳｜方言を標準語に変換・標準語を全${TRANSLATE_DIALECTS.length}方言に変換 | 方言ラボ`;

export const metadata: Metadata = {
  title: INDEX_TITLE,
  description: `入力した文を全${TRANSLATE_DIALECTS.length}方言に変換・翻訳します。⇄ で向きを変えれば方言を標準語に変換することもできます。大阪弁・博多弁・津軽弁など方言同士の変換も可能。方言ごとの変換ページでは収録語の一覧（意味・例文つき）も見られます。`,
  alternates: { canonical: `${BASE}/translate` },
  openGraph: {
    title: INDEX_TITLE,
    description: `入力した文を全${TRANSLATE_DIALECTS.length}方言に変換。⇄ で方言を標準語に変換することもできます。`,
    url: `${BASE}/translate`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function TranslatePage() {
  const groups = translateByRegion();

  // 🔴 一覧・ハブ面の本文に出す数値は、すべてここで実データから数える（手打ちしない）。
  // 以前この面には「35方言・3,362語」と手で書いた数字が残っていて、辞典が増えたあとも
  // 更新されず実際の 3,368 語とずれていた（2026-09-14 に発見）。
  const dialectCount = TRANSLATE_DIALECTS.length;
  const wordCounts = TRANSLATE_DIALECTS.map((d) => ({ dialect: d, n: wordsOf(d).length }));
  const totalWords = wordCounts.reduce((s, w) => s + w.n, 0);
  const sorted = [...wordCounts].sort((a, b) => b.n - a.n);
  const most = sorted[0];
  const fewest = sorted[sorted.length - 1];
  const phraseCount = SHINDAN_QUESTIONS.length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="section-title">🗣️ 方言変換</h1>
        <p className="text-sub text-sm">
          全{TRANSLATE_DIALECTS.length}方言に対応。<b>「⇄ 逆向き」で方言を標準語に変換</b>することもできます
        </p>
        <p className="text-sm text-sub leading-relaxed">
          方言ラボの辞典（{dialectCount}方言・{totalWords.toLocaleString()}語）に収録されている語を置き換えるしくみです。
          語尾や活用は変えず、置き換えられなかった部分はそのまま残します。
        </p>
      </div>

      <TranslateTool />

      <section className="space-y-3">
        <h2 className="font-bold text-2xl text-center">方言を選んで変換する（「○○弁 変換」の個別ページ）</h2>
        {groups.map((g) => (
          <div key={g.region} className="card p-4 space-y-2">
            <h3 className="text-xl font-bold text-sub">{g.region}</h3>
            <div className="flex flex-wrap gap-2">
              {g.dialects.map((d) => (
                <Link
                  key={d}
                  href={`/translate/${translateSlug(d)}`}
                  className="btn-secondary text-sm min-h-[48px] inline-flex items-center"
                >
                  {d} 変換
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <Link href="/quiz" className="btn-ghost">🏅 方言クイズ検定</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/dict" className="btn-ghost">📖 方言辞典</Link>
      </div>

      <ToolIntro
        heading="この一覧について（方言変換のしくみと、選び方）"
        paragraphs={[
          `この面は2つの役割を兼ねています。1つは、入力した文をその場で${dialectCount}方言のどれにでも変換できる変換ツールそのもの。もう1つは、方言ごとに用意してある個別ページ（「○○弁 変換」）への索引です。上のツールは全方言から選ぶ形なので、特定の方言だけを続けて使うなら、下の一覧から個別ページに入ったほうが選び直す手間がありません。`,
          `一覧はあいうえお順でも人気順でもなく、${groups.length}つの地方（北海道・東北／関東／甲信越・北陸／東海／近畿／中国／四国／九州・沖縄）に分けて、北から南の順に並べています。方言は隣り合う土地どうしで似ることが多いので、自分の出身地が分からないときでも、近い地方の見出しから探せば見当がつきます。`,
        ]}
        steps={[
          {
            t: "変換したい文を入れる",
            d: "単語だけでなく、ふつうの文のまま入れて構いません。辞典に載っている語だけが置き換わり、それ以外はそのまま残ります。",
          },
          {
            t: "変換先の方言を選ぶ",
            d: `最初は「標準語 → 大阪弁」になっています。プルダウンから${dialectCount}方言のどれにでも変えられます。`,
          },
          {
            t: "「⇄ 逆向き」で方言を標準語に戻す",
            d: "方言で書かれた文の意味が分からないときは、向きを入れ替えて標準語側に変換します。方言から方言への変換も、同じ要領で両側を方言にすれば行えます。",
          },
          {
            t: "どの語が置き換わったかを見る",
            d: "変換後は、実際に置き換わった語が結果と一緒に出ます。1語も置き換わらなかったときは、その文に辞典収録語が入っていなかったということです。",
          },
        ]}
        facts={[
          {
            h: "変換に使っている辞典の中身",
            body: [
              `変換の材料は、方言ラボの辞典に入っている${dialectCount}方言・合計${totalWords.toLocaleString()}語です。外部の翻訳APIは使っていません。処理は端末の中だけで完結するので、入力した文がどこかに送られることはありません。`,
              `収録語数は方言によって差があります。いちばん多いのは${most.dialect}の${most.n}語、いちばん少ないものでも${fewest.n}語あります。語数の差は、その方言の豊かさの差ではなく、標準語と形が違う語をどれだけ拾えているかの差です。語数が少ない方言では、置き換わらずに残る部分が多くなります。`,
              `一覧に関東が1つしか無いのは、関東に方言が無いからではありません。この辞典は「標準語と語の形が違うもの」を収録する方針で作ってあるため、現代の標準語と重なりの大きい地域ほど語として立てにくく、結果として収録できた関東の方言が茨城弁だけになっています。ここは辞典側の限界で、方言そのものの分布とは一致しません。`,
            ],
          },
          {
            h: "個別ページを作る方言を、どう決めているか",
            body: [
              `方言名ごとのページは、中身が薄いまま増やさないように3つの条件で足切りしています。①その方言の変換に使う注記が用意されていること ②「ありがとう」「疲れた」のような日常のひとこと${phraseCount}種類のうち、${MIN_PHRASES}種類以上の言い換えがそろっていること ③辞典の収録語が${MIN_WORDS}語以上あること。`,
              `現時点では、この3条件を${dialectCount}方言すべてが満たしているため、一覧に出ている方言と個別ページがある方言は一致しています。条件を満たさない方言が出てきた場合は、ページを作らずに一覧からも外します。`,
              "個別ページのほうには、その方言だけの収録語一覧（意味と例文つき）と、よく使う言い換えの対応表を置いています。変換して終わりにせず、なぜそう変わったのかを確かめたいときはそちらを見てください。",
            ],
          },
          {
            h: "この変換でできないこと",
            body: [
              "語の置き換えだけを行っているので、文法までは変えていません。語順や活用、助詞の使い方は標準語のまま残ります。実際の話し言葉では語尾やイントネーションのほうが特徴的なことも多く、変換結果がそのまま自然な方言の文になるわけではありません。",
              "また、収録しているのは方言ごとに代表的な形ひとつです。同じ県の中でも市町村や世代で言い方は割れるので、「地元ではこう言わない」が出ることは前提にしています。地域の全員がその言い方をしている、という主張ではありません。",
            ],
          },
        ]}
        faq={[
          {
            q: "文を入れたのに、何も変わりませんでした。",
            a: "辞典に載っている語がその文に無かった場合です。変換は語の置き換えなので、標準語と形が同じ語しか入っていない文は、そのまま出てきます。短い文より、日常会話に近い文のほうが置き換わりやすいです。",
          },
          {
            q: "方言から標準語に変換できますか？",
            a: "できます。「⇄ 逆向き」で向きを入れ替えると、方言側を入力にして標準語に戻せます。ただし辞典に載っている語だけが対象なので、聞き慣れない語がすべて訳せるわけではありません。",
          },
          {
            q: "大阪弁から博多弁のように、方言どうしの変換もできますか？",
            a: "できます。入力側と出力側の両方に方言を選んでください。内部では標準語の意味を経由して置き換えるため、両方の辞典に載っている語だけが変換されます。片方にしか無い語はそのまま残ります。",
          },
          {
            q: "入力した文は保存されますか？",
            a: "サーバーには送っていません。変換の処理はブラウザの中だけで行っていて、入力した文を保存する仕組みもありません。",
          },
          {
            q: "収録されていない言い方を追加できますか？",
            a: "辞典は少しずつ増やしています。ここに無い言い方は、みんなの方言辞書から書き込めます。",
          },
        ]}
        related={[
          { href: "/dict", label: "📖 方言辞典で語を調べる" },
          { href: "/kurabe", label: "🔤 同じひとことを全国でくらべる" },
          { href: "/quiz", label: "🏅 方言クイズ検定に挑戦" },
          { href: "/shindan", label: "🧭 方言診断" },
        ]}
      />
      <PageDates route="/translate" type="CollectionPage" name="方言変換（全国）| 方言ラボ" />
    </div>
  );
}
