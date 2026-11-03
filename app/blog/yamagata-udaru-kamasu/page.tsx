import type { Metadata } from "next";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources, WordCard } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("yamagata-udaru-kamasu")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/yamagata-udaru-kamasu" },
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        「そのゴミ、うだってきてけろ」。
        標準語の感覚で読むと、ゴミが暑さでぐったりしているように聞こえます。
        でも山形の人が頼んでいるのは<strong>「そのゴミを捨ててきて」</strong>です。
      </P>
      <P>
        山形弁には、標準語と音が同じか近いのに、意味がちがう動詞があります。
        この記事では「うだる」「おだる」「かます」の3語を、古い方言集と県の公式ページで確かめ、
        方言ラボの変換ツールで置き換わる形・置き換わらない形も実際に試しました。
      </P>

      <H2>意味がちがう3語</H2>

      <WordCard
        word="うだる"
        dialect="山形弁（庄内）"
        meaning="捨てる"
        example="そのゴミ、うだってきてけろ。"
      >
        1933年の『山形県方言集』に、「うだる＝捨てる」とあり、使用地方は庄内、用例は「此のごみをうだる」です。
        標準語の「うだる」は「暑さでうだる」のように、ぐったりする意味なので、まったく別の語です。
      </WordCard>

      <WordCard
        word="おだる"
        dialect="山形弁"
        meaning="折る"
        example="木の枝おだって遊んでらった。"
      >
        山形県の公式サイト「やまがた子育て応援サイト」の山形弁講座には、「おだる＝折る」と載っています。
        「おだてる」に似ていますが、意味はまるで別で、枝や棒を折る動作のことです。
      </WordCard>

      <WordCard
        word="かます"
        dialect="山形弁"
        meaning="かきまわす"
        example="味噌汁かますとうめぐなる。"
      >
        同じ県の公式ページに「かます＝かきまわす」とあります。
        標準語の「かます」は、一発かます、はったりをかますのように相手に何かをくらわせる使い方が中心なので、
        味噌汁の話で出てきたら、鍋をかきまわしているのだと読みます。
      </WordCard>

      <Note title="この2つの資料について">
        『山形県方言集』は、山形県師範学校が編み、1933年（昭和8年）に出た本です。
        凡例には、使用地方を庄内・村山・最上・置賜の4地方に分けて示したと書かれています。
        また、載せた語の中には「山形地方だけの方言とは云ひ得ないもの」がかなり多い、とも断っています。
        県の公式ページは、山形弁の語を名詞・動詞・会話語に分けて一覧にしたものです。
      </Note>

      <H2>変換ツールに入れると、どうなるか</H2>

      <P>
        方言ラボの<Link href="/translate/yamagata" className="text-primary-text underline underline-offset-2">山形弁 変換</Link>
        で、この3語を試しました（2026年11月4日に実行）。
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
              ["山形弁→標準語", "ゴミをうだる", "ゴミを捨てる", "あり"],
              ["山形弁→標準語", "そのゴミ、うだってきてけろ", "そのゴミ、うだってきてください", "一部だけ"],
              ["山形弁→標準語", "おだる", "折る", "あり"],
              ["山形弁→標準語", "その枝おだって", "その枝おだって", "なし"],
              ["山形弁→標準語", "みそ汁かますとうめぐなる", "みそ汁かき混ぜるとうめぐなる", "一部だけ"],
              ["標準語→山形弁", "捨てる", "うだる", "あり"],
              ["標準語→山形弁", "混ぜる", "混ぜる", "なし"],
              ["標準語→山形弁", "かき混ぜる", "かます", "あり"],
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
        「うだる」は置き換わるのに、「うだって」は置き換わりません。
        そのため「そのゴミ、うだってきてけろ」では、「けろ」だけが「ください」になり、
        肝心の「うだって」が残ります。出力を見て「ゴミがうだってきてください」と読むと、意味がずれます。
      </P>
      <P>
        <strong>標準語から山形弁への向きは、辞典の見出しの言い方に合わせる必要があります。</strong>
        「混ぜる」と入れても「かます」にならず、辞典の語釈どおり「かき混ぜる」と入れたときだけ置き換わります。
        「かきまわす」でも置き換わりません。
      </P>
      <P>
        <strong>文の残りは訳されません。</strong>
        「うめぐなる」のような語尾や活用は、置き換え対象になっていないので、そのまま残ります。
      </P>

      <figure className="my-5">
        <div className="overflow-x-auto">
          <svg
            width="296"
            height="150"
            viewBox="0 0 296 150"
            role="img"
            aria-label="辞典の見出しの形は置き換わり、活用した形は置き換わらない。例：うだるは置き換わり、うだっては置き換わらない"
            style={{ display: "block", width: 296, height: "auto" }}
          >
            <rect x="1" y="1" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            <text x="12" y="26" fontSize="14" fontWeight="700" fill="currentColor">見出しの形</text>
            <text x="12" y="52" fontSize="16" fill="currentColor">うだる　→　捨てる</text>
            <text x="190" y="26" fontSize="14" fill="currentColor">置き換わる</text>
            <rect x="1" y="85" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
            <text x="12" y="110" fontSize="14" fontWeight="700" fill="currentColor">活用した形</text>
            <text x="12" y="136" fontSize="16" fill="currentColor">うだって　→　うだって</text>
            <text x="190" y="110" fontSize="14" fill="currentColor">置き換わらない</text>
          </svg>
        </div>
        <figcaption className="text-sm text-sub mt-2 leading-[1.8]">
          図：辞典の見出しと同じ形だけが置き換わる（上の表の「うだる」「うだって」の場合）
        </figcaption>
      </figure>

      <H2>出会ったときの読み方</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>ゴミや不要なものの話で「うだる」が出たら、捨てることです。暑さの話とは限りません。</li>
        <li>枝・棒・骨など細いものの話で「おだる」が出たら、折ることです。</li>
        <li>汁物やタレの話で「かます」が出たら、かきまわすことです。</li>
        <li>変換結果に元の語が残っていたら、活用した形かもしれません。「うだって」を「うだる」に直して入れ直します。</li>
      </ul>

      <H2>まとめ：次にやること</H2>
      <P>
        「うだる」は捨てる、「おだる」は折る、「かます」はかきまわす。
        標準語と同じ音の語を見つけたら、文脈から別の意味を疑うのが近道です。
        気になった語は、辞典の一覧で引いてみてください。
      </P>
      <P>
        <Link href="/translate/yamagata" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 山形弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/yamagata" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 山形弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：「うだる＝捨てる」が1933年の『山形県方言集』（庄内の語として）に、「おだる＝折る」「かます＝かきまわす」が県の公式ページにあること。
          </li>
          <li>
            確かめられていないこと：「おだる」「かます」が山形県内のどの地方で使われるか。県の公式ページは地方の別を示していません。
          </li>
          <li>
            確かめられていないこと：「うだる」がいまも庄内で使われているか。資料は90年以上前のものです。
          </li>
        </ul>
        そのため、この3語を「山形県内どこでも通じる」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "山形縣師範學校 編『山形県方言集』（1933）国立国会図書館デジタルコレクション（「う」の部・凡例）",
            url: "https://lab.ndl.go.jp/dl/book/1214458",
          },
          {
            label: "山形県「やまがた子育て応援サイト」山形弁講座 方言辞典（おだる・かます）",
            url: "https://kosodate.pref.yamagata.jp/dialect/dictionary",
          },
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月4日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/yamagata",
          },
        ]}
      />
    </ArticleShell>
  );
}
