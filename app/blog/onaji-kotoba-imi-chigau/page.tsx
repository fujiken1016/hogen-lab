import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("onaji-kotoba-imi-chigau")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/onaji-kotoba-imi-chigau" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/onaji-kotoba-imi-chigau", type: "article" }),
};

const LINK = "text-primary-text underline underline-offset-2";

// 同じ語形で、辞典の意味が方言によって分かれる5語（方言ラボ辞典・2026年11月11日時点）
const ROWS: [string, string, string, string][] = [
  ["ねまる", "座る・くつろぐ（南部弁・新潟弁・富山弁・飛騨弁）", "（食べ物が）腐る（博多弁・長崎弁）", "座る側は出典で確認。腐る側は未確認"],
  ["あば", "お母さん（秋田弁）", "じゃあね・さようなら（新潟弁・飛騨弁）", "秋田は確認。飛騨は「あばよ」系で確認。新潟は未確認"],
  ["はしかい", "すばしこい・抜け目がない（富山弁・和歌山弁）", "肌にチクチクする・かゆい（伊勢弁・出雲弁）", "出雲は確認。同じ資料の中でも2つの意味が出る"],
  ["すける", "手伝う（南部弁・仙台弁・新潟弁）", "物を置く、乗せておく（岡山弁）", "岡山は確認。仙台は未確認"],
  ["いけん", "だめ・いけない（鳥取弁・出雲弁・山口弁）", "どう・どのように（鹿児島弁）", "山口・出雲・鹿児島は確認。鳥取は未確認"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "同じ言葉なのに、方言で意味が違うのはなぜですか？",
    a: "この記事では原因までは調べていません。確かめられたのは、同じ語形が地域によって別の意味で記録されていることです。たとえば「あば」は、秋田では「母」、飛騨では別れのあいさつの語幹として記録されています。",
  },
  {
    q: "「ねまる」は座るですか、腐るですか？",
    a: "東北・新潟・北陸・飛騨の資料では「座る」で確認できています。九州の博多弁・長崎弁に「腐る」の意味で辞典に載っていますが、この意味は出典で確かめられていません。",
  },
  {
    q: "同じ語が複数の方言に載っているとき、意味は同じですか？",
    a: "同じとは限りません。方言ラボの辞典では、2つ以上の方言に載っている見出し語は437語あり、その中に意味が分かれる語が含まれています。意味は方言ごとに確かめる必要があります。",
  },
  {
    q: "変換ツールは、意味が違う語をどう扱いますか？",
    a: "辞典の見出しと意味が一致した方言の語だけを置き換えます。たとえば「手伝う」を新潟弁に変換すると「すける」になり、岡山弁の「すける」（物を置く）は別の意味として扱われます。",
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
          同じ音の方言でも、地域によって意味が分かれる語があります。
          方言ラボの辞典では、2つ以上の方言に載っている語が437語あります。
        </strong>
        その中から「ねまる」「あば」「はしかい」「すける」「いけん」の5語を、出典の記録と照らして確かめました。
      </P>
      <P>
        辞典の集計は2026年11月11日時点です。
        3,368語を見出しの表記で数えると、語の種類は2,722語でした。
        2つ以上の方言に載っているのは437語で、全体の約16％にあたります。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "辞典で、同じ見出し語はどれくらい重なっている？" },
        { id: "s2", label: "意味が分かれる5語を並べると？" },
        { id: "s3", label: "「ねまる」は、座る？腐る？" },
        { id: "s4", label: "「あば」は、母？さようなら？" },
        { id: "s5", label: "「はしかい」「すける」「いけん」は？" },
        { id: "s6", label: "意味が分かれる語に出会ったとき、どう読む？" },
        { id: "s7", label: "変換ツールでは、どうなる？" },
        { id: "s8", label: "よくある質問" },
        { id: "s9", label: "まとめ：次にやること" },
      ]} />

      <H2 id="s1">辞典で、同じ見出し語はどれくらい重なっている？</H2>
      <P>
        見出しの表記が同じ語を、35方言にまたがって数えました（2026年11月11日・自社集計）。
      </P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>辞典の収録：3,368語（35方言）</li>
        <li>見出し語の種類：2,722語</li>
        <li>2つ以上の方言に載っている語：437語</li>
        <li>3つ以上の方言に載っている語：138語</li>
        <li>5つ以上の方言に載っている語：16語</li>
      </ul>

      <BarFig
        max={437}
        unit="語"
        ariaLabel="同じ見出し語が載っている方言の数。2方言以上が437語、3方言以上が138語、5方言以上が16語"
        caption="図：同じ見出し語が載っている方言の数（方言ラボ辞典・2026年11月11日時点・自社集計）"
        items={[
          { label: "2方言以上に載っている語", value: 437 },
          { label: "3方言以上に載っている語", value: 138, dim: true },
          { label: "5方言以上に載っている語", value: 16, dim: true },
        ]}
      />
      <P>
        重なっている語の多くは、同じ意味で広い地域に散っています。
        「ねぶる（なめる）」は5方言、「めげる（壊れる）」も5方言で、意味はそろっています。
        一方で、意味が分かれる語もあります。次の表がその5語です。
      </P>

      <H2 id="s2">意味が分かれる5語を並べると？</H2>
      <P>
        辞典の意味が、方言によって大きく2つに分かれる語を選びました。
        右の欄は、出典の記録で確かめられたかどうかです。
      </P>

      <BarFig
        max={4}
        unit="方言"
        ariaLabel="5語それぞれで、意味Aに載る方言数と意味Bに載る方言数。ねまる4と2、あば1と2、はしかい2と2、すける3と1、いけん3と1"
        caption="図：下の表の、意味Aの方言数（濃い棒）。意味Bの方言数は、ねまる2・あば2・はしかい2・すける1・いけん1"
        items={[
          { label: "ねまる：意味A（座る）", value: 4 },
          { label: "あば：意味A（お母さん）", value: 1 },
          { label: "はしかい：意味A（すばしこい）", value: 2 },
          { label: "すける：意味A（手伝う）", value: 3 },
          { label: "いけん：意味A（だめ）", value: 3 },
        ]}
      />

      <div className="overflow-x-auto my-5">
        <table className="w-full min-w-[620px] text-sm border-collapse">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            同じ語形で意味が分かれる語（方言ラボ辞典・2026年11月11日時点。確認の記録は出典照合台帳による）
          </caption>
          <thead>
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">語</th>
              <th scope="col" className="py-2 pr-3 font-bold">意味A</th>
              <th scope="col" className="py-2 pr-3 font-bold">意味B</th>
              <th scope="col" className="py-2 font-bold">出典での確認</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([w, a, b, c]) => (
              <tr key={w} className="border-b border-line align-top">
                <td className="py-2 pr-3 whitespace-nowrap">{w}</td>
                <td className="py-2 pr-3 min-w-[11em]">{a}</td>
                <td className="py-2 pr-3 min-w-[11em]">{b}</td>
                <td className="py-2 min-w-[11em]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="s3">「ねまる」は、座る？腐る？</H2>
      <P>
        「ねまる」は、東北から北陸・飛騨にかけて「座る」の意味で記録されています。
        南部弁は青森県の方言集2冊で、新潟弁は新潟の方言集2冊（1892年と1944年）で確かめました。
        山形（庄内）の方言考（1891年）にも「ねまる」が「座る」の意味で載っています。
      </P>
      <P>
        辞典には、博多弁と長崎弁にも「ねまる」があります。
        意味は「（食べ物が）腐る」で、用例は「この牛乳、ねまっとるけん飲まれんよ」です。
        ただし、この意味を裏づける出典は、まだ確かめられていません。
      </P>

      <H2 id="s4">「あば」は、母？さようなら？</H2>
      <P>
        秋田の方言集（1929年）には、「あば」が「母、妻」の意味で、県内8郡の語として載っています。
        同じ本に、別れのあいさつ「あばよ」「あばや」も別の項目で出ています。
      </P>
      <P>
        飛騨は、1916年の調査報告に「アバエナ」「あばよ」「あばゆな」があり、別れのあいさつの語幹として確かめられます。
        ただし、「あば」だけの形は、その資料に載っていません。
      </P>
      <P>
        新潟弁の「あば」は、辞典では「じゃあね・さようなら」です。
        しかし、新潟の方言集を含む4冊を調べても、あいさつの意味は見つかりませんでした。
        見つかったのは「母」「未婚の年長の女性」（新潟）と、「海辺の女」「祖母」（山形）です。
      </P>

      <H2 id="s5">「はしかい」「すける」「いけん」は？</H2>
      <P>
        <strong>はしかい</strong>：
        富山弁・和歌山弁では「すばしこい」です。
        伊勢弁・出雲弁では「肌にチクチクする」で、出雲の方言書に麦などの芒が肌に触れてかゆいこと、と書かれています。
        富山と和歌山の資料には、かゆい・チクチクの意味も別の項目として載っていました。
      </P>
      <P>
        <strong>すける</strong>：
        南部弁・仙台弁・新潟弁では「手伝う」です。
        岡山弁では「物を置く、乗せておく」で、岡山の資料に「載せる」を「すける」と言う、とあります。
        仙台の「手伝う」は、確かめた資料に見出しがなく、未確認です。
      </P>
      <P>
        <strong>いけん</strong>：
        山口弁と出雲弁では「だめ」です。山口の1928年の村誌と、出雲の1916年の方言書で確かめました。
        鹿児島弁では、1906年の方言集に「どう」の意味で載っていて、別の意味です。
        鳥取弁も「だめ」で載っていますが、鳥取を特定する出典は見つかっていません。
      </P>

      <H2 id="s6">意味が分かれる語に出会ったとき、どう読む？</H2>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-1.5">
        <li>「ねまる」は、場所の話なら座る、食べ物の話なら腐るかもしれない。</li>
        <li>「あば」は、人の呼び名なら母、別れ際なら「じゃあね」の語幹かもしれない。</li>
        <li>「はしかい」は、体の感覚ならチクチク、人の動きならすばしこい。</li>
        <li>「すける」は、人に対してなら手伝う、物に対してなら置く。</li>
        <li>話した人の出身地が分からないときは、1つの意味に決めずに文脈で読む。</li>
      </ul>

      <H2 id="s7">変換ツールでは、どうなる？</H2>
      <P>
        変換ツールは、辞典の見出しと意味が一致した語だけを置き換えます。
        意味が分かれる語は、方言ごとに別の語として扱われます。
        標準語の「手伝う」を新潟弁・南部弁・仙台弁に変換すると「すける」になります。岡山弁の「すける」を標準語へ戻すと「物を置く」です。
      </P>
      <P>
        <Link href="/translate/niigata" className={LINK}>新潟弁変換</Link>
        と
        <Link href="/translate/okayama" className={LINK}>岡山弁変換</Link>
        で同じ「すける」を引くと、意味が違うことを確かめられます。
        標準語と音が同じで意味が違う語は、
        <Link href="/blog/hyoujungo-dato-omotteta" className={LINK}>標準語だと思ってた方言10選</Link>
        でも扱っています。
      </P>

      <H2 id="s8">よくある質問</H2>
      {FAQ.map((f) => (
        <div key={f.q} className="mb-5">
          <h3 className="text-lg font-bold mb-1.5">{f.q}</h3>
          <p className="text-base leading-[1.95]">{f.a}</p>
        </div>
      ))}

      <H2 id="s9">まとめ：次にやること</H2>
      <P>
        同じ音でも、「ねまる」は座る、「あば」は母、「すける」は手伝うと、地域で意味が分かれます。
        出会ったら、1つの意味に決めず、話した人の出身地と文脈で読んでください。
      </P>
      <P>
        <Link href="/dict" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 方言の辞典で、気になる語を引く
        </Link>
      </P>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>確かめたこと：辞典の収録語数と、重なっている語の数（2026年11月11日・自社集計）。</li>
          <li>
            確かめたこと：表の「確認」と書いた意味が、各地の方言集・調査報告に載っていること（出典照合台帳の記録による。年は各資料の刊行年）。
          </li>
          <li>確かめられていないこと：「ねまる＝腐る」（博多・長崎）、「あば＝さようなら」（新潟）、「すける＝手伝う」（仙台）、「いけん＝だめ」（鳥取）。</li>
          <li>確かめられていないこと：意味が分かれた原因（共通の起源か、別々の発生か）。</li>
        </ul>
        そのため、未確認の意味を「その地域の言葉として正しい」とは書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "方言ラボ 辞典（35方言3,368語・見出し語の重なりを自社集計・2026年11月11日時点）",
            url: "https://hogen.mainichi-lab.com/dict",
          },
          {
            label: "方言ラボ 辞典の出典照合台帳（社内記録。ねまる・あば・はしかい・すける・いけんの項）",
          },
          {
            label: "方言ラボ 変換ツールでの実行結果（2026年11月11日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/niigata",
          },
        ]}
      />
    </ArticleShell>
  );
}
