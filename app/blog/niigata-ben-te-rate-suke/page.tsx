import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ArticleShell, H2, P, Note, Sources } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ArticleToc } from "@/components/ArticleToc";
import { BarFig } from "@/components/BarFig";

const article = getArticle("niigata-ben-te-rate-suke")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/niigata-ben-te-rate-suke" },
  ...ogMeta({ title: `${article.title} | 方言ラボ`, description: article.description, path: "/blog/niigata-ben-te-rate-suke", type: "article", image: { path: "/og/blog-niigata-ben-te-rate-suke.jpg", alt: "新潟弁の文末「〜て」「〜らて」「〜すけ」は何？" } }),
};

const LINK = "text-primary-text underline underline-offset-2";

const AREAS: [string, string, string][] = [
  ["北越方言", "阿賀野川より北（阿賀北）と東蒲原郡", "東北方言に分類される。岩船北蒲原方言は北奥羽方言、東蒲原方言は南奥羽方言に属する"],
  ["中越方言", "新潟市付近と中越地方", "越後方言の中心。新潟市付近の方言が「新潟弁」として知られる"],
  ["中越南部（魚沼）", "魚沼地方", "関東方言の色を帯びる"],
  ["上越方言", "上越地方", "信州方言の色を帯びる"],
  ["佐渡方言・西端越方言", "佐渡島と、糸魚川市の旧青海町", "北陸方言に分類される"],
];

const ENDINGS: [string, number][] = [
  ["文末が「て」「てば」", 47],
  ["「ら」＋ね・て・ぞ（「だ」にあたる）", 14],
  ["〜すけ（理由）", 9],
  ["〜ろ・〜ろー（推量）", 2],
];

const GROUPS: [string, number][] = [
  ["東北の6方言", 9],
  ["中部・東海の5方言", 7],
  ["中国・四国の9方言", 5],
  ["北陸の2方言", 4],
  ["北海道弁", 2],
  ["九州・沖縄の6方言", 2],
  ["関東（茨城弁）", 1],
  ["近畿の4方言", 0],
];

const SRC: [string, number][] = [
  ["新潟県観光協会の方言紹介", 15],
  ["『越佐方言集』（1892）", 8],
  ["『山形県方言集』（1933）", 6],
  ["『石川県方言彙集』", 5],
  ["『荘内方言考』・Wikipedia", 2],
];

const TESTS: [string, string, string][] = [
  ["新潟弁→標準語", "この川の水、しゃっこいて！", "この川の水、冷たいて！（「て」は残る）"],
  ["新潟弁→標準語", "暗くなったすけ、おみちよーね。", "暗くなったすけ、道中お気をつけてね。（「すけ」は残る）"],
  ["新潟弁→標準語", "体のあんべーはどうらね？", "体の具合はどうらね？（「らね」は残る）"],
  ["新潟弁→標準語", "今日の雪はごうぎらねっか。", "今日の雪はすごいらねっか。（「らねっか」は残る）"],
  ["新潟弁→標準語", "温泉入って、じょんのびしてきたて。", "温泉入って、ゆったりしてきたて。（「て」は残る）"],
  ["新潟弁→標準語", "明日は晴れるろ？", "変わらない（文末の「ろ」は置き換わらない）"],
  ["標準語→新潟弁", "冷たい", "しゃっこい"],
  ["標準語→新潟弁", "とても", "ばか"],
  ["標準語→新潟弁", "疲れた", "なんぎー"],
  ["標準語→新潟弁", "かわいい", "かわいい（変わらない）"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "新潟弁と越後弁は、同じものですか？",
    a: "同じではありません。Wikipedia「新潟弁」は、ここでの新潟弁を、新潟市を中心とする地域の方言に限っています。新潟県全域の方言を指して新潟弁と呼ぶこともあります。越後方言は、旧越後国（佐渡島を除く新潟県）の方言の総称で、阿賀北地域などを東北方言に含めています。方言ラボの辞典の語には地域の注記がなく、県内のどの地域の語かは、語ごとには分かりません。",
  },
  {
    q: "新潟弁の「ばか」は、悪口ですか？",
    a: "副詞の「ばか」は、悪口ではなく「すごく」の意味です。Wikipedia「新潟弁」は、副詞の「バカ」を、ひどく、すごくの意味と説明し、「バーカ タノシソゲラネー（すごく楽しそうだね）」という例を挙げています。辞典の語釈も「とても・すごく（強調）」で、例文は「この枝豆、ばかうんめぇて。」です。",
  },
  {
    q: "「ねまる」は、新潟だけの言葉ですか？",
    a: "辞典の中では、新潟弁のほかに、南部弁・富山弁・飛騨弁にも「ねまる」（座る）が載っています。一方、博多弁と長崎弁では、食べ物が腐る意味で載っています。同じ見出し語でも意味が同じとは限りません。",
  },
];

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        <strong>先に結論です。</strong>
        <strong>方言ラボの辞典の新潟弁は、例文100文のうち47文が、文末の「て」（「てば」を含む）で終わっていました。</strong>
      </P>
      <P>
        Wikipedia「新潟弁」の例文「ミレバ ワカルテ。」（見れば分かるよ）から、「て」は「〜よ」にあたる終助詞とみられますが、独立した項目としての説明は確認できませんでした。
        理由を言う「〜すけ」は9文です。
        Wikipedia「越後方言」は、この「すけ」を、近畿方言の「さかい」と同じ語源と書いています。
      </P>
      <P>
        この記事では、新潟県の方言区画を表にしたうえで、辞典の例文の語尾を数えます。
        あわせて、辞典の語が他の方言とどう重なるか、出典、変換ツールが直せない語尾も、実行結果で確かめました。
      </P>

      <ArticleToc items={[
        { id: "s1", label: "新潟県の方言は、一つではない" },
        { id: "s2", label: "文末の「〜て」「〜らて」を数えると" },
        { id: "s3", label: "「〜すけ」は、「さかい」と同源とされる" },
        { id: "s4", label: "辞典の新潟弁は、どこの言葉と重なるか" },
        { id: "s5", label: "辞典の新潟弁は、どこの言葉か" },
        { id: "s6", label: "変換ツールに入れると、どう変わるか" },
        { id: "s7", label: "よくある質問" },
        { id: "s8", label: "まとめ" },
      ]} />

      <H2 id="s1">新潟県の方言は、一つではない</H2>
      <P>
        Wikipedia「越後方言」は、新潟県が東北・関東・中部の中間に位置するため、県内でも地域によって方言の特徴が違うと書いています。
        方言の区画の上では、県内の方言がいくつかに分けられています。
      </P>
      <figure className="overflow-x-auto my-5">
        <table className="w-full text-sm border-collapse max-md:block">
          <caption className="text-left text-sm text-sub leading-relaxed pb-2">
            新潟県の方言の区分（Wikipedia「越後方言」「北越方言」より・2026年11月25日取得）
          </caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left align-bottom">
              <th scope="col" className="py-2 pr-3 font-bold">区分</th>
              <th scope="col" className="py-2 pr-3 font-bold">地域</th>
              <th scope="col" className="py-2 font-bold">方言としての色合い</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {AREAS.map(([a, b, c]) => (
              <tr key={a + b} className="border-b border-line align-top max-md:block max-md:py-2">
                <td data-l="区分" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold max-md:whitespace-normal">{a}</td>
                <td data-l="地域" className="py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{b}</td>
                <td data-l="方言としての色合い" className="py-2 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <P>
        Wikipedia の記事「新潟弁」が指す新潟弁は、このうち、新潟市を中心とする地域の方言だけを指しています。
        同記事は、新潟県全域の方言を新潟弁と呼ぶこともあるとしたうえで、記事ではすべて新潟市中心の方言を指すと断っています。
        <strong>辞典の語には地域の注記がなく、どの語が県内のどの地域の言葉かは、語ごとには分かりません。</strong>
      </P>
      <P>
        県の西の端にあたる糸魚川市は、東西の特徴が入れ替わる土地として知られています。
        その話は、
        <Link href="/blog/higashi-nishi-kyoukai" className={LINK}>言葉の東西の境界を扱った記事</Link>
        にあります。
        阿賀野川より北が東北方言に分類されることは、ズーズー弁の特徴が新潟北部にも及ぶという
        <Link href="/blog/hogen-oto-no-chigai" className={LINK}>方言の音の違いを扱った記事</Link>
        の説明とも合います。
      </P>

      <H2 id="s2">文末の「〜て」「〜らて」を数えると</H2>
      <P>
        方言ラボの辞典には、新潟弁が100語載っていて、それぞれに例文が1文ずつ付いています。
        その100文の語尾などを数えました（2026年11月25日の自社集計）。
      </P>

      <BarFig
        max={47}
        unit="文"
        ariaLabel="辞典の新潟弁の例文100文に出る語尾などの数。文末が「て」「てば」47文、ら＋ね・て・ぞ14文、すけ9文、ろ・ろー2文"
        caption="図：辞典の新潟弁100文に出る語尾などの数（2026年11月25日・自社集計。1文に複数の形が出る場合は重ねて数えた）"
        items={ENDINGS.map(([l, n]) => ({ label: l, value: n, dim: n < 10 }))}
      />

      <P>
        <strong>いちばん多いのは、文末の「て」の47文</strong>です（「てば」の2文を含みます）。
        「この川の水、しゃっこいて！」「この枝豆、ばかうんめぇて。」「正月はばあちゃんののっぺが楽しみらて。」のように、文の終わりに付きます。
        Wikipedia「新潟弁」は、文末の「て」を独立した項目としては説明していませんが、終助詞の例文に「ミレバ ワカルテ。」（見れば分かるよ）を挙げています。
      </P>
      <P>
        「ら」を含む形は14文です。
        「三十らて」「久しぶりらねぇ」「どうらね」「はじまりらぞ」のように出ます（挨拶の「なじらね」を含みます）。
        Wikipedia「越後方言」は、東京方言の「だ」にあたるものが「ら」で現れると書いていて、「ダメラ」（だめだ）の例を挙げています。
        推量の「ろ」「ろー」は2文でした（「晴れるろ？」「合うろー。」）。
        同記事は、推量が「終止形＋ロー」で表されると説明しています。
      </P>
      <P>
        辞典の例文は用例として載せた文で、新潟の人の話し言葉の記録ではないため、使用率としては読めません。
        他の方言の例文では数えていないため、新潟弁の特徴とまでは言えません。辞典の例文の書き方の癖かもしれません。
      </P>

      <H2 id="s3">「〜すけ」は、「さかい」と同源とされる</H2>
      <P>
        Wikipedia「越後方言」は、理由を表す助詞「-スケ」を、近畿方言の「-サカイ」と同源と書いています。
        例は「サーミスケ ドゴニモ イギトネ」（寒いからどこにも行きたくない）です。
      </P>
      <P>
        Wikipedia「北越方言」にも、岩船北蒲原方言は理由を「すけー」「しけー」「すげ」「しげ」などで表し、これは「さかい」由来だという説明があります。
        一方、東蒲原方言では、「から」「がら」が使われると書かれています。
      </P>
      <P>
        辞典の例文では、「すけ」が9文でした。
        「暗くなったすけ、おみちよーね。」「疲れたすけ、ちょっとながまらせてくんない。」のように、理由のあとに付きます。
        「だすけ」（だから）も1文あります。
        理由を言う「から」は3文（「怒られたからって」「まっかてっからて」「準備すっからね」）で、「すけ」のほうが多く出ています。
      </P>
      <P>
        ただし、「さかい」と同源という説明は、Wikipedia の記述で、原典はこの記事では確認していません。
      </P>

      <H2 id="s4">辞典の新潟弁は、どこの言葉と重なるか</H2>
      <P>
        辞典の新潟弁100語のうち、他の方言にも同じ見出し語があるのは20語でした（2026年11月25日の集計）。
        相手の方言を地方別に数えると、次のとおりです。
      </P>

      <BarFig
        max={9}
        unit="語"
        ariaLabel="辞典の新潟弁で、他の方言にも載る20語を、相手の方言の地方別に数えた語数。東北9語、中部・東海7語、中国・四国5語、北陸4語、北海道2語、九州・沖縄2語、関東1語、近畿0語"
        caption="図：新潟弁と同じ見出し語を持つ方言の地方別の語数（2026年11月25日・自社集計。1語が複数の地方と重なる場合は、それぞれに数えた）"
        items={GROUPS.map(([l, n]) => ({ label: l, value: n, dim: n < 3 }))}
      />

      <P>
        いちばん多いのは、東北の6方言との9語です。
        「しゃっこい」（冷たい）、「ねまる」（座る）、「すける」（手伝う）、「ながまる」（体を伸ばして横になる）などです。
        次に、中部・東海の5方言とは7語、中国・四国の9方言とは5語、北陸の2方言とは4語でした。
        近畿の4方言とは、1語も重なりませんでした。
      </P>
      <P>
        <strong>新潟弁の語は、東北とだけ重なるのではなく、中部・中国・四国・北陸にも散らばっています。</strong>
      </P>
      <P>
        Wikipedia「越後方言」が書く、県内の北は東北方言、魚沼は関東方言の色、上越は信州方言の色、という区分とは、矛盾しません。
        ただし、地方ごとの方言の数が違うため、語数の多い少ないは、単純には比べられません。
        また、これは辞典の中での重なりで、語の由来は示しません。同じ見出し語でも、意味が同じとは限りません。
        近畿の方言と重なる語が0語だったのは、見出し語の重なりの話で、「すけ」のような語尾の語源とは別の話です。
      </P>

      <H2 id="s5">辞典の新潟弁は、どこの言葉か</H2>
      <P>
        辞典の新潟弁100語のうち、出典つきの照合台帳に載っているのは42語です（2026年11月25日の集計）。
        そのうち、出典で語と語釈を確認できたのは36語で、残る6語は出典に届いていません。
        36語の出典は、次の内訳でした。
      </P>

      <BarFig
        max={15}
        unit="語"
        ariaLabel="出典を確認できた新潟弁36語の出典の内訳。新潟県観光協会15語、越佐方言集1892が8語、山形県方言集1933が6語、石川県方言彙集5語、荘内方言考とWikipediaが2語"
        caption="図：出典を確認できた新潟弁36語の出典の内訳（2026年11月25日・自社集計）"
        items={SRC.map(([l, n]) => ({ label: l, value: n, dim: n < 6 }))}
      />

      <P>
        新潟県観光協会の方言紹介で確認できた語が15語、明治25年（1892）の『越佐方言集』で確認できた語が8語あります。
        一方、山形・石川・庄内の方言集を出典に挙げている語も、12語ありました。
        この12語は、新潟の資料では確認できていない語です。
        台帳に載っていない58語は、この記事では出典を確かめていません。
      </P>

      <H2 id="s6">変換ツールに入れると、どう変わるか</H2>
      <P>
        ここまでの語や文を、方言ラボの
        <Link href="/translate/niigata" className={LINK}>新潟弁変換</Link>
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
        「しゃっこい」は「冷たい」に、「あんべー」は「具合」に、「ごうぎ」は「すごい」に直ります。
        標準語の「冷たい」は「しゃっこい」に、「とても」は「ばか」に、「疲れた」は「なんぎー」に変わります。
        一方、<strong>文末の「て」「らね」「ろ」は、直りません。</strong>
        100文のうち47文は文末が「て」で、辞典の語を直しても、文の終わりは新潟弁のまま残ります。
      </P>
      <P>
        「すけ」も、「暗くなったすけ」の「すけ」は残りました。
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
        新潟県の方言は、北越・中越・上越・佐渡などに分かれていて、辞典の語には地域の注記がありません。
        辞典の例文100文では、文末の「て」が47文、「ら」を含む形が14文、「〜すけ」が9文でした。
        「すけ」は、Wikipedia「越後方言」によると、近畿方言の「さかい」と同源です。
        変換ツールは、語は直しますが、文末の「て」「らね」「ろ」は直しません。
      </P>
      <P>
        次にやることは、気になる語を言葉一覧で引いて、例文の語尾も一緒に読むことです。
      </P>
      <P>
        <Link href="/translate/niigata" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 新潟弁変換と、言葉一覧（意味・例文つき）
        </Link>
      </P>
      <P>
        <Link href="/quiz/niigata" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2">
          → 新潟弁検定
        </Link>
      </P>

      <P>この記事の数字は、出どころで3つに分かれます。</P>
      <ul className="list-disc pl-6 mb-4 text-base leading-[1.95] space-y-2">
        <li>新潟県の方言区画、「すけ」の語源、「ら」「ろ」の説明：Wikipedia「越後方言」「北越方言」「新潟弁」の記述です。引用元の原典は確認していません。</li>
        <li>辞典の例文の数（47文・14文・9文）と、他の方言との重なり（20語・9語など）：方言ラボの辞典を2026年11月25日に数えた自社集計です。</li>
        <li>変換ツールの結果：同日に自社のツールを実行した出力です。</li>
      </ul>

      <Note title="確かめたこと、確かめられていないこと">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            確かめたこと：Wikipedia「新潟弁」「越後方言」「北越方言」の音韻・文法・方言区画の節を2026年11月25日に読みました。辞典の例文の語尾の集計、他方言との重なりの集計、変換ツールの出力は、同日の自社集計・自社実行です。
          </li>
          <li>
            確かめたこと：出典照合台帳（新潟弁42語）の出典の内訳。『越佐方言集』（1892）などの記載は、台帳に記録された照合結果によるもので、今回あらためて原本を開いてはいません。
          </li>
          <li>
            確かめられていないこと：文末の「て」の現在の使用率と意味の使い分け、「すけ」と「さかい」が同源という説の原典（Wikipedia の記述を紹介しているだけです）、辞典の新潟弁58語の出典、辞典の語が県内のどの地域の言葉か。
          </li>
        </ul>
        そのため、これらを「新潟ではこう言う」と断定する形では書いていません。
      </Note>

      <Sources
        items={[
          {
            label: "Wikipedia「新潟弁」音韻・文法・語彙の節（新潟市を中心とする地域の方言）2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/新潟弁",
          },
          {
            label: "Wikipedia「越後方言」新潟県の方言区画・文法の特徴の節 2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/越後方言",
          },
          {
            label: "Wikipedia「北越方言」特徴・文法の節 2026年11月25日取得",
            url: "https://ja.wikipedia.org/wiki/北越方言",
          },
          {
            label: "田中勇吉編『越佐方言集』（1892）国立国会図書館デジタルコレクション（出典照合台帳の記録）",
          },
          {
            label: "方言ラボ 新潟弁変換ツールの実行結果・辞典の例文の集計（2026年11月25日・自社実測）",
            url: "https://hogen.mainichi-lab.com/translate/niigata",
          },
        ]}
      />
    </ArticleShell>
  );
}
