import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, H3, P, Note, WordCard, Sources, ShindanCta } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { BarFig } from "@/components/BarFig";
import { StepFig, CompareFig } from "@/components/ArticleFigs";

const article = getArticle("ninshou-kotoba-chiiki")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/ninshou-kotoba-chiiki" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/ninshou-kotoba-chiiki", type: "article" }),
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        英語なら、自分を指す言葉は I ひとつで足ります。
        日本語はそうはいきません。わたし、わたくし、僕、俺、うち、わし、おら。
        しかも、どれを選ぶかには<strong>地域の差がはっきり出ます</strong>。
      </P>
      <P>
        そして相手を呼ぶほうの言葉——二人称になると、事情はもっと複雑になります。
        関西で「自分、どこ住んでるん？」と聞かれて固まった経験がある人は、
        たぶん少なくないはずです。
      </P>

      <P>
        「自分」「おら」「わし」などを実際の文で見たいときは、方言ラボの<Link href="/translate/kansai" className="text-primary-text underline underline-offset-2">大阪弁 変換</Link>や<Link href="/translate/hiroshima" className="text-primary-text underline underline-offset-2">広島弁 変換</Link>が使えます。
      </P>

      <Note title="この記事の要点（本文の内容をまとめたもの）">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>自分を指す言葉（一人称）は、地域差がはっきり出る</li>
          <li>「オレ」を男女とも使うという注記が、辞典類には7県にある</li>
          <li>山形県東田川郡の中学生調査（1989年）では、同性の友人に対する「オレ」は男子95.7%・女子20.2%</li>
          <li>関西の「自分」は、目の前の相手を指す二人称</li>
          <li>人称は地域だけでなく、相手・場面・年齢でも切り替わる</li>
        </ul>
      </Note>

      <H2>一人称の地図——ざっくりした見取り図</H2>
      <P>
        まず全体像から。細かい例外はいくらでもありますが、
        大づかみには次のような傾向が知られています。
      </P>

      <div className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            一人称の見取り図（下のカードの内容をまとめた表）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">語</th>
              <th scope="col" className="py-2 pr-3 font-bold">主な地域</th>
              <th scope="col" className="py-2 pr-3 font-bold">ひとこと</th>
            </tr>
          </thead>
          <tbody>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">おら／おれ</td>
                <td className="py-2 pr-3">東日本（東北〜関東・甲信越）</td>
                <td className="py-2 pr-3">「おれ」の変化した形とされる</td>
              </tr>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">わし</td>
                <td className="py-2 pr-3">中国・四国・近畿ほか（西日本に多い）</td>
                <td className="py-2 pr-3">年配男性のイメージが強い</td>
              </tr>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">うち</td>
                <td className="py-2 pr-3">近畿・中国・四国ほか</td>
                <td className="py-2 pr-3">女性の自称として広く使われる</td>
              </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-sub leading-relaxed -mt-2 mb-5">※分布は大づかみの傾向で、例外は多くあります。</p>
      <CompareFig
        cols={[
          { head: "東日本に多い", items: ["おら", "おれ"] },
          { head: "西日本に多い", items: ["わし", "うち"] },
        ]}
        ariaLabel="一人称の見取り図。東日本に多いのはおら・おれ、西日本に多いのはわし・うち。"
        caption="図：一人称の大づかみな傾向（※概念図。地図ではなく、例外も多い）"
      />

      <WordCard
        word="おら／おれ"
        dialect="東日本"
        meaning="自分。東北から関東・甲信越にかけて広く使われる"
        example="おら、まだ行ったことねぇんだ"
      >
        「おら」は「おれ」の変化した形とされます。東日本を中心に分布し、
        年配層では男女とも使う地域があります。
      </WordCard>

      <WordCard
        word="わし"
        dialect="中国・四国・近畿ほか"
        meaning="自分。西日本に多く、年配男性のイメージが強い"
        example="わしはもう先に帰るけぇ"
      >
        「わたし」が縮まった形と説明されます。
        フィクションでは老人の記号として使われます。
        広島・岡山などでは日常の自称として使われてきたと説明されますが、年代ごとの使用率はこの記事では確かめていません。
      </WordCard>

      <WordCard
        word="うち"
        dialect="近畿・中国・四国ほか"
        meaning="自分。現在は女性の自称として広く使われる"
        example="うち、そこ行ったことあるで"
      >
        もともとは「家（うち）」に由来する語とされ、
        近畿では女性の自称として定着しています。
        近年は関西以外の若い世代にも広がっています。
      </WordCard>

      <Note title="大阪の「うち」「わて」「わし」は、辞典でどう書かれているか">
        国立国語研究所は1974年10月から1975年3月にかけて、
        東京都区内と大阪市内（15〜69歳の住民）で「大都市における言語生活の実態調査」を行い、報告書『大都市の言語生活』を1981年に出しています。
        ただし、一人称の使用率の集計は今回の確認では見つけられていないので、この調査から数字は引いていません。
        そのかわり、国立国会図書館のレファレンス協同データベースが整理した辞典の記述を並べます。
        『全国方言辞典』（1978）は「うち」を主に女子供の一人称とし、
        『大阪ことば事典』（1984）は、「ワテ」は女性が使い、男性は「ワイ」「ワシ」を使うと書いています。
        『大阪ことば辞典』（1995）には、「ワテ」は中高年の女性に多く、船場では男性も使った、「ウチ」は女性語、とあります。
        つまり辞典では、大阪の一人称は性別と世代で分かれて書かれています。
      </Note>

      <H2>「オレ」を女性が使う地域がある</H2>
      <P>
        一人称の地域差でいちばん面白いのが、この話です。
        国立国語研究所の「ことば研究館」は、
        方言辞典類の記述をもとに、
        <strong>「オレ」を男女とも使うという注記が岩手・秋田・茨城・群馬・神奈川・静岡・奈良に見られる</strong>と紹介しています。
        「主として男性が使用」という注記が付くのは青森・栃木・東京（奥多摩）で、
        東北や、首都圏を除く関東に多い傾向だとされます。
      </P>

      <div className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「オレ」の注記（方言辞典類の記述・ことば研究館の紹介による）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">注記</th>
              <th scope="col" className="py-2 pr-3 font-bold">見られる都県</th>
            </tr>
          </thead>
          <tbody>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">男女とも使う</td>
                <td className="py-2 pr-3">岩手・秋田・茨城・群馬・神奈川・静岡・奈良</td>
              </tr>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">主として男性が使用</td>
                <td className="py-2 pr-3">青森・栃木・東京（奥多摩）</td>
              </tr>
          </tbody>
        </table>
      </div>

      <H3>共通語が「男女差」を持ち込んだ</H3>
      <P>
        同じ記事で紹介されている山形県東田川郡の1989年の調査が、
        この話を一段深くしてくれます。中学生を対象にした調査で、
        同性の友人に対する「オレ」の使用率は
        <strong>男子95.7%に対して女子20.2%</strong>。
        異性の同級生に対しては男子96.3%、女子14.6%でした。
      </P>
      <BarFig
        items={[
          { label: "同性の友人に対して・男子", value: 95.7 },
          { label: "同性の友人に対して・女子", value: 20.2 },
          { label: "異性の同級生に対して・男子", value: 96.3 },
          { label: "異性の同級生に対して・女子", value: 14.6 },
        ]}
        max={100}
        unit="%"
        ariaLabel="山形県東田川郡の中学生調査（1989年）で、オレを使う割合。同性の友人に対して男子95.7%・女子20.2%、異性の同級生に対して男子96.3%・女子14.6%。"
        caption="「オレ」を使う割合（山形県東田川郡・中学生・1989年調査。ことば研究館の紹介による）"
      />
      <P>
        年配層では「オレ」に男女差がほとんどなかったと推測されるのに、
        若い世代で差が開いている。
        つまり<strong>「オレは男の言葉」という区別は、共通語の影響で後から入ってきた</strong>可能性が高いということです。
      </P>
      <Note title="共通語にない語は、影響を受けにくい">
        同じ調査で、その土地固有の自称詞「オイ」には男女差がほとんど見られませんでした。
        共通語に対応する語がないため、
        <strong>「男が使う／女が使う」という共通語側の用法が入り込む余地がなかった</strong>と説明されています。
        方言が共通語に押されるとき、押され方は語によって違うのです。
      </Note>

      <H2>二人称——関西の「自分」問題</H2>
      <P>
        関西で使われる二人称の「自分」は、
        他地域の人がいちばん驚くポイントかもしれません。
        「自分、それ好きなん？」の「自分」は、目の前の相手を指しています。
      </P>
      <P>
        これは学生の記述研究などでも取り上げられているテーマで、
        大阪府北河内地方を対象にした調査報告もあります。
        使える相手はおおむね同年代か目下で、
        <strong>目上には使いにくい</strong>という感覚が共有されている点が特徴です。
      </P>

      <H3>一人称が二人称に流れる、という現象</H3>
      <P>
        「自分」が相手を指すのは奇妙に見えますが、
        日本語ではよくあるパターンです。
        「われ」も「おのれ」も、古くは自分を指す語でした。
        それがのちに相手を指す語として使われるようになり、
        現在では関西などで<strong>けんか腰の呼びかけ</strong>として残っています。
      </P>
      <StepFig
        steps={[
          { title: "古く", sub: "「われ」「おのれ」は自分を指す語" },
          { title: "のち", sub: "相手を指す語として使われるようになる" },
          { title: "現在", sub: "関西などでけんか腰の呼びかけに残る" },
        ]}
        ariaLabel="われ・おのれの変化。古くは自分を指す語、のちに相手を指す語、現在は関西などでけんか腰の呼びかけとして残る。"
        caption="図：「われ」「おのれ」の意味の移り変わり（※概念図）"
      />
      <P>
        こうした入れ替わりは、
        <strong>丁寧に使われていた語がだんだん敬意を失い、別の語に置き換わっていく</strong>という説明で語られることが多い現象です
        （いわゆる敬意逓減の考え方）。
        「貴様」「お前」がいまや乱暴な語になっているのも、同じ流れとして説明されます。
        ただしすべての人称語がこの筋道どおりに動くわけではなく、
        個々の語の履歴は一つずつ確かめる必要があります。
      </P>

      <H2>地域ごとの二人称、いくつか</H2>
      <div className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            地域ごとの二人称の例
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">語</th>
              <th scope="col" className="py-2 pr-3 font-bold">地域</th>
              <th scope="col" className="py-2 pr-3 font-bold">ニュアンス</th>
            </tr>
          </thead>
          <tbody>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">おまん</td>
                <td className="py-2 pr-3">土佐（高知）ほか</td>
                <td className="py-2 pr-3">「おまえさん」系の語。乱暴さは薄く、ふつうの呼びかけ</td>
              </tr>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">おめ／おめえ</td>
                <td className="py-2 pr-3">東日本（東北・関東に広く分布）</td>
                <td className="py-2 pr-3">「おまえ」の変化形</td>
              </tr>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">あんた</td>
                <td className="py-2 pr-3">全国</td>
                <td className="py-2 pr-3">「あなた」の縮まった形。地域によって親しみの語にも見下しの語にもなる</td>
              </tr>
              <tr className="border-b border-line align-top">
                <td className="py-2 pr-3 font-bold whitespace-nowrap">自分</td>
                <td className="py-2 pr-3">関西</td>
                <td className="py-2 pr-3">目の前の相手を指す。同年代か目下向きで、目上には使いにくい</td>
              </tr>
          </tbody>
        </table>
      </div>
      <P>
        「あんた」は、方言そのものというより、<strong>地域ごとに温度差がある語</strong>と考えたほうが正確です。
      </P>

      <H2>人称は「地域」だけで決まらない</H2>
      <P>
        ここまで地域差を並べてきましたが、
        最後に大事な注意を一つ。人称の選び方は、地域だけで決まりません。
        次のような条件のほうが強く効くこともあります。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li><strong>相手が誰か</strong></li>
        <li><strong>その場が公的か私的か</strong></li>
        <li><strong>自分が何歳か</strong></li>
      </ul>
      <P>
        同じ人が、場面によってこう切り替えます。
      </P>
      <CompareFig
        cols={[
          { head: "職場", items: ["わたし"] },
          { head: "地元の友達", items: ["おれ"] },
          { head: "親", items: ["おら"] },
        ]}
        ariaLabel="同じ人が場面で一人称を切り替える例。職場ではわたし、地元の友達にはおれ、親にはおら。"
        caption="図：同じ人が場面で切り替える一人称の例（※概念図）"
      />
      <P>
        方言の人称は、地図の上に固定された点ではなく、
        <strong>その人が持っている引き出しの一つ</strong>です。
        分布図はあくまで「よく使われる形」の記録として読むのが安全です。
      </P>
      <P>
        なお、こうした人称の使い分けを極端に単純化したものが、
        フィクションの中の「わし＝博士」「おら＝田舎者」という記号です。
        その話は
        役割語と方言コスプレの記事
        で扱っています。
      </P>
      <P>
        <Link href="/blog/media-to-hogen" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 役割語と方言コスプレの記事
        </Link>
      </P>

      <ShindanCta
        title="あなたの「自分の呼び方」は、どの地方寄り？"
        body="言葉づかい6問・性格4問の全10問。全国35体のご当地キャラから、あなたの言語感覚に近い相棒を判定します。"
      />

      <Sources
        items={[
          {
            label:
              "ことば研究館（国立国語研究所）「女の人が自分のことを『オレ』という地域があるのでしょうか」（山形県東田川郡1989年調査ほか）",
            url: "https://kotoba.ninjal.ac.jp/qa/yokuaru/qa-144/",
          },
          {
            label:
              "レファレンス協同データベース（国立国会図書館）「大阪弁の『わて』と『うち』の使い分けについて知りたい。未婚と既婚で使い分けるのか。」（『全国方言辞典』『大阪ことば事典』『大阪ことば辞典』ほかの記述を整理）",
            url: "https://crd.ndl.go.jp/reference/entry/index.php?page=ref_view&id=1000137468",
          },
          {
            label:
              "国立国語研究所 研究資料室「大都市における言語生活の実態調査」（1974〜1975年・東京都区内／大阪市内、報告書『大都市の言語生活』1981年）",
            url: "https://rmr.ninjal.ac.jp/materials/fo0008/",
          },
          {
            label: "国立国語研究所『日本言語地図』（全国約2,400地点の語彙調査）",
            url: "https://www2.ninjal.ac.jp/past-publications/publication/catalogue/laj_map/",
          },
          {
            label:
              "松木悠「北河内地方における二人称としての『自分』の使用について」（東京外国語大学記述言語学論集『思言』第2号、2006年）",
            url: "http://www.tufs.ac.jp/ts/personal/kazama/shigen/2/Matsuki.pdf",
          },
          {
            label: "ウィキペディア「日本語の一人称代名詞」「日本語の二人称代名詞」（語形の一覧として参照）",
            url: "https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E4%B8%80%E4%BA%BA%E7%A7%B0%E4%BB%A3%E5%90%8D%E8%A9%9E",
          },
        ]}
      />
    </ArticleShell>
  );
}
