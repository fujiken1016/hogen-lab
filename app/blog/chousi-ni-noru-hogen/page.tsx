import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("chousi-ni-noru-hogen")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/chousi-ni-noru-hogen" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/chousi-ni-noru-hogen", type: "article" }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 方言ラボ辞典（2026年11月11日時点）で、意味に「調子に乗る」「ふざける」「お調子者」を含む語
const ROWS: [string, string, string, string][] = [
  ["北海道弁", "おだつ", "ふざける・調子に乗る", "そんなにおだってたら転ぶよ。"],
  ["仙台弁", "おだつ", "ふざける、調子に乗る", "そんなにおだってると、けがすっぞ！"],
  ["仙台弁", "おだづもっこ", "お調子者", "あいづはクラス一のおだづもっこだ。"],
  ["伊勢弁", "おだつ", "ふざける、調子に乗る", "そんなにおだっとると転ぶに。"],
  ["静岡弁", "おだっくい", "お調子者", "あいつはほんとにおだっくいだで、すぐ調子に乗るよ。"],
  ["静岡弁", "ちょーける", "調子に乗ってふざける", "授業中にちょーけてると先生に怒られるに。"],
  ["京都弁", "いちびる", "調子に乗ってふざける", "そないイチビっとったら怒られますえ。"],
  ["大阪弁", "いちびる", "調子に乗ってふざける", "いちびっとったら、そのうち怪我するで。"],
  ["大阪弁", "いきる", "調子に乗る・粋がる", "新入りのくせにいきってたら嫌われるで。"],
  ["神戸弁", "いちびる", "調子に乗る、ふざける", "あんまりいちびっとったら先生に怒られるで。"],
  ["阿波弁", "あばさかる", "調子に乗ってはしゃぐ", "そんなにあばさかったら、こけるでよ。"],
  ["博多弁", "にやがる", "調子に乗る", "一回勝ったくらいでにやがんなよ。"],
  ["熊本弁", "のぼす", "調子に乗る", "あんまりのぼすと怪我するばい。"],
  ["長崎弁", "のぼせもん", "お調子者・熱中しやすい人", "うちの兄ちゃんは、祭りとなるとのぼせもんになっとよ。"],
];

// 「あいつは調子に乗る」を標準語から各方言へ変換した結果（2026年11月11日・自社実測）
const CONV: [string, string, string][] = [
  ["北海道弁・仙台弁・伊勢弁", "あいつはおだつ", "意味が通る"],
  ["神戸弁", "あいつはいちびる", "意味が通る"],
  ["大阪弁", "あいつはいきる", "意味が通る"],
  ["博多弁", "あいつはにやがる", "意味が通る"],
  ["熊本弁", "あいつはのぼす", "意味が通る"],
  ["津軽弁", "あいつはあんべに乗る", "意味が壊れる"],
  ["新潟弁", "あいつはあんべーに乗る", "意味が壊れる"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "伊勢弁の「おだっとる」はどういう意味ですか？",
    a: "方言ラボの辞典では、伊勢弁の「おだつ」は「ふざける、調子に乗る」です。「おだっとる」は「おだつ」に「とる」が付いた形で、調子に乗っている、という意味で読めます。辞典の用例は「そんなにおだっとると転ぶに。」です。",
  },
  {
    q: "「おだつ」は三重県だけの言葉ですか？",
    a: "いいえ。辞典には北海道弁・仙台弁・伊勢弁の3方言に「おだつ」が載っています。静岡弁には「おだっくい」（お調子者）もあります。三重県だけの言葉とは言えません。",
  },
  {
    q: "「いちびる」はどこの方言ですか？",
    a: "辞典では京都弁・大阪弁・神戸弁に載っています。出典の記録には、大辞泉が「関西で」調子に乗ってはしゃぎまわる、と説明していることが残っています。関西の言葉として見るのが無難です。",
  },
  {
    q: "標準語の「調子に乗る」を方言に変換するとどうなりますか？",
    a: "2026年11月11日の実測では、35方言のうち9方言で置き換わりました。そのうち7方言は意味が通る形で、津軽弁と新潟弁は「調子」だけが「あんべ」に置き換わり、意味が壊れました。",
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
        <strong>
          「調子に乗る」にあたる方言は、辞典に載っている範囲で、東北から九州まで少なくとも10語あります。
        </strong>
        東北・北海道と伊勢は「おだつ」、関西は「いちびる」、熊本は「のぼす」です。
      </P>
      <P>
        「おだっとる 方言」「おだっとる 三重」と検索する人がいるので、伊勢弁の「おだつ」を入り口にして、
        方言ラボの辞典3,368語から「調子に乗る」の仲間を拾い出しました（2026年11月11日・自社集計）。
        変換ツールにも通して、意味が通る方言と通らない方言を確かめています。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "「調子に乗る」の方言は、辞典にいくつある？" },
        { id: "s2", label: "「おだつ」はどこで使われる？" },
        { id: "s3", label: "「いちびる」「いきる」は関西のどこ？" },
        { id: "s4", label: "九州では「のぼす」「にやがる」「のぼせもん」" },
        { id: "s5", label: "変換ツールに「調子に乗る」を入れると？" },
        { id: "s6", label: "出会ったときの読み方" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ：次にやること" },
      ]} />

      <H2 id="s1">「調子に乗る」の方言は、辞典にいくつある？</H2>
      <P>
        辞典の意味欄に「調子に乗る」「ふざける」「お調子者」のいずれかを含む語を数えました。
        下の表の14件で、語の種類は10語、方言は11です。
        「ふざける」だけの語は、調子に乗る意味とは限らないので、表には入れていません。
      </P>

      <BarFig
        max={5}
        unit="件"
        ariaLabel="辞典の「調子に乗る」にあたる14件を語の系統で分けた棒グラフ。おだつ系5件、いちびる3件、そのほか6語が各1件"
        caption="図：下の表14件を、語の系統で分けたもの。そのほか6語は、いきる・ちょーける・あばさかる・にやがる・のぼす・のぼせもん（方言ラボ辞典・2026年11月11日時点）"
        items={[
          { label: "おだつ系（おだつ3ほか）", value: 5 },
          { label: "いちびる（京阪神）", value: 3 },
          { label: "そのほか6語（各1件）", value: 1, dim: true },
        ]}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[560px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「調子に乗る」にあたる辞典の語（方言ラボ辞典・2026年11月11日時点）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">方言</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">語</th>
              <th scope="col" className="py-2 pr-3 font-bold">辞典の意味</th>
              <th scope="col" className="py-2 font-bold">辞典の用例</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([d, w, m, ex]) => (
              <tr key={d + w} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{d}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{w}</td>
                <td className="py-2 pr-3 min-w-[9em]">{m}</td>
                <td className="py-2 min-w-[14em]">{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="s2">「おだつ」はどこで使われる？</H2>
      <P>
        辞典で「おだつ」が載っているのは、北海道弁・仙台弁・伊勢弁の3方言です。
        用例はどれも「そんなにおだっとると転ぶに」の型で、調子に乗ると痛い目にあう、という注意として使われています。
      </P>
      <P>
        静岡弁の「おだっくい」と仙台弁の「おだづもっこ」は、どちらも「お調子者」です。
        同じ「おだ」で始まる語が、東北・東海・三重に並んでいます。
        ただし、同じ起源かどうかは、この記事では確かめていません。
      </P>
      <P>
        伊勢弁の「おだつ」は、三重県だけの言葉ではありません。
        「三重弁」と調べて出てきた語が、実は北海道や仙台でも載っている、ということです。
      </P>

      <H2 id="s3">「いちびる」「いきる」は関西のどこ？</H2>
      <P>
        「いちびる」は京都弁・大阪弁・神戸弁の3方言に載っています。
        出典の記録には、大辞泉が「関西で」調子に乗ってはしゃぎまわる、と説明していることがあります。
        意味は「調子に乗ってふざける」で、「おだつ」より「はしゃぐ」の色が強い語です。
      </P>
      <P>
        「いきる」は、大阪弁では「調子に乗る・粋がる」です。
        ところが辞典には、飛騨弁と広島弁に「いきる＝蒸し暑い」も載っています。
        広島の資料では「いきる」が「騒ぐ」の意味で出ており、「蒸し暑い」は見つかりませんでした。
        そのため、この意味の「いきる」は出典で確かめられていません。
      </P>

      <H2 id="s4">九州では「のぼす」「にやがる」「のぼせもん」</H2>
      <P>
        熊本弁の「のぼす」は「調子に乗る」です。
        出典の記録には、熊本の方言集に「調子に乗る」の意味で（下二段の形で）載っていることが残っています。
        博多弁の「にやがる」も「調子に乗る」で、用例は「一回勝ったくらいでにやがんなよ」です。
      </P>
      <P>
        博多弁と長崎弁には、名詞の「のぼせもん」もあります。
        長崎弁では「お調子者・熱中しやすい人」、博多弁では「祭り好き、何かに熱中する人」です。
        どちらの用例も、祭りに夢中になる人を指しています。悪口だけでなく、熱心な人というほめ言葉にも寄る語です。
      </P>

      <H2 id="s5">変換ツールに「調子に乗る」を入れると？</H2>
      <P>
        「あいつは調子に乗る」を、標準語から35方言へ変換しました。
        置き換わったのは9方言で、7方言は意味が通りました。
      </P>

      <BarFig
        max={26}
        unit="方言"
        ariaLabel="「あいつは調子に乗る」を35方言へ変換した結果。意味が通ったのは7方言、意味が壊れたのは2方言、置き換わらなかったのは26方言"
        caption="図：「あいつは調子に乗る」の変換結果の内訳（35方言・2026年11月11日・自社実測）"
        items={[
          { label: "意味が通る形に置き換わった", value: 7 },
          { label: "意味が壊れた（津軽・新潟）", value: 2 },
          { label: "置き換わらなかった", value: 26, dim: true },
        ]}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[480px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「あいつは調子に乗る」の変換結果（2026年11月11日・方言ラボ自社実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">方言</th>
              <th scope="col" className="py-2 pr-3 font-bold">出力</th>
              <th scope="col" className="py-2 font-bold whitespace-nowrap">読み</th>
            </tr>
          </thead>
          <tbody>
            {CONV.map(([d, out, r]) => (
              <tr key={d} className="border-b border-line align-top">
                <td className="py-2 pr-3 min-w-[8em]">{d}</td>
                <td className="py-2 pr-3 min-w-[12em]">{out}</td>
                <td className="py-2 whitespace-nowrap">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        津軽弁と新潟弁では、「調子に乗る」の「調子」だけが、辞典の「あんべ（具合・調子）」に置き換わりました。
        「あんべ」は体の具合の意味なので、出力は「あいつはあんべに乗る」となり、意味が通りません。
        出力を読んで変だと思ったら、置き換え先の意味を、結果欄の辞典の意味で確かめてください。
      </P>
      <P>
        逆向きの変換にも弱いところがあります。
        伊勢弁の「そんなにおだっとると転ぶに」は、そのまま返ります。
        「おだっとる」が辞典の見出し「おだつ」と一致しないためです。
        「そんなにおだつと転ぶに」と入れると、「そんなにふざけると転ぶに」になります。
      </P>

      <H2 id="s6">出会ったときの読み方</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>「おだつ」「おだっくい」は、東北・北海道・東海・三重の「ふざける・調子に乗る」。</li>
        <li>「いちびる」は、関西の「調子に乗ってふざける」。</li>
        <li>「のぼす」「にやがる」は、九州の「調子に乗る」。</li>
        <li>活用した形（おだっとる）は、変換ツールに入れる前に「おだつ」へ戻す。</li>
      </ul>

      <H2 id="s7">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-5">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <p className="text-base leading-[1.95]">{f.a}</p>
        </div>
      ))}

      <H2 id="s8">まとめ：次にやること</H2>
      <P>
        「調子に乗る」の方言は、東北・北海道と伊勢の「おだつ」、関西の「いちびる」、九州の「のぼす」「にやがる」などに分かれます。
        変換ツールに入れるときは、活用を戻して辞典の形で入れると、置き換わりやすくなります。
      </P>
      <P>
        <Link href="/translate/ise" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 三重弁（伊勢弁）変換と、言葉一覧
        </Link>
      </P>
      <P>
        <Link href="/translate/kumamoto" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 熊本弁変換と、言葉一覧
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：辞典に載っている語の数と意味、変換ツールの出力（2026年11月11日・自社実測）。
            熊本弁の「のぼす」と関西の「いちびる」は、出典の記録があります。
          </li>
          <li>確かめられていないこと：北海道弁・仙台弁・伊勢弁の「おだつ」の出典の照合。辞典の収録として書いています。</li>
          <li>確かめられていないこと：飛騨弁・広島弁の「いきる＝蒸し暑い」。出典で見つかっていません。</li>
        </ul>
        そのため、表の語を「その地域の人が必ず使う言い方」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "方言ラボ 辞典（35方言3,368語・意味欄に「調子に乗る」「ふざける」「お調子者」を含む語を自社集計・2026年11月11日時点）",
            url: "https://hogen.mainichi-lab.com/dict",
          },
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月11日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/ise",
          },
          {
            label: "方言ラボ 辞典の出典照合台帳（社内記録。のぼす・いちびる・いきるの項）",
          },
        ]}
      />
    </ArticleShell>
  );
}
