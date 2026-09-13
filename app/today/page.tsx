"use client";

import { useEffect, useState } from "react";
import ShareBar from "@/components/ShareBar";
import { TodayWord, allWords, speak, todayWord } from "@/lib/data";
import { charLen, maskWord, shareBlock } from "@/lib/share_text";
import { REGION_OF } from "@/lib/tools";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

/**
 * ページ下部の静的解説。数値は props で実データから受け取る（手で書くと必ず古くなる）。
 * 文面はこの面だけのもの。ほかのツール面と同じ説明を貼り回さないこと。
 */
function TodayIntro({ total, dialects }: { total: number; dialects: number }) {
  return (
    <ToolIntro
      heading="今日の方言について"
      paragraphs={[
        `全国${dialects}方言・${total.toLocaleString()}語の方言辞典から、その日の1語だけを大きく出すページです。意味と、その語を実際に使った例文が必ず付きます。検索しに来た人ではなく「今日はどの言葉だろう」と開きに来る人のための面なので、入口は1語しかありません。`,
        "選ばれる語は乱数ではなく日付から決まります。だから同じ日に開いた人は、どの端末からでも全員が同じ語を見ます。スクリーンショットを送って「これ分かる？」と聞いたとき、相手の画面にも同じ語が出ているのはそのためです。日付が変われば語も変わります。",
      ]}
      steps={[
        {
          t: "その日の語を読む",
          d: "カードの大きな文字がその日の方言、下が意味です。さらに下の枠に、その語を使った例文が1つ入っています。単語だけだと使いどころが分からないので、必ず文の形で置いています。",
        },
        {
          t: "例文を音で聞く",
          d: "「🔊 例文を読み上げる」を押すと、ブラウザの音声合成が日本語（ja-JP）として例文を読みます。速度は標準の0.95倍に落としてあります。方言のイントネーションそのものではなく、字面だけでは読み方が分からないときの手がかりとして使ってください。",
        },
        {
          t: "友だちに出題する",
          d: "共有ボタンには、語も意味も伏せた形が用意してあります。出るのは丸の数（＝文字数）とどの地方の言葉かだけなので、受け取った人はここへ答え合わせに来ることになります。",
        },
        {
          t: "全部の語を見る",
          d: `「▼ 方言ことば一覧（${total.toLocaleString()}語）」を開くと収録語が全部並びます。右の選択欄で方言を1つに絞れるので、自分の地元の言葉だけを続けて読むこともできます。一覧の語も、それぞれ🔊で例文を聞けます。`,
        },
      ]}
      facts={[
        {
          h: "どの語が出てくるのか",
          body: [
            `出題元は方言ラボの辞典そのものです。${dialects}方言ぶん、合計${total.toLocaleString()}語が入っています。内訳は、1語ずつ手で書いた400語と、地域ごとの資料から起こした${(total - 400).toLocaleString()}語です。`,
            "手で書いた400語のほうは、意味と例文をこちらで整えています。資料から起こしたほうは語数が多いぶん、表記のゆれや世代差がそのまま残っていることがあります。おかしいと思った語を見つけたら、みんなの方言辞書から指摘を書き残せます。",
            "収録は35方言に散らしてあるので、特定の地方だけが続けて出ることはありません。ただし語数は方言ごとに同じではないので、「毎日きっかり公平」という作りではありません。",
          ],
        },
        {
          h: "日付で決まるということ",
          body: [
            "その日の語は、日付から計算した番号で辞典の並びを引いています。サーバーが選んでいるわけでも、あなたに合わせて変えているわけでもありません。同じ日なら誰が開いても同じです。",
            `番号は1日ごとに辞典の中を大きく飛びながら進むので、同じ方言の語が2日続けて出ることはありません。${total.toLocaleString()}語が1回ずつ出てから最初に戻るので、一巡するまでに${total.toLocaleString()}日、およそ${(total / 365.2425).toFixed(1)}年かかります。辞典に語が足されると、その日から先の並びは組み直されます。`,
            "逆に言うと、更新は1日1回だけです。何度読み込んでも日付が変わるまでは同じ語のままなので、「引き直す」ことはできません。もっとたくさんの語を続けて読みたいときは、下の一覧を開いてください。",
            "端末の日付を見て計算しているので、日付をまたいだ瞬間ではなく、あなたの端末が次の日になった時点で切り替わります。",
          ],
        },
      ]}
      faq={[
        {
          q: "毎日何時に変わりますか？",
          a: "あなたの端末の日付が変わった時点です。サーバー側の決まった時刻に一斉更新しているのではないので、時差のある場所では切り替わるタイミングもずれます。",
        },
        {
          q: "この語、自分の地元でも使います。間違いですか？",
          a: "間違いではありません。方言は県境で切れないので、同じ語が隣接した地域にまたがることはよくあります。ここに書いてある地方は「辞典が収録している地域」で、その語を使うのがそこだけだという意味ではありません。",
        },
        {
          q: "読み上げの声が方言っぽくありません。",
          a: "ブラウザに入っている標準の日本語音声で読んでいるためです。方言の音声を録音して載せているわけではないので、抑揚は標準語のものになります。文字だけでは読み方が分からないときの補助として使ってください。",
        },
        {
          q: "過去の日の語をあとから見られますか？",
          a: "日付をさかのぼって表示する機能はありません。ただし出題元は全部が一覧に並んでいるので、見逃した語は一覧から方言で絞り込んで探せます。",
        },
        {
          q: "読み上げボタンを押しても音が出ません。",
          a: "端末が消音になっているか、ブラウザが音声合成に対応していない可能性があります。音声合成に対応していない環境ではボタンを押しても何も起きない作りなので、エラーは出ません。",
        },
      ]}
      related={[
        { href: "/dict", label: "📚 方言辞典で語を調べる" },
        { href: "/kurabe", label: "🔤 同じ意味を全国でくらべる" },
        { href: "/doko", label: "🗾 どこの言葉か当てる" },
        { href: "/shindan", label: "🔮 方言タイプ診断" },
      ]}
    />
  );
}

/**
 * 日替わりの1語を出すカード。`today` が確定してから描画されるので、
 * 「読み込み中」の分岐をこの中に閉じ込められる。
 *
 * 🔴 2026-09-14：以前はこの分岐が TodayPage の先頭にあり、
 * `if (!today) return <p>読み込み中…</p>` で **h1 も解説文もまとめて消えていた**。
 * サーバーが返すHTMLの可読テキストが **268字**（うち本文0字）だったのはこれが原因で、
 * 検索エンジンにも、JSが動く前の読者にも、このページは「読み込み中…」しか無かった。
 * ＝**書いてある文章と、読者に見えている文章は別物**。分岐の中に本文を置かないこと。
 */
function TodayHero({ today }: { today: TodayWord }) {
  const shareText = `【今日の方言】${today.dialect}「${today.word}」＝${today.meaning}。例:「${today.example}」 #方言ラボ`;
  const url = typeof window !== "undefined" ? `${window.location.origin}/today` : "";
  // Wordle型: 語も意味も伏せ字。文字数と地方だけ出して「何それ」と思わせる
  const shareBlockText = shareBlock([
    `今日の方言（${new Date().getMonth() + 1}/${new Date().getDate()}）`,
    `📖「${maskWord(today.word)}」（${charLen(today.word)}文字・${REGION_OF[today.dialect] ?? "日本"}のことば）意味わかる？`,
    `毎日ひとつ変わります #方言ラボ`,
  ]);

  return (
    <div className="card p-8 text-center space-y-4">
      <div className="text-sm text-sub">
        {new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}の方言（{today.dialect}）
      </div>
      <div className="text-4xl font-bold font-display">{today.word}</div>
      <div className="text-lg text-sub">{today.meaning}</div>
      <div className="bg-paper border border-line rounded-xl p-4 text-left">
        <span className="text-sm text-sub block mb-1">例文</span>
        {today.example}
      </div>
      <div className="flex justify-center">
        <button onClick={() => speak(today.example)} className="btn-secondary text-sm">
          🔊 例文を読み上げる
        </button>
      </div>
      <ShareBar text={shareText} url={url} block={shareBlockText} />
    </div>
  );
}

function TodayPage() {
  const [today, setToday] = useState<TodayWord | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("すべて");

  // 日付依存のためマウント後に確定（SSRとの不一致回避）
  useEffect(() => setToday(todayWord()), []);

  // 語の一覧は日付に依存しないので、`today` の確定を待たずに組み立てる
  const words = allWords();
  const dialects = ["すべて", ...Array.from(new Set(words.map((w) => w.dialect)))];
  const shown = filter === "すべて" ? words : words.filter((w) => w.dialect === filter);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="section-title text-center">📅 今日の方言</h1>

      {today ? <TodayHero today={today} /> : <p className="text-center text-sub py-16">読み込み中…</p>}

      <div className="flex items-center justify-between">
        <button onClick={() => setShowAll((s) => !s)} className="btn-ghost">
          {showAll ? "▲ 一覧を閉じる" : `▼ 方言ことば一覧（${words.length}語）`}
        </button>
        {showAll && (
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select-base text-sm py-1.5">
            {dialects.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        )}
      </div>

      {showAll && (
        <div className="grid gap-2">
          {shown.map((w, i) => (
            <div key={i} className="card p-4 flex items-baseline gap-3 flex-wrap">
              <span className="chip bg-indigo/10 text-indigo shrink-0">{w.dialect}</span>
              <span className="font-bold">{w.word}</span>
              <span className="text-sm text-sub">{w.meaning}</span>
              <button onClick={() => speak(w.example)} className="ml-auto text-sm shrink-0" title="例文を読み上げ">
                🔊
              </button>
            </div>
          ))}
        </div>
      )}
      <TodayIntro total={words.length} dialects={dialects.length - 1} />
    </div>
  );
}

/**
 * 日付証跡（公開日・最終更新日）は、ツールの画面状態（読み込み中・出題中など）に関係なく
 * 必ず出す必要があるので、内部の分岐の外側で描画する。
 */
export default function Page() {
  return (
    <>
      <TodayPage />
      <PageDates route="/today" type="WebApplication" name="今日の方言 | 方言ラボ" />
    </>
  );
}
