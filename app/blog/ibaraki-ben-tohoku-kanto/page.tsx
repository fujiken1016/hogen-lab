import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("ibaraki-ben-tohoku-kanto")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/ibaraki-ben-tohoku-kanto" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/ibaraki-ben-tohoku-kanto", type: "article", image: { path: "/og/blog-ibaraki-ben-tohoku-kanto.jpg", alt: "茨城弁は東北弁？関東弁？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

const SCHOOLS: [string, string, string][] = [
  ["都竹通年雄（1949）", "本州東部方言の南奥羽方言（岩手県南部・宮城県・山形県東部・福島県・栃木県と同じ区分）", "東北方言に含める"],
  ["金田一春彦（1955）", "東日本方言の北部方言の南奥方言（該当地域は都竹とほぼ同じ）", "東北方言に含める"],
  ["東條操（1953）", "関東方言の東関東方言（栃木県の大部分とともに）", "関東方言に含める"],
  ["大橋勝男（1981）", "関東地方域方言の「関東東北部」分派（栃木県の大部分とともに）", "関東方言の中に置く"],
];

const CMP: [string, string, string][] = [
  ["イとエ", "区別が確かでなく、中間の音で発音される", "単独のイとエがエに統合する"],
  ["か行・た行", "語中・語尾で濁音になる（柿がカギになる）", "語頭以外のカ・タ行がガ・ダ行になる（開けるがアゲルになる）"],
  ["アクセント", "単語で区別しない無アクセント。県西の一部などに例外がある", "仙台市より南は一型アクセント（無アクセント）。北は特殊アクセント"],
  ["「〜しよう」「〜だろう」", "「べ」「っぺ」（だっぺ・すっぺ）", "「べ」。「る」で終わる動詞では「っぺ」にもなる"],
  ["方向の「さ」", "「水戸さ行く」のように使う", "「東京さ行く」のように使う"],
];

const ENDINGS: [string, number][] = [
  ["〜っぺ・〜べ", 17],
  ["〜さ（方向）", 5],
  ["〜け（疑問）", 4],
];

const SHARED: [string, number][] = [
  ["仙台弁", 7],
  ["福島弁", 5],
  ["山形弁", 4],
  ["北海道弁", 4],
  ["南部弁", 3],
  ["静岡弁", 2],
  ["鳥取弁", 2],
];

const SRC: [string, number][] = [
  ["Wikipedia「茨城弁」", 17],
  ["『茨城方言集覧』（1904）", 13],
  ["JLect の茨城方言の語彙表", 2],
];

const TESTS: [string, string, string][] = [
  ["茨城弁→標準語", "転んだのけ？だいじけ？", "転んだのけ？大丈夫け？（「け」は残る）"],
  ["茨城弁→標準語", "今日は一日畑仕事で、あーこわい。", "今日は一日畑仕事で、あー疲れた。"],
  ["茨城弁→標準語", "んだっぺ、おれの言ったとおりだ。", "そうだろう、おれの言ったとおりだ。"],
  ["茨城弁→標準語", "ごじゃっぺばっか言ってんじゃねえよ。", "いい加減ばっか言ってんじゃねえよ。（意味は近いが、文としては少し不自然）"],
  ["茨城弁→標準語", "らいさま鳴ってっから、早く帰んべ。", "変わらない（「らいさま」も「帰んべ」も置き換わらない）"],
  ["茨城弁→標準語", "この井戸水、ひゃっこくてうめえな。", "変わらない（「ひゃっこい」は活用した形）"],
  ["標準語→茨城弁", "冷たい", "ひゃっこい"],
  ["標準語→茨城弁", "でたらめ", "ごじゃっぺ"],
  ["標準語→茨城弁", "疲れた", "こわい"],
  ["標準語→茨城弁", "ごめんね", "ごめんね（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "茨城弁は、東北弁の仲間ですか？",
    a: "学者によって分け方が違います。Wikipedia「茨城弁」は、茨城弁を栃木弁とともに東関東方言に分類する一方で、東北方言や東京方言との共通も多いと書いています。都竹通年雄や金田一春彦は東北方言に含め、東條操や平山輝男は関東方言に含めた、という整理です。",
  },
  {
    q: "「〜っぺ」は、茨城だけの語尾ですか？",
    a: "茨城だけではありません。Wikipedia「茨城弁」は、「べ」「っぺ」を、文語の「べし」の名残で、いわゆる「関東べい」が変形したものと書いています。Wikipedia「仙台弁」にも、助動詞「べ」が「る」で終わる動詞につくと「っぺ」になる、という説明があります。辞典の仙台弁にも、「食うべ」「作るべ」「だべ」など4文に「べ」が出ます。",
  },
  {
    q: "「ごじゃっぺ」は、文末の「〜っぺ」と同じですか？",
    a: "別のものです。「ごじゃっぺ」は、でたらめ、いい加減という意味の語で、Wikipedia「茨城弁」は「ごじゃっぺ・ごじゃらっぺ」を、でたらめ、いい加減（な人、な事）、馬鹿という意味の語として載せています。語の一部に「っぺ」が入っているだけで、「〜しよう」「〜だろう」を表す文末の「っぺ」とは別の語として載っています。2つの語源が関係するかどうかは、確認していません。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>茨城弁を東北方言と見るか関東方言と見るかは、方言学者の間でも分かれています。</strong>
        Wikipedia「茨城弁」は、茨城弁を東関東方言（栃木と同じ区分）に分類しますが、東北方言に含める説もあります。
        方言ラボの辞典の茨城弁102語のうち、他の方言にも同じ見出し語があるのは22語で、そのうち14語に、東北の6方言のどれかが入っていました。
        文末の「〜っぺ」「〜べ」は、例文17文に出ます。
      </P>
      <P>
        この記事では、学者の分け方を表にしたうえで、茨城弁と仙台弁の音の特徴を並べ、辞典の例文の語尾を数えます。
        あわせて、辞典の語が東北の方言とどれだけ重なるか、出典、変換ツールが直せない形も、実行結果で確かめました。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "茨城弁は東北方言か、関東方言か" },
        { id: "s2", label: "音の特徴は、仙台弁とよく似ている" },
        { id: "s3", label: "辞典の例文の語尾を数えると" },
        { id: "s4", label: "辞典の茨城弁を、東北の方言と照らすと" },
        { id: "s5", label: "辞典の茨城弁は、どこの言葉か" },
        { id: "s6", label: "変換ツールに入れると、どう変わるか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">茨城弁は東北方言か、関東方言か</H2>
      <P>
        Wikipedia「茨城弁」は、茨城弁を栃木弁とともに東関東方言に分類しています。
        一方で、東北地方南部の福島県や、隣の栃木県の方言に通じる共通点があり、東北方言や東京方言との共通も多いとも書いています。
        茨城県の方言を、東北方言に含める説と関東方言に含める説があるためです。
      </P>
      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            茨城県の方言の区分の主な説（Wikipedia「茨城弁」より・2026年11月25日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">学者（発表年）</th>
              <th scope="col" className="py-2 pr-3 font-bold">区分</th>
              <th scope="col" className="py-2 font-bold">茨城をどちらに置くか</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {SCHOOLS.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="学者（発表年）" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="区分" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="茨城をどちらに置くか" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        同記事は、前者の例として都竹通年雄や金田一春彦、後者の例として東條操や平山輝男を挙げています。
        <strong>どちらかに決着している、とは書かれていません。</strong>
        語彙についても、「こわい」（疲れた）などは東北方言、特に南奥羽方言と共通し、関東方言と東北方言の接触地帯としての茨城方言の性格が表れている、と説明しています。
        「こわい」（疲れた）の使われ方は、
        <Link href="/blog/fukushima-kowai-tsukareta" className={LINK}>福島弁の「こわい」を扱った記事</Link>
        で詳しく書きました。
      </P>

      <H2 id="s2">音の特徴は、仙台弁とよく似ている</H2>
      <P>
        Wikipedia「茨城弁」と「仙台弁」の説明を並べると、音と語尾の特徴に、共通する点がいくつもあります。
      </P>
      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            茨城弁と仙台弁の音と語尾の特徴（Wikipedia「茨城弁」「仙台弁」より・2026年11月25日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">特徴</th>
              <th scope="col" className="py-2 pr-3 font-bold">茨城弁</th>
              <th scope="col" className="py-2 font-bold">仙台弁</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {CMP.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="特徴" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="茨城弁" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="仙台弁" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        この表の特徴は、東北だけのものではありません。
        「シ」と「ス」の区別がなくなる、いわゆるズーズー弁の特徴が、東北だけでなく茨城・栃木などにも広がっているとされる話は、
        <Link href="/blog/hogen-oto-no-chigai" className={LINK}>方言の音の違いを扱った記事</Link>
        にあります。
        一方で、Wikipedia「茨城弁」は、東北方言との違いも書いています。
        短音化の傾向は茨城にもあるが東北では著しいこと、イ段・ウ段の中舌化は茨城でもその傾向があるが、東北の大部分では「し」と「す」などの区別がなくなっていること、などです。
      </P>
      <P>
        仙台弁のほうの語尾や、宮城県内の地域差は、
        <Link href="/blog/sendai-ben-ccha-dakara" className={LINK}>仙台弁の「〜っちゃ」を数えた記事</Link>
        で扱っています。
      </P>

      <H2 id="s3">辞典の例文の語尾を数えると</H2>
      <P>
        方言ラボの辞典には、茨城弁が102語載っていて、それぞれに例文が1文ずつ付いています。
        その102文の語尾などを数えました（2026年11月25日の自社集計）。
      </P>

      <BarFig
        max={17}
        unit="文"
        ariaLabel="辞典の茨城弁の例文102文に出る語尾などの数。っぺ・べ17文、さ5文、け4文"
        caption="図：辞典の茨城弁102文に出る語尾などの数（2026年11月25日・自社集計）"
        items={ENDINGS.map(([l, n]) => ({ label: l, value: n, dim: n < 6 }))}
      />

      <P>
        <strong>いちばん多いのは、「〜っぺ」「〜べ」で17文</strong>です。
        「〜っぺ」が13文、「〜べ」が4文でした。
        「んだっぺ、おれの言ったとおりだ。」「駅までなら、あるってくべ。」のように、推量や意志の形で出ます。
        Wikipedia「茨城弁」は、この「べ」「っぺ」を、意志・推量・勧誘を表す助動詞と書いています。
      </P>
      <P>
        方向を表す「さ」は5文です（「東京さ行ってんだ」「駅さ着くよ」など）。
        同記事は、この「さ」を、茨城以外にも関東・東北で広く行われる助詞と書いています。
        疑問の「け」は4文で、「転んだのけ？」「新車買ったのけ？」のように出ます。
        同記事は、疑問の「け」を、「か」と同じ意味で、ニュアンスはやや丁寧で親密感があり、穏やかな問いかけになると説明しています。
        ほかに、「〜てくれっけ？」の形が3文ありました。
      </P>
      <P>
        辞典の例文は用例として載せた文で、茨城の人の話し言葉の記録ではないため、使用率としては読めません。
      </P>

      <H2 id="s4">辞典の茨城弁を、東北の方言と照らすと</H2>
      <P>
        辞典の茨城弁102語のうち、他の方言にも同じ見出し語があるのは22語でした（2026年11月25日の集計）。
        いちばん多い相手は、仙台弁の7語です。
      </P>

      <BarFig
        max={7}
        unit="語"
        ariaLabel="辞典の茨城弁で、他の方言にも載る22語の相手の方言。仙台弁7語、福島弁5語、山形弁4語、北海道弁4語、南部弁3語、静岡弁2語、鳥取弁2語"
        caption="図：茨城弁と同じ見出し語を持つ方言（2026年11月25日・自社集計。1語が複数の方言と重なる場合は、それぞれに数えた）"
        items={SHARED.map(([l, n]) => ({ label: l, value: n, dim: n < 3 }))}
      />

      <P>
        22語を、津軽弁・南部弁・秋田弁・仙台弁・山形弁・福島弁の6方言と照らすと、14語に、このうちのどれかが入っています。
        「こわい」（疲れた）、「ひゃっこい」（冷たい）、「らいさま」（雷）、「おごご」（お漬物）、「ばっぱ」（おばあさん）、「やっこい」（やわらかい）などです。
        <strong>共通する22語のうち、14語（64%）に東北の方言が入っています。</strong>辞典に載る方言の数や並びに左右される数字で、東北に寄っているとまでは言えません。
      </P>
      <P>
        残りの8語は、東北以外の方言と重なっていました。
        「うんと」（土佐弁）、「おてしょ」（京都弁）、「うでる」（名古屋弁）、「うっちゃる」（静岡弁）などです。
        北海道弁とも4語（「こわい」「おがる」「かっちゃく」「ばくる」）が重なります。
        北海道弁と東北の重なりは、
        <Link href="/blog/hokkaido-ben-touhoku-hokuriku" className={LINK}>北海道弁と東北・北陸の方言を数えた記事</Link>
        にあります。
      </P>
      <P>
        <strong>ただし、この数字では「関東の方言との重なり」は測れません。</strong>
        辞典に載っている関東の方言は、茨城弁だけで、栃木弁・埼玉・千葉・東京の言葉は載っていないためです。
        東北の方言とだけ照らしたので、東北に近く見えるのは、比べる相手がそちらにしか無いせいかもしれません。
        また、これは辞典の中での重なりで、語の由来は示しません。同じ見出し語でも、意味が同じとは限りません。
      </P>

      <H2 id="s5">辞典の茨城弁は、どこの言葉か</H2>
      <P>
        辞典の茨城弁102語のうち、出典つきの照合台帳に載っているのは36語です（2026年11月25日の集計）。
        そのうち、出典で語と語釈を確認できたのは32語で、残る4語は出典に届いていません。
        32語の出典は、次の内訳でした。
      </P>

      <BarFig
        max={17}
        unit="語"
        ariaLabel="出典を確認できた茨城弁32語の出典の内訳。Wikipedia茨城弁17語、茨城方言集覧1904が13語、JLectが2語"
        caption="図：出典を確認できた茨城弁32語の出典の内訳（2026年11月25日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 6 }))}
      />

      <P>
        明治37年（1904）の『茨城方言集覧』で確認できた語が13語あります。
        100年以上前の方言集に載る語が一定数ある一方で、台帳に載っていない66語は、この記事では出典を確かめていません。
      </P>

      <H2 id="s6">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/ibaraki" className={LINK}>茨城弁変換</Link>
        に入れました（2026年11月25日・ツールと同じ関数で実行）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた文と、変換ツールの出力（2026年11月25日・方言ラボ自社実測）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">向き</th>
              <th scope="col" className="py-2 pr-3 font-bold">入れた文</th>
              <th scope="col" className="py-2 font-bold">出力</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {TESTS.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="向き" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="入れた文" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="出力" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        「こわい」は「疲れた」に、「んだっぺ」は「そうだろう」に、「ごじゃっぺ」は「いい加減」に直ります。
        標準語の「冷たい」は「ひゃっこい」に、「でたらめ」は「ごじゃっぺ」に変わります。
        一方、<strong>「帰んべ」のような「べ」の形や、「ひゃっこくて」のように活用した形は、直りません。</strong>
        「け」も、「だいじけ」の「だいじ」だけが直って、語尾の「け」は残ります。
      </P>
      <P>
        「ごじゃっぺばっか」は、「いい加減ばっか」になりました。意味は近いのですが、文としては少し不自然です。
        変換結果は、辞典の語釈と同じ意味になるとは限らないので、気になる語は言葉一覧の語釈で確かめてください。
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
        茨城弁は、東北方言に含める説と関東方言に含める説があり、Wikipedia「茨城弁」は、どちらかに決まっているとは書いていません。
        辞典の例文102文では、「〜っぺ」「〜べ」が17文で、他の方言にも載る22語のうち14語に東北の方言が入っています。
        ただし、辞典には関東の他の方言が無いので、関東側との重なりは測れません。
        変換ツールは、語は直しますが、「べ」や活用した形は直しません。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾も一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/ibaraki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 茨城弁変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/ibaraki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 茨城弁検定
        </Link>
      </P>

      <P>この記事の数字は、出どころで3つに分かれます。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>学者による区分、音と語尾の特徴、語彙の説明：Wikipedia「茨城弁」「仙台弁」の記述です。引用元の原典は確認していません。</li>
        <li>辞典の例文の数（17文・5文・4文）と、他の方言との重なり（22語・14語など）：方言ラボの辞典を2026年11月25日に数えた自社集計です。</li>
        <li>変換ツールの結果：同日に自社のツールを実行した出力です。</li>
      </ul>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「茨城弁」の概要・発音・文法・東北方言との関係・語彙の節と、Wikipedia「仙台弁」の特徴の節を2026年11月25日に読みました。辞典の例文の語尾の集計、他方言との重なりの集計、変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（茨城弁36語）の出典の内訳。『茨城方言集覧』（1904）の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：都竹・金田一・東條・大橋の各説の原典（Wikipedia の整理を紹介しているだけです）、「べ」「っぺ」の現在の使用率、関東の他の方言との重なり（辞典に無いため）、辞典の茨城弁66語の出典。
          </li>
        </ul>
        そのため、これらを「茨城ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「茨城弁」概要・方言区画における位置づけ・発音・文法・東北方言との関係・語彙の節 2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/茨城弁",
          },
          {
            label: "Wikipedia「仙台弁」概要・特徴（音声・アクセント・文法）の節 2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/仙台弁",
          },
          {
            label: "茨城教育協会編『茨城方言集覧』（1904）国立国会図書館デジタルコレクション（出典照合台帳の記録）",
          },
          {
            label: "方言ラボ 茨城弁変換ツールの実行結果・辞典の例文の集計（2026年11月25日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/ibaraki",
          },
        ]}
      />
    </ArticleShell>
  );
}
