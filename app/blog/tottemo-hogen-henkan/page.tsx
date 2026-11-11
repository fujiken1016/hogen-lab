import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("tottemo-hogen-henkan")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/tottemo-hogen-henkan" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/tottemo-hogen-henkan", type: "article" }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 「今日は○○うまい」を標準語→各方言に変換したときの、「とても」の置き換え先（2026年11月11日・方言ラボ変換ツールの実測）
const SAME: [string, string, string][] = [
  ["ばり", "3", "神戸弁・博多弁・長崎弁"],
  ["いぎなり", "2", "仙台弁・福島弁"],
  ["ばか", "2", "新潟弁・静岡弁"],
  ["えらい", "2", "京都弁・出雲弁"],
  ["ぶち", "2", "広島弁・山口弁"],
  ["なまら", "1", "北海道弁"],
  ["たんげ", "1", "津軽弁"],
  ["しったげ", "1", "秋田弁"],
  ["うんと", "1", "茨城弁"],
  ["がんこ", "1", "金沢弁"],
  ["めた", "1", "信州弁"],
  ["でら", "1", "名古屋弁"],
  ["めっちゃ", "1", "大阪弁"],
  ["やにこい", "1", "和歌山弁"],
  ["でーれー", "1", "岡山弁"],
  ["がいに", "1", "讃岐弁"],
  ["ごっつい", "1", "阿波弁"],
  ["こじゃんと", "1", "土佐弁"],
  ["しんけん", "1", "大分弁"],
  ["たいぎゃ", "1", "熊本弁"],
  ["わっぜ", "1", "鹿児島弁"],
  ["でーじ", "1", "沖縄方言"],
];

const WORDS: [string, string, string, string][] = [
  ["とても", "28", "北海道弁「なまら」・名古屋弁「でら」・広島弁「ぶち」など", "南部・山形・富山・飛騨・伊勢・鳥取・伊予"],
  ["すごく", "16", "北海道弁「なまら」・神戸弁「ばり」・鹿児島弁「わっぜ」など", "茨城・京都・大阪・熊本・長崎・沖縄など19方言"],
  ["非常に", "5", "名古屋弁「どえりゃあ」・大阪弁「めっちゃ」など", "30方言"],
  ["ものすごく", "5", "長崎弁「ばさらか」・岡山弁「でーれー」など", "30方言"],
  ["めっちゃ", "0", "なし", "35方言すべて"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "長崎弁で「とても」「めっちゃ」は何と言いますか？",
    a: "方言ラボの辞典では、長崎弁の「とても」にあたる語は「ばり」と「ばさらか」です。変換ツールは「とても」を「ばり」に、「ものすごく」を「ばさらか」に置き換えます。「めっちゃ」は置き換わりません。",
  },
  {
    q: "「ばり」は長崎・博多・神戸のどこの言葉ですか？",
    a: "辞典には神戸弁・博多弁・長崎弁の3方言に「ばり」が載っています。どれか1か所だけの言葉ではありません。出典の確認状況は語ごとに違い、この記事は「どこが発祥か」までは断定しません。",
  },
  {
    q: "「めっちゃ」を各地の方言に変換できますか？",
    a: "できません。2026年11月11日の実測では、35方言すべてで「めっちゃ」は置き換わりませんでした。辞典の語釈に「めっちゃ」と書かれた見出し語が無いためです。「とても」を大阪弁に変換すると「めっちゃ」が出ます。",
  },
  {
    q: "変換ツールで「とても」が置き換わらない方言はありますか？",
    a: "あります。南部弁・山形弁・富山弁・飛騨弁・伊勢弁・鳥取弁・伊予弁の7方言では、「とても」を入れても置き換わりませんでした。辞典に「とても」と同じ意味の見出し語が無いか、語釈の書き方が違うためです。",
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
          「とても」を標準語から方言に変換すると、35方言のうち28方言で別の語に置き換わります。
        </strong>
        一方、「めっちゃ」は35方言のどれにも置き換わりません。
        長崎弁なら、「とても」は「ばり」、「ものすごく」は「ばさらか」になります。
      </P>
      <P>
        これは、方言ラボの変換ツールに同じ文を入れて数えた結果です（2026年11月11日・自社実測）。
        辞典に載っている語だけを置き換えるツールなので、「この方言ではこう言うのが正しい」という断定ではありません。
        どの語がどの方言に載っているかを、表で確かめてください。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "「とても」は、何方言で別の語に置き換わる？" },
        { id: "s2", label: "同じ語を使う方言は、どこにある？" },
        { id: "s3", label: "「すごく」「めっちゃ」では、置き換わる方言が変わる？" },
        { id: "s4", label: "長崎弁の「とても」「めっちゃ」は何と言う？" },
        { id: "s5", label: "置き換わらないとき、どう読めばいい？" },
        { id: "s6", label: "よくある質問" },
        { id: "s7", label: "まとめ：次にやること" },
      ]} />

      <H2 id="s1">「とても」は、何方言で別の語に置き換わる？</H2>
      <P>
        「今日はとてもうまい」を標準語から35方言へ変換しました。
        置き換わったのは28方言で、置き換わらなかったのは7方言です。
        置き換え先の語は全部で22種類でした。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>置き換わった方言：28（22種類の語に分かれる）</li>
        <li>置き換わらなかった方言：南部弁・山形弁・富山弁・飛騨弁・伊勢弁・鳥取弁・伊予弁の7</li>
        <li>入れた文：「今日はとてもうまい」（標準語→各方言）</li>
      </ul>

      <H2 id="s2">同じ語を使う方言は、どこにある？</H2>
      <P>
        22種類の語のうち、2つ以上の方言で同じ語に置き換わったのは5語です。
        いちばん多いのは「ばり」で、神戸弁・博多弁・長崎弁の3方言でした。
        残りの17語は、1つの方言にだけ出てきました。
      </P>

      <BarFig
        max={17}
        unit="語"
        ariaLabel="「とても」の置き換え先22語を、使う方言の数で分けた棒グラフ。1方言だけの語が17語、2方言が4語、3方言が1語"
        caption="図：置き換え先の22語を、同じ語になった方言の数で分けたもの。2方言で同じ4語は、いぎなり・ばか・えらい・ぶち（2026年11月11日・自社実測）"
        items={[
          { label: "1方言だけに出た語", value: 17, dim: true },
          { label: "2方言で同じになった語", value: 4 },
          { label: "3方言で同じ語（ばり）", value: 1 },
        ]}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[460px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            「とても」の置き換え先（2026年11月11日・方言ラボ変換ツールの実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">置き換え先</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">方言数</th>
              <th scope="col" className="py-2 font-bold">方言</th>
            </tr>
          </thead>
          <tbody>
            {SAME.map(([w, n, ds]) => (
              <tr key={w} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{w}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{n}</td>
                <td className="py-2">{ds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        「ばり」は神戸（兵庫）と福岡・長崎という離れた土地に並びます。
        「ぶち」は広島と山口、「ばか」は新潟と静岡で、地理的に隣り合っていない組み合わせもあります。
        同じ音でも、土地ごとに別々に育った語かもしれません。
        ここでは語源や発祥までは調べていないので、分かったのは「辞典に載っている」ことだけです。
      </P>

      <H2 id="s3">「すごく」「めっちゃ」では、置き換わる方言が変わる？</H2>
      <P>
        「とても」以外の言い方でも、同じ文で試しました。
        置き換わる数は、入れる語によって大きく変わります。
      </P>

      <BarFig
        max={35}
        unit="方言"
        ariaLabel="入れた語ごとに置き換わった方言の数。とても28、すごく16、非常に5、ものすごく5、めっちゃ0（35方言中）"
        caption="図：入れた語ごとの、置き換わった方言の数（35方言中・2026年11月11日・自社実測）"
        items={[
          { label: "「とても」を入れた場合", value: 28 },
          { label: "「すごく」を入れた場合", value: 16 },
          { label: "「非常に」を入れた場合", value: 5, dim: true },
          { label: "「ものすごく」を入れた場合", value: 5, dim: true },
          { label: "「めっちゃ」を入れた場合", value: 0, dim: true },
        ]}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[520px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            入れた語ごとの置き換わった方言数（35方言中・2026年11月11日・自社実測）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">入れた語</th>
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">置き換わった方言数</th>
              <th scope="col" className="py-2 pr-3 font-bold">置き換え先の例</th>
              <th scope="col" className="py-2 font-bold">置き換わらない方言</th>
            </tr>
          </thead>
          <tbody>
            {WORDS.map(([w, n, ex, no]) => (
              <tr key={w} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{w}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{n}</td>
                <td className="py-2 pr-3 min-w-[12em]">{ex}</td>
                <td className="py-2 min-w-[8em]">{no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        このツールは、辞典の見出し語の意味（語釈）と入力の語が一致したときだけ置き換えます。
        辞典に「とても」と書かれた語が多く、「すごく」「非常に」と書かれた語は少ないので、数に差が出ます。
        「めっちゃ」は、語釈に「めっちゃ」と書かれた見出し語が辞典に無いので、標準語から方言への向きでは0方言でした。
        大阪弁の見出し語としては載っていて、「とても」を大阪弁に変換すると「めっちゃ」が出ます。
      </P>

      <H2 id="s4">長崎弁の「とても」「めっちゃ」は何と言う？</H2>
      <P>
        長崎弁で「めっちゃ」と言いたいとき、辞典にある候補は2語です。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>「ばり」：意味は「とても」。辞典の用例は「このちゃんぽん、ばりうまか。」</li>
        <li>「ばさらか」：意味は「とても・ものすごく」。辞典の用例は「今日はばさらか暑かねえ。」</li>
      </ul>
      <P>
        実測では、「今日はとても暑い」が「今日はばり暑い」になり、「ものすごく」は「ばさらか」になりました。
        逆向きでは、「今日はばり暑か」が「今日はとても暑か」になります。
        一方、「めっちゃ」と「すごく」は長崎弁に置き換わらず、入力した文がそのまま返りました。
      </P>
      <P>
        「ばさらか」は、熊本弁の「ばさろ」や博多弁の「ばさらか」と近い形です。
        九州の中で形が似た語が並んでいることは、辞典の収録から分かります。
        ただし、長崎でどちらの語がいまよく使われるかは、この記事では確かめていません。
      </P>
      <P>
        <Link href="/translate/nagasaki" className={LINK}>長崎弁変換ツール</Link>
        で、自分の文を入れて試せます。
        「めっちゃ」を使うと置き換わらないので、「とても」に直して入れてください。
      </P>

      <H2 id="s5">置き換わらないとき、どう読めばいい？</H2>
      <P>
        置き換わらなかった7方言には、「とても」に近い語がありました。
        たとえば伊予弁には「おんまく」（めいっぱい・すごく）と「がいに」（ものすごく）が載っています。
        ただし語釈が「すごく」「ものすごく」なので、「とても」とは一致しませんでした。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>置き換わらなかったら、「すごく」「ものすごく」に言い換えて入れ直す。</li>
        <li>それでも置き換わらなければ、辞典の一覧で意味に「たくさん」「大変」を含む語を探す。</li>
        <li>置き換わった語は、そのまま方言として通じるとは限らない。表の語は辞典の収録にすぎない。</li>
      </ul>

      <H2 id="s6">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-5">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <p className="text-base leading-[1.95]">{f.a}</p>
        </div>
      ))}

      <H2 id="s7">まとめ：次にやること</H2>
      <P>
        「とても」を方言に変換すると、35方言中28方言で置き換わり、「めっちゃ」は0方言でした。
        長崎弁なら「ばり」と「ばさらか」が辞典の候補です。
        気になる方言があれば、「とても」と「すごく」の両方で試すと、辞典にある語を拾いやすくなります。
      </P>
      <P>
        <Link href="/kurabe" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 全国方言くらべ（「とてもおいしい」を35方言で並べる）
        </Link>
      </P>
      <P>
        <Link href="/translate/nagasaki" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 長崎弁変換ツール
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>確かめたこと：2026年11月11日に、変換ツールへ入力して置き換わった方言と置き換え先を数えたこと。</li>
          <li>
            確かめられていないこと：置き換え先の語が、いまもその土地で使われているか。
            たとえば金沢弁の「がんこ」は、戦前の方言集では別の意味で載っており、「とても」の意味は新しい使い方の可能性があります。
          </li>
          <li>確かめられていないこと：同じ語が複数の方言に載っている理由（共通の起源か、別々の発生か）。</li>
        </ul>
        そのため、表の語を「その地域で正しい言い方」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月11日・自社実測。「今日は○○うまい」を標準語から35方言へ）",
            url: "https://hogen.mainichi-lab.com/translate/nagasaki",
          },
          {
            label: "方言ラボ 全国方言くらべ（「とてもおいしい」「良い」を強調する言い方の一覧）",
            url: "https://hogen.mainichi-lab.com/kurabe",
          },
          {
            label: "方言ラボ 辞典（35方言3,368語・2026年11月11日時点）",
            url: "https://hogen.mainichi-lab.com/dict",
          },
        ]}
      />
    </ArticleShell>
  );
}
