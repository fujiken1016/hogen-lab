import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("nagoya-ben-gaya-gane-namo")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/nagoya-ben-gaya-gane-namo" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/nagoya-ben-gaya-gane-namo", type: "article", image: { path: "/og/blog-nagoya-ben-gaya-gane-namo.jpg", alt: "名古屋弁の「がや」「がね」「なも」は今も使う？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

const KINDS: [string, string, string][] = [
  ["上町（うわまち）言葉", "清洲越しで名古屋に移った富商が住んだ、広小路通より北の城下町", "語尾に「なも」「なもし」「えも」をつけて調子をやわらげる。「さま」「ござりまする」などの丁寧な言い方もある"],
  ["下町言葉", "職人・小商人・農民など、庶民が暮らした地域", "「がや」「がね」を使うのが最大の特徴。仲間うちの言葉として使われた"],
];

const ENDINGS: [string, number][] = [
  ["〜がや・〜がね", 17],
  ["〜とる・〜とった（〜している）", 9],
  ["〜で・〜だで（理由）", 8],
  ["〜ちょう・〜ちょー（〜してください）", 7],
  ["〜やあ・〜りゃあ（すすめ・命令）", 7],
  ["〜まい・〜みゃあ（誘い）", 6],
  ["〜なも", 3],
];

const REGION: [string, string, string][] = [
  ["北尾張（一宮・江南など）", "「がや」「がね」「だで」「だわ」の代わりに「やん」「やで」「やわ」を使う。否定の「へん」も多い", "0文"],
  ["瀬戸", "確認の「〜やらあ」を使い、肯定の相づちに「ほや」が出る", "0文"],
  ["知多", "「〜じゃん」「〜だらあ」「〜りん」など、三河弁に近い形を使う", "0文"],
];

const SRC: [string, number][] = [
  ["Wikipedia「名古屋弁」語彙表など", 27],
  ["『名古屋市史 風俗編』（1915）", 18],
];

const TESTS: [string, string, string][] = [
  ["名古屋弁→標準語", "この味噌カツ、でらうまいがね！", "この味噌カツ、すごくおいしいがね！（「がね」は残る）"],
  ["名古屋弁→標準語", "早よまわししやあ。", "早よ準備しやあ。（「しやあ」は残る）"],
  ["名古屋弁→標準語", "聞き取れんかったで、まっぺん言ってちょー。", "聞き取れんかったで、もう一回言ってちょー。（「で」「ちょー」は残る）"],
  ["名古屋弁→標準語", "雨で運動会がわやになってまった。", "雨で運動会がめちゃくちゃになってまった。（「てまった」は残る）"],
  ["名古屋弁→標準語", "はよ行こみゃあ、遅れてまうがね。", "はよ行こみゃあ、遅れてまうがね。（変わらない）"],
  ["名古屋弁→標準語", "テレビがこわけてまったがや。", "テレビがこわけてまったがや。（変わらない。「こわける」は活用した形）"],
  ["名古屋弁→標準語", "今日はええお天気だなも。", "今日はええお天気だ丁寧で上品な語尾。（辞典の語釈が文に入ってしまう）"],
  ["標準語→名古屋弁", "とても", "でら"],
  ["標準語→名古屋弁", "久しぶり", "やっとかめ"],
  ["標準語→名古屋弁", "疲れた", "えらい"],
  ["標準語→名古屋弁", "ごめんね", "ごめんね（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "名古屋弁と尾張弁は、同じものですか？",
    a: "Wikipedia「名古屋弁」は、名古屋弁（尾張弁）を、愛知県西部（旧尾張国）で話される方言と説明しています。名古屋市の中心部の方言を名古屋弁、それ以外の尾張地方（北部の一宮市など）の方言を尾張弁と区別することもある、とも書いています。方言ラボの辞典の語には地域の注記がなく、どの語が名古屋市の中心部の言葉かは、語ごとには分かりません。",
  },
  {
    q: "名古屋弁と三河弁は、同じものですか？",
    a: "同じではありません。Wikipedia「名古屋弁」は、同じ愛知県でも東部（旧三河国）の三河弁は、アクセントも表現も名古屋弁と異なる点が多く、岐阜県南部の美濃弁のほうが名古屋弁との共通点が多いと書いています。方言ラボの辞典には、三河弁は載っていません。",
  },
  {
    q: "「〜みゃあ」「〜まい」は、何を言う語尾ですか？",
    a: "「〜しよう」と相手を誘う言い方です。Wikipedia「名古屋弁」は、「まい」「まいか」「めぁ」「めぁか」を、「〜しよう」のあとについて勧誘を表す表現と書いています。辞典の例文では、「行こまい」「遊ぼまい」「行こみゃあ」「決めよみゃあ」など6文に出ます。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>方言ラボの辞典の例文85文でいちばん多いのは、下町言葉の「〜がや」「〜がね」の17文でした。上町言葉の上品な「〜なも」は3文です。</strong>
        Wikipedia「名古屋弁」は、2009年の名古屋市の調査（成人の市民2000人）で、名古屋弁を「使わない」という回答が6割だったと書いています。
        「がや」「がね」「なも」が今も使われているかを示す統計は、確認できませんでした。この調査は、名古屋弁全体についての数字です。
      </P>
      <P>
        この記事では、上町言葉と下町言葉の違いを表にしたうえで、辞典の例文の語尾を数えます。
        あわせて、尾張北部・瀬戸・知多の言い方と、辞典の名古屋弁の出典、他の方言との重なり、変換ツールが直せない語尾も、実行結果で確かめました。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "名古屋弁は上町言葉と下町言葉に分かれる" },
        { id: "s2", label: "名古屋弁は今も使われているか" },
        { id: "s3", label: "辞典の例文の語尾を数えると" },
        { id: "s4", label: "尾張北部・瀬戸・知多では言い方が違う" },
        { id: "s5", label: "辞典の名古屋弁は、どこの言葉と重なるか" },
        { id: "s6", label: "変換ツールに入れると、どう変わるか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">名古屋弁は上町言葉と下町言葉に分かれる</H2>
      <P>
        Wikipedia「名古屋弁」は、名古屋弁を、愛知県西部（旧尾張国）で話される方言と説明しています。
        そのうえで、名古屋市の中にも2つの言葉づかいがあったと書いています。
        城下町の北側で話された上町言葉と、庶民の地域で話された下町言葉です。
      </P>
      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            名古屋市の2つの言葉づかい（Wikipedia「名古屋弁」より・2026年11月25日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">種類</th>
              <th scope="col" className="py-2 pr-3 font-bold">話された場所・人</th>
              <th scope="col" className="py-2 font-bold">特徴</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {KINDS.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="種類" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="話された場所・人" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="特徴" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        上町言葉については、昭和期まで引き継がれたものの、名古屋大空襲の戦災と戦後復興による地域社会の崩壊などで衰退が著しく、その後は下町言葉に主役を取って代わられた、と同記事は書いています。
        「なもし」は、<Link href="/blog/iyo-ben-zonamoshi" className={LINK}>伊予弁の「ぞなもし」を扱った記事</Link>にも出てくる語尾ですが、名古屋でも上町の言葉として説明されています。
      </P>
      <P>
        名古屋は、西日本方言と東日本方言の境界にあたる土地でもあります。
        同記事は、アクセントは東京式に分類される一方で、文法は関西的な要素が多いと書いています。
        境界の土地の言葉の話は、
        <Link href="/blog/higashi-nishi-kyoukai" className={LINK}>言葉の東西の境界を扱った記事</Link>
        にあります。
      </P>

      <H2 id="s2">名古屋弁は今も使われているか</H2>
      <P>
        Wikipedia「名古屋弁」は、2009年に名古屋市が成人の市民2000人（外国人を含む）を対象に行ったアンケートで、名古屋弁を「使わない」という回答が6割だったと書いています。
        名古屋弁への良い印象と悪い印象は半々で、あまり使われなくなっている現状を「残念に思う」は1割、「時代の流れでやむを得ない」という意見が多かった、とも書かれています。
        <strong>名古屋市の原資料は、この記事では確認できていません。</strong>
      </P>
      <P>
        発音についても同記事に記述があります。
        「ない」が「にゃあ」と聞こえるような母音の変化は、伝統的な名古屋弁を描いた説明であって、実際には若年層の自然な会話からはほぼ失われている、という内容です。
        高齢層でも日常的な語彙に限られる、とも書かれています。
      </P>
      <P>
        ここから、名古屋弁の中でも、広く知られた発音の特徴は、今の若い世代の話し言葉には残りにくいと読めます。
        <strong>「知られている名古屋弁」と「今、日常で使う名古屋弁」は別</strong>です。
        ドラマやマンガで方言がどう作られるかは、
        <Link href="/blog/media-to-hogen" className={LINK}>ドラマやマンガの方言がどう作られるかを書いた記事</Link>
        で扱っています。
      </P>

      <H2 id="s3">辞典の例文の語尾を数えると</H2>
      <P>
        方言ラボの辞典には、名古屋弁が85語載っていて、それぞれに例文が1文ずつ付いています。
        その85文の語尾を数えました（2026年11月25日の自社集計）。
      </P>

      <BarFig
        max={17}
        unit="文"
        ariaLabel="辞典の名古屋弁の例文85文に出る語尾の数。がやとがね17文、とる・とった9文、で・だで8文、ちょう・ちょー7文、やあ・りゃあ7文、まい・みゃあ6文、なも3文"
        caption="図：辞典の名古屋弁85文に出る語尾の数（2026年11月25日・自社集計。1文に複数の形が出る場合は重ねて数えた）"
        items={ENDINGS.map(([l, n]) => ({ label: l, value: n, dim: n < 7 }))}
      />

      <P>
        <strong>いちばん多いのは「〜がや」「〜がね」で17文</strong>です。
        「この味噌カツ、でらうまいがね！」「雨がひどかったがや。」のように、文の終わりに出ます。
        Wikipedia「名古屋弁」が、下町言葉の最大の特徴として挙げている形です。
      </P>
      <P>
        続いて、「〜とる」「〜とった」の形が9文あります（「元気しとった？」「溜まっとるがね」など）。
        理由を言う「〜で」「〜だで」は8文で、「出かけるで」「掃除の時間だで」のように出ます。
        同記事は、この「で」が終止形につく点を、共通語の「ので」との違いとして説明しています。
        「〜してください」にあたる「〜ちょう」「〜ちょー」は7文でした。
      </P>
      <P>
        一方、上町言葉の「なも」は3文です。
        見出し語「なも」自身の例文「今日はええお天気だなも。」のほかに、「こっすい」「おぼこい」の例文にも出ます。
        <strong>下町言葉の「がや・がね」が17文、上町言葉の「なも」が3文</strong>という差があります。
        ただし、辞典の例文は用例として載せた文で、名古屋の人の話し言葉の記録ではないため、使用率としては読めません。この差を、上町言葉の衰退の裏付けとして読むことはできません。
      </P>

      <H2 id="s4">尾張北部・瀬戸・知多では言い方が違う</H2>
      <P>
        Wikipedia「名古屋弁」は、尾張地方の方言には地域ごとに違いがあり、「名古屋市で用いられる方言」と「尾張全域の言葉」は同じではない、と注意しています。
        北部の一宮市・江南市のあたりは美濃弁の影響が強く、瀬戸市は東濃の方言と共通する特徴があり、知多半島は三河弁に近い言葉が使われる、という説明です。
      </P>
      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            名古屋市付近と違う形が、辞典の名古屋弁85文に出た数（Wikipedia「名古屋弁」の説明と、2026年11月25日の自社集計）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">地域</th>
              <th scope="col" className="py-2 pr-3 font-bold">名古屋市付近との違い（Wikipedia）</th>
              <th scope="col" className="py-2 font-bold">辞典の例文に出た数</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {REGION.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="地域" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="名古屋市付近との違い（Wikipedia）" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="辞典の例文に出た数" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        辞典の名古屋弁85文には、これらの地域の形は1文も出ませんでした。
        辞典の語には地域の注記がなく、これは例文の形を数えただけの結果で、どの地域の形が多いかまでは言えません。
        同じ愛知県でも、東の三河弁は名古屋弁と異なる点が多いと、同記事は書いています。
        名古屋の西にあたる三重県の言葉は、
        <Link href="/blog/mie-ise-ben-chigai" className={LINK}>三重の伊勢弁の違いを数えた記事</Link>
        で扱っています。
      </P>

      <H2 id="s5">辞典の名古屋弁は、どこの言葉と重なるか</H2>
      <P>
        辞典の名古屋弁85語のうち、出典つきの照合台帳に載っているのは47語です（2026年11月25日の集計）。
        そのうち、出典で語と語釈を確認できたのは45語で、残る2語は出典に届いていません。
        45語の出典は、次の内訳でした。
      </P>

      <BarFig
        max={27}
        unit="語"
        ariaLabel="出典を確認できた名古屋弁45語の出典の内訳。Wikipedia名古屋弁語彙表など27語、名古屋市史風俗編1915が18語"
        caption="図：出典を確認できた名古屋弁45語の出典の内訳（2026年11月25日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 20 }))}
      />

      <P>
        大正4年（1915）の『名古屋市史 風俗編』で確認できた語が18語あります。
        そのほかは、Wikipedia「名古屋弁」の語彙表などです。
      </P>
      <P>
        辞典の中で見ると、名古屋弁85語のうち28語は、他の方言にも同じ見出し語があります。
        いちばん多いのは信州弁の7語、次いで神戸弁6語、飛騨弁5語、大分弁4語です。
        愛知の西の隣にあたる伊勢弁は2語（「えらい」「つる」）でした。
        「えらい」（疲れた）は、名古屋弁を含む10方言に載っています。
        <strong>辞典の中での重なりは、東北の方言とはほとんどありません</strong>（東北の6方言と共通なのは「まっと」の1語だけです）。
        ただし、これは辞典の中での重なりで、語の由来は示しません。同じ見出し語でも、意味が同じとは限りません。
      </P>

      <H2 id="s6">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/nagoya" className={LINK}>名古屋弁変換</Link>
        に入れました（2026年11月25日・ツールと同じ関数で実行）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた文と、変換ツールの出力（2026年11月25日・方言ラボ自社実測）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">向き</th>
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 font-bold">出力</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {TESTS.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="向き" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="入れた文" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="出力" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        「でら」は「すごく」に、「わや」は「めちゃくちゃ」に、「まっぺん」は「もう一回」に直ります。
        標準語の「とても」は「でら」に、「久しぶり」は「やっとかめ」に変わります。
        一方、<strong>「がね」「がや」「ちょー」「みゃあ」のような語尾は、直りません。</strong>
        85文の3分の1強にあたる30文が、「がや・がね」か「ちょう・ちょー」か「〜やあ」のどれかを含むため、語を直しても、文の語尾は名古屋弁のまま残ります。
      </P>
      <P>
        もう1点、「だなも」は、辞典の「なも」の語釈（丁寧で上品な語尾）が、そのまま文に入ってしまいました。
        語尾の語釈は、文の中で置き換える言葉にならないためです。
        気になる語は、言葉一覧の語釈で確かめてください。
        この限界は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にまとめています。
      </P>

      <H2 id="s7">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-4">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <P>{f.a}</P>
        </div>
      ))}


      <H2 id="s8">まとめ：次にやること</H2>
      <P>
        名古屋弁は、城下町の北側の上町言葉と、庶民の下町言葉に分かれていました。
        Wikipedia「名古屋弁」によると、2009年の名古屋市の調査では「使わない」が6割です。
        辞典の例文85文では、「〜がや・〜がね」が17文、上品な「〜なも」が3文で、変換ツールは、語は直しますが、語尾は直しません。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾も一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/nagoya" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 名古屋弁変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/nagoya" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 名古屋弁検定
        </Link>
      </P>

      <P>この記事の数字は、出どころで3つに分かれます。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>上町・下町の区分、名古屋市のアンケート、地域ごとの違い：Wikipedia「名古屋弁」の記述です。アンケートの原資料は確認していません。</li>
        <li>辞典の例文の数（17文・9文・8文など）と、他の方言との重なり：方言ラボの辞典を2026年11月25日に数えた自社集計です。</li>
        <li>変換ツールの結果：同日に自社のツールを実行した出力です。</li>
      </ul>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「名古屋弁」の名古屋弁の種類・地域差・文法・発音の節を2026年11月25日に読みました。辞典の例文の語尾の集計、他方言との重なりの集計、変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（名古屋弁47語）の出典の内訳。『名古屋市史 風俗編』（1915）の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：2009年の名古屋市のアンケートの原資料（Wikipedia の記述を紹介しているだけです）、「がや」「がね」「なも」の現在の使用率、辞典の名古屋弁38語の出典、辞典の語がどの地域の言葉か。
          </li>
        </ul>
        そのため、これらを「名古屋ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「名古屋弁」名古屋弁の種類・その他の地域・文法・発音・名古屋弁の印象史の節 2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/名古屋弁",
          },
          {
            label: "名古屋市編『名古屋市史 風俗編』（1915）国立国会図書館デジタルコレクション（出典照合台帳の記録）",
          },
          {
            label: "方言ラボ 名古屋弁変換ツールの実行結果・辞典の例文の集計（2026年11月25日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/nagoya",
          },
        ]}
      />
    </ArticleShell>
  );
}
