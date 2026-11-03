import type { Metadata } from "next";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources, WordCard } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("shizuoka-imani-oeru")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/shizuoka-imani-oeru" },
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        「いまに雨が降ってくるに」「お隣でお茶によばれてきた」。
        静岡の人が言うこうした言葉は、標準語と同じ音なのに、読み方を一歩まちがえると意味がずれます。
      </P>
      <P>
        この記事では、静岡の方言を集めた古い辞典（1910年）に載っている
        <strong>「いまに」「おえる」「さばく」「よばれる」</strong>を取り上げます。
        あわせて、方言ラボの変換ツールに入れたときに、置き換わる文と置き換わらない文を実際に試した結果を並べます。
      </P>

      <H2>音は同じ（または近い）のに、意味がちがう4語</H2>

      <WordCard
        word="いまに"
        dialect="静岡弁"
        meaning="すぐに、まもなく（「ぢきに」）"
        example="いまに雨が降ってくるに。"
      >
        標準語の「今に」は「今に見ていろ」のように、先のことを予告するときに使います。
        1910年の『静岡県方言辞典』の口語法の章には、「いまに」を「ぢきに」の意味とする欄があり、
        「今ニ来ル」「今ニ行キマス」「今ニ雨ガ降ッテクル」という例が並んでいます。
        さらに、同じ「いまに」の見出しに「いんまに」「いまだに」の形を添えた別の欄もあり、
        ここには「まだ来ませんか」にあたる例が載っているように読めます。
        つまり「いまに」には、「すぐに」と「まだ」の両方に近い使い方が記録されています。
      </WordCard>

      <WordCard
        word="おえる"
        dialect="静岡弁"
        meaning="終わる／壊れる"
        example="仕事もうおえたっけ？"
      >
        同じ辞典の「おえる」には2つの語釈があります。
        ひとつは「終る」で、用例は「本日で仕事はおえる」。
        もうひとつは「毀損す」、つまり壊れること。
        標準語の「終える」と同じ感覚で読むと、後者の意味を取りこぼします。
      </WordCard>

      <WordCard
        word="さばく"
        dialect="静岡弁"
        meaning="裂く（破る）"
        example="紙をさばいて捨てちゃった。"
      >
        辞典には「さばく＝裂く」とあり、用例は「紙をさばく」です。
        標準語の「さばく」は魚をさばく、人の流れをさばくなどの使い方なので、
        紙を前にして「さばく」と言われると、一瞬なんのことか分かりません。
      </WordCard>

      <WordCard
        word="よばれる"
        dialect="静岡弁"
        meaning="ごちそうになる"
        example="お隣でお茶によばれてきたよ。"
      >
        辞典には「よばれる＝馳走を受く」とあります。
        「呼ばれる」ではなく「ごちそうになる」の意味です。
      </WordCard>

      <Note title="この辞典について">
        『静岡県方言辞典』は、静岡県師範学校と静岡県女子師範学校が共同で編み、1910年（明治43年）に吉見書店から出た本です。
        国立国会図書館のデジタルコレクションで全文を調べました。
        100年以上前の記録なので、いま静岡で同じ意味で使われているかどうかは、この辞典だけでは分かりません。
      </Note>

      <H2>変換ツールに入れると、どうなるか</H2>

      <P>
        方言ラボの<Link href="/translate/shizuoka" className="text-primary-text underline underline-offset-2">静岡弁 変換</Link>
        で、上の語を使った文を試しました（2026年11月4日に実行）。
        このツールは、辞典に載っている語の「見出しの形」と一致した部分だけを置き換えます。
      </P>

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[520px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた文と、変換ツールの出力（2026年11月4日・方言ラボ自社実測）
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
              ["静岡弁→標準語", "仕事おえる", "仕事終わらせる", "あり"],
              ["静岡弁→標準語", "仕事おえたっけ", "仕事おえたっけ", "なし"],
              ["静岡弁→標準語", "紙をさばく", "紙を破る", "あり"],
              ["静岡弁→標準語", "紙をさばいて捨てた", "紙をさばいて捨てた", "なし"],
              ["静岡弁→標準語", "お隣でお茶によばれる", "お隣でお茶にご馳走になる", "あり"],
              ["静岡弁→標準語", "お隣でお茶によばれてきた", "お隣でお茶によばれてきた", "なし"],
              ["静岡弁→標準語", "いまに雨が降ってくる", "いまに雨が降ってくる", "なし"],
              ["標準語→静岡弁", "ご馳走になる", "よばれる", "あり"],
            ].map(([dir, input, output, hit]) => (
              <tr key={dir + input} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{dir}</td>
                <td className="py-2 pr-3 min-w-[16em]">{input}</td>
                <td className="py-2 pr-3 min-w-[16em]">{output}</td>
                <td className="py-2 whitespace-nowrap">{hit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>表から分かる、ツールの弱いところ</H2>
      <P>
        <strong>活用した形は置き換わりません。</strong>
        「おえる」は置き換わるのに「おえたっけ」は置き換わらず、「よばれる」は置き換わるのに「よばれてきた」は置き換わりません。
        「さばいて」も同じです。
      </P>
      <P>
        <strong>「いまに」は、辞典に載っていないので変換されません。</strong>
        「静岡弁 いまに」と検索する人がいますが、いまのツールはこの語に答えられません。
        この記事で書いた意味は、1910年の辞典の記録によるもので、ツールの出力ではありません。
      </P>
      <P>
        <strong>語釈が少しずれることがあります。</strong>
        「さばく」はツールが「破る」と出しますが、1910年の辞典の語釈は「裂く」です。
        同じ辞典には「さぶる＝破る」という別の項目もあるので、「破る」と「裂く」は辞典の中でも書き分けられています。
      </P>

      <figure className="my-5">
        <div className="overflow-x-auto">
          <svg
            width="296"
            height="150"
            viewBox="0 0 296 150"
            role="img"
            aria-label="辞典の見出しの形は置き換わり、活用した形は置き換わらない。例：よばれるは置き換わり、よばれてきたは置き換わらない"
            style={{ display: "block", width: 296, height: "auto" }}
          >
            <rect x="1" y="1" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            <text x="12" y="26" fontSize="14" fontWeight="700" fill="currentColor">見出しの形</text>
            <text x="12" y="52" fontSize="16" fill="currentColor">よばれる　→　ご馳走になる</text>
            <text x="190" y="26" fontSize="14" fill="currentColor">置き換わる</text>
            <rect x="1" y="85" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
            <text x="12" y="110" fontSize="14" fontWeight="700" fill="currentColor">活用した形</text>
            <text x="12" y="136" fontSize="16" fill="currentColor">よばれてきた　→　よばれてきた</text>
            <text x="190" y="110" fontSize="14" fill="currentColor">置き換わらない</text>
          </svg>
        </div>
        <figcaption className="text-sm text-sub mt-2 leading-[1.8]">
          図：辞典の見出しと同じ形だけが置き換わる（上の表の「よばれる」「よばれてきた」の場合）
        </figcaption>
      </figure>

      <H2>出会ったときの読み方</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>「いまに」の後ろが先の出来事なら、「すぐに」「まもなく」と読んでみます。</li>
        <li>食べ物や飲み物のあとに「よばれた」が出たら、ごちそうになったことです。</li>
        <li>紙や布のあとに「さばく」が出たら、裂く・破ることです。</li>
        <li>物や機械のあとに「おえた」が出たら、終わったのか壊れたのか、前後の文で決めます。</li>
        <li>変換結果が元の文のままなら、活用した形かもしれません。見出しの形に直して入れ直します。</li>
      </ul>

      <H2>まとめ：次にやること</H2>
      <P>
        「よばれる」はごちそうになる、「さばく」は裂く、「おえる」は終わる・壊れる、「いまに」はすぐに。
        標準語の感覚だけで読まず、意味が合わないときは同じ音の別の語を疑うと、だいたい当たります。
        気になった語は、辞典の一覧で引いてみてください。
      </P>
      <P>
        <Link href="/translate/shizuoka" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 静岡弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/shizuoka" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 静岡弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：1910年の『静岡県方言辞典』に、「おえる（終る・毀損す）」「さばく（裂く）」「よばれる（馳走を受く）」の語釈があること。口語法の章に「いまに（ぢきに）」の例文があること。
          </li>
          <li>
            確かめられていないこと：「いまに」の2つ目の欄（「いんまに」「いまだに」を添えた欄）の読み方。国会図書館の文字起こしをもとにしており、原本の画像で1字ずつ確認してはいません。
          </li>
          <li>
            確かめられていないこと：いま静岡のどの地域で、どの年代が使っているか。該当項目に使用地域の記載は読み取れませんでした。
          </li>
        </ul>
        そのため、これらを「静岡県内どこでも通じる」「いまも使われている」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label:
              "静岡県師範学校・静岡県女子師範学校 共編『静岡県方言辞典』（吉見書店、1910）国立国会図書館デジタルコレクション（おえる・さばく・よばれる・口語法の章）",
            url: "https://lab.ndl.go.jp/dl/book/992062",
          },
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月4日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/shizuoka",
          },
        ]}
      />
    </ArticleShell>
  );
}
