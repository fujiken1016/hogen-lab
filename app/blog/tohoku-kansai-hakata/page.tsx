import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, H3, P, Note, PrBox, Sources, ShindanCta } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("tohoku-kansai-hakata")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/tohoku-kansai-hakata" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/tohoku-kansai-hakata", type: "article" }),
};

const COMPARE = [
  {
    std: "このラーメン、すごくおいしい",
    tohoku: "このラーメン、いぎなりうめぇっちゃ",
    kansai: "このラーメン、めっちゃうまいわ",
    hakata: "このラーメン、ばりうまか！",
  },
  {
    std: "そうだよね",
    tohoku: "んだんだ",
    kansai: "せやなぁ",
    hakata: "そうたい",
  },
  {
    std: "何をしているの？",
    tohoku: "なにしてらの？",
    kansai: "なにしてん？",
    hakata: "なんしよーと？",
  },
  {
    std: "疲れたから、もう帰る",
    tohoku: "こえがら、もう帰っぺ",
    kansai: "しんどいし、もう帰るわ",
    hakata: "きつかけん、もう帰るばい",
  },
  {
    std: "じゃあね、また明日",
    tohoku: "へばな、また明日",
    kansai: "ほな、また明日な",
    hakata: "ほんなら、また明日ね",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        方言を語るとき、まず断っておかなければならないことがあります。
        <strong>「東北弁」や「関西弁」という単一の方言は、厳密には存在しません。</strong>
        どちらも複数の方言をまとめた呼び名——いわば地方名です。
      </P>
      <P>
        津軽弁と仙台弁は、同じ東北でも語彙も語尾もかなり違います。京都弁と大阪弁も、
        現地の人からすれば別物です。それでも「東北弁らしさ」「関西弁らしさ」と呼べる共通の特徴はあります。
        この記事では、その共通項を音・文法・語彙の3層で整理していきます。
      </P>

      <Note title="先に結論です">
        「東北弁」「関西弁」という単一の方言は、厳密には存在しません。どちらも複数の方言をまとめた地方名です。それでも共通の特徴はあり、東北は助詞と語尾を削って短くまとめ、関西は語尾を伸ばして情感を足し、博多は語尾で情報の性質を指定します。どれも「くずれた標準語」ではなく、それぞれ固有の文法規則を持つ体系です。
      </Note>

      <Note title="この記事での呼び方">
        東北弁＝津軽弁・南部弁・秋田弁・山形弁・仙台弁・福島弁などの総称。
        関西弁＝大阪弁・京都弁・神戸弁・和歌山弁などの総称。
        博多弁は福岡市周辺の方言を指す、より狭い呼び名です（同じ福岡県でも北九州弁・筑後弁は別物です）。
      </Note>

      <H2>東北弁：音がこもり、助詞が短くなる</H2>
      <H3>音の特徴</H3>
      <P>
        東北のことばが「こもって聞こえる」と言われる最大の理由は、母音の発音位置にあります。
        イ段（い・し・ち）とウ段（う・す・つ）の音が近づくため、「寿司」と「獅子」のような語が似た響きになります。
        さらに、語の中ほどのカ行・タ行が濁る傾向があり、「柿（かき）」が「かぎ」に近く聞こえます。
        方言だから発音が乱れているのではなく、<strong>これはこれで規則的な音の体系</strong>です。
      </P>
      <P>
        東北弁の音のこもりを、母音の無声化・四つ仮名・中舌母音といった仕組みから整理した記事は、<Link href="/blog/hogen-oto-no-chigai" className="text-primary-text underline underline-offset-2">なまりの正体は「音」にある</Link>です。
      </P>
      <H3>文法の特徴</H3>
      <P>
        方向を表す助詞に「さ」を使うのが目印です。「東京さ行ぐ（東京へ行く）」のように、標準語の「へ」「に」を1音でまかないます。
        推量・意志には「〜べ」が付き、「行ぐべ」「やっぺ」となる。仙台では終助詞の「〜っちゃ」、
        津軽・秋田では別れ際の「へば」が特徴的です。
      </P>
      <H3>語彙の特徴</H3>
      <P>
        「めんこい（かわいい）」「いずい（しっくりこない）」「こわい（疲れた）」「なげる（捨てる）」など、
        標準語と形が同じで意味が違う語、あるいは標準語に訳しにくい語が豊富です。
        なお、宮城南部から福島・北関東にかけては、語の高低差がほとんどない無アクセント地域が広がっており、
        同じ東北でも青森・秋田とは音の印象が大きく異なります。
      </P>

      <H2>関西弁：アクセントが逆で、否定形が独特</H2>
      <H3>音の特徴</H3>
      <P>
        関西弁最大の特徴は<strong>京阪式アクセント</strong>です。東京式とは高低のパターンが異なり、
        「箸」と「橋」のような語の区別が東京とは逆になる場合があります。
        また、一音の名詞を伸ばす癖があり、「木」は「きぃ」、「目」は「めぇ」、「歯」は「はぁ」となります。
        関西の人が標準語を話しても関西出身だとわかるのは、語彙ではなくこのアクセントが残るためです。
      </P>
      <H3>文法の特徴</H3>
      <P>
        断定は「や」（〜だ→〜や）。否定は「〜へん」「〜ん」で、「行かない」は「行かへん／行かん」。
        過去の否定は「行かへんかった」となります。京都で発達した「〜はる」は敬語というより
        親しみを込めた距離の調整装置で、身内にも使われます。神戸では「〜している」が「〜しとう」、
        進行中は「〜しよう」と、状態と進行を文法で区別します。
      </P>
      <H3>語彙の特徴</H3>
      <P>
        「ほかす（捨てる）」「なおす（片付ける）」「いけず（意地悪）」「なんぼ（いくら）」など、
        古い京ことばの流れをくむ語が多く残ります。大阪はテンポと笑いの語彙、
        京都は含みを持たせる語彙が強い、という色分けもよく指摘されます。
      </P>

      <PrBox
        title="音・アクセント・文法を、体系立てて読みたい人へ"
        body="この記事で触れた音の違いやアクセントの型は、方言学の入門書だと図と用語で整理されています。三大方言の比較を「なぜそうなるか」まで追いたいときの一冊です。"
        books={[
          {
            name: "方言学入門",
            meta: "木部暢子ほか 編／三省堂",
            url: "https://item.rakuten.co.jp/book/12441926/",
          },
        ]}
        slot="RAKUTEN_HOGEN_3"
      />

      <H2>博多弁：語尾で情報の種類を伝える</H2>
      <H3>音の特徴</H3>
      <P>
        九州西部の方言に共通する<strong>カ語尾の形容詞</strong>が最大の目印です。
        「うまい→うまか」「よい→よか」「暑い→暑か」と、形容詞の語尾が「か」になります。
        福岡市周辺のアクセントは東京式に近く、そのぶん「音は関東寄りなのに語尾が九州」という
        独特のコントラストが生まれます。
      </P>
      <H3>文法の特徴</H3>
      <P>
        博多弁の面白さは、文末の語尾で<strong>話し手の構え方が変わる</strong>ところにあります。
        「〜ばい」は事実をそのまま差し出す言い方、「〜たい」は納得や念押しをともなう言い方、と説明されることが多い組み合わせです。
        「雨が降っとうばい（降ってるよ）」と「そうたい（そうなんだよ）」のような違いです。
        ただし使い分けの説明は話者や研究者によって揺れがあり、きれいに割り切れる規則があるわけではありません。
        「〜たい」は福岡県内でも使う地域が限られる、という指摘もあります。
        理由は「〜けん」、疑問は「〜と？」で表します。
      </P>
      <H3>語彙の特徴</H3>
      <P>
        強調の「ばり」「ちかっぱ」、否定の「いっちょん（全然）」、
        「とっとーと？（取ってあるの？）」に代表される「〜と」の多用が博多弁らしさをつくります。
        「すいとーよ（好きだよ）」が全国区になったのも、直球の告白を音がやわらげてくれるからでしょう。
      </P>

      <H2>同じ文を3方言で並べてみる</H2>
      <P>
        違いがいちばん実感できるのは、同じ内容を並べたときです。横スクロールで見比べてみてください。
      </P>
      <div className="my-5 -mx-4 px-4 overflow-x-auto">
        <table className="min-w-[560px] w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo/10 text-indigo">
              <th className="text-left font-bold px-3 py-2.5 rounded-l-lg">標準語</th>
              <th className="text-left font-bold px-3 py-2.5">東北（仙台ほか）</th>
              <th className="text-left font-bold px-3 py-2.5">関西（大阪）</th>
              <th className="text-left font-bold px-3 py-2.5 rounded-r-lg">博多</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.std} className="border-b border-line align-top">
                <td className="px-3 py-3 text-sub">{r.std}</td>
                <td className="px-3 py-3 font-bold">{r.tohoku}</td>
                <td className="px-3 py-3 font-bold">{r.kansai}</td>
                <td className="px-3 py-3 font-bold">{r.hakata}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        並べてみると、違いは単語の置き換えだけではないことがわかります。
        東北は助詞と語尾を削って短くまとめ、関西は語尾を伸ばして情感を足し、
        博多は語尾で伝え方の色を変える。<strong>それぞれ別の設計思想で動いている言語体系</strong>だと考えると、
        方言の見え方が変わってきます。
      </P>

      <P>
        東北の中の違いを見たい場合は、
        <Link href="/blog/fukushima-kowai-tsukareta" className="text-primary-text underline underline-offset-2">福島県の3地方・10区画を扱った記事</Link>
        があります。「こわい」が疲れた、の意味になる例も載せています。
      </P>

      <Note title="「方言＝くずれた標準語」ではない">
        3つを比べてわかるとおり、方言には固有の文法規則があります。
        規則があるからこそ、地元の人どうしなら細かいニュアンスまで通じ合える。
        なぜこれほど多様な体系が生まれたのかは、別記事「方言はなぜ生まれるのか」で解説しています。
      </Note>

      <P>
        3つの方言の文を、方言ラボの変換ツールで試すこともできます。
        <Link href="/translate/tsugaru" className="text-primary-text underline underline-offset-2">津軽弁 変換</Link>・
        <Link href="/translate/kansai" className="text-primary-text underline underline-offset-2">大阪弁 変換</Link>・
        <Link href="/translate/hakata" className="text-primary-text underline underline-offset-2">博多弁 変換</Link>に同じ標準語の文を入れると、
        辞典に載っている語が置き換わるところを見比べられます（語尾や活用までは変わりません）。
      </P>

      <ShindanCta
        title="あなたの言葉づかいは、どの体系に近い？"
        body="10問の診断で、全国のご当地キャラからあなたの相棒を判定します。育った土地とは違う方言が出ることも珍しくありません。"
      />

      <Sources
        items={[
          {
            label: "ことば研究館（国立国語研究所）「日本語には方言がいくつありますか」（方言の区画と、東北・近畿・九州などの大きなまとまりの考え方）",
            url: "https://kotoba.ninjal.ac.jp/qa/yokuaru/qa-139/",
          },
          {
            label: "ウィキペディア日本語版「日本語の方言のアクセント」（京阪式・東京式・無アクセントの分布の概観）",
            url: "https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E6%96%B9%E8%A8%80%E3%81%AE%E3%82%A2%E3%82%AF%E3%82%BB%E3%83%B3%E3%83%88",
          },
          { label: "各方言の語尾・語彙は各種方言辞典の記述による。「ばい」「たい」の使い分けは話者による揺れがあり、本記事では代表的な説明を紹介するにとどめた" },
        ]}
      />
    </ArticleShell>
  );
}
