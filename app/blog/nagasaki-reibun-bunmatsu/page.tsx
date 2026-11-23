import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("nagasaki-reibun-bunmatsu")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/nagasaki-reibun-bunmatsu" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/nagasaki-reibun-bunmatsu", type: "article", image: { path: "/og/blog-nagasaki-reibun-bunmatsu.jpg", alt: "長崎弁の例文103文を数えた" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 方言ラボの辞典（長崎弁103語・各語に例文1文＝103文）を、文の形で数えた（2026年11月23日・自社実測）
// [形, 文数, 例文]
const FORMS: [string, number, string][] = [
  ["対格の「ば」（〜ばしてくれんね）", 18, "引っ越しのかせばしてくれんね。"],
  ["「ばい」「たい」（文末15・文中2）", 17, "急に声かけられてたまがったばい。"],
  ["「〜とる」（完了・状態）", 14, "怒られて弟のはぶてとる。"],
  ["理由の「けん」", 13, "朝から何も食べとらんけん、ひだるかー。"],
  ["文末の「とよ」", 11, "明日は休みとよ。"],
  ["疑問の「と？」", 5, "あーた、どこに行くと？"],
  ["進行の「〜よる」", 3, "こどんたちの公園で遊びよるよ。"],
  ["〜しなければの「〜んば」", 2, "明日までに宿題ばせんば。"],
  ["逆接の「ばってん」", 1, "行きたかばってん、用事のあっと。"],
  ["伝聞の「げな」", 1, "あん人、来月結婚するげなよ。"],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
// [向き, 入れた文, 出力, 置き換え]
const TESTS: [string, string, string, string][] = [
  ["標準語→長崎弁", "今日は本当に暑いね。", "今日はほんなこて暑いね。", "あり"],
  ["標準語→長崎弁", "そんなに慌てなくていいよ。", "そがん慌てなくてよかよか。", "あり（語尾の「なくて」は残る）"],
  ["標準語→長崎弁", "行きたいけど、用事がある。", "行きたいけど、用事がある。", "なし"],
  ["標準語→長崎弁", "明日までに宿題をしなければ。", "明日までに宿題をしなければ。", "なし"],
  ["標準語→長崎弁", "ご飯を食べているところだよ。", "ご飯を食べているところだよ。", "なし"],
  ["長崎弁→標準語", "どがんすればよかと？", "どのようにすればよかと？", "あり（「よかと？」は残る）"],
  ["長崎弁→標準語", "行きたかばってん、用事のあっと。", "行きたかだけど、用事のあっと。", "あり（文としては崩れる）"],
  ["長崎弁→標準語", "ランドセルばからって学校に行く。", "ランドセルばからって学校に行く。", "なし"],
  ["長崎弁→標準語", "明日は休みとよ。", "明日は休みとよ。", "なし"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "長崎弁で「〜だよ」「〜なんだよ」は何と言いますか？",
    a: "辞典の例文には「〜ばい」「〜たい」「〜とよ」の形が多く出ます。2026年11月23日の集計では、103文のうち「ばい」「たい」が出る文が17（文末で終わる文は15）、「とよ」で終わる文が11でした。Wikipedia「長崎弁」は、断定の「じゃ・や」を文の終わりにそのまま使うことは普通なく、代わりに「ばい」「たい」を用いると説明しています。",
  },
  {
    q: "「〜ばい」と「〜たい」はどう違いますか？",
    a: "Wikipedia「長崎弁」には、「ばい」は自分の判断を確認したり穏やかに教えたりするときに、「たい」は自明・客観的な事柄を言うときに使う、という説明があります。辞典の例文では「ばい」で終わる文が9、「たい」で終わる文が6あり、どちらも文の終わりに付いています。使い分けの細かい条件までは、この記事では確かめていません。",
  },
  {
    q: "長崎弁の変換ツールで、文末は変わりますか？",
    a: "変わりません。方言ラボの変換ツールは、辞典に載っている語だけを置き換えます。「明日は休みとよ。」や「ランドセルばからって学校に行く。」を長崎弁から標準語に入れても、入力と同じ文が返りました（2026年11月23日）。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>方言ラボの長崎弁辞典の例文103文を数えると、いちばん多かったのは対格の「ば」（18文）で、次が「ばい」「たい」の出る文（17文・うち文末15文）、「〜とる」（14文）、理由の「けん」（13文）でした。</strong>
        長崎弁の例文は、辞典の語を入れ替えるだけでは作れません。語のまわりの小さな形が文の印象を決めているからです。
      </P>
      <P>
        数字は、辞典に載せている103語それぞれの例文1文を、文の形ごとに数えたものです（2026年11月23日・自社集計）。
        この記事では、数えた結果と、Wikipedia「長崎弁」にある文法の説明を照らし合わせ、そのうえで変換ツールが語尾までは直せない様子を実例で示します。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "103例文の中身を、形ごとに数えた" },
        { id: "s2", label: "断定の代わりに「ばい」「たい」" },
        { id: "s3", label: "「ば」「けん」「ばってん」：つなぎの小さな形" },
        { id: "s4", label: "「とよ」「と？」：文の終わりに付く「と」" },
        { id: "s5", label: "「〜とる」と「〜よる」の言い分け" },
        { id: "s6", label: "変換ツールに入れると、どこまで変わるか" },
        { id: "s7", label: "長崎弁の例文を作るときの手順" },
        { id: "s8", label: "よくある質問" },
        { id: "s9", label: "まとめ" },
      ]} />

      <H2 id="s1">103例文の中身を、形ごとに数えた</H2>
      <P>
        方言ラボの辞典には、長崎弁が103語載っています。
        どの語にも例文が1文あるので、全部で103文です。
        この103文を、長崎弁の文法の特徴として知られる形ごとに数えました。
        1つの文に複数の形が入るので、合計は103になりません。
      </P>

      <BarFig
        max={20}
        unit="文"
        ariaLabel="辞典の長崎弁の例文103文に出てくる形の数。対格のば18、ばいたい17（文末15・文中2）、〜とる14、理由のけん13、文末のとよ11、疑問のと5、進行の〜よる3、〜んば2、ばってん1、げな1"
        caption="図：長崎弁の例文103文に出てくる形の数（2026年11月23日・自社集計）"
        items={FORMS.map(([f, n]) => ({ label: f, value: n, dim: n < 5 }))}
      />

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2 block">
            形ごとの文数と、辞典にある例文（2026年11月23日・自社集計）
          </caption>
          <thead className="sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">形</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">文数</th>
              <th scope="col" className="py-2 font-bold">辞典の例文</th>
            </tr>
          </thead>
          <tbody className="block">
            {FORMS.map(([f, n, e]) => (
              <tr key={f} className="border-b border-line align-top block py-2">
                <td data-l="形" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 font-bold whitespace-normal">{f}</td>
                <td data-l="文数" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{n}文</td>
                <td data-l="辞典の例文" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        <strong>注意してほしいのは、これが「辞典の書き方」の集計だということです。</strong>
        辞典の例文は、長崎の人が実際に話した記録ではなく、語の使い方を示すために辞典に載せた文です。
        そのため、長崎の人が日常でどの形をどれだけ使うかは、この数字からは言えません。
        分かるのは、辞典の例文が長崎弁をどういう形で書いているか、という点までです。
      </P>

      <H2 id="s2">断定の代わりに「ばい」「たい」</H2>
      <P>
        標準語の「〜だ」「〜だよ」にあたる文末は、長崎弁では「ばい」「たい」が目立ちます。
        Wikipedia「長崎弁」には、断定の助動詞に「じゃ・や」があるものの、普通は文の終わりにそのまま使うことはなく、代わりに「ばい」「たい」を用いる、という説明があります（出典は坂口至の長崎県の方言の解説）。
      </P>
      <P>
        辞典の例文でも、これと同じ向きです。
        「ばい」で終わる文が9、「たい」で終わる文が6あり、「よかたい」のように文の途中に出る例を足すと、全部で17文でした。
        「じゃ」や「や」で言い切る文は、103文の中に1つもありません。
      </P>
      <P>
        ここで、辞典の例文を2つ並べます。
        「急に声かけられてたまがったばい。」は、驚いた出来事を相手に伝える文です。
        「冬はがんば料理の一番たい。」は、自分が当然だと思っていることを言う文です。
        Wikipedia「長崎弁」には、「ばい」は自分の判断を確認したり穏やかに教えたりするときに、「たい」は自明・客観的な事柄を言うときに使う、という説明があります（出典は坂口至の解説）。上の2文は、この説明と合う例です。ただし、2文だけで決めつけず、辞典の例文全体での傾向は確かめていません。
      </P>

      <H2 id="s3">「ば」「けん」「ばってん」：つなぎの小さな形</H2>
      <P>
        いちばん多かったのは、対格の「ば」です。
        標準語の「を」にあたる助詞で、18文に出てきました。
        「引っ越しのかせばしてくれんね。」の「かせば」は、「かせ（手伝い）を」の意味です。
        Wikipedia「長崎弁」も、対格（を）には「ば」を用いると説明しています。
      </P>
      <P>
        理由の「けん」は13文でした。
        標準語の「から」にあたる接続助詞で、Wikipedia「長崎弁」には「けん・けー・け」などが挙がっています。
        「朝から何も食べとらんけん、ひだるかー。」のように、理由を先に言って、あとに気持ちを続ける文が多く見られます。
      </P>
      <P>
        逆接の「ばってん」は、辞典の例文では1文だけでした。
        Wikipedia「長崎弁」では、「ばってん」が「けれども」にあたる接続助詞として広く用いられると書かれています。
        つまり、よく使われる形でも、辞典の例文には1文しか出てこないことがあります。
        例文の数だけで、その形の使われ方を決めつけないほうがよい例です。
      </P>

      <H2 id="s4">「とよ」「と？」：文の終わりに付く「と」</H2>
      <P>
        文末の「とよ」は11文、疑問の「と？」は5文ありました。
        「明日は休みとよ。」は「〜なのよ」にあたり、「あーた、どこに行くと？」は「どこに行くの？」にあたります。
      </P>
      <P>
        Wikipedia「長崎弁」には、準体助詞に「と」を用いるという説明と、「はなん きれかと(つ)ば こーてきたばい」（花のきれいなのを買ってきたよ）という例があります。
        辞典の「とよ」「と？」にも「と」が付いています。
        ただ、<strong>この「と」が、Wikipedia の挙げる準体助詞の「と」と同じものかどうかは、この記事では確かめていません。</strong>
        形が似ているというだけで、同じ語だと言い切ることは避けます。
      </P>
      <P>
        使い方としては、「と？」を疑問の形として覚えておくと、会話が読みやすくなります。
        辞典の例文では、「なして昨日は来んやったと？」「これ、どがんすればよかと？」のように、疑問の言葉（なして・どがん）と組み合わせた例が目立ちました。
      </P>

      <H2 id="s5">「〜とる」と「〜よる」の言い分け</H2>
      <P>
        辞典の例文には、「〜とる」が14文、「〜よる」が3文ありました。
        Wikipedia「長崎弁」には、長崎県では進行（動作の途中）に「よる」を、完了（結果が残っている状態）に「とる」を用いて言い分ける、という説明があります。
      </P>
      <P>
        この言い分けを、辞典の例文で見てみます。
        「こどんたちの公園で遊びよるよ。」の「遊びよる」は、遊んでいる最中です。
        「怒られて弟のはぶてとる。」の「はぶてとる」は、すねた状態がいま続いている、という意味です。
        標準語はどちらも「〜ている」で表すので、ここは標準語にない区別です。
      </P>
      <P>
        ただし、辞典の例文では「〜とる」が14文、「〜よる」が3文と、数に開きがあります。
        これも辞典の書き方の偏りかもしれず、長崎で「よる」が少ないという意味ではありません。
        言い分けそのものは、坂口至の解説を引くWikipedia の記述にもとづくもので、この記事で現地の使われ方を調べたわけではありません。
      </P>

      <H2 id="s6">変換ツールに入れると、どこまで変わるか</H2>
      <P>
        ここまでの形を、方言ラボの
        <Link href="/translate/nagasaki" className={LINK}>長崎弁変換</Link>
        に入れて試しました（2026年11月23日・ツールと同じ関数で実行）。
        このツールは、辞典に載っている語の見出しと一致した部分だけを置き換えます。
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
              <th scope="col" className="py-2 pr-3 font-bold">出力</th>
              <th scope="col" className="py-2 font-bold">置き換え</th>
            </tr>
          </thead>
          <tbody className="block">
            {TESTS.map(([d, i, o, h]) => (
              <tr key={d + i} className="border-b border-line align-top block py-2">
                <td data-l="向き" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 font-bold whitespace-normal">{d}</td>
                <td data-l="入れた文" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{i}</td>
                <td data-l="出力" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{o}</td>
                <td data-l="置き換え" className="[word-break:auto-phrase] [text-wrap:balance] block pr-0 py-0.5 before:block before:text-[13px] before:text-sub before:content-[attr(data-l)]">{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        <strong>語は置き換わりますが、文末や助詞は変わりません。</strong>
        「本当に」は「ほんなこて」に、「そんなに」は「そがん」になります。
        一方、「けど」は「ばってん」にならず、「しなければ」は「〜んば」にならず、「食べているところ」は「〜よる」になりません。
      </P>
      <P>
        反対向きでは、<strong>辞典の例文そのものも、すべて標準語に直るわけではありません。</strong>
        辞典の長崎弁の例文103文を、長崎弁から標準語に入れると、何かが置き換わったのは72文で、31文は入力と同じ文が返りました。
        置き換わった文でも、「行きたかばってん」が「行きたかだけど」になるように、文として崩れる例があります。
        原因は、「ばってん」は直せても、そのまえの「行きたか」（形容詞のカ語尾）が残るためです。
      </P>
      <P>
        同じ仕組みの限界は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にもあります。
        長崎弁の「とても」「ものすごく」にあたる語が知りたいときは、
        <Link href="/blog/tottemo-hogen-henkan" className={LINK}>「とても」を35方言に変換した実測</Link>
        に、「ばり」と「ばさらか」の違いをまとめています。
      </P>

      <H2 id="s7">長崎弁の例文を作るときの手順</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>まず、辞典の語を1つ選びます。たとえば「ひだるか（おなかがすいた）」です。</li>
        <li>理由があるなら、先に「〜けん」で言います。「朝から何も食べとらんけん、ひだるかー。」の形です。</li>
        <li>「を」にあたる部分は「ば」に直します。「ご飯ば食べとらんけん」のようにします。</li>
        <li>文の終わりは「ばい」「たい」「とよ」から選びます。疑問なら「と？」を付けます。</li>
        <li>動作の最中なら「〜よる」、結果が残っているなら「〜とる」に直します。</li>
        <li>最後に、<Link href="/translate/nagasaki" className={LINK}>長崎弁変換の言葉一覧</Link>で、使った語の意味と例文を引いて確かめます。</li>
      </ul>
      <P>
        この手順は、辞典の例文の形を並べ直したものです。
        長崎の人が自然だと感じるかどうかは、この記事では確かめていません。
        地元の人に見てもらえる場合は、その指摘を優先してください。
      </P>

      <H2 id="s8">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-4">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <P>{f.a}</P>
        </div>
      ))}

      <H2 id="s9">まとめ：次にやること</H2>
      <P>
        辞典の長崎弁の例文103文を数えると、対格の「ば」が18文、「ばい」「たい」の出る文が17文（うち文末15文）、「〜とる」が14文、理由の「けん」が13文でした。
        語だけでなく、こうした小さな形がそろって、長崎弁らしい文になります。
        変換ツールは語を置き換えますが、この小さな形までは直しません。
      </P>
      <P>
        次にやることは、気になる語を1つ選んで、上の手順で1文を作ってみることです。
        語を引くには、変換ツールの言葉一覧が早いです。
      </P>
      <P>
        <Link href="/translate/nagasaki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 長崎弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/nagasaki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 長崎弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：方言ラボの辞典の長崎弁103語と、各語の例文103文を、2026年11月23日に数えました。変換ツールの出力は、ツールと同じ関数を同日に実行した結果です。
          </li>
          <li>
            確かめたこと：Wikipedia「長崎弁」の文法の節に、断定の「ばい」「たい」、対格「ば」、準体助詞「と」、理由「けん」、逆接「ばってん」、進行「よる」・完了「とる」の説明があること（2026年11月23日に本文を取得）。
          </li>
          <li>
            確かめられていないこと：辞典の例文が、長崎の人の実際の話し方をどれだけ反映しているか。例文は用例として載せた文で、話し言葉の記録ではありません。
          </li>
          <li>
            確かめられていないこと：「ばい」と「たい」の使い分けが辞典の例文全体でも当てはまるか、辞典の「とよ」「と？」の「と」が準体助詞と同じものかどうか、地域や年代による差。
          </li>
        </ul>
        そのため、これらを「長崎の人はこう話す」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「長崎弁」文法の節（断定・進行相と完了相・助詞・接続助詞。出典は坂口至「長崎県の方言」ほか）2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/長崎弁",
          },
          {
            label: "方言ラボ 長崎弁変換ツールの実行結果と、辞典の例文103文の集計（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/nagasaki",
          },
        ]}
      />
    </ArticleShell>
  );
}
