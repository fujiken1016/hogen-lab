import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("sendai-ben-ccha-dakara")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/sendai-ben-ccha-dakara" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/sendai-ben-ccha-dakara", type: "article", image: { path: "/og/blog-sendai-ben-ccha-dakara.jpg", alt: "仙台弁の「〜っちゃ」「だから」は何を言う語？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

const ENDINGS: [string, number][] = [
  ["〜っちゃ（〜だっちゃを含む）", 10],
  ["〜さ（方向など）", 9],
  ["〜けろ・〜けさいん（〜してください）", 6],
  ["〜べ・〜だべ", 4],
];

const AREAS: [string, string][] = [
  ["三陸方言", "県北部の三陸地域"],
  ["仙北内陸方言", "県北部の内陸部地域"],
  ["仙台方言", "仙台市とその周辺地域"],
  ["仙南方言", "県南部地域"],
];

const SHARED: [string, number][] = [
  ["福島弁", 9],
  ["南部弁", 8],
  ["茨城弁", 7],
  ["北海道弁", 6],
  ["秋田弁", 4],
  ["山形弁", 3],
];

const SRC: [string, number][] = [
  ["『仙台方言集』（1919）", 13],
  ["仙台弁こけし『仙台弁ミニ辞典』", 11],
  ["Wikipedia「仙台弁」など", 8],
  ["『東北の方言』（1944）", 4],
];

const TESTS: [string, string, string][] = [
  ["仙台弁→標準語", "服のタグが首さ当たっていずいっちゃ。", "服のタグが首さ当たってしっくりこないっちゃ。（「さ」「っちゃ」は残る）"],
  ["仙台弁→標準語", "隣の家の赤ちゃん、めんこいごだ〜。", "隣の家の赤ちゃん、かわいいごだ〜。（「ごだ」は残る）"],
  ["仙台弁→標準語", "んだんだ、おれもそう思うっちゃ。", "うんうん、おれもそう思うっちゃ。（「っちゃ」は残る）"],
  ["仙台弁→標準語", "早ぐ手洗っておまま食うべ", "早ぐ手洗ってご飯食うべ（「ぐ」「べ」は残る）"],
  ["仙台弁→標準語", "こっちさ来てけさいん", "変わらない（「けさいん」は置き換わらない）"],
  ["仙台弁→標準語", "そのゴミ、なげでけろ。", "変わらない（「なげる」は辞典に載っていない）"],
  ["標準語→仙台弁", "かわいい", "めんこい"],
  ["標準語→仙台弁", "疲れた", "こわい"],
  ["標準語→仙台弁", "捨てる", "捨てる（変わらない）"],
  ["標準語→仙台弁", "ごめんね", "ごめんね（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "仙台弁と宮城弁は、同じものですか？",
    a: "ほぼ同じ意味で使われます。Wikipedia「仙台弁」は、仙台弁を、狭くは仙台市の方言、広くは旧仙台藩領の方言と説明しています。同記事は宮城県の方言を取り扱い、県名から宮城弁とも言う、と書いています。方言ラボの辞典の語には地域の注記がなく、どの語が仙台市の言葉かは、語ごとには分かりません。",
  },
  {
    q: "「ずーずー弁」とは、何のことですか？",
    a: "東北の言葉でよく言われる、音の特徴です。Wikipedia「仙台弁」は、「シ」「ス」「シュ」が「ス」に、「ジ」「ズ」「ジュ」が「ズ」に、「チ」「ツ」「チュ」が「ツ」に合流している、と説明しています。辞典の語はかなで書かれているため、この音の違いは、例文の表記では表せません。",
  },
  {
    q: "「だべ」は、「だろう」という意味ですか？",
    a: "「だろう」のほかに、「〜だね」の意味でも使われます。Wikipedia「仙台弁」は、助動詞「べ」を、「…だろう」「…しよう」にあたり、推量・意志・確認・勧誘など用法が多岐にわたると書いています。仙台弁こけしの『仙台弁ミニ辞典』は、「だべ」を「〜だね・〜だろう」と説明しています。辞典の例文では、「あんだの話、あっぺとっぺだべ。」の1文に「だべ」が出ます。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>河北新報の特集によると、仙台弁の「だから」は、「だから何？」と問い詰める言葉ではなく、「そうだよね」という同意の言葉として使われます。</strong>
        文末の「〜っちゃ」は、相手が知っているはずのことを確認する語尾で、方言ラボの辞典の例文86文のうち10文に出ます。
      </P>
      <P>
        この記事では、河北新報の記事とWikipedia「仙台弁」の説明をもとに、「だから」と「〜っちゃ」の使い方を整理します。
        そのうえで、辞典の例文の語尾を数え、宮城県内の4区分と、辞典の語が東北の他の方言とどれだけ重なるかを確かめます。
        出典と、変換ツールが直せない語尾も、実行結果で見ました。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "「だから」は怒っていない、同意の言葉" },
        { id: "s2", label: "「〜っちゃ」「べ」「けろ」を数えると" },
        { id: "s3", label: "宮城県の言葉は、県内で違うのか" },
        { id: "s4", label: "辞典の仙台弁を、東北の方言と照らすと" },
        { id: "s5", label: "辞典の仙台弁は、どこの言葉か" },
        { id: "s6", label: "変換ツールに入れると、どう変わるか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">「だから」は怒っていない、同意の言葉</H2>
      <P>
        方言ラボの辞典の仙台弁には、「だから」が載っています。
        語釈は「そうだよね！（強い同意）」で、例文は「「あの店うまいよね」「だから〜！」」です。
        「んだ」（うん、そうだ）も、同じ同意の言葉として載っています。
      </P>
      <P>
        河北新報オンラインの特集「『だから』は同意だっちゃ　なじょだべ仙台弁」（2022年4月20日。河北ウイークリーせんだい2022年4月14日号掲載）は、仙台弁こけしの語りの形で、この「だから」を説明しています。
        県外から来た人が驚く表現として挙げ、「だから何？」と問い詰める意味ではなく、「そうだよね」にあたる同意の言葉だと書いています。
        若い世代も、共通語を話しながら使うとしています。
        さらになまると「んだがら」になる、という説明もあります。
      </P>
      <P>
        ここから、「だから」は、他の地域の人が聞くと意味を取り違えやすい語だと読めます。
        方言が別の意味に聞こえてしまう話は、
        <Link href="/blog/onaji-kotoba-imi-chigau" className={LINK}>同じ言葉で意味が違う方言を扱った記事</Link>
        にもあります。
        記事は筆者名が明記されておらず、仙台弁こけし（仙台市のご当地キャラ）の語りです。
        使われ方の実態を調べた統計ではない点には、注意が必要です。
      </P>

      <H2 id="s2">「〜っちゃ」「べ」「けろ」を数えると</H2>
      <P>
        方言ラボの辞典には、仙台弁が86語載っていて、それぞれに例文が1文ずつ付いています。
        その86文の語尾などを数えました（2026年11月25日の自社集計）。
      </P>

      <BarFig
        max={10}
        unit="文"
        ariaLabel="辞典の仙台弁の例文86文に出る語尾などの数。っちゃ10文、さ9文、けろ・けさいん6文、べ・だべ4文"
        caption="図：辞典の仙台弁86文に出る語尾などの数（2026年11月25日・自社集計）"
        items={ENDINGS.map(([l, n]) => ({ label: l, value: n, dim: n < 6 }))}
      />

      <P>
        <strong>いちばん多いのは、「〜っちゃ」の10文</strong>です。
        Wikipedia「仙台弁」は、終助詞「ちゃ」を、相手が知っているはずの事柄を示して確認させる働きがあると説明しています。
        共通語の「でしょ」「じゃない（か）」「（だ）よね」「（だ）よな」にあたり、用言のあとでは「っちゃ」、名詞のあとでは「だっちゃ」になる、という書き方です。
      </P>
      <P>
        辞典の10文では、「そう思うっちゃ」「しばれるねっちゃ」のように用言のあとに7文、「誰だっちゃ」「十分だっちゃ」のように「だっちゃ」が3文でした。
        河北新報の記事も、「だっちゃ」「だっちゃね」を同意の言い回しとして使っています。
      </P>
      <P>
        「〜べ」「〜だべ」は4文です（「食うべ」「作るべ」「行ぐべした」「あっぺとっぺだべ」）。
        Wikipedia「仙台弁」は、助動詞「べ」を、推量・意志・確認・勧誘に使い、「る」で終わる動詞につくと「っぺ」になると書いています。
        茨城弁の「〜っぺ」と同じ系統の語尾で、
        <Link href="/blog/ibaraki-ben-tohoku-kanto" className={LINK}>茨城弁の「〜っぺ」を数えた記事</Link>
        で、17文を数えています。
      </P>
      <P>
        「〜けろ」「〜けさいん」は6文です。
        仙台弁こけしの『仙台弁ミニ辞典』は、「けろ」を「〜してちょうだい」、「けさいん」を「〜してください」と説明しています。
      </P>
      <P>
        「〜さ」は9文で、「こっちさ来てけさいん」「東京さ出でる」のように方向を表します。
        Wikipedia「仙台弁」は、この「さ」を、存在の場所を表す場合には使わない（若年層では使える）と書いています。
        辞典の「あそこさいるおどご、誰だっちゃ。」の1文は、その存在の場所に「さ」を使った形です。
      </P>
      <P>
        辞典の例文は用例として載せた文で、宮城の人の話し言葉の記録ではないため、使用率としては読めません。
        ただし、「〜っちゃ」「〜べ」「〜けろ・〜けさいん」のどれかを含む文は、86文のうち20文（約4分の1）あります。
      </P>

      <H2 id="s3">宮城県の言葉は、県内で違うのか</H2>
      <P>
        Wikipedia「仙台弁」は、江戸時代には現在の宮城県の全域が仙台藩の領内だったため、県内の方言差はあまりないとされる、と書いています。
        そのうえで、詳しく見れば県内各地に差があるとして、後藤彰三の4区分を紹介しています。
      </P>
      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            宮城県の方言の4区分（Wikipedia「仙台弁」が紹介する後藤彰三の区分・2026年11月25日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">区分</th>
              <th scope="col" className="py-2 font-bold">地域</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {AREAS.map(([a, b]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="区分" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="地域" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        三陸地方には特殊な語彙があり、岩手県の三陸地方へ連続している、とも書かれています。
        アクセントは、黒川郡付近を境に県の南北で違います。
        同記事は、仙台市より南は一型アクセント（無アクセント）、境のあたりは曖昧アクセント、それより北は特殊アクセントと説明しています。
        <strong>辞典の語には地域の注記がなく、4区分のどこの言葉かは、語ごとには分かりません。</strong>
      </P>
      <P>
        同記事は、昭和以降は共通語化が進み、特に仙台市などの都市部で変化が顕著だとも書いています。
        一方で、「ジャス」（ジャージー）や「カッペロ」（カップ麺）のような新しい単語（新方言）も生まれている、という説明です。
        辞典の仙台弁にも、「ジャス」（ジャージ）が載っています。
        共通語だと思って使っていた方言の例は、
        <Link href="/blog/hyoujungo-dato-omotteta" className={LINK}>標準語だと思っていた言葉を扱った記事</Link>
        にあります。
      </P>

      <H2 id="s4">辞典の仙台弁を、東北の方言と照らすと</H2>
      <P>
        辞典の仙台弁86語のうち、他の方言にも同じ見出し語があるのは29語でした（2026年11月25日の集計）。
        相手の方言は、次のとおりです。
      </P>

      <BarFig
        max={9}
        unit="語"
        ariaLabel="辞典の仙台弁で、他の方言にも載る29語の相手の方言。福島弁9語、南部弁8語、茨城弁7語、北海道弁6語、秋田弁4語、山形弁3語"
        caption="図：仙台弁と同じ見出し語を持つ方言（2026年11月25日・自社集計。1語が複数の方言と重なる場合は、それぞれに数えた。津軽弁は0語）"
        items={SHARED.map(([l, n]) => ({ label: l, value: n, dim: n < 5 }))}
      />

      <P>
        29語を、津軽弁・南部弁・秋田弁・山形弁・福島弁の5方言と照らすと、19語に、このうちのどれかが入っています。
        「いずい」（しっくりこない）、「めんこい」（かわいい）、「やっこい」（やわらかい）、「おごご」（漬物）、「ほでなす」（ばか者）などです。
        辞典に載る35方言のうち、仙台弁以外の東北の5方言は、他の34方言の15%ほどです。
        <strong>共通する29語のうち、19語（66%）に東北の方言が入っています。</strong>辞典に載る方言の数や並びに左右される数字で、東北に寄っているとまでは言えません。
      </P>
      <P>
        Wikipedia「仙台弁」は、旧伊達氏の領地だった福島県の信達地方や山形県の米沢地方の方言と、似ている面があると書いています。
      </P>
      <P>
        辞典で福島弁と重なるのが9語、山形弁が3語でした。
        茨城弁とも7語、北海道弁とも6語が重なります。
        「こわい」（疲れた）は、南部弁・山形弁・福島弁・茨城弁などにも載る語です。
        <strong>ただし、これは辞典の中での重なりで、語の由来は示しません。</strong>
        辞典に載っている方言の数や語数に左右される数字で、同じ見出し語でも意味が同じとは限りません。
        東北の方言と北海道弁の重なりは、
        <Link href="/blog/hokkaido-ben-touhoku-hokuriku" className={LINK}>北海道弁と東北・北陸の方言を数えた記事</Link>
        にあります。
      </P>

      <H2 id="s5">辞典の仙台弁は、どこの言葉か</H2>
      <P>
        辞典の仙台弁86語のうち、出典つきの照合台帳に載っているのは38語です（2026年11月25日の集計）。
        そのうち、出典で語と語釈を確認できたのは36語で、残る2語は出典に届いていません。
        36語の出典は、次の内訳でした。
      </P>

      <BarFig
        max={13}
        unit="語"
        ariaLabel="出典を確認できた仙台弁36語の出典の内訳。仙台方言集1919が13語、仙台弁こけしが11語、Wikipedia仙台弁など8語、東北の方言1944が4語"
        caption="図：出典を確認できた仙台弁36語の出典の内訳（2026年11月25日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 6 }))}
      />

      <P>
        大正8年（1919）の『仙台方言集』で確認できた語が13語、仙台弁こけしの『仙台弁ミニ辞典』で確認できた語が11語あります。
        台帳に載っていない48語は、この記事では出典を確かめていません。
      </P>

      <H2 id="s6">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/sendai" className={LINK}>仙台弁変換</Link>
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
        「いずい」は「しっくりこない」に、「めんこい」は「かわいい」に、「んだんだ」は「うんうん」に直ります。
        標準語の「かわいい」は「めんこい」に、「疲れた」は「こわい」に変わります。
        一方、<strong>「っちゃ」「べ」「ごだ」「けさいん」のような語尾は、直りません。</strong>
        また、「なげる」（捨てる）は辞典に載っていないので、「なげでけろ」はそのまま返り、標準語の「捨てる」も仙台弁に変わりません。
      </P>
      <P>
        前に数えたとおり、86文のうち20文は「っちゃ」「べ」「けろ・けさいん」のどれかを含むので、語を直しても、文の語尾は仙台弁のまま残ります。
        気になる語は、言葉一覧の語釈で確かめてください。
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
        仙台弁の「だから」は、「そうだよね」という同意の言葉で、文末の「〜っちゃ」は、相手に確認を求める語尾です。
        辞典の例文86文では、「〜っちゃ」が10文、「〜さ」が9文、「〜けろ・〜けさいん」が6文、「〜べ」が4文でした。
        宮城県内には4つの区分がありますが、辞典の語には地域の注記がありません。
        変換ツールは、語は直しますが、「っちゃ」「べ」「けさいん」のような語尾は直しません。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾も一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/sendai" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 仙台弁変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/sendai" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 仙台弁検定
        </Link>
      </P>

      <P>この記事の数字は、出どころで3つに分かれます。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>「だから」の説明：河北新報オンラインの特集記事（2022年4月20日）です。仙台弁こけしの語りの形で、使用率を調べた統計ではありません。「〜っちゃ」「べ」、宮城の4区分：Wikipedia「仙台弁」の記述です。</li>
        <li>辞典の例文の数（10文・9文・6文・4文）と、他の方言との重なり（29語・19語など）：方言ラボの辞典を2026年11月25日に数えた自社集計です。</li>
        <li>変換ツールの結果：同日に自社のツールを実行した出力です。</li>
      </ul>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：河北新報オンラインの特集記事（2022年4月20日）、仙台弁こけし『仙台弁ミニ辞典』のページ、Wikipedia「仙台弁」の概要・特徴の節を2026年11月25日に読みました。辞典の例文の語尾の集計、他方言との重なりの集計、変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（仙台弁38語）の出典の内訳。『仙台方言集』（1919）と『東北の方言』（1944）の記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：「だから」「〜っちゃ」の現在の使用率、後藤彰三の4区分の原典（Wikipedia の紹介を読んだだけです）、辞典の仙台弁48語の出典、辞典の語が宮城県のどの地域の言葉か。
          </li>
        </ul>
        そのため、これらを「仙台ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "河北新報オンライン【特集】なじょだべ仙台弁「『だから』は同意だっちゃ」2022年4月20日（河北ウイークリーせんだい2022年4月14日号掲載）2026年11月25日取得",
            url: "https://kahoku.news/articles/20220420khn000040.html",
          },
          {
            label: "仙台弁こけし『仙台弁ミニ辞典』2026年11月25日取得",
            url: "https://kokesu.com/sendaiben/",
          },
          {
            label: "Wikipedia「仙台弁」概要・特徴（音声・アクセント・文法）の節 2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/仙台弁",
          },
          {
            label: "土井八枝編『仙台方言集』（1919）国立国会図書館デジタルコレクション（出典照合台帳の記録）",
          },
          {
            label: "方言ラボ 仙台弁変換ツールの実行結果・辞典の例文の集計（2026年11月25日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/sendai",
          },
        ]}
      />
    </ArticleShell>
  );
}
