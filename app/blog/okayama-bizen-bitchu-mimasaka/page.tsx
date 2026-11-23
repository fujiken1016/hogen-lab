import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("okayama-bizen-bitchu-mimasaka")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/okayama-bizen-bitchu-mimasaka" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/okayama-bizen-bitchu-mimasaka", type: "article", image: { path: "/og/blog-okayama-bizen-bitchu-mimasaka.jpg", alt: "岡山弁は3地域で違う" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 方言ラボの岡山弁辞典（87語）のうち、Wikipedia「岡山弁」の語彙節に項目がある語（2026年11月23日・自社照合）
// [語, 辞典の意味, Wikipedia の注記]
const MIMASAKA: [string, string, string][] = [
  ["もんげー", "ものすごい", "美作地域では使用しない"],
  ["みてる", "なくなる・尽きる", "美作地方では使われない"],
  ["おらぶ", "大声で叫ぶ", "美作地方では使われない"],
  ["とらげる", "片付ける、しまう", "美作地方では使われない"],
  ["ねき", "そば、近く", "美作地方では使用されない"],
  ["ほとびる", "水を吸ってふやける", "美作地方では使われない"],
  ["いごいごする", "うろちょろする", "美作地方では使用されない"],
  ["くぎる", "焦げる", "美作地方では使われない"],
  ["なんば", "とうもろこし", "美作地方では使用されない"],
];

// 「すごく」にあたる4語（Wikipedia「岡山弁」語彙節の説明）
const SUGOI: [string, string][] = [
  ["でーれー", "「すごい」。「どえらい」が変化した語。副詞の形「でーろー」は美作では使われない、と書かれています。"],
  ["ぼっけー（ぼっけえ）", "「すごい、ものすごい、大きい」。主に量や程度を表す語で、備前地方で使われる、と書かれています。"],
  ["もんげー", "「ものすごい、とんでもない」。「ものすごい」が変化した語で、美作地域では使用しない、と書かれています。"],
  ["ぶち", "「とっても」。主に備後（広島県東部）で使われ、「でーれー」とほぼ同等か少し弱い、と書かれています。"],
];

// 「〜しなさい」の言い方（Wikipedia「岡山弁」・出典は金沢・中東2009）
const MEIREI: [string, string][] = [
  ["備前", "○○せられー"],
  ["備中", "○○しねー"],
  ["美作", "○○しんちゃい"],
];

// 変換ツールに入れた結果（2026年11月23日・方言ラボの変換ツールと同じ関数）
const TESTS: [string, string, string][] = [
  ["標準語→岡山弁", "今日はとても寒いね。", "今日はでーれー寒いね。"],
  ["標準語→岡山弁", "そこの近くに座って。", "そこのねきに座って。"],
  ["標準語→岡山弁", "とうもろこしを焼く。", "なんばを焼く。"],
  ["標準語→岡山弁", "今日はすごく寒いね。", "今日はすごく寒いね。（変わらない）"],
  ["標準語→岡山弁", "早くしなさい。", "早くしなさい。（変わらない）"],
  ["岡山弁→標準語", "ガソリンがみてるけえ、スタンド寄ろう。", "ガソリンがなくなるけえ、スタンド寄ろう。"],
  ["岡山弁→標準語", "ぼっけえかわいい服じゃな。", "すごいかわいい服じゃな。"],
  ["岡山弁→標準語", "はよしねー、遅れるが。", "はよしねー、遅れるが。（変わらない）"],
  ["岡山弁→標準語", "冷めんうちにはよ食べられー。", "冷めんうちにはよ食べられー。（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "「でーれー」と「ぼっけえ」は、岡山のどこで使いますか？",
    a: "Wikipedia「岡山弁」には、「ぼっけー」は備前地方で使われると書かれ、「でーれー」には地域の注記がありません（副詞の形「でーろー」は美作では使われないと書かれています）。ただし岡山大学の研究は、旧3国で対立する語は多くないと整理しています。県内どこでも通じる語なのか、地域が限られるのかは、この記事では確かめていません。",
  },
  {
    q: "岡山弁の「もんげー」は、岡山県全域の言葉ですか？",
    a: "Wikipedia「岡山弁」は、「もんげー」は美作地域では使用しないと書いています。一方、岡山県の2014年のPRページは、「もんげー」を「すごい」という意味の岡山弁として紹介しています。県全域で使うとは、そのページには書かれていません。",
  },
  {
    q: "変換ツールの岡山弁は、備前・備中・美作のどこ向けですか？",
    a: "地域は分けていません。2026年11月23日の実行では、「近く」が「ねき」に、「とうもろこし」が「なんば」に置き換わりましたが、この2語は Wikipedia「岡山弁」で美作では使用されないと書かれた語です。出力は県内のどの地域でも通じるとは限らない、と読んでください。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>Wikipedia「岡山弁」の語彙の節のおよそ115項目のうち、およそ35項目に「美作では使われない（使用しない）」という注記があります。方言ラボの岡山弁辞典87語のうち、この注記つきの語は9語でした。</strong>
        一方、岡山大学の研究は、備前・備中・美作の3つの旧国が互いに対立して分布する事象は多いとは言えない、と整理しています。
      </P>
      <P>
        つまり「岡山弁は3地域でくっきり分かれる」とも「ほとんど同じ」とも、言い切れません。
        この記事では、辞典の語を Wikipedia の注記と照らし合わせた結果と、研究の見方を並べ、変換ツールの出力がどの地域向けなのかを実例で確かめます。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "岡山県は3つの旧国に分かれる" },
        { id: "s2", label: "辞典87語のうち、「美作では使わない」と書かれた9語" },
        { id: "s3", label: "「すごく」を言う4語：でーれー・ぼっけー・もんげー・ぶち" },
        { id: "s4", label: "「〜しなさい」は3つの旧国で形が違う" },
        { id: "s5", label: "研究は「3国の対立は多くない」と言う" },
        { id: "s6", label: "変換ツールの出力は、どの地域向けか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">岡山県は3つの旧国に分かれる</H2>
      <P>
        岡山県の方言は、旧国ごとに分けて語られることが多いです。
        Wikipedia「岡山弁」は、県内の方言を備前（東南部）、備中（西部）、美作（東北部）に分類しています。
        岡山大学の研究にも、岡山県内の方言差はさほど大きくなく、備前・備中・美作の旧国域に対応した緩やかな差が認められるのが通説だった、という書き出しがあります。
      </P>
      <P>
        ただし、この研究は続けて、県全域を対象にした言語地理学的な調査を踏まえた言説とは言い難い、とも書いています。
        つまり、「3地域に分かれる」という説明は、長く言われてきた通説であって、全域の調査で確かめられたものではない、という立場です。
        この記事も、通説を紹介しつつ、確かめられていない部分を分けて書きます。
      </P>

      <H2 id="s2">辞典87語のうち、「美作では使わない」と書かれた9語</H2>
      <P>
        Wikipedia「岡山弁」の語彙の節には、語ごとに使われる地域の注記があります。
        2026年11月23日に本文を取得して数えると、語彙の節はおよそ115項目で、そのうちおよそ35項目に「美作地方（地域）では使われない・使用しない」という注記がありました（同じ見出しが2か所に出る項目を含みます。数え方で数項目ずれるため、約3割という目安で読んでください）。
        約3割です。
      </P>
      <P>
        この項目と、方言ラボの岡山弁辞典87語を突き合わせました。
        辞典の語のうち、Wikipedia に項目があるのは24語。そのうち「美作では使われない」の注記があるのは次の9語です。
      </P>

      <BarFig
        max={87}
        unit="語"
        ariaLabel="方言ラボの岡山弁辞典87語のうち、Wikipediaの岡山弁に項目がある語は24語、そのうち美作では使われないと書かれた語は9語、残りの63語は項目なし"
        caption="図：辞典87語と Wikipedia「岡山弁」の突き合わせ（2026年11月23日・自社照合）"
        items={[
          { label: "辞典の岡山弁の語", value: 87 },
          { label: "Wikipedia に項目がある語", value: 24, dim: true },
          { label: "うち「美作では使われない」の注記つき", value: 9, dim: true },
        ]}
      />

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「美作では使われない」と書かれた、辞典の9語（Wikipedia「岡山弁」語彙の節・2026年11月23日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">語</th>
              <th scope="col" className="py-2 pr-3 font-bold">辞典の意味</th>
              <th scope="col" className="py-2 font-bold">Wikipedia の注記</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {MIMASAKA.map(([w, m, n]) => (
              <tr key={w} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="語" className="py-2 pr-3 whitespace-nowrap max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{w}</td>
                <td data-l="辞典の意味" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{m}</td>
                <td data-l="Wikipedia の注記" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        <strong>この表の見方には、2つの注意があります。</strong>
        1つ目は、Wikipedia は誰でも編集できる百科事典で、語彙の節の注記も1語ずつ出典が付いているわけではないことです。
        2つ目は、辞典の残り63語は「Wikipedia に項目がない」だけで、「県内どこでも使う」という意味ではないことです。
        表の9語は、地域差の目安として読んでください。
      </P>

      <H2 id="s3">「すごく」を言う4語：でーれー・ぼっけー・もんげー・ぶち</H2>
      <P>
        岡山弁といえば「でーれー」「ぼっけえ」「もんげー」が有名です。
        辞典には「ぶち」も載っています。
        Wikipedia「岡山弁」の説明を、4語まとめて並べます。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        {SUGOI.map(([w, d]) => (
          <li key={w}>
            <strong>{w}</strong>：{d}
          </li>
        ))}
      </ul>
      <P>
        4語とも「すごい・とても」の意味ですが、注記は同じではありません。
        「ぼっけー」は備前、「もんげー」は美作では使わない、「ぶち」は備後（広島県東部）が中心、という具合です。
        岡山県のPRページ「もんげー岡山！」（2014年）は、「もんげー」を「すごい」という意味の岡山弁として紹介しています。
        ただ、そのページには、県内全域で使うとは書かれていません。
      </P>
      <P>
        「とても」を35方言に入れた結果は、
        <Link href="/blog/tottemo-hogen-henkan" className={LINK}>「とても」を方言にするとどうなる？35方言の実測</Link>
        にまとめています。
        岡山弁は、そこでは「とても」が「でーれー」に置き換わる方言の1つでした。
      </P>

      <H2 id="s4">「〜しなさい」は3つの旧国で形が違う</H2>
      <P>
        語彙より、文の形のほうが、旧国の違いがはっきり書かれています。
        Wikipedia「岡山弁」には、「〜しなさい」「〜してください」にあたる、やわらかい命令の言い方が旧国で違うと書かれ、3つが表になっています（出典は金沢・中東2009）。
      </P>

      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「○○しなさい」の言い方（Wikipedia「岡山弁」・2026年11月23日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">旧国</th>
              <th scope="col" className="py-2 font-bold">言い方</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {MEIREI.map(([k, v]) => (
              <tr key={k} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="旧国" className="py-2 pr-3 whitespace-nowrap max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{k}</td>
                <td data-l="言い方" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        方言ラボの辞典にも、この言い方が2つ載っています。
        「られー」（〜しなさい）の例文は「冷めんうちにはよ食べられー。」で、備前の形にあたります。
        「〜しねー」は、辞典が「主に備中」と注記した語で、例文は「はよしねー、遅れるが。」です。
        備前・備中の2つは辞典に入っていて、美作の「〜しんちゃい」は辞典にありません。
      </P>
      <P>
        もし岡山の人に「はよしねー」と言われたら、備中の言い方かもしれない、と読むことができます。
        同じ意味でも、備前なら「はよせられー」になります。
        ただし、これも通説の説明で、いまの若い世代が旧国ごとにこの形を使い分けているかどうかは、この記事では確かめていません。
      </P>

      <H2 id="s5">研究は「3国の対立は多くない」と言う</H2>
      <P>
        ここまでは、3つの旧国で分かれる話でした。
        一方、岡山大学の研究は、1950年代に調査された『中国地方五県言語地図』の岡山県域の地図を読み解き、県内の方言分布の傾向を4つにまとめています。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>西と東の対立。備後から伝わった西の事象が、少しずつ東へ進む傾向がある。</li>
        <li>県南と県北の対立。西から伝わった県南の事象が北上し、県北には古い事象や、伯耆・因幡につながる事象が見られる。</li>
        <li>備前・備中・美作の3つの旧国が、互いに対立して分布する事象は、必ずしも多いとは言えない。</li>
        <li>備中南部の井笠地域には、独自の分布が認められる。</li>
      </ul>
      <P>
        3つ目が大事です。
        <strong>研究の整理では、旧国3つで分かれる語は、必ずしも多くありません。</strong>
        むしろ「西か東か」「県南か県北か」という軸のほうが目立つ、という見方です。
        Wikipedia の「美作では使われない」という注記が多い理由も、この「県南の事象が北上する」傾向と、重なって読めそうです。
        ただし、そう言い切るには、1語ずつ地図で確かめる必要があり、この記事ではやっていません。
      </P>
      <P>
        方言の区画を、県の単位でなく別の単位で見る例としては、
        <Link href="/blog/kyushu-hogen-gradation" className={LINK}>九州弁を3つの区画で見る記事</Link>
        もあります。
        地域の違いを読むときは、県名より細かい単位を見るのが基本です。
      </P>

      <H2 id="s6">変換ツールの出力は、どの地域向けか</H2>
      <P>
        方言ラボの
        <Link href="/translate/okayama" className={LINK}>岡山弁変換</Link>
        に、ここまでの語を入れて試しました（2026年11月23日・ツールと同じ関数で実行）。
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
        <strong>「近く→ねき」「とうもろこし→なんば」は、どちらも美作では使われないと書かれた語です。</strong>
        ツールは地域を分けずに、辞典に載っている語を返します。
        そのため、出力は「岡山弁」としてまとめて読めますが、岡山県内のどの地域でも通じるとは限りません。
      </P>
      <P>
        また、「〜しねー」「〜られー」のような語尾は、岡山弁から標準語へ入れても変わりません。
        辞典の岡山弁の例文87文を標準語に入れると、何かが置き換わったのは58文で、29文は入力と同じ文でした。
        語尾や活用が直らない理由は、
        <Link href="/blog/hogen-henkan-kawaranai" className={LINK}>方言変換で文が変わらない理由を420通りで数えた記事</Link>
        にあります。
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
        岡山弁の語には、Wikipedia に「美作では使われない」と書かれたものがあり、辞典87語のうち9語が当てはまります。
        一方、研究は、備前・備中・美作で分かれる語は多くなく、西と東、県南と県北の違いのほうが目立つと整理しています。
        どちらも本当らしく見えるので、地域の注記は目安として、地元の人の言い方を優先してください。
      </P>
      <P>
        次にやることは、気になる語を1つ選んで、辞典の意味と例文を引くことです。
        変換ツールの言葉一覧から引けます。
      </P>
      <P>
        <Link href="/translate/okayama" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 岡山弁 変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/okayama" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 岡山弁検定
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「岡山弁」の語彙の節（およそ115項目）の本文を2026年11月23日に取得し、「美作」を含む使用地域の注記を機械で数え、辞典87語と突き合わせました（辞典の見出しとカナを揃えて照合）。
          </li>
          <li>
            確かめたこと：岡山大学学術成果リポジトリの論文「岡山県下の方言分布」に、通説の紹介と、4つの分布傾向（本文の整理）が書かれていること（2026年11月23日に本文を確認）。
          </li>
          <li>
            確かめられていないこと：Wikipedia の注記が、現在の岡山県内の実際の使われ方に合っているか。注記は1語ずつ出典が付いているわけではありません。
          </li>
          <li>
            確かめられていないこと：「ぼっけー」「でーれー」を使う地域の範囲、「〜しんちゃい」の現在の使われ方、論文の著者名と刊行年（リポジトリの表示からは読み取れませんでした）。
          </li>
        </ul>
        そのため、これらを「備前ではこう、美作ではこう」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「岡山弁」語彙の節・文法の節（2026年11月23日取得。命令表現の出典は金沢・中東2009）",
            url: "https://ja.wikipedia.org/wiki/岡山弁",
          },
          {
            label: "岡山大学学術成果リポジトリ「岡山県下の方言分布」（『中国地方五県言語地図』の岡山県域の読解）",
            url: "https://ousar.lib.okayama-u.ac.jp/files/public/6/61484/20210310145317867899/kokugo_35_055_044.pdf",
          },
          {
            label: "岡山県「新しいPR『もんげー岡山！』」県政ハイライト（2014年9月16日）",
            url: "https://www.pref.okayama.lg.jp/site/160/410289.html",
          },
          {
            label: "方言ラボ 岡山弁変換ツールの実行結果（2026年11月23日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/okayama",
          },
        ]}
      />
    </ArticleShell>
  );
}
