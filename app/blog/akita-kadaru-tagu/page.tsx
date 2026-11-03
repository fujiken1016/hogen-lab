import type { Metadata } from "next";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources, WordCard } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("akita-kadaru-tagu")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/akita-kadaru-tagu" },
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        「おらもその遊びさかだる」。
        「かだる」は「語る」に聞こえますが、秋田の人が言っているのは<strong>「仲間に入る」</strong>です。
      </P>
      <P>
        秋田弁には、標準語と音が近いのに意味がちがう語があります。
        この記事では「かだる」「たぐる」「きかね」の3語を、1929年に秋田県が出した方言集で確かめ、
        方言ラボの変換ツール（秋田弁 変換）で置き換わる形・置き換わらない形も実際に試しました。
      </P>

      <H2>音は標準語に近い、意味はちがう3語</H2>

      <WordCard
        word="かだる"
        dialect="秋田弁"
        meaning="仲間に入る（加わる）"
        example="おらもその遊びさかだる！"
      >
        『秋田方言』に「かだる（動詞）＝仲間入りをする」とあり、使用地域の欄は「全縣」です。
        用例は「君も俺の組にかだれ。俺は君の方にかだる。」。
        同じ本には「かだらせる＝加入させる」も全県の語として載っています。
        標準語の「語る」とは別の語です。
      </WordCard>

      <WordCard
        word="たぐる"
        dialect="秋田弁"
        meaning="めくりあげる、たくしあげる／はぐ"
        example="袖たぐって手伝ってけれ。"
      >
        『秋田方言』には「たぐる」が2か所あります。
        ひとつは「捲きあげる」で、秋田市・平鹿・仙北の語として載り、用例は「裾をたぐる」。
        もうひとつは「はぐ（剝ぐ）」で、南秋田・秋田市・河辺・雄勝の語として載り、用例は「木の皮をたぐる」。
        標準語の「手繰る（引き寄せる）」にあたる語は、同じ本では別に「たごむ」として載っています。
      </WordCard>

      <WordCard
        word="きかね"
        dialect="秋田弁"
        meaning="荒い、強い（気が強い・乱暴だ）"
        example="ここのわらし、きかねくて大変だ。"
      >
        『秋田方言』には「きかねぁ（形容詞）＝荒い。つよい」とあり、用例は「あの小供ほんとうにきかねぁ」です。
        使用地域は山本と雄勝の2郡だけで、県内全域の語とは書かれていません。
        標準語の「効かない」「聞かない」と読むと、意味がずれます。
      </WordCard>

      <Note title="この資料について">
        『秋田方言』は、秋田県学務部学務課が編んで1929年（昭和4年）に出した方言集です。
        各項目に、使用する郡の略号（秋田市・南秋田・河辺・平鹿・仙北・雄勝・山本など）が付いています。
        国立国会図書館のデジタルコレクションで全文を調べました。
        文字起こしにはところどころ読めない字があるので、確認できた範囲だけを書いています。
      </Note>

      <H2>変換ツールに入れると、どうなるか</H2>

      <P>
        方言ラボの<Link href="/translate/akita" className="text-primary-text underline underline-offset-2">秋田弁 変換</Link>
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
              ["秋田弁→標準語", "おらもその遊びさかだる", "おれもその遊びさ仲間に入る", "あり"],
              ["秋田弁→標準語", "かだって", "かだって", "なし"],
              ["秋田弁→標準語", "袖たぐって手伝ってけれ", "袖たぐって手伝ってけれ", "なし"],
              ["秋田弁→標準語", "たぐる", "めくりあげる", "あり"],
              ["秋田弁→標準語", "このわらし、きかねくて大変だ", "このわらし、気が強いくて大変だ", "あり（不自然）"],
              ["標準語→秋田弁", "仲間に入る", "かだる", "あり"],
              ["標準語→秋田弁", "めくりあげる", "たぐる", "あり"],
              ["標準語→秋田弁", "気が強い", "きかね", "あり"],
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
        「かだる」は置き換わるのに「かだって」は置き換わらず、「たぐる」は置き換わるのに「たぐって」は置き換わりません。
        変換結果が元の文とまったく同じなら、「訳すところがなかった」のではなく、活用した形が辞典に引っかからなかった可能性があります。
      </P>
      <P>
        <strong>置き換えた語のあとに、秋田弁の活用がつながると不自然になります。</strong>
        「きかねくて」は「気が強いくて」と出ます。「気が強くて」と読み直す必要があります。
      </P>
      <P>
        <strong>1語に複数の意味がある語は、1つにしぼられます。</strong>
        「たぐる」は『秋田方言』では「捲きあげる」と「はぐ」の2つの意味ですが、ツールが出すのは「めくりあげる」だけです。
      </P>

      <figure className="my-5">
        <div className="overflow-x-auto">
          <svg
            width="296"
            height="150"
            viewBox="0 0 296 150"
            role="img"
            aria-label="辞典の見出しの形は置き換わり、活用した形は置き換わらない。例：かだるは置き換わり、かだっては置き換わらない"
            style={{ display: "block", width: 296, height: "auto" }}
          >
            <rect x="1" y="1" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            <text x="12" y="26" fontSize="14" fontWeight="700" fill="currentColor">見出しの形</text>
            <text x="12" y="52" fontSize="16" fill="currentColor">かだる　→　仲間に入る</text>
            <text x="190" y="26" fontSize="14" fill="currentColor">置き換わる</text>
            <rect x="1" y="85" width="294" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
            <text x="12" y="110" fontSize="14" fontWeight="700" fill="currentColor">活用した形</text>
            <text x="12" y="136" fontSize="16" fill="currentColor">かだって　→　かだって</text>
            <text x="190" y="110" fontSize="14" fill="currentColor">置き換わらない</text>
          </svg>
        </div>
        <figcaption className="text-sm text-sub mt-2 leading-[1.8]">
          図：辞典の見出しと同じ形だけが置き換わる（上の表の「かだる」「かだって」の場合）
        </figcaption>
      </figure>

      <H2>出会ったときの読み方</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>遊びや集まりの話で「かだる」が出たら、仲間に入ることです。</li>
        <li>袖や裾の話で「たぐる」が出たら、まくりあげることです。木の皮の話なら、はぐことです。</li>
        <li>子どもや動物の話で「きかね」が出たら、気が強い・荒いことです。ただし使う地域は限られるかもしれません。</li>
        <li>変換結果が元の文のままなら、活用した形かもしれません。見出しの形に直して入れ直します。</li>
      </ul>

      <H2>まとめ：次にやること</H2>
      <P>
        「かだる」は仲間に入る、「たぐる」はまくる・はぐ、「きかね」は気が強い。
        標準語に似た音の語を見つけたら、文脈から別の意味を疑うのが近道です。
        気になった語は、辞典の一覧で引いてみてください。
      </P>
      <P>
        <Link href="/translate/akita" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 秋田弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/akita" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 秋田弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：1929年の『秋田方言』に、「かだる（全縣）」「たぐる（2つの意味）」「きかねぁ（山本・雄勝）」の語釈と用例があること。
          </li>
          <li>
            確かめられていないこと：「かだる」「たぐる」が、いまも同じ意味で使われているか。資料は90年以上前のものです。
          </li>
          <li>
            確かめられていないこと：国会図書館の文字起こしをもとにしており、原本の画像で1字ずつ確認してはいません。使用地域の略号の読み取りに誤りがある可能性があります。
          </li>
        </ul>
        そのため、「たぐる」「きかね」を「秋田県内どこでも通じる」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "秋田県学務部学務課 編『秋田方言』（1929）国立国会図書館デジタルコレクション（「か」の部・「た」の部）",
            url: "https://lab.ndl.go.jp/dl/book/1230046",
          },
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月4日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/akita",
          },
        ]}
      />
    </ArticleShell>
  );
}
