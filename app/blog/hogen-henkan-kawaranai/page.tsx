import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("hogen-henkan-kawaranai")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/hogen-henkan-kawaranai" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/hogen-henkan-kawaranai", type: "article" }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 日常の12文を標準語→35方言へ変換した実測（2026年11月16日・方言ラボの変換ツールと同じ関数）
// [文, 置き換わった方言数（35中）, 置き換わった語（その語で置き換わった方言数）]
const SENTENCES: [string, number, string][] = [
  ["今日はとても寒いね。", 28, "とても（28）・寒い（4）・今日（1）"],
  ["今日はなんだか疲れた。", 27, "疲れた（26）・今日（1）"],
  ["ありがとう、助かったよ。", 20, "ありがとう（20）"],
  ["それは本当にすごいね。", 17, "本当に（10）・すごい（8）・本当（1）"],
  ["ちょっと待ってください。", 9, "ください（7）・ちょっと（3）"],
  ["久しぶりに会えてうれしい。", 8, "久しぶり（8）"],
  ["明日、一緒に行かない？", 6, "明日（3）・ない（2）・一緒に（1）"],
  ["そんなこと言わないでよ。", 5, "そんな（3）・ない（2）"],
  ["この荷物を持ってくれる？", 3, "くれる（3）"],
  ["早く家に帰りたい。", 2, "早く（2）"],
  ["おなかがすいたので、ご飯を食べよう。", 2, "ご飯（1）・おなかがすいた（1）"],
  ["雨が降っているから、傘を持っていって。", 0, "なし"],
];

// 1語だけを入れたときに置き換わった方言数（35中・同日の実測）
const WORDS: [string, number][] = [
  ["疲れた", 35],
  ["ありがとう", 35],
  ["本当に", 35],
  ["久しぶり", 35],
  ["たくさん", 25],
  ["捨てる", 20],
  ["恥ずかしい", 14],
  ["帰る", 12],
  ["かわいい", 10],
  ["寒い", 4],
  ["きれい", 3],
  ["食べる", 2],
  ["傘", 0],
  ["降る", 0],
  ["家", 0],
  ["行く", 0],
  ["いい", 0],
];

// 1語だけ入れたときと、文の中に入れたときの違い（同日の実測・35方言中の置き換わった方言数）
const ALONE: [string, number, string, number][] = [
  ["ありがとう", 35, "「ありがとう、助かったよ。」", 20],
  ["疲れた", 35, "「今日はなんだか疲れた。」", 26],
  ["本当に", 35, "「それは本当にすごいね。」", 10],
  ["久しぶり", 35, "「久しぶりに会えてうれしい。」", 8],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "方言変換で文が変わらないのは、故障ですか？",
    a: "故障ではありません。方言ラボの変換ツールは、辞典に載っている語だけを置き換える仕組みです。2026年11月16日の実測では、日常の12文を35方言に入れた420通りのうち、293通り（約70%）で入力と同じ文が返りました。",
  },
  {
    q: "どんな文が方言に変わりやすいですか？",
    a: "「とても」「疲れた」「ありがとう」のように、辞典に多くの方言で載っている語を含む文です。「今日はとても寒いね。」は35方言中28方言で変わりました。「雨が降っているから、傘を持っていって。」は0方言で変わりませんでした。",
  },
  {
    q: "「ありがとう」だけ入れると変わるのに、文にすると変わらないのはなぜですか？",
    a: "1語だけを入れたときは、その方言の言い方をひとこと丸ごと返します。文の中では、語ひとつに収まる言い方だけを置き換えます。「ありがとね〜」のような伸ばし記号つきの言い方を文の途中に入れると、「ありがとね〜ございます」のように壊れるためです。",
  },
  {
    q: "語尾や活用も方言に変わりますか？",
    a: "変わりません。置き換えるのは辞典の語だけで、語尾・活用・助詞は標準語のまま残ります。「行かない？」を神戸弁にすると、「ない」だけが「あらへん」に替わって「行かあらへん？」になり、活用との接続までは直りません。",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
      <P>
        <strong>先に結論です。</strong>
        <strong>標準語の12文を35方言に変換すると、420通りのうち127通り（約30%）で語が替わり、293通り（約70%）は入力と同じ文が返りました。</strong>
        変わらないのは<strong>故障ではなく、辞典に載っていない語だから</strong>です。
        「今日はとても寒いね。」は28方言で変わり、「雨が降っているから、傘を持っていって。」は0方言でした。
      </P>
      <P>
        数字は、方言ラボの変換ツールと同じ関数に12文を通して数えたものです（2026年11月16日・自社実測）。
        この記事では、どんな文が変わりやすいか、変わらないときにどう入れ直すか、そして語尾までは変わらない限界を、実例で示します。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "420通りのうち、変わったのは127通り" },
        { id: "s2", label: "変わりやすい語と、ほとんど変わらない語" },
        { id: "s3", label: "1語だけ入れると変わるのに、文にすると減る" },
        { id: "s4", label: "語尾や活用は、直らない" },
        { id: "s5", label: "変わらないときの入れ直し方" },
        { id: "s6", label: "他の方言変換ツールとの違い" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">420通りのうち、変わったのは127通り</H2>
      <P>
        日常でよく使う12文を用意し、標準語から35方言へ1つずつ変換しました。
        12文×35方言で420通りです。
        1語でも置き換わったのは127通り、入力と同じ文のままだったのは293通りでした。
        置き換わった語は、全部で135語です。
      </P>
      <P>
        方言ごとに見ると、12文のうち置き換わった文の数は1〜7文の間に分かれました。
        いちばん多いのは出雲弁の7文、伊勢弁と土佐弁の6文です。
        南部弁と富山弁は1文だけで、真ん中の値（中央値）は4文でした。
      </P>

      <BarFig
        max={35}
        unit="方言"
        ariaLabel="12文ごとの、置き換わった方言の数（35方言中）。今日はとても寒いね28、今日はなんだか疲れた27、ありがとう助かったよ20、それは本当にすごいね17、ちょっと待ってください9、久しぶりに会えてうれしい8、明日一緒に行かない6、そんなこと言わないでよ5、この荷物を持ってくれる3、早く家に帰りたい2、おなかがすいたのでご飯を食べよう2、雨が降っているから傘を持っていって0"
        caption="図：12文ごとの、置き換わった方言の数（35方言中・2026年11月16日・自社実測）"
        items={SENTENCES.map(([s, n]) => ({ label: s, value: n, dim: n < 10 }))}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            12文ごとの結果。カッコ内は、その語で置き換わった方言の数（2026年11月16日・自社実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">変わった方言</th>
              <th scope="col" className="py-2 font-bold">置き換わった語</th>
            </tr>
          </thead>
          <tbody>
            {SENTENCES.map(([s, n, w]) => (
              <tr key={s} className="border-b border-line align-top">
                <td className="py-2 pr-3">{s}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{n}／35</td>
                <td className="py-2">{w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        上位の文は、どれも「とても」「疲れた」「ありがとう」のように、辞典に多くの方言で載っている語を含みます。
        下位の文は、「降る」「傘」「持つ」「家」のように、標準語と同じ形で全国に通じる語でできています。
        そういう語は、<strong>方言の辞典に見出し語として載りにくい</strong>ので、置き換える相手がありません。
      </P>

      <H2 id="s2">変わりやすい語と、ほとんど変わらない語</H2>
      <P>
        文を細かく分けるために、1語だけを35方言に入れて、置き換わった方言の数も数えました。
        同じ日に、17語を試した結果です。
      </P>

      <BarFig
        max={35}
        unit="方言"
        ariaLabel="1語だけを入れたときに置き換わった方言の数（35方言中）。疲れた、ありがとう、本当に、久しぶりは35、たくさん25、捨てる20、恥ずかしい14、帰る12、かわいい10、寒い4、きれい3、食べる2、傘・降る・家・行く・いいは0"
        caption="図：1語だけを入れたときに、置き換わった方言の数（35方言中・2026年11月16日・自社実測）"
        items={WORDS.map(([w, n]) => ({ label: w, value: n, dim: n < 10 }))}
      />

      <P>
        「行く」「家」「いい」のような、ごく基本の語は0方言でした。
        反対に、「疲れた」「ありがとう」「本当に」「久しぶり」は35方言すべてで置き換わりました。
        ただし、この4語は次の節のとおり、1語で入れたときの結果です。
        「寒い」が4方言、「食べる」が2方言なのは、辞典の語釈にその意味で載っている方言が少ないためです。
      </P>

      <H2 id="s3">1語だけ入れると変わるのに、文にすると減る</H2>
      <P>
        同じ語でも、1語だけ入れたときと、文の中に入れたときで、置き換わる方言の数が変わります。
      </P>

      <BarFig
        max={35}
        unit="方言"
        ariaLabel="1語で入れたときと文の中に入れたときの、置き換わった方言の数。ありがとうは1語35、文の中20。疲れたは1語35、文の中26。本当には1語35、文の中10。久しぶりは1語35、文の中8"
        caption="図：同じ語を1語で入れたときと、文の中に入れたときの、置き換わった方言の数（35方言中・2026年11月16日・自社実測）"
        items={[
          { label: "「ありがとう」を1語で", value: 35 },
          { label: "「ありがとう、助かったよ。」の中で", value: 20, dim: true },
          { label: "「疲れた」を1語で", value: 35 },
          { label: "「今日はなんだか疲れた。」の中で", value: 26, dim: true },
          { label: "「本当に」を1語で", value: 35 },
          { label: "「それは本当にすごいね。」の中で", value: 10, dim: true },
          { label: "「久しぶり」を1語で", value: 35 },
          { label: "「久しぶりに会えてうれしい。」の中で", value: 8, dim: true },
        ]}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            1語で入れたときと、文の中に入れたときの違い（35方言中・2026年11月16日・自社実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">語</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">1語だけ</th>
              <th scope="col" className="py-2 pr-3 font-bold">文の中</th>
              <th scope="col" className="py-2 font-bold whitespace-nowrap">文の中の数</th>
            </tr>
          </thead>
          <tbody>
            {ALONE.map(([w, a, s, n]) => (
              <tr key={w} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{w}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{a}方言</td>
                <td className="py-2 pr-3">{s}</td>
                <td className="py-2 whitespace-nowrap">{n}方言</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        <strong>1語で入れると、ツールはその方言の言い方を「ひとこと丸ごと」返します。</strong>
        「ありがとう」なら、大阪弁は「おおきに」、北海道弁は「ありがとね〜」、津軽弁は「ありがとごす」です。
        「疲れた」なら、北海道弁は「こわい」、大阪弁は「しんど〜」、博多弁は「きつか」になります。
        北海道弁の「こわい」は、辞典の語釈が「疲れた、体がだるい」の語です。
      </P>
      <P>
        一方、<strong>文の中では、置き換える相手を「語ひとつに収まる言い方」に絞っています。</strong>
        「ありがとね〜」のように伸ばし記号や感嘆符がついた言い方を文の途中に入れると、「ありがとね〜ございます」のように文が壊れるからです。
        この絞り込みは2026年11月15日に入れました。それまでは文中にもひとこと丸ごとを当てていて、別の日常文12本で測ると、壊れた文が大半でした（経緯は
        <Link href="https://mainichi-lab.com/read/dialect-converter-417-of-432-broken?utm_source=hogen&utm_medium=blog&utm_campaign=hogen-henkan-kawaranai" className={LINK}>変換ツールの出力を全部の組み合わせで数えた記録</Link>
        にあります）。
        そのぶん文の中で置き換わる数は減りましたが、読める文を返すほうを選んでいます。
      </P>

      <H2 id="s4">語尾や活用は、直らない</H2>
      <P>
        <strong>このツールが置き換えるのは辞典の語だけで、語尾・活用・助詞は標準語のまま残します。</strong>
        文法まで変えるツールではないので、置き換えた語と元の文の接続が不自然になることがあります。
        次は、同じ文で語尾に当たる語が置き換わった例です。
      </P>

      <div className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「明日、一緒に行かない？」を変換した結果（2026年11月16日・自社実測。置き換わった6方言）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">方言</th>
              <th scope="col" className="py-2 pr-3 font-bold">変換結果</th>
              <th scope="col" className="py-2 font-bold">置き換わった語</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line align-top"><td className="py-2 pr-3 whitespace-nowrap">伊勢弁</td><td className="py-2 pr-3">明日、一緒に行かねー？</td><td className="py-2">ない→ねー</td></tr>
            <tr className="border-b border-line align-top"><td className="py-2 pr-3 whitespace-nowrap">神戸弁</td><td className="py-2 pr-3">明日、一緒に行かあらへん？</td><td className="py-2">ない→あらへん</td></tr>
            <tr className="border-b border-line align-top"><td className="py-2 pr-3 whitespace-nowrap">和歌山弁</td><td className="py-2 pr-3">明日、つれもて行かない？</td><td className="py-2">一緒に→つれもて</td></tr>
            <tr className="border-b border-line align-top"><td className="py-2 pr-3 whitespace-nowrap">岡山弁</td><td className="py-2 pr-3">あしたり、一緒に行かない？</td><td className="py-2">明日→あしたり</td></tr>
            <tr className="border-b border-line align-top"><td className="py-2 pr-3 whitespace-nowrap">土佐弁</td><td className="py-2 pr-3">あいた、一緒に行かない？</td><td className="py-2">明日→あいた</td></tr>
            <tr className="border-b border-line align-top"><td className="py-2 pr-3 whitespace-nowrap">沖縄方言</td><td className="py-2 pr-3">あちゃー、一緒に行かない？</td><td className="py-2">明日→あちゃー</td></tr>
          </tbody>
        </table>
      </div>

      <P>
        伊勢弁の「行かねー？」は、そのまま通じる形です。
        神戸弁の「行かあらへん？」は、辞典の「あらへん」を「ない」の位置に入れただけで、「行かへん」のように動詞に合わせた形には直していません。
        自然な言い方かどうかは、この記事では確かめていません。
        語尾までふくめて自然な方言にしたいときは、置き換わった語を手がかりに、辞典の例文で言い回しを確かめてください。
      </P>

      <H2 id="s5">変わらないときの入れ直し方</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li><strong>文を、ひとこと単位に切って入れる。</strong>「ありがとう」「疲れた」「本当に」は、1語で入れると35方言すべてで返ります。</li>
        <li><strong>方言の語が多い言い方を足す。</strong>「行く」「家」のような基本の語は変わらないので、「とても」「たくさん」「恥ずかしい」のような言い方を文に入れてみてください。</li>
        <li>それでも変わらなければ、方言のページの「よく使う言い換え」や辞典の一覧で、意味から語を探して自分で差し込む。</li>
        <li>語尾・活用は直らないので、置き換わった語の例文を見て、文の終わりは自分で整える。</li>
      </ul>

      <H2 id="s6">他の方言変換ツールとの違い</H2>
      <P>
        方言変換ツールは、仕組みが大きく3つに分かれます。2026年11月16日に、検索の上位に出るツールの説明ページを開いて確認しました。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>
          辞典の語を置き換える方式（方言ラボ）。置き換えた語を必ず見せ、語尾・活用は変えません。何が変わったかを確かめられるのが長所で、基本の語しかない文が変わらないのが短所です。
        </li>
        <li>
          文法規則を順に当てるルール方式。方言辞典サイト（hougenjiten.com）は「正規表現によるルールベース」と説明し、短い文ほど自然で、長文や複文では不自然になることがあると書いています。
        </li>
        <li>
          AIで文ごと書き換える方式。別のツールのページには、AIを使うと明記したものがあります。文は自然になりやすい一方で、どの語がどの辞典に載っているかは確かめにくくなります。
        </li>
      </ul>
      <P>
        どれが正しいかは決められません。方言ラボは、「その語が辞典にある」ことを確かめられる方式を選んでいます。
        そのかわり、変わらない文が出ることは、この記事のとおり数字で示しています。
      </P>

      <H2 id="s7">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-5">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <p className="text-base leading-[1.95]">{f.a}</p>
        </div>
      ))}

      <H2 id="s8">まとめ</H2>
      <P>
        12文を35方言に入れた420通りのうち、約70%は入力と同じ文でした。
        変わりやすいのは「とても」「疲れた」「ありがとう」を含む文、変わらないのは「降る」「傘」「家」のような基本の語でできた文です。
        変わらないときは、ひとこと単位に切って、方言の語が多い言い方を足してみてください。
      </P>
      <P>
        <strong>次の1アクション：</strong>
        いま変換して変わらなかった文を、ひとこと単位に切って、下のツールに入れ直してみてください。
      </P>
      <P>
        <Link href="/translate" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 方言変換ツール（35方言）
        </Link>
      </P>
      <P>
        <Link href="/blog/tottemo-hogen-henkan" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 「とても」を35方言に変換すると？（置き換え先の22語）
        </Link>
      </P>

      <P>
        <Link href="/blog/nagasaki-reibun-bunmatsu" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 長崎弁の文末の「ばい」「たい」は変換で直る？（例文103文の実測）
        </Link>
      </P>
      <P>
        <Link href="/blog/fukushima-kowai-tsukareta" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 福島弁の「こわい」は疲れた（変換結果が読み違えられる例）
        </Link>
      </P>
      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>確かめたこと：2026年11月16日に、12文と17語を標準語から35方言へ変換し、置き換わった方言の数を数えたこと。12文は筆者が選んだ日常の文で、無作為に選んだものではありません。</li>
          <li>確かめられていないこと：置き換わった語が、いまもその土地で使われているか。表の語は辞典に載っているという意味で、その地域の「正しい言い方」とは書いていません。</li>
          <li>確かめられていないこと：変換後の文を、その方言の話者が自然と感じるか。語尾の接続が不自然な例を、1つ示しました。</li>
          <li>確かめられていないこと：他のツールの精度。各ページの説明を読んだだけで、同じ12文を他のツールに入れて比べてはいません。</li>
        </ul>
      </Note>

      <Sources
        items={[
          {
            label: "方言ラボ 方言変換ツール（2026年11月16日・自社実測。12文と17語を標準語から35方言へ）",
            url: "https://hogen.mainichi-lab.com/translate",
          },
          {
            label: "方言ラボ 辞典（35方言3,368語）",
            url: "https://hogen.mainichi-lab.com/dict",
          },
          {
            label: "方言辞典（hougenjiten.com）トップページ。変換の仕組みの説明（2026年11月16日確認）",
            url: "https://hougenjiten.com/",
          },
        ]}
      />
    </ArticleShell>
  );
}
