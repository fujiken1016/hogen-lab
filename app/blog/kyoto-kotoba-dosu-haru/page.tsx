import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("kyoto-kotoba-dosu-haru")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/kyoto-kotoba-dosu-haru" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/kyoto-kotoba-dosu-haru", type: "article", image: { path: "/og/blog-kyoto-kotoba-dosu-haru.jpg", alt: "京言葉の「どす」「はる」は今も使う？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// Wikipedia「京言葉」が書く調査の数字（「どす」＝岸江信介・井上文子『京都市方言の動態』1997／「はる」＝岸江信介「京阪方言における親愛表現構造の枠組み」1998 を出典に挙げる記述。原本は未確認）
const SURVEY: [string, string, string][] = [
  ["「どす」を使うか（1993〜94年の方言調査・出典：Wikipedia「京言葉」）", "80代：「使用する」49.2%", "10代：「聞いたこともない」54.0%"],
  ["父親の話題に「〜はる」を使う（1990年代の調査・出典：岸江1998）", "京都：女性9割・男性6割", "大阪：男女とも2割程度"],
  ["赤ん坊の話題に「〜はる」を使う（同）", "京都：女性8割・男性4割", "大阪：男女とも2割程度"],
];

// 辞典の京都弁90文の語尾を数えた結果（2026年11月23日・自社集計）
const ENDINGS: [string, number][] = [
  ["〜どす（どした・どすえ・どすなあ）", 14],
  ["〜やす（おいでやす・おあがりやす）", 11],
  ["〜えで終わる（かんにんえ・ありますえ）", 13],
  ["〜はる（きはった・いはります）", 6],
  ["〜おす・〜おます（暑おすなあ）", 3],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
const TESTS: [string, string, string][] = [
  ["京都弁→標準語", "ほな、今日もおきばりやす。", "ほな、今日も頑張ってください。"],
  ["京都弁→標準語", "ごめんやす、どなたかいはりますか。", "ごめんください、どなたかいはりますか。（「いはります」は残る）"],
  ["京都弁→標準語", "かんにんえ", "ごめんなさいえ（文末の「え」は残る）"],
  ["京都弁→標準語", "今日はええお天気どすなあ。", "今日はええお天気どすなあ。（変わらない）"],
  ["京都弁→標準語", "お母さん、もう帰ってきはったえ。", "お母さん、もう帰ってきはったえ。（変わらない）"],
  ["標準語→京都弁", "いらっしゃいませ", "おいでやす"],
  ["標準語→京都弁", "おしりが冷えるので座布団を使ってください", "おいどが冷えるのでおざぶを使ってください"],
  ["標準語→京都弁", "お母さんがもう帰ってきたよ。", "お母さんがもう帰ってきたよ。（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "京言葉と京都弁は、同じものですか？",
    a: "同じものを指します。Wikipedia「京言葉」は、京都で用いられる方言を、京言葉のほか、京都語、京都弁、近世には京談とも呼ぶと書いています。この記事も「京言葉」と「京都弁」を同じ意味で使っています。",
  },
  {
    q: "京都の人は今も「どす」を使いますか？",
    a: "調査の数字を見る限り、世代で大きく違います。Wikipedia「京言葉」が挙げる1993〜94年の調査（出典は同記事の記述）では、80代の49.2%が「使用する」と答え、10代の54.0%が「聞いたこともない」と答えました。同記事は、現在は高齢層や芸妓など限られた場面でしか聞かれないとも書いています。ただし、これは約30年前の調査で、現在の数字ではありません。",
  },
  {
    q: "変換ツールで「どす」や「はる」が直らないのはなぜですか？",
    a: "「どす」「〜はる」は文末や動詞に付く語尾で、辞典の見出し語と同じ形の文字列として文の中に出てくるとは限らないためです。この記事の表のとおり、「おいでやす」「おきばりやす」のように語として独立した言い方は直り、「お天気どすなあ」「帰ってきはったえ」の語尾は残ります。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>「どす」「はる」「〜やす」は京言葉の代表ですが、今の京都で誰もが使う言葉ではありません。</strong>
        Wikipedia「京言葉」が書く1993〜94年の調査（出典：同記事の記述・2026年11月23日時点）では、「どす」を使うと答えた80代は49.2%、「聞いたこともない」と答えた10代は54.0%でした。
      </P>
      <P>
        方言ラボの辞典の京都弁の例文90文を2026年11月23日に自社で数えると、「どす」は14文、「はる」は6文で、約半数の48文は、この5つの形をどれも含みませんでした。
      </P>
      <P>
        この記事では、京言葉と京都弁の呼び方、「どす」「はる」の使われ方の調査、辞典の例文の語尾の集計、変換ツールで直る語と直らない語尾を、実行結果と一緒に整理します。
        京言葉のイメージと実際の使われ方のずれを、数字で確かめるための記事です。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "京言葉と京都弁は同じ" },
        { id: "s2", label: "「どす」「はる」はいつ生まれ、今どれだけ使われるか" },
        { id: "s3", label: "辞典の例文の語尾を数えると" },
        { id: "s4", label: "辞典の京都弁は、どこの言葉か" },
        { id: "s5", label: "変換ツールに入れると、どう変わるか" },
        { id: "s6", label: "よくある質問" },
        { id: "s7", label: "まとめ" },
      ]} />

      <H2 id="s1">京言葉と京都弁は同じ</H2>
      <P>
        Wikipedia「京言葉」の「呼称」の節は、京都で用いられる方言を、京言葉、京都語、京都弁と呼び、近世には「京談」とも称されたと説明しています。
        検索では「京言葉 変換」と「京都弁 変換」のどちらも使われますが、指しているものは同じです。
      </P>
      <P>
        同じ記事は、京都市中心部の京言葉を、御所で話された公家言葉（御所言葉）と、市中で話される町ことばに大きく分けています。
        町ことばは、中京ことば、西陣の職人ことば、祇園の花街ことば、伝統産業語の4つに分けられると書かれています。
        つまり、ドラマや観光で聞く「京言葉」は、このうち花街ことばや、町家の女性のことばの印象が強いと読めます。
      </P>

      <H2 id="s2">「どす」「はる」はいつ生まれ、今どれだけ使われるか</H2>
      <P>
        Wikipedia「京言葉」は、代表的な京言葉の「どす」「はる」を、幕末から明治初期に生まれた言葉と考えられていると書いています。
        平安時代以来の古語は、あまり残っていないとも説明されています。
        「昔からずっとある京都の言葉」というイメージとは、少し違う成り立ちです。
      </P>
      <P>
        使われ方については、同記事が調査の数字を挙げています。
        「どす」の数字の出典は、岸江信介・井上文子『京都市方言の動態』（1997）、「はる」の数字の出典は、岸江信介「京阪方言における親愛表現構造の枠組み」（1998）と書かれています。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            京言葉の使われ方の調査（Wikipedia「京言葉」の記述より・2026年11月23日取得。調査の原本は未確認）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">項目</th>
              <th scope="col" className="py-2 pr-3 font-bold">数字</th>
              <th scope="col" className="py-2 font-bold">比べる数字</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {SURVEY.map(([a, b, c]) => (
              <tr key={a} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="項目" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="数字" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="比べる数字" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        読み取れることが2つあります。
        <strong>1つは、「どす」は世代で使われ方が大きく違うこと</strong>です。
        もう1つは、<strong>「はる」は、大阪より京都のほうが、身内や目下にも広く使われること</strong>です。
        同記事によると、京都では「はる」が、大阪のように明確な尊敬語としてだけでなく、親しみを込めた言い方や、聞き手への丁寧さも兼ねて使われます。
      </P>
      <P>
        ただし、どちらも約30年前の調査です。
        現在の10代・20代が、どの形をどれだけ使うかは、この記事では確かめられていません。
        同記事は、京都市内でも共通語化や関西共通語化（大阪弁化）が進み、京言葉らしい京言葉を使うのは昭和中期以前に生まれた世代や花街に限られると書いています。
        大阪弁の側で「〜てはる」がどれだけ出るかを見たいときは、
        <Link href="/blog/kobe-ben-osaka-chigai" className={LINK}>神戸弁と大阪弁の違いを例文で数えた記事</Link>
        も参考になります。
      </P>

      <H2 id="s3">辞典の例文の語尾を数えると</H2>
      <P>
        方言ラボの辞典には、京都弁が90語載っていて、それぞれに例文が1文ずつ付いています。
        その90文から、京言葉らしい語尾（どす・やす・はる・おす・文末の「え」）を数えました（2026年11月23日の自社集計）。
      </P>

      <BarFig
        max={14}
        unit="文"
        ariaLabel="辞典の京都弁の例文90文のうち、京言葉らしい語尾の数。どす14文、やす11文、文末のえ13文、はる6文、おす・おます3文"
        caption="図：辞典の京都弁90文に出る語尾の数（2026年11月23日・自社集計。1文に複数の形が出る場合は重ねて数えた）"
        items={ENDINGS.map(([l, n]) => ({ label: l, value: n, dim: n < 7 }))}
      />

      <P>
        5つの形のどれかを含む文は、2026年11月23日時点の自社集計（実測）で、重なりを除くと<strong>42文（47%）</strong>でした。
        残る48文は、「かなんわぁ」「ええ味やね」「しぶちんやわあ」のように、「〜わ」「〜な」「〜さかい」で終わる文です。
        これらは、関西弁に共通する言い方に近い文です。
      </P>
      <P>
        「どす」は14文あり、「お天気どすなあ」「おあげさんと菜っ葉のたいたんどす」のように、料理や挨拶の場面に多く出ます。
        「はる」は6文で、すべて、話題の人や相手の動作を言う文です（「お母さん、もう帰ってきはったえ。」「昔はおくどさんでご飯を炊いてはったんえ。」など）。
      </P>
      <P>
        参考に、大阪弁の例文96文で「〜てはる」の形が出るのは1文でした。
        Wikipedia の「京都のほうが、はるの使用率が高い」という説明と同じ向きですが、1文と6文の差なので、傾向を示す程度の数字です。
      </P>
      <P>
        辞典の例文は用例として載せた文で、京都の人の話し言葉を集めた記録ではありません。
        ここから言えるのは、「辞典の京都弁の例文の約半数は、京言葉らしい語尾を持たない」というところまでです。
      </P>

      <H2 id="s4">辞典の京都弁は、どこの言葉か</H2>
      <P>
        辞典の京都弁90語のうち、出典つきの照合台帳に載っているのは9語です（2026年11月23日の集計）。
        内訳は、Wikipedia「京言葉」「近畿方言」で確認した4語（おおきに・まったり・えらい・はんなり）と、国語辞典（小学館『デジタル大辞泉』・『日本国語大辞典』）で確認した5語（〜はる・どす・ほたえる・いちびる・すかたん）です。
        残る81語は、台帳に出典の記録がありません。
      </P>
      <P>
        9語のうち7語は、出典に「京都以外でも使う」と書かれた語でした。
        たとえば「おおきに」について、Wikipedia「近畿方言」は、近畿地方に限らず西日本各地や東北の一部でも用いる地域があると説明しています。
        辞典の中で見ても、京都弁90語のうち32語は、他の方言にも同じ見出し語があります（ひらがな・カタカナの違いは同じ語として数えました）。
      </P>
      <P>
        <strong>「京都らしい言葉」と見える語の多くは、近畿や西日本の広い範囲で使われる語でもある</strong>ということです。
        「ほかす」「いちびる」「かなん」「いけず」のように、大阪弁・神戸弁にも載っている語は、京都だけの言葉とは言えません。
        「いちびる」の全国での使われ方は、
        <Link href="/blog/chousi-ni-noru-hogen" className={LINK}>「調子に乗る」の方言を全国で並べた記事</Link>
        でも見られます。
      </P>

      <H2 id="s5">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/kyoto" className={LINK}>京都弁（京言葉）変換</Link>
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
        「おいでやす」「おきばりやす」「ごめんやす」のように、1つの挨拶として辞典に載っている形は直ります。
        標準語の「いらっしゃいませ」は「おいでやす」に、「トイレ」は「ハバカリ」になります。
        一方、<strong>文末の「どす」「え」と、動詞に付く「はる」は直りません。</strong>
      </P>
      <P>
        「かんにんえ」は、「かんにん」の部分だけが「ごめんなさい」になり、文末の「え」が「ごめんなさいえ」と残りました。
        標準語から京都弁へ入れた「お母さんがもう帰ってきたよ。」も、「帰ってきはったえ」にはなりません。
      </P>
      <P>
        そのため、変換結果の京都弁をそのまま使うと、語だけ京都風で、語尾は標準語のままの文になることがあります。
        この限界は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にまとめています。
        語彙そのものを比べたいときは、
        <Link href="/blog/kawaii-hogen-ranking" className={LINK}>かわいい方言ランキング</Link>
        で、京都弁が第2位に入った理由も読めます。
      </P>

      <H2 id="s6">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-4">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <P>{f.a}</P>
        </div>
      ))}

      <H2 id="s7">まとめ：次にやること</H2>
      <P>
        京言葉と京都弁は同じものを指します。
        「どす」「はる」は幕末から明治初期に生まれた形とされ、調査では「どす」は世代で使われ方が大きく違いました。
        辞典の例文90文では、「どす」14文・「やす」11文・「はる」6文で、約半数の48文は京言葉らしい語尾を持ちません。
        変換ツールは、挨拶や名詞の語は直しますが、文末の「どす」や動詞の「はる」は直しません。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾と一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/kyoto" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 京都弁（京言葉）変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/kyoto" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 京都弁検定
        </Link>
      </P>

      <P>この記事の数字は、出どころで3つに分かれます。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>1993〜94年の調査の割合（49.2%・54.0%など）：出典はWikipedia「京言葉」の記述です。原本は未確認です。</li>
        <li>辞典の例文の数（14文・6文・42文など）：方言ラボの辞典を2026年11月23日に数えた自社集計です。</li>
        <li>変換ツールの結果：同日に自社のツールを実行した出力です。</li>
      </ul>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「京言葉」の本文を2026年11月23日に取得し、呼称、歴史、区分、敬語の節を読みました。辞典の例文の語尾の集計と変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（京都弁9語）の出典の内訳。『デジタル大辞泉』『日本国語大辞典』の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：岸江信介・井上文子『京都市方言の動態』（1997）と岸江信介（1998）の原本（Wikipedia の記述を介して数字を引いています）、現在の京都の若い世代の使い方、辞典の京都弁81語の出典。
          </li>
        </ul>
        そのため、これらを「京都の人は今こう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「京言葉」呼称・歴史・区分・敬語の節（調査の数字の出典として『京都市方言の動態』などを挙げる）2026年11月23日取得",
            url: "https://ja.wikipedia.org/wiki/京言葉",
          },
          {
            label: "岸江信介・井上文子『京都市方言の動態』近畿方言研究会（1997）（Wikipedia「京言葉」が出典に挙げる文献。原本は未確認）",
          },
          {
            label: "岸江信介「京阪方言における親愛表現構造の枠組み」日本語科学（1998）（Wikipedia「京言葉」が「はる」の数字の出典に挙げる文献。原本は未確認）",
          },
          {
            label: "コトバンク「どす」「はる」（小学館『デジタル大辞泉』・精選版『日本国語大辞典』）",
            url: "https://kotobank.jp/word/どす",
          },
          {
            label: "方言ラボ 京都弁変換ツールの実行結果・辞典の例文の集計（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/kyoto",
          },
        ]}
      />
    </ArticleShell>
  );
}
