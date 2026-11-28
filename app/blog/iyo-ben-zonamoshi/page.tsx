import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("iyo-ben-zonamoshi")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/iyo-ben-zonamoshi" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/iyo-ben-zonamoshi", type: "article", image: { path: "/og/blog-iyo-ben-zonamoshi.jpg", alt: "伊予弁の「ぞなもし」は今も使う？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 伊予銀行のコラム（iyomemo・2017年1月24日）が挙げる「遊びにきませんか」の地域ごとの言い方
const REGION: [string, string, string][] = [
  ["東予", "遊びにこんかい", "語調はスッキリとしたシャキシャキ系"],
  ["中予", "遊びにおいでなさい", "どちらつかずで、のんびり感が満載"],
  ["南予", "遊びにきさいや／きんさいや", "ゆるゆる感が特徴のいやし系"],
];

// 辞典の例文99文の語尾などを数えた結果（2026年11月23日・自社集計）
const ENDINGS: [string, number][] = [
  ["〜けん（理由）", 19],
  ["〜んよ（〜なのよ）", 17],
  ["〜わい", 15],
  ["〜よる・〜よった（進行）", 11],
  ["〜ぞなもし・〜なもし", 2],
];

// 出典を確認できた伊予弁22語の出典（出典照合台帳・2026年11月23日の自社集計）
const SRC: [string, number][] = [
  ["『広島県方言の研究』（1933）", 11],
  ["伊予銀行 iyomemo のコラム", 6],
  ["Wikipedia「伊予弁」", 5],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
const TESTS: [string, string, string][] = [
  ["伊予弁→標準語", "ええ天気ぞなもし。", "ええ天気ぞなもし。（変わらない）"],
  ["伊予弁→標準語", "もう遅いけん、そろそろいんでこーわい。", "もう遅いけん、そろそろ帰りますね。"],
  ["伊予弁→標準語", "ちょっとそれ取ってつかーさい。", "ちょっとそれ取ってください。"],
  ["伊予弁→標準語", "今日はがいに暑いわい。", "今日はものすごく暑いわい。（「わい」は残る）"],
  ["伊予弁→標準語", "風邪ひいて一晩中たごりよった。", "風邪ひいて一晩中たごりよった。（変わらない）"],
  ["伊予弁→標準語", "雨やけん、外出るのたいぎいわい。", "雨やけん、外出るの疲れた〜。（語釈は「面倒くさい・だるい」）"],
  ["標準語→伊予弁", "ありがとう", "だんだん"],
  ["標準語→伊予弁", "いらっしゃい", "おいでんよ"],
  ["標準語→伊予弁", "とても暑い", "とても暑い（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "「ぞなもし」は、今の愛媛の人が使う言葉ですか？",
    a: "伊予銀行のコラム（iyomemo）は、「おいでたなもし」のような言い方を、実際には死語に近いと書いています。一方で、伊予の風情を表す代表として、ドラマや映画にも登場し続けているとも説明しています。辞典の例文でも、「なもし」は見出し語そのものの例文2つだけにしか出ませんでした。ただし、現在の使用率を調べた数字は、この記事では確認できていません。",
  },
  {
    q: "伊予弁と愛媛弁は、同じものですか？",
    a: "広い意味では、同じ愛媛県の方言を指します。Wikipedia「伊予弁」は、伊予弁を愛媛県で話されている方言とし、狭義には松山平野を中心とする中予地方の方言を指すと説明しています。方言ラボの辞典も、愛媛県の言葉を「伊予弁」として載せています。",
  },
  {
    q: "「いんでこーわい」は、帰ってくるという意味ですか？",
    a: "帰ります、という意味です。伊予銀行のコラムは、「いんでこうわい」を「帰ります」と訳し、決して戻ってくるわけではないので注意が必要だと書いています。Wikipedia「伊予弁」も、他地域の人が誤解しやすい表現として挙げています。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>「ぞなもし」は伊予弁の代表として有名ですが、伊予銀行のコラムは「おいでたなもし」のような言い方を「死語に近い」と書いています。方言ラボの辞典の例文99文でも、「なもし」が出るのは見出し語そのものの2文だけでした。</strong>
        例文でいちばん多いのは、理由を言う「〜けん」の19文、「〜なのよ」にあたる「〜んよ」の17文、「〜わい」の15文でした。
      </P>
      <P>
        この記事では、伊予銀行のコラムが書く東予・中予・南予の言い方の違いを表にしたうえで、辞典の例文の語尾を数えます。
        あわせて、辞典の伊予弁の出典、他の方言との重なり、変換ツールが直せない語尾も、実行結果で確かめました。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "愛媛の方言は東予・中予・南予で違う" },
        { id: "s2", label: "「ぞなもし」は今も使われるか" },
        { id: "s3", label: "辞典の例文の語尾を数えると" },
        { id: "s4", label: "辞典の伊予弁は、どこの言葉か" },
        { id: "s5", label: "変換ツールに入れると、どう変わるか" },
        { id: "s6", label: "よくある質問" },
        { id: "s7", label: "まとめ" },
      ]} />

      <H2 id="s1">愛媛の方言は東予・中予・南予で違う</H2>
      <P>
        愛媛県は、東予・中予・南予の3つの地方に分けられます。
        Wikipedia「伊予弁」は、愛媛県内の方言の区分には様々な案があるとしたうえで、江端義夫ほか『最新ひと目でわかる全国方言一覧辞典』（1998）の一例として、東予方言は新居浜市付近より東側、中予方言は松山市を中心とした地域の方言だと書いています。
      </P>
      <P>
        アクセントは、東予が香川県に近い讃岐式、中予が京阪式、南予の宇和島が東京式と、地方によって違います。
      </P>
      <P>
        言葉の違いは、伊予銀行のコラム「古くて新しい方言ワールド 知っとるかな？愛媛の方言」（iyomemo・2017年1月24日）に、具体例があります。
        「遊びにきませんか」にあたる言い方が、3つの地方で違うという説明です。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「遊びにきませんか」の地方ごとの言い方（伊予銀行 iyomemo のコラムより・2026年11月23日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">地方</th>
              <th scope="col" className="py-2 pr-3 font-bold">言い方</th>
              <th scope="col" className="py-2 font-bold">語調（コラムの表現）</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {REGION.map(([a, b, c]) => (
              <tr key={a} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="地方" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="言い方" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="語調（コラムの表現）" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        「ください」にあたる言い方にも違いがあります。
        Wikipedia「伊予弁」は、東予方言は「つかーさい」、南予方言は「やんなはい」になると書いています。
        <strong>辞典の伊予弁には「つかーさい」が載っていて、「やんなはい」は載っていません。</strong>
        ただし、辞典の語には地方の注記がなく、どの語がどの地方の言葉かは、語ごとには分かりません。
      </P>

      <H2 id="s2">「ぞなもし」は今も使われるか</H2>
      <P>
        「ぞなもし」「なもし」は、伊予弁の代表としてよく知られています。
        Wikipedia「伊予弁」は、『坊っちゃん』など松山を舞台にした作品を、伊予弁に関連した作品として挙げています。
        伊予銀行のコラムは、愛媛なら松山市の「おいでたなもし」というところだが、実際には死語に近い、と書いています。
      </P>
      <P>
        そのうえで、「なもし言葉」は伊予弁ののんびりした調子が城下町・松山を思わせる、ドラマや映画にも登場する存在だと説明しています。
        コラムには、時折、地元の人が「今どき、あんな言葉は使ってない」と言う、とも書かれています。
      </P>
      <P>
        Wikipedia「伊予弁」にも、「〜ぞなもし」「〜なもし」を「〜ですよ、ねぇ」と訳す記述があります。
        同記事には、「〜ぜ」は伊予、「〜ぜよ」は土佐弁という書き分けもあります。
        方言がドラマやマンガの中でどう使われるかは、
        <Link href="/blog/media-to-hogen" className={LINK}>ドラマやマンガの方言がどう作られるかを書いた記事</Link>
        にあります。
      </P>
      <P>
        ここから、「ぞなもし」を、今の愛媛の人が普通に使う言葉と考えるのは、難しいと読めます。
        <strong>「知っている言葉」と「使う言葉」は別</strong>で、ぞなもしは前者です。
      </P>

      <H2 id="s3">辞典の例文の語尾を数えると</H2>
      <P>
        方言ラボの辞典には、伊予弁が99語載っていて、それぞれに例文が1文ずつ付いています。
        その99文の語尾などを数えました（2026年11月23日の自社集計）。
      </P>

      <BarFig
        max={19}
        unit="文"
        ariaLabel="辞典の伊予弁の例文99文の語尾などの数。けん19文、んよ17文、わい15文、よる・よった11文、ぞなもし・なもし2文"
        caption="図：辞典の伊予弁99文に出る語尾などの数（2026年11月23日・自社集計。1文に複数の形が出る場合は重ねて数えた）"
        items={ENDINGS.map(([l, n]) => ({ label: l, value: n, dim: n < 7 }))}
      />

      <P>
        <strong>いちばん多いのは、理由を言う「〜けん」で19文</strong>です。
        「雨やけん、外出るのたいぎいわい。」「髪が伸びたけん、そろそろつまないかん。」のように、「〜やけん」「〜たけん」の形で出ます。
      </P>
      <P>
        標準語の「〜から」「〜ので」にあたる言い方です。
        続いて、「〜んよ」が17文あります（「泣きよる子をうずんであやしたんよ。」「今日は早う帰るんよ。」など）。
        「〜わい」は15文で、「ええ天気ぞなもし」とは別の、言い切りの語尾です。
      </P>
      <P>
        進行を表す「〜よる」「〜よった」の形は11文でした。
        「勉強しよるんよ」「鳴きよるわい」「歩きよったら」のように出ます。
        Wikipedia「伊予弁」も、「しよる」「なんしょん？」を「何してるの？」と訳しています。
        この「ヨル」で進行を言う形は、神戸弁や長崎弁にもあります。
        <Link href="/blog/kobe-ben-osaka-chigai" className={LINK}>神戸弁と大阪弁の違いを数えた記事</Link>
        と
        <Link href="/blog/nagasaki-reibun-bunmatsu" className={LINK}>長崎弁の例文を数えた記事</Link>
        と並べると、「ヨル」が西日本の広い範囲で使われる形だと分かります。
      </P>
      <P>
        一方、「なもし」は2文で、どちらも見出し語（「なもし」「ぞなもし」）自身の例文「ええ天気ぞなもし。」です。
        <strong>それ以外の97文には、「なもし」は出ません。</strong>
        辞典の例文は用例として載せた文で、愛媛の人の話し言葉の記録ではないため、使用率としては読めませんが、伊予銀行のコラムの「おいでたなもし」についての説明と矛盾しない数字です。
      </P>

      <H2 id="s4">辞典の伊予弁は、どこの言葉か</H2>
      <P>
        辞典の伊予弁99語のうち、出典つきの照合台帳に載っているのは24語です（2026年11月23日の集計）。
        そのうち、出典で語と語釈を確認できたのは22語で、残る2語（「ほかす」など）は出典に届いていません。
        22語の出典は、次の内訳でした。
      </P>

      <BarFig
        max={11}
        unit="語"
        ariaLabel="出典を確認できた伊予弁22語の出典の内訳。広島県方言の研究11語、伊予銀行iyomemoのコラム6語、Wikipedia伊予弁5語"
        caption="図：出典を確認できた伊予弁22語の出典の内訳（2026年11月23日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 6 }))}
      />

      <P>
        半数の11語が、広島県の方言集で確認された語です。
        辞典の中で見ても、伊予弁99語のうち39語は他の方言にも同じ見出し語があり、そのうち24語は、中国地方の方言（鳥取・出雲・岡山・広島・山口）にも載っています。
      </P>
      <P>
        四国の他の方言（讃岐・阿波・土佐）にも載る語は13語でした。
        「だんだん」（ありがとう）は、鳥取弁・出雲弁にも載っていて、Wikipedia「伊予弁」は、伊予弁の「だんだん」を旧い表現と書いています。
      </P>
      <P>
        <strong>伊予弁の語は、四国の他の方言より、瀬戸内海をはさんだ中国地方の方言と重なる語のほうが多い</strong>と読めます。
        ただし、辞典が収録する方言は中国地方が5方言、四国の他の方言が3方言で、数の差も含んでいます。これは辞典の中での重なりで、語の由来は示しません。
        「ほかす」（捨てる）は、京都弁・大阪弁・神戸弁にも載っていて、伊予弁に特有の語とは言えません。
        台帳に載っていない75語は、この記事では出典を確かめていません。
      </P>

      <H2 id="s5">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/iyo" className={LINK}>伊予弁変換</Link>
        に入れました（2026年11月23日・ツールと同じ関数で実行）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた文と、変換ツールの出力（2026年11月23日・方言ラボ自社実測）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">向き</th>
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 font-bold">出力</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {TESTS.map(([d, i, o]) => (
              <tr key={d + i} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="向き" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{d}</td>
                <td data-l="入れた文" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{i}</td>
                <td data-l="出力" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{o}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        「いんでこーわい」は「帰りますね」に、「つかーさい」は「ください」に、「がいに」は「ものすごく」に直ります。
        標準語の「ありがとう」は「だんだん」に、「いらっしゃい」は「おいでんよ」に変わります。
        一方、<strong>「ぞなもし」と、「たごりよった」のような活用した形は直りません。</strong>
        「〜わい」は語尾として残り、「がいに暑いわい」は「ものすごく暑いわい」になります。
      </P>
      <P>
        もう1点、「たいぎいわい」は、辞典の語釈が「面倒くさい・だるい」なのに、出力は「疲れた〜」でした。
        意味は近いのですが、「面倒くさい」とは少しずれます。
        変換結果は、辞典の語釈と同じ意味になるとは限らないので、気になる語は言葉一覧の語釈で確かめてください。
        この限界は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にまとめています。
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
        愛媛の方言は、東予・中予・南予で「遊びにきませんか」の言い方まで違います。
        「ぞなもし」は有名ですが、伊予銀行のコラムは「おいでたなもし」のような言い方を「死語に近い」と書いていて、辞典の例文99文でも、見出し語自身の2文にしか出ません。
        例文でいちばん多いのは、「〜けん」19文、「〜んよ」17文、「〜わい」15文です。
        変換ツールは、語は直しますが、「ぞなもし」や活用した形は直しません。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾も一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/iyo" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 伊予弁変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/iyo" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 伊予弁検定
        </Link>
      </P>

      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>隣の阿波弁の文末は、<Link href="/blog/awa-ben-jo-deyo-ken" className="text-primary-text underline underline-offset-2">阿波弁の「〜んじょ」「〜でよ」を数えた記事</Link>で読めます。</li>
      </ul>

      <P>この記事の数字は、出どころで3つに分かれます。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>東予・中予・南予の言い方と「死語に近い」という記述：伊予銀行のコラム（2017年1月24日）とWikipedia「伊予弁」です。</li>
        <li>辞典の例文の数（19文・17文・15文など）：方言ラボの辞典を2026年11月23日に数えた自社集計です。</li>
        <li>変換ツールの結果：同日に自社のツールを実行した出力です。</li>
      </ul>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：伊予銀行 iyomemo のコラム（2017年1月24日）と、Wikipedia「伊予弁」の区分・会話表現の節を2026年11月23日に読みました。辞典の例文の語尾の集計、他方言との重なりの集計、変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（伊予弁24語）の出典の内訳。『広島県方言の研究』（1933）の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：「ぞなもし」の現在の使用率、Wikipedia「伊予弁」は冒頭に独自研究の注意書きがある記事のため、区分の説明（江端ほか1998を出典に挙げる部分）と、会話表現の例だけを使っていること、辞典の伊予弁75語の出典、東予・中予・南予ごとの辞典の語の分布。
          </li>
        </ul>
        そのため、これらを「愛媛ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "伊予銀行 iyomemo「古くて新しい方言ワールド 知っとるかな？愛媛の方言」（提供元：えひめリビング新聞社）2017年1月24日 2026年11月23日取得",
            url: "https://www.iyobank.co.jp/sp/iyomemo/entry/20170124.html",
          },
          {
            label: "Wikipedia「伊予弁」概要（区分）・会話表現の例の節（冒頭に独自研究の注意書きあり）2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/伊予弁",
          },
          {
            label: "村岡淺夫編『廣島縣方言の研究』（1933）国立国会図書館デジタルコレクション（出典照合台帳の記録）",
          },
          {
            label: "方言ラボ 伊予弁変換ツールの実行結果・辞典の例文の集計（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/iyo",
          },
        ]}
      />
    </ArticleShell>
  );
}
