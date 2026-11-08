import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources, WordCard } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("sanuki-okiru-makeru")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/sanuki-okiru-makeru" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/sanuki-okiru-makeru", type: "article" }),
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        「うどん2玉食べたら、お腹おきたわ」。
        これを標準語の感覚で読むと、食べ終わって目が覚めた話に見えます。
        でも香川の人が言っているのは<strong>「お腹がいっぱいになった」</strong>です。
      </P>
      <P>
        讃岐弁には、標準語と音がそっくりなのに意味が違う言葉があります。
        しかも、変換ツールに入れても置き換わらないことがある言葉です。
        この記事では、その代表の「おきる」と「まける」を、
        出典と、方言ラボの変換ツールで実際に試した結果を並べて読みます。
      </P>

      <H2>音は標準語と同じ、意味はちがう2語</H2>

      <WordCard
        word="おきる"
        dialect="讃岐弁"
        meaning="満腹になる（お腹がいっぱいになる）"
        example="うどん2玉食べたらお腹おきたわ。"
      >
        三省堂の方言コラム（第265回）が紹介する香川方言の語彙表に、
        「おなかがおきる＝満腹になる」と載っています。
        ウィキペディアの讃岐弁の項にも「腹が膨れる」という語釈と
        「腹おきてもう食えんわ」という用例があります。
        ここでは「起きる」とは別の意味で使われています。
      </WordCard>

      <WordCard
        word="まける"
        dialect="讃岐弁"
        meaning="（液体が）こぼれる"
        example="コップの水がまけるで、気をつけまい。"
      >
        同じ語彙表に「まける＝こぼれる」とあり、ウィキペディアにも
        「汁がまけよるが」という用例があります。
        標準語の「負ける」とは関係のない使い方なので、
        知らないと「水が負ける？」と一瞬つまずきます。
        器から今にもあふれそうな様子を「まけまけいっぱい」と言う、という記載もウィキペディアにあります。
      </WordCard>

      <Note title="この表の出どころ">
        語彙表は、香川県高松市の讃岐天ぷらの店が包装紙に印刷したものです。
        三省堂のコラムによると、店は従業員や祖父母に昔から使っている讃岐弁を挙げてもらい、
        「今も香川の人が普通に使っている言葉」を選んだとのことです。
        研究者が地点調査をした資料ではなく、店が選んだ語彙表だという点は、先に断っておきます。
      </Note>

      <H2>変換ツールに入れると、どうなるか</H2>

      <P>
        方言ラボの<Link href="/translate/sanuki" className="text-primary-text underline underline-offset-2">讃岐弁 変換</Link>
        で、この2語を実際に試しました（2026年11月1日に実行）。
        このツールは、辞典に載っている語の「見出しの形」と一致した部分だけを置き換えます。
        語尾や活用は変えません。結果を表にまとめます。
      </P>

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[520px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた文と、変換ツールの出力（2026年11月1日・方言ラボ自社実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">向き</th>
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 pr-3 font-bold">出力</th>
              <th scope="col" className="py-2 font-bold whitespace-nowrap">置き換え</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["標準語→讃岐弁", "満腹になる", "おきる", "あり"],
              ["標準語→讃岐弁", "満腹になった", "満腹になった", "なし"],
              ["標準語→讃岐弁", "コップの水がこぼれる", "コップの水がまける", "あり"],
              ["標準語→讃岐弁", "こぼれた", "こぼれた", "なし"],
              ["讃岐弁→標準語", "お腹がおきる", "お腹が満腹になる", "あり"],
              ["讃岐弁→標準語", "お腹がおきた", "お腹がおきた", "なし"],
              ["讃岐弁→標準語", "お茶がまけるで", "お茶がこぼれるで", "あり"],
              ["讃岐弁→標準語", "水がまけた／水がまけよる", "そのまま", "なし"],
            ].map(([dir, input, output, hit]) => (
              <tr key={dir + input} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{dir}</td>
                <td className="py-2 pr-3">{input}</td>
                <td className="py-2 pr-3">{output}</td>
                <td className="py-2 whitespace-nowrap">{hit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>活用した形が、置き換わらない理由</H2>
      <P>
        表のとおり、辞典の見出しと同じ形（「おきる」「まける」）なら置き換わり、
        「おきた」「まけた」「まけよる」のように活用した形は、いまは置き換わりません。
        冒頭の「お腹おきたわ」をそのまま入れても、標準語にはなりません。
      </P>
      <figure className="my-5">
        <div className="overflow-x-auto">
          <svg
            width="296"
            height="150"
            viewBox="0 0 296 150"
            role="img"
            aria-label="辞典の見出しの形は置き換わり、活用した形は置き換わらない。例：おきるは置き換わり、おきたは置き換わらない"
            style={{ display: "block", width: 296, height: "auto" }}
          >
            <rect x="1" y="1" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            <text x="12" y="26" fontSize="14" fontWeight="700" fill="currentColor">見出しの形</text>
            <text x="12" y="52" fontSize="16" fill="currentColor">おきる　→　満腹になる</text>
            <text x="190" y="26" fontSize="14" fill="currentColor">置き換わる</text>
            <rect x="1" y="85" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
            <text x="12" y="110" fontSize="14" fontWeight="700" fill="currentColor">活用した形</text>
            <text x="12" y="136" fontSize="16" fill="currentColor">おきた　→　おきた</text>
            <text x="190" y="110" fontSize="14" fill="currentColor">置き換わらない</text>
          </svg>
        </div>
        <figcaption className="text-sm text-sub mt-2 leading-[1.8]">
          図：辞典の見出しと同じ形だけが置き換わる（上の表の「おきる」「おきた」の場合）
        </figcaption>
      </figure>
      <P>
        変換結果が元の文とまったく同じ場合は、
        <strong>「訳すところがなかった」のではなく「活用した形で辞典に引っかからなかった」</strong>
        可能性があります。ここはツール側の弱いところです。
        見出しの形に直して入れ直すか、辞典の一覧で語を引けば、意味はたどれます。
      </P>

      <H2>出会ったときの読み方</H2>
      <P>標準語の意味で読んで文がおかしいときは、同じ音の別の語を疑うと、だいたい当たります。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>食事の話の中で「おきた」が出たら、満腹のことです。</li>
        <li>水やお茶、汁物の話で「まける」が出たら、こぼれることです。</li>
        <li>「まけまけいっぱい」は、器からあふれそうなほど入っている様子です（ウィキペディアの記載）。</li>
        <li>文が変換されずにそのまま返ってきたら、活用した形かもしれません。見出しの形に直して試します。</li>
      </ul>

      <H2>まとめ：次にやること</H2>
      <P>
        「おきる」は満腹、「まける」はこぼれる。
        どちらも標準語と同じ音で、変換ツールは見出しの形でしか置き換えません。
        まずは辞典の一覧で、気になった語を引いてみてください。
      </P>
      <P>
        <Link href="/translate/sanuki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 讃岐弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/sanuki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 讃岐弁検定（全8問・約1分）
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：「おきる＝満腹になる」「まける＝こぼれる」が、三省堂のコラムに添付された語彙表とウィキペディアの両方で同じ意味になっていること。
          </li>
          <li>
            確かめられていないこと：使われる年代と、香川県内のどのあたりで使うか。ウィキペディアの讃岐弁の項は、東讃（東部）と西讃（西部）で言い方に違いがあると書いており、同時に出典や独自研究についての注記が付いています。
          </li>
          <li>
            取得できなかった資料：国立国語研究所の方言談話データ（香川・徳島の巻）。2026年11月1日時点でリポジトリがメンテナンス中で、原音声の文字起こしには当たれていません。
          </li>
        </ul>
        そのため、この2語を「県内どこでも通じる」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label:
              "三省堂 ことばのコラム「地域語の経済と社会」第265回 大橋敦夫「包装紙で讃岐弁をアピール（香川県高松市）」（2013年8月3日）",
            url: "https://dictionary.sanseido-publ.co.jp/column/chiikigo265",
          },
          {
            label: "同コラムに添付の「香川方言語彙表」（PDF。おなかがおきる／まける ほか）",
            url: "https://dictionary.sanseido-publ.co.jp/wp-images/column_chiikigo/265_goi.pdf",
          },
          {
            label:
              "ウィキペディア「讃岐弁」（語釈と用例の参照。出典の明記・独自研究などの注記が付いた記事のため、上の語彙表と照らして使用）",
            url: "https://ja.wikipedia.org/wiki/%E8%AE%83%E5%B2%90%E5%BC%81",
          },
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月1日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/sanuki",
          },
        ]}
      />
    </ArticleShell>
  );
}
