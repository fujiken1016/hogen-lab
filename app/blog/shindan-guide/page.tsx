import type { Metadata } from "next";
import Link from "next/link";
import { ArticleShell, H2, H3, P, Note, ShindanCta } from "@/components/article";
import { getArticle } from "@/lib/articles";
import { ARCHETYPES } from "@/lib/data";
import { CLUSTERS } from "@/lib/compat";
import { TYPES } from "@/lib/types";
import { SECRETS } from "@/lib/secret";

const article = getArticle("shindan-guide")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/shindan-guide" },
};

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        方言ラボの<Link href="/shindan" className="text-primary font-bold underline underline-offset-2">方言タイプ診断</Link>
        は、14問の質問に答えるだけで、全国{TYPES.length}体のご当地キャラからあなたの相棒を判定するツールです。
        ただ、結果画面には「ことだま鑑定」や「4桁コード」など、初見だと用途がわかりにくい要素も並んでいます。
        この記事では、診断の遊び方と結果の読み方をひととおり解説します。
      </P>

      <H2>診断の流れ：14問・約2分</H2>
      <H3>ステップ1｜言葉づかいの質問（8問）</H3>
      <P>
        最初の8問では、日常の場面でどんな言い回しを選ぶかを聞かれます。
        「ここは自分ならこう言う」に近いものを選んでください。方言を知らなくても大丈夫で、
        <strong>語感の好みで選んで問題ありません</strong>。この8問で、あなたの言葉の距離感が全国のどの方言に近いかを測ります。
      </P>
      <H3>ステップ2｜性格の質問（6問）</H3>
      <P>
        続く6問は、行動や価値観についての質問です。ここで判定されるのが後述の「気質タイプ」で、
        同じ方言キャラが出た人どうしでも、この6問の答えによって結果の文面が変わります。
      </P>
      <H3>ステップ3｜結果とキャラ判定</H3>
      <P>
        14問すべてに答えると、あなたの方言キャラが表示されます。質問は毎回プールからランダムに選ばれるため、
        <strong>もう一度やると違う質問が出ます</strong>。「前と結果が変わった」という場合は、
        たいてい質問の組み合わせが変わったことが理由です。気になる方は、いちばん自分らしいと思う結果を採用してください。
      </P>

      <H2>結果画面の見方</H2>
      <H3>① 方言キャラとタイプ名</H3>
      <P>
        メインの結果です。「大阪弁＝天性のムードメーカー」のように、方言名とタイプ名がセットで表示されます。
        性格の解説・恋愛の傾向・あるあるの3点セットが付くので、当たっているところだけ拾って楽しむのがおすすめです。
      </P>
      <H3>② 気質タイプ（7種）</H3>
      <P>
        性格6問から判定される、あなたの内面のタイプです。全部で{CLUSTERS.length}種類あります。
      </P>
      <div className="grid sm:grid-cols-2 gap-2.5 my-4">
        {CLUSTERS.map((c) => (
          <div key={c} className="card p-3.5">
            <p className="font-bold text-[14px] text-primary-deep">{ARCHETYPES[c]?.label}</p>
            <p className="text-[12.5px] text-sub leading-[1.8] mt-1">{ARCHETYPES[c]?.love}</p>
          </div>
        ))}
      </div>
      <P>
        さらに、その気質がどれくらい表に出ているかを5段階（ひかえめ／じんわり／しっかり／ぐいぐい／全開）で表示します。
        方言キャラ{TYPES.length}通り × 気質7通り × 強さ5段階の組み合わせなので、
        同じキャラが出ても文面が同じになることはめったにありません。
      </P>
      <H3>③ ことだま鑑定</H3>
      <P>
        結果の下に続くのが、占いパートの「ことだま鑑定」です。あなたの方言に割り当てられた五行（木・火・土・金・水）を軸に、
        ことだまの数、タロット1枚、月相、恋愛運・仕事運・金運・対人運の4指標、
        7日間の運気の波と勝負日、そしてラッキー方位までを一枚にまとめています。
      </P>
      <Note title="ことだま鑑定の仕組み">
        鑑定内容は「あなたの結果」と「その日の日付」の組み合わせから決まります。
        つまり<strong>同じ人でも日が変わると内容が変わり、同じ日なら何度開いても同じ</strong>。
        毎朝のおみくじのように使ってもらう想定です。
      </Note>

      <H2>4桁コードと相性チェックの使い方</H2>
      <P>
        診断が終わると、結果と一緒に4桁の英数字コードが発行されます。これは
        <strong>あなたの診断結果を圧縮した合言葉</strong>で、方言キャラ・気質・強さの3情報が入っています。
      </P>
      <H3>使い方A｜友達のコードを入力する</H3>
      <P>
        <Link href="/aishou" className="text-primary font-bold underline underline-offset-2">相性チェッカー</Link>
        に2人分のコードを入れると、その場で相性が出ます。友達に診断をやり直してもらう必要はありません。
        自分のコードは自動で入るので、実際に入力するのは相手のぶんだけです。
      </P>
      <H3>使い方B｜結果ページのリンクを共有する</H3>
      <P>
        結果画面の共有リンクは、そのまま<strong>自分の診断結果ページ</strong>になっています。
        受け取った人はあなたのキャラを見られますし、その人がすでに診断済みなら、
        ページを開いた時点で2人の相性まで自動で表示されます。SNSに貼るならこちらが手軽です。
      </P>
      <H3>相性で見られる5つの軸</H3>
      <P>
        相性は総合スコアだけでなく、会話のテンポ・価値観・恋愛相性・コンビ仕事力・ケンカ耐性の5軸で表示されます。
        さらに五行の相生・相剋（どちらが相手を生かす関係か、ぶつかりやすい関係か）と、
        2人で試すと面白いアクションの提案が付きます。
        総合点が低くても、特定の軸だけ突出して高い組み合わせは珍しくありません。
      </P>

      <H2>シークレットキャラについて</H2>
      <P>
        通常の{TYPES.length}体とは別に、ごく低い確率でしか出会えないシークレットキャラが{SECRETS.length}体います。
      </P>
      <div className="grid gap-2.5 my-4">
        {SECRETS.map((s) => (
          <div key={s.slug} className="card p-3.5 flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              ❔
            </span>
            <div>
              <p className="font-bold text-[14px]">{s.name}</p>
              <p className="text-[12px] text-sub mt-0.5">出現率 {s.rateLabel}</p>
            </div>
          </div>
        ))}
      </div>
      <P>
        出会うまではキャラ図鑑でもモザイクがかかったままで、一度引き当てると図鑑と紹介ページが解放されます。
        狙って出せるものではないので、気長に診断を重ねたときのご褒美くらいに考えてください。
      </P>

      <H2>よくある質問</H2>
      <H3>Q. 何度やっても大丈夫？</H3>
      <P>
        回数制限はありません。質問はプールからランダムに選ばれるので、
        やるたびに違う角度から聞かれます。何度か試して、いちばんしっくりくる結果を「自分のキャラ」にしてください。
      </P>
      <H3>Q. 結果はどこに保存される？</H3>
      <P>
        診断結果・獲得バッジ・解放したシークレットは、すべて<strong>お使いのブラウザ内にのみ保存</strong>されます。
        サーバーに送信されることはありません。そのぶん、ブラウザのデータを消したり別の端末で開いたりすると引き継がれない点にはご注意ください。
        コードだけメモしておけば、相性チェックはどの端末からでも使えます。
      </P>
      <H3>Q. 診断のあとは何をすればいい？</H3>
      <P>
        結果が出たら、<Link href="/quiz" className="text-primary font-bold underline underline-offset-2">クイズ検定</Link>
        でバッジを集めたり、<Link href="/translate" className="text-primary font-bold underline underline-offset-2">方言翻訳</Link>
        で自分の文章を出たキャラの方言に変換してみるのがおすすめです。
        毎日1語ずつ覚えるなら<Link href="/today" className="text-primary font-bold underline underline-offset-2">今日の方言</Link>、
        地元の言い回しを登録したいなら<Link href="/dict" className="text-primary font-bold underline underline-offset-2">みんなの辞書</Link>へどうぞ。
      </P>

      <ShindanCta
        title="まずは1回、やってみる"
        body="14問・約2分。登録不要・無料です。出たキャラのコードを控えておけば、友達との相性チェックにそのまま使えます。"
      />
    </ArticleShell>
  );
}
