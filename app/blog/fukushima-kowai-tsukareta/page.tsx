import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("fukushima-kowai-tsukareta")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/fukushima-kowai-tsukareta" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/fukushima-kowai-tsukareta", type: "article", image: { path: "/og/blog-fukushima-kowai-tsukareta.jpg", alt: "福島弁のこわいは疲れた" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// Wikipedia「福島弁」の方言区画（菅野宏の10区画案）。[地方, 区画の数, 区画名]
const KUKAKU: [string, number, string][] = [
  ["浜通り", 2, "相馬方言・磐城方言"],
  ["中通り", 4, "信達方言・安達安積方言・田村方言・県南方言"],
  ["会津", 4, "会津平方言・南会津東方言・南会津西方言・檜枝岐方言"],
];

// 辞典の福島弁107語のうち、Wikipedia「福島弁」の語彙の節で使用地域のタグがついていた12語（2026年11月23日・自社照合）
// [語, 辞典の意味, Wikipedia の使用地域]
const TAGGED: [string, string, string][] = [
  ["おばんです", "こんばんは", "県内全般"],
  ["かんぷら", "じゃがいも", "県内全般"],
  ["ばっち", "末っ子", "県内全般"],
  ["べこ", "牛", "県内全般"],
  ["ほろぐ", "落として失くす", "県内全般"],
  ["ねっぱす", "貼り付ける", "県内全般"],
  ["はぁ", "もう・すでに", "県内全般"],
  ["らいさま", "雷", "県内全般（浜通りでは「れえさま」）"],
  ["あんべわり", "具合が悪い", "県内全般は「病気」、県北は「塩梅が悪い」"],
  ["さすけね", "大丈夫・差し支えない", "県北・県中"],
  ["こらんしょ", "来てください", "県北"],
  ["うるがす", "水に浸す", "県北"],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
const TESTS: [string, string, string][] = [
  ["標準語→福島弁", "今日は本当に疲れた。", "今日は本当にこわい。"],
  ["標準語→福島弁", "とても疲れた。", "いぎなりこわい。"],
  ["標準語→福島弁", "ちょっと待ってください。", "ちょっと待ってくなんしょ。"],
  ["標準語→福島弁", "こんばんは。", "おばんです。"],
  ["標準語→福島弁", "どうしよう。", "なじょすっぺ。"],
  ["福島弁→標準語", "畑仕事して、あーこえー。", "畑仕事して、あー疲れた。"],
  ["福島弁→標準語", "そのぐらい汚れたって、さすけね。", "そのぐらい汚れたって、大丈夫。"],
  ["福島弁→標準語", "明日みんなで行くべした、早く寝っぺ。", "明日みんなで行くべした、早く寝っぺ。（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "福島弁の「こわい」は、怖いという意味ではないのですか？",
    a: "Wikipedia「福島弁」には、「こわい、おっかない」を体調が優れない、具合が悪い、疲れた様と説明し、恐怖心も「こわい」「おっかない」と言う、と書かれています。つまり、怖いの意味もあり、疲れたの意味もあります。方言ラボの辞典では「こわい」を「疲れた」と収録しています。",
  },
  {
    q: "福島弁の「〜べ」と「〜っぺ」は、どう違いますか？",
    a: "Wikipedia「福島弁」には、意志・推量・勧誘に「べ」を用い、浜通りと中通りでは「っぺ」となることが多い、と書かれています。使い分けの細かい条件は、この記事では確かめていません。",
  },
  {
    q: "会津弁と中通りの言葉は、同じですか？",
    a: "同じではありません。Wikipedia「福島弁」は、福島県の方言を浜通り・中通り・会津の3地方に分け、さらに10の区画に分けています。ただし、区画ごとに言葉が完全に分かれるわけではなく、語彙の分布は区画にぴたりとは当てはまらないことが多い、とも書かれています。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>福島弁の「こわい」には、「疲れた」「体調が悪い」の意味があります。そのため、標準語の「疲れた」を福島弁に変換すると、「こわい」という、怖いと読めてしまう出力になります。</strong>
        福島県は3つの地方・10の区画に分かれ、語尾の「〜べ」「〜っぺ」も地域で形が違います。
      </P>
      <P>
        この記事では、Wikipedia「福島弁」の区画と語尾の説明を整理し、方言ラボの福島弁辞典107語のうち、使用地域がわかる語を数えます。
        そのうえで、変換ツールが「疲れた→こわい」を返す理由と、語尾が直らない限界を実例で示します。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "福島県は3つの地方、10の区画に分かれる" },
        { id: "s2", label: "語尾の「べ」「っぺ」「さ」「い」" },
        { id: "s3", label: "辞典107語のうち、使用地域がわかる12語" },
        { id: "s4", label: "「こわい」は怖いだけでなく、疲れたの意味もある" },
        { id: "s5", label: "変換ツールに入れると、どう変わるか" },
        { id: "s6", label: "よくある質問" },
        { id: "s7", label: "まとめ" },
      ]} />

      <H2 id="s1">福島県は3つの地方、10の区画に分かれる</H2>
      <P>
        福島県は、阿武隈山地と奥羽山脈の2つの山脈で、浜通り・中通り・会津の3つに分かれます。
        Wikipedia「福島弁」は、方言の区画もこの山脈が基線になるとしたうえで、菅野宏の案として、福島県の方言を次の10区画に分けています。
      </P>

      <BarFig
        max={4}
        unit="区画"
        ariaLabel="Wikipedia福島弁が示す、福島県の方言の10区画。浜通り2区画、中通り4区画、会津4区画"
        caption="図：福島県の方言区画の数（Wikipedia「福島弁」・2026年11月23日取得）"
        items={KUKAKU.map(([g, n]) => ({ label: g, value: n }))}
      />

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2 block">
            福島県の方言の10区画（Wikipedia「福島弁」・菅野宏の区画案）
          </caption>
          <thead className="sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">地方</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">区画数</th>
              <th scope="col" className="py-2 font-bold">区画名</th>
            </tr>
          </thead>
          <tbody className="block">
            {KUKAKU.map(([g, n, names]) => (
              <tr key={g} className="border-b border-line align-top block py-2">
                <td data-l="地方" className="block pr-0 py-0.5 font-bold whitespace-normal">{g}</td>
                <td data-l="区画数" className="block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{n}</td>
                <td data-l="区画名" className="block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{names}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        同じ説明には、見方の違いも書かれています。
        東北的な北部と関東的な南部という傾向もあり、縦割りではなく、横割りに方言が分かれているとの見方もある、という内容です。
        つまり「会津・中通り・浜通り」の3分類は目安で、いつでもくっきり分かれるわけではありません。
      </P>
      <P>
        中通りは、かなりの地域差があると書かれています。
        行政上の「県北」「県中」「県南」とも一致しないとされています。
        ここでは「県北」「県中」などの呼び方が出てきたら、行政区画ではなく、方言の区画だと考えると読み違えが減ります。
      </P>

      <H2 id="s2">語尾の「べ」「っぺ」「さ」「い」</H2>
      <P>
        福島弁の語尾は、語より目立つ特徴です。
        Wikipedia「福島弁」の文法の節から、よく出る形を並べます。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>
          <strong>「べ」「っぺ」</strong>：意志・推量・勧誘に「べ（ー）」を使います（いわゆるベェベェ言葉）。浜通りと中通りでは「っぺ」になることが多く、磐城・県南・田村では「だべ」が「だっぺ」、「たべ」が「たっぺ」になる場合もある、と書かれています。
        </li>
        <li>
          <strong>「さ」</strong>：方向を表す「へ」「に」の代わりに「さ」を使います。「まっちゃ えく」（町へ行く）のように、前の語に合わせて形が変わることもある、と書かれています。
        </li>
        <li>
          <strong>文末の「い」</strong>：文化庁の「方言アフレコ体験教室」の福島方言編では、文末に「い」が付くことが多く、これは敬語で、相手を敬う気持ちで言う、と説明されています。
        </li>
        <li>
          <strong>「なんしょ」</strong>：Wikipedia「福島弁」に「〜してくなんしょ＝〜してください」が載っています。使われる地域の注記はそこにありません。方言ラボの辞典は、会津の依頼の言い方として収録しています。
        </li>
      </ul>
      <P>
        文化庁のページには、「相手を誘う・確認するときに『べー』を使う」という説明もあります（例：「そうでしょう」が「んだべー」）。
        ただし、このページには会津・中通り・浜通りの違いや、「っぺ」の説明はありません。
        地域差の話は、Wikipedia の記述に頼っている部分です。
      </P>

      <H2 id="s3">辞典107語のうち、使用地域がわかる12語</H2>
      <P>
        Wikipedia「福島弁」の語彙の節には、語ごとに使われる地域のタグがあります。
        凡例は、県（県内全般）、浜（浜通り）、北（県北）、中（県中）、南（県南）、会（会津）の6つです。
        2026年11月23日に本文を取得して数えると、語彙の節は148項目で、そのうち45項目にタグがありました。
      </P>
      <P>
        この項目と、方言ラボの福島弁辞典107語を突き合わせました。
        辞典の語のうち、タグつきの項目があったのは12語です。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2 block">
            辞典の福島弁で、使用地域のタグがあった12語（Wikipedia「福島弁」語彙の節・2026年11月23日取得）
          </caption>
          <thead className="sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">語</th>
              <th scope="col" className="py-2 pr-3 font-bold">辞典の意味</th>
              <th scope="col" className="py-2 font-bold">Wikipedia の使用地域</th>
            </tr>
          </thead>
          <tbody className="block">
            {TAGGED.map(([w, m, a]) => (
              <tr key={w} className="border-b border-line align-top block py-2">
                <td data-l="語" className="block pr-0 py-0.5 font-bold whitespace-normal">{w}</td>
                <td data-l="辞典の意味" className="block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{m}</td>
                <td data-l="Wikipedia の使用地域" className="block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        12語のうち、県内全般が8語、県北が2語、県北・県中が1語、県内全般と県北で意味が分かれるのが1語です。
        <strong>辞典の語のうち、会津や浜通りを使用地域とするタグがついた語は、浜通りの「れえさま」（雷）の別形を除いて、ありません。</strong>
        辞典は「〜なんしょ」を会津の依頼の言い方として収録していますが、Wikipedia の語彙の節には地域のタグがなく、この表では確かめられていません。
      </P>
      <P>
        この結果の読み方には注意が要ります。
        タグがないのは「使われていない」という意味ではなく、Wikipedia に地域の記載がないだけです。
        また、Wikipedia「福島弁」には、独自研究の可能性を示す注意書きがあります（2008年4月付）。
        地域の目安として読み、地元の人の使い方を優先してください。
      </P>

      <H2 id="s4">「こわい」は怖いだけでなく、疲れたの意味もある</H2>
      <P>
        福島弁で見落としやすいのが、「こわい」です。
        Wikipedia「福島弁」は、「こわい、おっかない」を、体調が優れない、具合が悪い、疲れた様と説明しています。
        そして、「恐怖心もこわい（怖い）、おっかないと言う」と添えています。
        辞典の例文は、「畑仕事して、あーこえー。」で、意味は「疲れた」です。
      </P>
      <P>
        別の方言でも、同じ形で意味がずれる語があります。
        <Link href="/blog/onaji-kotoba-imi-chigau" className={LINK}>同じ言葉で意味がちがう方言を並べた記事</Link>
        には、「ねまる」「はしかい」「すける」の例があります。
        「こわい」は、方言を読むときに、標準語の意味で読むと取り違える、代表的な語です。
      </P>
      <P>
        標準語から福島弁へ変換すると、この取り違えが起きます。
        「今日は本当に疲れた。」を入れると、「今日は本当にこわい。」が返ります。
        辞典の意味としては合っていますが、福島の言葉を知らない人が読むと、「怖い」と受け取ります。
        <strong>変換ツールの出力は、読む人が方言を知らないと、誤解されることがあります。</strong>
        辞典の意味を並べて確かめるのが、安全です。
      </P>

      <H2 id="s5">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/fukushima" className={LINK}>福島弁変換</Link>
        に入れて試しました（2026年11月23日・ツールと同じ関数で実行）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2 block">
            入れた文と、変換ツールの出力（2026年11月23日・方言ラボ自社実測）
          </caption>
          <thead className="sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">向き</th>
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 font-bold">出力</th>
            </tr>
          </thead>
          <tbody className="block">
            {TESTS.map(([d, i, o]) => (
              <tr key={d + i} className="border-b border-line align-top block py-2">
                <td data-l="向き" className="block pr-0 py-0.5 font-bold whitespace-normal">{d}</td>
                <td data-l="入れた文" className="block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{i}</td>
                <td data-l="出力" className="block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{o}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        語は置き換わります。
        「どうしよう」は「なじょすっぺ」に、「こんばんは」は「おばんです」に、「ください」は「くなんしょ」になります。
        一方、福島弁から標準語へ入れた「行くべした、寝っぺ」は、「べ」「っぺ」が語として載っていないため、入力と同じ文が返りました。
      </P>
      <P>
        辞典の福島弁の例文107文を標準語に入れると、何かが置き換わったのは81文で、26文は入力と同じ文でした。
        置き換わった文でも、文末の「べ」「っぺ」や、助詞の「さ」は残ります。
        語尾や活用が直らない理由は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にあります。
        東北の方言の見比べは、
        <Link href="/blog/tohoku-kansai-hakata" className={LINK}>東北弁・関西弁・博多弁の比較記事</Link>
        も参考になります。
      </P>

      <H2 id="s6">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-4">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <P>{f.a}</P>
        </div>
      ))}

      <H2 id="s7">まとめ：次にやること</H2>
      <P>
        福島弁は、浜通り・中通り・会津の3地方、10の区画に分けて説明されます。
        語尾の「べ」「っぺ」は地域で形が違い、「こわい」は「疲れた」の意味でも使います。
        変換ツールは、語を置き換えますが、語尾までは直さず、「疲れた→こわい」のように読み違えが起きる出力もあります。
      </P>
      <P>
        次にやることは、出力に気になる語があったら、言葉一覧で意味と例文を引くことです。
      </P>
      <P>
        <Link href="/translate/fukushima" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 福島弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/fukushima" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 福島弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「福島弁」の本文を2026年11月23日に取得し、区画、文法の節、語彙の節（148項目・タグつき45項目）を読みました。文化庁「方言アフレコ体験教室 福島方言編」の説明も読みました。
          </li>
          <li>
            確かめたこと：辞典107語とWikipedia語彙の節の突き合わせ、変換ツールの出力、辞典の例文107文の集計は、同日の自社実行・自社集計です。
          </li>
          <li>
            確かめられていないこと：Wikipedia「福島弁」には独自研究の注意書き（2008年4月付）があり、区画の元の文献は今回あらためて開いていません。また、「〜なんしょ」を使う地域、「〜べ」と「〜っぺ」の使い分けの条件、いま福島のどの年代が「こわい」を疲れたの意味で使うか。
          </li>
        </ul>
        そのため、これらを「福島の人は全員こう話す」という形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「福島弁」地域差・文法・語彙の節（区画は菅野宏の案）2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/福島弁",
          },
          {
            label: "文化庁「方言アフレコ体験教室」福島方言編（ワンポイントレッスン）",
            url: "https://www.bunka.go.jp/hogen/op_fukushima.html",
          },
          {
            label: "方言ラボ 福島弁変換ツールの実行結果（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/fukushima",
          },
        ]}
      />
    </ArticleShell>
  );
}
