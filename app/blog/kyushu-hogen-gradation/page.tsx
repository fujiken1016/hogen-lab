import type { Metadata } from "next";
import Link from "next/link";
import { ArticleShell, H2, H3, P, Note, Sources, ShindanCta } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("kyushu-hogen-gradation")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/kyushu-hogen-gradation" },
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        「九州弁」という言い方をよく見かけます。
        でも福岡の人に鹿児島の会話を聞かせると、
        <strong>けっこうな割合で聞き取れません</strong>。
        大分の言葉は、九州よりむしろ瀬戸内の向こう側に似ています。
      </P>
      <P>
        九州のことばは一枚岩ではなく、
        大きく3つの層に分かれると考えられてきました。
        その分け方を知ると、「九州弁」がなぜ通じないのかが見えてきます。
      </P>

      <H2>豊日・肥筑・薩隅——3つの区画</H2>
      <P>
        方言の区画としてよく参照されるのが、東条操の分類です。
        日本語の方言をまず本土方言と琉球方言に分け、
        本土方言を東部・西部・九州の3つに分ける。
        そして<strong>九州方言をさらに豊日・肥筑・薩隅に分ける</strong>という枠組みです。
      </P>

      <H3>① 豊日方言（ほうにち）</H3>
      <P>
        福岡県東部（北九州・筑豊）、大分県、宮崎県の大部分。
        海を挟んだ中国方言・四国方言と共通する特徴を持つのが特色です。
        「〜ちゃ」「〜っちゃ」のような言い方が知られています。
      </P>
      <P>
        大分の言葉が関西寄りに聞こえることがあるのは、
        気のせいではありません。
        <strong>瀬戸内海は障壁ではなく通り道</strong>だった、という話でもあります。
      </P>

      <H3>② 肥筑方言（ひちく）</H3>
      <P>
        福岡県西部（福岡・筑後）、佐賀県、長崎県、熊本県。
        一般に「九州弁」としてイメージされる特徴の多くは、ここに属します。
      </P>
      <P>
        文末の「〜ばい」「〜たい」、逆接の「ばってん」、
        質問の「〜と？」。
        目的語に「ば」を使う（「これば見て」）のも、この地域の代表的な特徴です。
        博多弁の詳細は
        三大方言の比較記事
        でも扱っています。
      </P>
      <P>
        <Link href="/blog/tohoku-kansai-hakata" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 三大方言の比較記事
        </Link>
      </P>
      <Note title="「ばい」と「たい」はどう違うのか">
        ざっくり言えば、<strong>「ばい」は事実をそのまま差し出す言い方</strong>、
        <strong>「たい」は納得や強調をともなう言い方</strong>と説明されることが多い組み合わせです。
        「雨降っとうばい（＝降ってるよ）」「そうたい（＝そうなんだよ）」。
        ただし使い分けの説明は研究者や話者によって揺れがあり、
        <strong>きれいに割り切れる規則があるわけではありません</strong>。
        文末詞は、規則よりも語感で運用されている部分が大きい領域です。
      </Note>

      <H3>③ 薩隅方言（さつぐう）</H3>
      <P>
        鹿児島県（奄美群島を除く）と、宮崎県南西部の諸県地方。
        九州のなかでも、音の面でとくに変化が大きい地域です。
      </P>
      <P>
        目立つのは<strong>母音の脱落</strong>です。
        「犬」が「いん」、「秋が」が「あっが」のように、
        母音が落ちて促音や撥音になる。
        結果として、日本語では珍しい閉音節（子音で終わる音節）が発達しています。
      </P>
      <P>
        音節の数が減るので、聞いているほうは情報が一気に来る感覚になります。
        「鹿児島弁は速い」と言われる理由の一部は、
        <strong>速く話しているのではなく、音が縮んでいる</strong>ことにあります。
      </P>

      <H2>アクセントも九州の中で割れている</H2>
      <P>
        アクセントの面でも、九州はきれいに分かれません。
        2拍の和語名詞で比べると、
        <strong>東京方言が3種類、京都方言が4種類の区別を持つのに対し、
        鹿児島方言は2種類</strong>とされています。
      </P>
      <P>
        すべての語がA型かB型のどちらかに属する、いわゆる二型アクセントで、
        長崎県南部から佐賀県中南部、熊本県南西部、
        鹿児島県の薩摩・大隅などに分布します。
      </P>
      <P>
        一方で、宮崎県の北諸県郡・西諸県郡のように
        <strong>アクセントによる語の区別を持たない無アクセント地域</strong>もあります。
        隣り合った県のあいだで、アクセントの仕組みそのものが違う。
        全国的な分布は
        アクセントの日本地図の記事
        を参照してください。
      </P>
      <P>
        <Link href="/blog/hogen-accent-chizu" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → アクセントの日本地図の記事
        </Link>
      </P>

      <H2>境界は「線」ではなく「帯」</H2>
      <P>
        3区画の話をすると、地図に線を引きたくなります。
        ただし国立国語研究所の解説も、
        <strong>境界線はあくまで目安であり、ことばは境目で急に切り替わるのではなく徐々に変化する</strong>と注意しています。
      </P>
      <P>
        実際、福岡県は県内で肥筑と豊日に分かれます。
        宮崎県も、北部と南西部で属する区画が違う。
        <strong>県境と方言の境目は一致しない</strong>のが原則です。
        東西の境界でも同じことが起きているのは
        糸魚川‐浜名湖線の記事
        で見たとおりです。
      </P>
      <P>
        <Link href="/blog/higashi-nishi-kyoukai" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 糸魚川‐浜名湖線の記事
        </Link>
      </P>
      <Note title="区画は「何を基準にするか」で変わる">
        方言区画は一つに定まっていません。
        アクセントを基準にする分け方（金田一春彦）、
        敬語を基準にする分け方（加藤正信）など、
        <strong>基準が変われば線の位置も数も変わります</strong>。
        「日本の方言はいくつあるか」という問いに一つの答えがないのは、そのためです。
      </Note>

      <H2>九州全体に共通するもの</H2>
      <P>
        分かれてばかりでもありません。共通する特徴もあります。
      </P>
      <P>
        <strong>否定は「〜ん」。</strong>
        西日本方言と同じく、「行かん」「知らん」の形です。
        否定形の全国分布は
        否定形の地域差の記事
        で扱いました。
      </P>
      <P>
        <Link href="/blog/hitei-kei-chiiki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 否定形の地域差の記事
        </Link>
      </P>
      <P>
        <strong>母音の無声化が盛ん。</strong>
        東北・関東・北陸と並んで、九州は母音が無声化しやすい地域とされています。
        薩隅の母音脱落は、その延長線上にある現象と考えると分かりやすくなります。
      </P>

      <H2>まとめ</H2>
      <P>
        「九州弁」でひとくくりにすると、
        瀬戸内寄りの豊日も、「ばい・たい」の肥筑も、
        音が縮む薩隅も、全部同じ棚に入ってしまいます。
        実際には、<strong>九州の中に日本語の多様性がひととおり詰まっている</strong>という見方のほうが実態に近い。
      </P>
      <P>
        次に九州の言葉を聞く機会があったら、
        語尾が「ちゃ」なのか「ばい」なのか、
        音が詰まっているかどうかを聞いてみてください。
        だいたいどのあたりの人か、見当がつくようになります。
      </P>

      <ShindanCta
        title="あなたの言葉は、九州のどのあたり？"
        body="言葉づかい8問・性格6問の全14問。全国35体のご当地キャラから、あなたの言語感覚に近い相棒を判定します。"
      />

      <Sources
        items={[
          {
            label:
              "ことば研究館（国立国語研究所）「日本語には方言がいくつありますか」（東条操の方言区画、九州方言＝豊日・肥筑・薩隅、境界線は目安であること）",
            url: "https://kotoba.ninjal.ac.jp/qa/yokuaru/qa-139/",
          },
          {
            label:
              "ことば研究館（国立国語研究所）「方言と共通語の発音にはどのような違いがあるのでしょうか」（2拍名詞のアクセント区別数：東京3・京都4・鹿児島2）",
            url: "https://kotoba.ninjal.ac.jp/qa/yokuaru/qa-147/",
          },
          {
            label: "方言文法研究会『全国方言文法辞典資料集（2）』福岡県福岡市方言・福岡県方言区画図",
            url: "https://hougen.sakura.ne.jp/shuppan/2014/15_125.pdf",
          },
          {
            label: "迫野虔徳「九州方言の動詞の活用」（九州大学学術情報リポジトリ）",
            url: "https://api.lib.kyushu-u.ac.jp/opac_download_md/9399/pa001.pdf",
          },
          {
            label: "ウィキペディア「九州方言」「豊日方言」「肥筑方言」「薩隅方言」「二型アクセント」（区画と特徴の概観として参照）",
            url: "https://ja.wikipedia.org/wiki/%E4%B9%9D%E5%B7%9E%E6%96%B9%E8%A8%80",
          },
        ]}
      />
    </ArticleShell>
  );
}
