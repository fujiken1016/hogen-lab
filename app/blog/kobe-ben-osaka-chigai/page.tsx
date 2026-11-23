import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("kobe-ben-osaka-chigai")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/kobe-ben-osaka-chigai" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/kobe-ben-osaka-chigai", type: "article", image: { path: "/og/blog-kobe-ben-osaka-chigai.jpg", alt: "神戸弁と大阪弁の違い" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// Wikipedia「神戸弁」の「特徴」の節から、神戸と大阪の語法の差を3点に絞ったもの（2026年11月23日取得）
const DIFF: [string, string, string][] = [
  ["「居る」", "オルを多用する", "イル・イテルを多用する（地区によってはオルも使う）"],
  ["進行と完了", "進行はヨル／ヨー、完了（結果）はトル／トーと言い分ける", "進行も完了も、テルまたはトルを使う"],
  ["尊敬の言い方", "テヤ敬語（「おってですか」＝いらっしゃいますか）。ハルではなくナハルを併用", "ハル敬語（「行きはる」）"],
];

// 辞典の例文の語尾を数えた結果（2026年11月23日・自社集計。神戸弁94文・大阪弁96文）
const COUNT: [string, string, string][] = [
  ["〜とう・〜とん・〜とった・〜とら（トル・トー系）", "18文", "4文"],
  ["〜てる・〜てた（テル系）", "0文", "6文"],
  ["〜てはる（ハル敬語）", "0文", "1文"],
  ["〜よう・〜よる（ヨル・ヨー系）", "1文", "2文"],
  ["居る：おる・おった", "1文", "0文"],
];

// 出典を確認できた神戸弁27語の出典（出典照合台帳・2026年11月23日の自社集計）
const SRC: [string, number][] = [
  ["Wikipedia「播州弁」", 10],
  ["『広島県方言の研究』（1933）", 9],
  ["国語辞典（大辞泉・日本国語大辞典）", 4],
  ["Wikipedia「神戸弁」", 2],
  ["Wikipedia「近畿方言」・和歌山県の公式資料", 2],
];

// Wikipedia「神戸弁」の語彙・俚言の節で、辞典に載っていなかった語
const MISSING: [string, string][] = [
  ["アモ", "餅"],
  ["オマワリ", "副食物"],
  ["コットリ", "落とし栓"],
  ["ナガタン", "包丁"],
  ["肉天", "お好み焼きの旧称"],
  ["日番（にちばん）", "学校の日直"],
  ["ピラミッドケーキ", "バウムクーヘンの旧称"],
  ["フンマイ", "踏み台"],
  ["マヒゲ", "眉毛"],
  ["メグ", "壊す"],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
const TESTS: [string, string, string][] = [
  ["神戸弁→標準語", "あの店の場所、知っとう？", "あの店の場所、知っとう？（変わらない）"],
  ["神戸弁→標準語", "外、雨降りようで。はよ帰ろ。", "外、雨降りようで。はよ帰ろ。（変わらない）"],
  ["神戸弁→標準語", "台風来とうから、たぶん電車止まっとうで。", "台風来とうから、たぶん電車止まっとうで。（変わらない）"],
  ["神戸弁→標準語", "帰りにサンライズ買うて帰るわ。", "帰りにメロンパン買うて帰るわ。"],
  ["神戸弁→標準語", "荒ゴミの日は月に一回やで。", "燃えないゴミの日は月に一回やで。"],
  ["神戸弁→標準語", "かけっこでどべになってしもた。", "かけっこで最下位になってしもた。"],
  ["標準語→神戸弁", "メロンパンを買って帰る", "サンライズを買っていぬ"],
  ["標準語→神戸弁", "雨が降っているから早く帰ろう。", "雨が降っているから早く帰ろう。（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "神戸弁と大阪弁は、どこが一番違いますか？",
    a: "Wikipedia「神戸弁」は、進行と完了の言い分けを大きな違いに挙げています。神戸は進行を「ヨル」、完了を「トル」と分け、大阪は進行も完了も「テル」または「トル」を使う、という説明です。方言ラボの例文の数え方でも、神戸の「トル・トー系」は18文、大阪は4文で、向きは同じでした。",
  },
  {
    q: "「〜とう」は神戸だけの言い方ですか？",
    a: "神戸だけとは言い切れません。Wikipedia「神戸弁」は、進行と完了の区別を播磨方言および他の西日本の方言と共通の特徴だと書いています。大阪弁の例文にも「〜とる」は4文ありました。",
  },
  {
    q: "変換ツールで「知っとう」が直らないのはなぜですか？",
    a: "辞典には見出し語として「〜しとう」が載っていますが、「知っとう」のように動詞に付いた活用の形は、見出し語の形と同じではないため置き換わりません。この記事の表にあるとおり、「〜しとう」は変換結果が変わらない語尾の代表です。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>神戸弁と大阪弁を分ける代表的な違いは、動作の「最中」と「済んだ結果」を言い分けるかどうかです。神戸は進行を「〜よう」、完了を「〜とう」と分け、大阪は進行も完了も「〜てる」か「〜とる」で言います。</strong>
        方言ラボの辞典の例文を数えると、神戸弁は「〜とう・〜とん」などのトル系が94文中18文、大阪弁は96文中4文でした。
      </P>
      <P>
        この記事では、Wikipedia「神戸弁」が挙げる大阪弁との3つの違いを表にしたうえで、辞典の神戸弁94文と大阪弁96文の語尾を数えます。
        あわせて、神戸弁の語の出典がどこの資料なのか、Wikipedia の語彙のうち辞典に載っていない語、変換ツールが直せない語尾も、実行結果で確かめました。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "神戸弁と大阪弁の違いは3点" },
        { id: "s2", label: "「〜よう」と「〜とう」の言い分け" },
        { id: "s3", label: "辞典の例文を数えると" },
        { id: "s4", label: "辞典の神戸弁は、どこの言葉か" },
        { id: "s5", label: "Wikipedia の語彙で、辞典にない語" },
        { id: "s6", label: "変換ツールに入れると、どう変わるか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">神戸弁と大阪弁の違いは3点</H2>
      <P>
        Wikipedia「神戸弁」は、神戸弁を兵庫県南東部の神戸市周辺で使われる近畿方言の一つで、播磨方言に属すると説明しています。
        そのうえで、「神戸と大阪の語法の差異」として3つの重点を挙げています。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            神戸弁と大阪弁の語法の違い（Wikipedia「神戸弁」の「特徴」より・2026年11月23日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">項目</th>
              <th scope="col" className="py-2 pr-3 font-bold">神戸</th>
              <th scope="col" className="py-2 font-bold">大阪</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {DIFF.map(([a, b, c]) => (
              <tr key={a} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="項目" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="神戸" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="大阪" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        大阪弁の側の特徴は、
        <Link href="/translate/kansai" className={LINK}>大阪弁（関西弁）変換</Link>
        の言葉一覧でも確かめられます。
        京都のハル敬語との違いは、
        <Link href="/blog/kyoto-kotoba-dosu-haru" className={LINK}>京言葉の「どす」「はる」を例文で数えた記事</Link>
        にまとめました。
      </P>

      <H2 id="s2">「〜よう」と「〜とう」の言い分け</H2>
      <P>
        Wikipedia「神戸弁」は、動作の進み方を、動詞の連用形に「ヨー（ヨル）」を付ける進行と、「トー（トル）」を付ける完了（継続・結果）に分けて説明しています。
        進行は完了した後の状態を示さず、完了は動作の最中を示さない、という区別です。
        同じ記事の文例を並べます。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>
          <strong>蝉が死によう。</strong>＝蝉が死にかけている（進行）
        </li>
        <li>
          <strong>蝉が死んどう。</strong>＝蝉がすでに死んでいる（完了）
        </li>
        <li>
          <strong>台風来ようから、たぶん電車止まりようで。</strong>＝台風が来ているところだから、電車はもうすぐ止まるだろう（進行）
        </li>
        <li>
          <strong>台風来とうから、たぶん電車止まっとうで。</strong>＝すでに台風が来ているから、電車はもう止まっているだろう（完了）
        </li>
      </ul>
      <P>
        標準語の「〜ている」は、この2つを1つの形で言います。
        神戸弁を標準語にしたつもりで「〜ている」と書くと、進行か完了かの区別が消えます。
        同じ区別は、西日本の他の地域にも見られます。
        <Link href="/blog/nagasaki-reibun-bunmatsu" className={LINK}>長崎弁の例文103文を数えた記事</Link>
        では「〜よる」と「〜とる」の区別を、
        <Link href="/blog/mie-ise-ben-chigai" className={LINK}>三重弁と伊勢弁の記事</Link>
        では、伊勢が進行も完了も「〜とる」で言うことを書きました。
      </P>

      <H2 id="s3">辞典の例文を数えると</H2>
      <P>
        方言ラボの辞典には、神戸弁が94語、大阪弁が96語載っていて、それぞれの語に例文が1文ずつ付いています。
        その語尾を、トル系・テル系・ヨル系に分けて数えました（2026年11月23日の自社集計）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            辞典の例文の語尾（神戸弁94文・大阪弁96文）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">語尾の形</th>
              <th scope="col" className="py-2 pr-3 font-bold">神戸弁</th>
              <th scope="col" className="py-2 font-bold">大阪弁</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {COUNT.map(([a, b, c]) => (
              <tr key={a} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="語尾の形" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="神戸弁" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="大阪弁" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        <strong>神戸弁はトル系が18文、テル系は0文</strong>でした。
        18文の内訳は、「〜とう」が5文、「〜とん」が4文、「〜とった」が6文、「〜とってん」が1文、「〜とら（ん）」が2文です。
        例は「ボタンがぐいちになっとうで。」「こんな時間まで何しとん？」「授業中にちょけとったら先生に怒られるで。」です。
      </P>
      <P>
        反対に<strong>大阪弁はテル系が6文、トル系が4文</strong>で、向きが逆になりました。
        「ややこが寝てるさかい、静かにしいや。」「あいついきってるから鼻へし折ったろか。」はテル系、
        「いちびっとったら、そのうち怪我するで。」はトル系です。
        Wikipedia の「大阪は進行・完了ともにテルまたはトル」という説明と同じ向きです。
      </P>
      <P>
        一方で、進行を表す「〜よう」は神戸弁で1文（「外、雨降りようで。はよ帰ろ。」）しかなく、大阪弁にも「〜しよる」が2文ありました。
        <strong>進行のヨル系は、神戸弁でも大阪弁でも例文にほとんど出ません。</strong>
      </P>
      <P>
        辞典の例文は用例として載せた文で、神戸の人の話し言葉を集めた記録ではありません。
        数は、辞典を書いた人の文の癖も含みます。
        ここから言えるのは、「神戸弁の例文は完了のトル系に寄り、大阪弁の例文はテル系に寄っている」というところまでです。
      </P>

      <H2 id="s4">辞典の神戸弁は、どこの言葉か</H2>
      <P>
        辞典の神戸弁94語のうち、出典つきの照合台帳に載っているのは33語です（2026年11月23日の集計）。
        そのうち、出典で語と語釈を確認できたのは27語で、残る6語は出典に届いていません。
        27語の出典を数えると、次の内訳でした。
      </P>

      <BarFig
        max={10}
        unit="語"
        ariaLabel="出典を確認できた神戸弁27語の出典の内訳。Wikipedia播州弁10語、広島県方言の研究9語、国語辞典4語、Wikipedia神戸弁2語、Wikipedia近畿方言と和歌山県の資料2語"
        caption="図：出典を確認できた神戸弁27語の出典の内訳（2026年11月23日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 5 }))}
      />

      <P>
        読み取れることが2つあります。
        1つは、<strong>「神戸弁」と題した資料で確認できた語は2語だけ</strong>だということです。
        もう1つは、多くの語が播磨（兵庫県南西部）や広島県の資料で確認されていて、「神戸だけの言葉」ではない語が多いことです。
        Wikipedia「神戸弁」自体が、神戸弁を播磨方言に属すると書いているので、播州弁の資料を使うことは筋が通っています。
      </P>
      <P>
        辞典の中で見ても、神戸弁94語のうち50語は、他の方言にも同じ見出し語があります（表記のひらがな・カタカナの違いは同じ語として数えました）。
      </P>
      <P>
        「ほかす」（京都弁・大阪弁・伊予弁にも載っています）や「いらう」（伊勢弁・京都弁・広島弁・阿波弁にも載っています）のような語は、神戸弁として載っていても、神戸だけの言葉ではありません。
        <strong>神戸らしさは、語彙よりも、先に見た語尾の使い分けのほうに出やすい</strong>と読めます。
      </P>

      <H2 id="s5">Wikipedia の語彙で、辞典にない語</H2>
      <P>
        Wikipedia「神戸弁」の「語彙・俚言」の節には、22語が挙がっています。
        そのうち、辞典に載っていたのは12語でした。
        「アトサシ」「荒ゴミ」「エンバ」「サンライズ（メロンパン）」「そば焼き」「たなもと（台所）」「ダボ」「どべ」「バラケツ」「ポンヤ」「めげる」「うらおもて」です。
        載っていなかった10語は、次のとおりです。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            Wikipedia「神戸弁」の語彙・俚言のうち、方言ラボの辞典に載っていない10語（意味は Wikipedia の記述）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">語</th>
              <th scope="col" className="py-2 font-bold">意味</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {MISSING.map(([a, b]) => (
              <tr key={a} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="語" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="意味" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        この10語は、変換ツールに入れても変わりません。
        Wikipedia の語彙節には出典の注記がなく、各語の一次資料は、この記事では確認できていません。
        そのため、辞典に足すかどうかは、出典を確かめてから決めます。
      </P>

      <H2 id="s6">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/kobe" className={LINK}>神戸弁変換</Link>
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
        語は直ります。
        「サンライズ」は「メロンパン」に、「荒ゴミ」は「燃えないゴミ」に、「どべ」は「最下位」になりました。
        標準語から神戸弁へ入れた「メロンパン」も「サンライズ」に変わります。
        一方で、<strong>この記事の中心にある「〜とう」「〜よう」は、神戸弁から標準語へ入れても直りません。</strong>
        辞典には「〜しとう」「〜よう」が見出し語として載っていますが、動詞に付いた形（「知っとう」「降りよう」）は、見出し語と同じ形ではないため置き換わらないためです。
        標準語の「雨が降っている」も、神戸弁の「降りよる」にはなりません。
        この限界は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にまとめています。
      </P>
      <P>
        もう1点、標準語の「帰る」は神戸弁の「いぬ」に変わりました。
        辞典の語釈どおりですが、「いぬ」は辞典の大阪弁・岡山弁・讃岐弁・阿波弁にも載っていて、神戸だけの言葉ではありません。
        関西の他の地域との比べ方は、
        <Link href="/blog/tohoku-kansai-hakata" className={LINK}>東北弁・関西弁・博多弁を比べた記事</Link>
        にも書いています。
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
        神戸弁と大阪弁の違いは、居る（オル／イル）・進行と完了（ヨル・トル／テル・トル）・尊敬の言い方（テヤ／ハル）の3点です。
        辞典の例文では、神戸弁はトル系18文・テル系0文、大阪弁はトル系4文・テル系6文でした。
        「〜とう」「〜よう」は変換ツールでは直らないので、文の意味は、動詞の形を見て自分で読み取る必要があります。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾も一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/kobe" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 神戸弁変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/kobe" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 神戸弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「神戸弁」の本文を2026年11月23日に取得し、神戸と大阪の語法の差、進行態と完了態の文例、語彙・俚言の節の22語を読みました。例文の語尾の集計と変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（神戸弁33語）の出典の内訳。『広島県方言の研究』（1933）や国語辞典の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：Wikipedia の語彙・俚言の節の各語の一次出典、現在の神戸の人が使う形、辞典の神戸弁の残り61語の出典。大阪弁についての数え方は、辞典の例文の範囲です。
          </li>
        </ul>
        そのため、これらを「神戸ではこう言う」「大阪ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「神戸弁」概要、特徴（大阪との語法の差・進行態と完了態・敬語体系）、語彙・俚言の節 2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/神戸弁",
          },
          {
            label: "Wikipedia「播州弁」（出典照合台帳に記録された照合結果）",
            url: "https://ja.wikipedia.org/wiki/播州弁",
          },
          {
            label: "村岡淺夫編『廣島縣方言の研究』（1933）国立国会図書館デジタルコレクション（同台帳の記録）",
          },
          {
            label: "方言ラボ 神戸弁変換ツールの実行結果・辞典の例文の集計（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/kobe",
          },
        ]}
      />
    </ArticleShell>
  );
}
