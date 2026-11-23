import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("mie-ise-ben-chigai")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/mie-ise-ben-chigai" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/mie-ise-ben-chigai", type: "article", image: { path: "/og/blog-mie-ise-ben-chigai.jpg", alt: "三重と伊勢の方言は同じ？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// Wikipedia「三重弁」の「各方言の主な違い」表から、進行相・完了相の2行だけを抜いた
// [方言区画, 進行（〜している最中）, 完了（〜してある・してしまった状態）]
const ASPECT: [string, string, string][] = [
  ["北伊賀・南伊賀", "…てる", "…てる"],
  ["北伊勢・中伊勢（伊勢弁）", "…とる", "…とる"],
  ["志摩・南伊勢", "…よる", "…とる"],
  ["北牟婁・南牟婁", "…よる／…やる・やーる", "…とる／…たる・たーる"],
];

// 辞典の伊勢弁84語のうち、出典照合台帳に出典つきで載っている27語の内訳（2026年11月23日・自社集計）
const SRC: [string, number][] = [
  ["Wikipedia「伊勢弁」の語彙", 10],
  ["『宇治山田市史』（1929・旧宇治山田市＝伊勢市）", 13],
  ["『鈴鹿郡郷土誌』（1915・三重県北部の鈴鹿郡）", 3],
  ["その他（出典に届かず未確認）", 1],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
const TESTS: [string, string, string][] = [
  ["伊勢弁→標準語", "おだっとる", "おだっとる（変わらない）"],
  ["伊勢弁→標準語", "おだつ", "ふざける"],
  ["伊勢弁→標準語", "そんなにおだつと転ぶに。", "そんなにふざけると転ぶに。"],
  ["伊勢弁→標準語", "そんなにおだっとると転ぶに。", "そんなにおだっとると転ぶに。（変わらない）"],
  ["伊勢弁→標準語", "展示品にいらう", "展示品に触る"],
  ["伊勢弁→標準語", "展示品はいろたらあかんに。", "展示品はいろたらダメだよ。（「いろた」は残る）"],
  ["標準語→伊勢弁", "遊びにいらっしゃい。", "遊びにおいない。"],
  ["標準語→伊勢弁", "そんなに調子に乗っていると転ぶよ。", "そんなに調子に乗っていると転ぶよ。（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "三重弁と伊勢弁は、同じものですか？",
    a: "同じではありません。Wikipedia「三重弁」は、三重県で話されている方言の総称で、「三重弁」で1つの方言圏をなすわけではないと説明しています。伊勢弁は、その中の北・中伊勢方言にあたります。",
  },
  {
    q: "「おだっとる」は伊勢弁ですか？",
    a: "方言ラボの辞典には、伊勢弁として「おだつ（ふざける、調子に乗る）」が載っています。「おだっとる」は「おだつ」に「〜とる」が付いた形です。Wikipedia「三重弁」は、伊勢では進行・完了ともに「〜とる」を使うと説明しています。ただし、「おだつ」自体の出典の確認は、この記事ではできていません。",
  },
  {
    q: "変換ツールの伊勢弁は、志摩や伊賀の言葉も入っていますか？",
    a: "入っていません。辞典の方言は「伊勢弁」で、志摩弁や伊賀弁は別の方言として載っていません。出典照合ができた語の出典は、伊勢市や鈴鹿郡の資料と Wikipedia「伊勢弁」で、北・中伊勢の言葉と読める範囲です。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>三重弁は三重県の方言の総称で、伊勢弁はその一部（北・中伊勢）です。進行や完了を言う形も地域で違い、伊勢は「〜とる」、伊賀は「〜てる」、志摩・南伊勢は進行に「〜よる」を使います。</strong>
        「おだっとる」が変換ツールで変わらないのは、この「〜とる」の形が辞典に見出し語として載っていないためです。
      </P>
      <P>
        この記事では、Wikipedia「三重弁」「伊勢弁」の区画の説明を表にし、方言ラボの伊勢弁辞典84語の出典がどこの土地のものかを数えます。
        そのうえで、「おだっとる」と、伊勢弁に特徴的な文末の「に」を、変換ツールの実行結果と一緒に見ていきます。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "三重弁は「総称」で、伊勢弁はその一部" },
        { id: "s2", label: "進行・完了の言い方は、地域で違う" },
        { id: "s3", label: "辞典の伊勢弁84語は、どこの言葉か" },
        { id: "s4", label: "「おだっとる」が変換されない理由" },
        { id: "s5", label: "文末の「に」は、伊勢弁の目印" },
        { id: "s6", label: "変換ツールに入れると、どう変わるか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">三重弁は「総称」で、伊勢弁はその一部</H2>
      <P>
        Wikipedia「三重弁」は、三重弁を三重県で話されている日本語の方言の総称だと説明しています。
        そのほぼ全てが近畿方言（いわゆる関西弁）に属しますが、県全体で1つの方言圏をなすわけではなく、地域による差が大きいと書かれています。
      </P>
      <P>区画は大きく2つです。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>
          <strong>北三重方言</strong>：旧伊勢国の北・中部と、旧伊賀国を合わせた区画です。伊勢弁は、このうち北・中伊勢方言にあたります（Wikipedia「伊勢弁」）。
        </li>
        <li>
          <strong>南三重方言</strong>：志摩、伊勢南部、旧紀伊国（東紀州）を合わせた区画です。
        </li>
        <li>
          <strong>伊勢弁に含まれない地域</strong>：桑名市の旧長島町と木曽岬町は、揖斐川の東側にあたり、尾張弁圏と書かれているため、伊勢弁には含まれません。
        </li>
      </ul>
      <P>
        北三重と南三重の境は、伊勢市と鳥羽市の境から、伊勢市南部、度会郡中部を横切り、多気郡の南の境を通る線と考えられている、と書かれています（楳垣実の1962年の研究にもとづく記述）。
        そのため、南伊勢町は旧国では伊勢国ですが、志摩・南伊勢方言のほうに入ります。
      </P>
      <P>
        「三重弁」と「伊勢弁」の呼び名は混ざって使われますが、<strong>伊勢弁と書いてあるツールの言葉が、志摩や伊賀の言葉まで含むとは限りません。</strong>
        方言ラボの辞典も、伊勢弁として収録しています。
        この記事の範囲では、志摩弁や伊賀弁は別の方言として辞典に載っていません。
      </P>

      <H2 id="s2">進行・完了の言い方は、地域で違う</H2>
      <P>
        Wikipedia「三重弁」には、各方言の主な違いを示す表があります。
        その中から、動作の言い方にかかわる2行だけを取り出しました。
        「進行」は動作の最中（雨が降っている）、「完了」は動作の結果が残っている状態（雨が降ってある）を指します。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            進行・完了の言い方（Wikipedia「三重弁」の表より抜粋・2026年11月23日取得）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">方言区画</th>
              <th scope="col" className="py-2 pr-3 font-bold">進行</th>
              <th scope="col" className="py-2 font-bold">完了</th>
            </tr>
          </thead>
          <tbody>
            {ASPECT.map(([a, b, c]) => (
              <tr key={a} className="border-b border-line align-top">
                <td className="py-2 pr-3">{a}</td>
                <td className="py-2 pr-3">{b}</td>
                <td className="py-2">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        表から読めるのは、<strong>伊勢（北・中）は、進行も完了も「〜とる」で同じ形</strong>だということです。
        Wikipedia「三重弁」には、北三重では進行と完了の区別がなく、使う動詞によって意味が進行にも完了にもなる、という説明があります。
        一方、南三重は進行に「〜よる」、完了に「〜とる」と言い分けます。
      </P>
      <P>
        九州にも似た言い分けがあります。
        <Link href="/blog/nagasaki-reibun-bunmatsu" className={LINK}>長崎弁の例文103文を数えた記事</Link>
        でも、長崎では進行に「〜よる」、完了に「〜とる」を使うと書かれています。
        離れた土地で同じ形が並ぶのは、方言を読むときの面白いところです。
      </P>

      <H2 id="s3">辞典の伊勢弁84語は、どこの言葉か</H2>
      <P>
        方言ラボの辞典には、伊勢弁が84語載っています。
        そのうち、出典つきの照合台帳に載っているのは27語です（2026年11月23日の集計）。
        残る57語は、台帳に出典の記録がありません。
        27語の出典を数えると、次の内訳になりました。
      </P>

      <BarFig
        max={14}
        unit="語"
        ariaLabel="辞典の伊勢弁84語のうち、出典つきの台帳に載る27語の出典の内訳。Wikipedia伊勢弁10語、宇治山田市史13語、鈴鹿郡郷土誌3語、その他未確認1語"
        caption="図：出典照合ができた伊勢弁27語の、出典の内訳（2026年11月23日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 5 }))}
      />

      <P>
        <strong>13語は、旧宇治山田市（いまの伊勢市）の市史にある方言の章</strong>で確かめた語です。
        1929年に出た『宇治山田市史』下巻の方言の章に、五十音順の語彙表があります。
        たとえば「あんご」（ばか）、「せこ」（細い路地）、「じっき」（すぐに）が、この資料で確かめられています。
        3語は、鈴鹿郡の『鈴鹿郡郷土誌』（1915）です。
      </P>
      <P>
        つまり、辞典の語の出典は、伊勢市周辺（中伊勢）と、三重県北部の鈴鹿郡（北伊勢）の資料です。
        Wikipedia の区画でいう北・中伊勢にあたります。
        志摩や南伊勢、伊賀の資料は、この27語には入っていません。
        台帳に載っていない57語は、出典が確かめられていないため、この記事では地域を判断していません。
      </P>

      <H2 id="s4">「おだっとる」が変換されない理由</H2>
      <P>
        「おだっとる 方言」という検索があります。
        辞典には、伊勢弁として「おだつ」（ふざける、調子に乗る）があり、例文は「そんなにおだっとると転ぶに。」です。
        「おだっとる」は、この「おだつ」に「〜とる」が付いた形です。
      </P>
      <P>
        ここで、辞典の伊勢弁の例文84文を数えると、「〜とる」「〜とった」の形が出る文が15文ありました。
        「ささってなら空いとるに。」「遅くまでらんぱちやっとるわ。」などです。
        一方、「〜よる」や「〜てる」の形で進行を言う文は、84文のうち0でした。
        これは、先に見た表の「伊勢は〜とる」という説明と同じ向きです。
        ただし、辞典の例文は用例として載せた文で、伊勢の人の話し言葉の記録ではありません。
      </P>
      <P>
        変換ツールに入れると、「おだつ」は「ふざける」に直りますが、「おだっとる」はそのまま返ります。
        ツールは辞典の見出し語（「おだつ」）と同じ形の部分だけを置き換えるため、「おだっ」＋「とる」の形には当たりません。
        <strong>「おだっとる」を調べるときは、「おだつ」に直して入れ直すと、意味が出ます。</strong>
        調子に乗る話は、
        <Link href="/blog/chousi-ni-noru-hogen" className={LINK}>「調子に乗る」の方言を全国で並べた記事</Link>
        にもあります。
      </P>

      <H2 id="s5">文末の「に」は、伊勢弁の目印</H2>
      <P>
        伊勢弁には、文末の「に」という特徴的な助詞があります。
        Wikipedia「伊勢弁」は、動詞の勧誘形に付けたり（一緒に行こに＝行こうよ）、「よ」にあたる強調で使ったり（書かなあかんに＝書かなければいけないよ）する、と説明しています。
      </P>
      <P>
        辞典の例文84文のうち、文の終わりが「〜に」の文は16文ありました。
        「気にせんでもだんないに。」「展示品はいろたらあかんに。」「あさぶら履いて浜まで行こに。」などです。
        約2割にあたります。
        このほか、「〜んさ」で終わる文が4文、「〜やわ」で終わる文が3文あり、文末の形が1つに偏らず書かれています。
      </P>
      <P>
        文末の「に」だけを、変換ツールで直すことはできません。
        「展示品はいろたらあかんに。」を標準語に入れると、「あかんに」が「ダメだよ」に直る一方で、「いろた」（「いらう」＝触る、の活用形）は残ります。
        文末や活用は、辞典の見出し語と同じ形でないと置き換わらないためです。
      </P>

      <H2 id="s6">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/ise" className={LINK}>伊勢弁（三重弁）変換</Link>
        に入れました（2026年11月23日・ツールと同じ関数で実行）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた文と、変換ツールの出力（2026年11月23日・方言ラボ自社実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">向き</th>
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 font-bold">出力</th>
            </tr>
          </thead>
          <tbody>
            {TESTS.map(([d, i, o]) => (
              <tr key={d + i} className="border-b border-line align-top">
                <td className="py-2 pr-3">{d}</td>
                <td className="py-2 pr-3">{i}</td>
                <td className="py-2">{o}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        見出し語の形で入れた「おだつ」「いらう」は直ります。
        活用した形（「おだっとる」「いろた」）や、「転ぶに」のような単独の文末の「に」は直りません。
        標準語から伊勢弁へ入れた「調子に乗っている」も、辞典の見出し語と一致しないので、そのまま返りました。
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
        三重弁は県の方言の総称で、伊勢弁は北・中伊勢の方言です。
        進行・完了を言う形は、伊勢が「〜とる」、伊賀が「〜てる」、志摩・南伊勢が進行に「〜よる」と分かれます。
        「おだっとる」のような活用した形は、見出し語の形に直して入れ直すと意味が出ます。
      </P>
      <P>
        次にやることは、気になる語を「見出し語の形」（辞書形）にして、言葉一覧で引くことです。
      </P>
      <P>
        <Link href="/translate/ise" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 伊勢弁（三重弁）変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/ise" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 伊勢弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「三重弁」「伊勢弁」の本文を2026年11月23日に取得し、区画、進行相・完了相の表、文末助詞「に」の説明を読みました。変換ツールの出力と辞典の例文の集計は、同日の自社実行・自社集計です。
          </li>
          <li>
            確かめたこと：出典照合台帳（伊勢弁27語）の出典の内訳。『宇治山田市史』『鈴鹿郡郷土誌』の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：「おだつ」の出典（Wikipedia「伊勢弁」の俚言の節には独自研究の注意書きがあり、根拠にしていません）、辞典の伊勢弁57語の出典、現在の伊勢の人が使う形、志摩・伊賀の言葉の実際。
          </li>
        </ul>
        そのため、これらを「伊勢ではこう言う」「志摩ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「三重弁」概要・区画、各方言の主な違いの表、文法の節（出典は楳垣実1962ほか）2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/三重弁",
          },
          {
            label: "Wikipedia「伊勢弁」概要・文法の節（文末助詞「に」ほか）2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/伊勢弁",
          },
          {
            label: "宇治山田市編『宇治山田市史』下巻（1929）方言の章 国立国会図書館デジタルコレクション（方言ラボ出典照合台帳の記録）",
          },
          {
            label: "三重県鈴鹿郡教育会編『鈴鹿郡郷土誌』（1915）国立国会図書館デジタルコレクション（同上）",
            url: "https://lab.ndl.go.jp/dl/book/950885",
          },
          {
            label: "方言ラボ 伊勢弁変換ツールの実行結果（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/ise",
          },
        ]}
      />
    </ArticleShell>
  );
}
