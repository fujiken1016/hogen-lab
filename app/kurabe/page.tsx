"use client";

import Link from "next/link";
import { useState } from "react";
import ShareBar from "@/components/ShareBar";
import TypeAvatar from "@/components/TypeAvatar";
import { REGIONS, SHINDAN_PHRASES, SHINDAN_QUESTIONS, STANDARD } from "@/lib/data";
import { track } from "@/lib/ga";
import { charLen, maskWord, shareBlock } from "@/lib/share_text";
import { REGION_OF } from "@/lib/tools";
import { typeByDialect } from "@/lib/types";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

const EMOJI: Record<string, string> = {
  ありがとう: "🙏",
  疲れた: "😮‍💨",
  "本当に？": "👀",
  とてもおいしい: "😋",
  ダメだよ: "🙅",
  "何してるの？": "🤔",
  じゃあね: "👋",
  とても良いね: "👍",
  おいで: "🫱",
  捨てておいて: "🗑️",
  久しぶり: "🤝",
  寒いね: "🥶",
};

/**
 * ページ下部の静的解説。数値は SHINDAN_QUESTIONS / SHINDAN_PHRASES から数えて出す。
 *
 * 🔴 2026-09-14：以前はこれを「全国一覧」の分岐にだけ置いていた。
 * ＝ひとことを1つ選ばないと1文字も出てこない＝**最初の画面には本文が無かった**
 * （可読テキスト492字・本文0字）。サーバーが返すHTMLもその状態だった。
 * 今は最初の画面と一覧の両方に置いている。
 */
function KurabeIntro() {
  const phrases = SHINDAN_QUESTIONS.length;
  const dialects = Object.keys(SHINDAN_PHRASES).length - 1; // 標準語を除く
  const cells = Object.values(SHINDAN_PHRASES).reduce((n, o) => n + Object.keys(o).length, 0);
  return (
    <ToolIntro
      heading="全国方言くらべについて"
      paragraphs={[
        `「ありがとう」「疲れた」のような日常のひとこと${phrases}種類を選ぶと、その意味を全国${dialects}方言がそれぞれどう言うかを、地方ごとにまとめて並べるツールです。翻訳のように文を入れるのではなく、先に意味を決めてから言い方を横に見ていきます。`,
        "1語ずつ辞書を引くと、その言葉が珍しいのかどうかは分かりません。同じ意味を全部の方言で並べたときにはじめて、「西日本だけ形が違う」「東北と九州で似た言い方をしている」といった並びが見えます。この面はそのための一覧です。",
      ]}
      steps={[
        {
          t: "くらべたいひとことを選ぶ",
          d: `最初の画面に${phrases}個のひとことが並びます。「捨てておいて」「何してるの？」のように、言い方の差が出やすい日常の表現だけを選んであります。`,
        },
        {
          t: "全国の言い方を上から読む",
          d: "北海道・東北から沖縄まで、8つの地方に分けて並びます。地方の見出しごとに区切ってあるので、近い土地の言い方がまとまって目に入ります。",
        },
        {
          t: "自分の言い方をタップする",
          d: "並んでいる中に自分が使う言い方があれば、それを押してください。標準語の言い方も選べるように、一覧の下に別の枠で置いてあります。",
        },
        {
          t: "同じ言い方をする地域を見る",
          d: "押すと、まったく同じ形を収録している方言が何件あるかが出ます。1件なら、その言い方はその土地だけのものです。複数出たなら、離れた土地と言い方を共有していることになります。",
        },
      ]}
      facts={[
        {
          h: "並べている表の中身",
          body: [
            `表そのものは、${phrases}のひとこと×${dialects}方言＋標準語＝${cells.toLocaleString()}件の言い方でできています。方言ごとに穴を開けていないので、どのひとことを選んでも全方言ぶんの行が出ます。`,
            "載せているのは各方言の代表的な1つの形です。実際には同じ県の中でも世代や市町村で形が割れるので、ここに出ている言い方が唯一の正解ではありません。「うちはもう少し違う」が出るのは、表が間違っているというより方言がそういうものだからです。",
            "標準語の行をあえて残してあるのは、比較の基準線が要るからです。標準語と同じ形の方言が並んでいるときは、その表現に関してはその土地に固有の言い方が無い、という読み方ができます。",
          ],
        },
        {
          h: "ひとことを12個に絞った理由",
          body: [
            "方言の差が出やすい表現と、出にくい表現があります。名詞はそのまま共通していることが多く、差が出るのはあいさつ・感情・依頼・相づちのような、人に向かって言う短い表現です。",
            "そこで、お礼（ありがとう）・別れ（じゃあね）・再会（久しぶり）・依頼（捨てておいて、おいで）・感想（とてもおいしい、とても良いね、寒いね、疲れた）・確認（本当に？、何してるの？）・否定（ダメだよ）に絞りました。どれも1日のうちに実際に言う機会がある表現です。",
            "逆に、方言らしさで有名でも日常で使わない語は入れていません。並べて「へえ」で終わらず、自分がどれを言うか答えられることを条件にしています。",
          ],
        },
      ]}
      faq={[
        {
          q: "自分の言い方が一覧にありません。",
          a: "収録しているのは方言ごとに代表的な1形だけなので、地域差・世代差で外れることがあります。その場合はいちばん近い言い方を選んでください。自分の言い方そのものを残したいときは、みんなの方言辞書から書き込めます。",
        },
        {
          q: "同じ言い方が複数の方言に出てきます。おかしくないですか？",
          a: "おかしくありません。隣り合う土地はもちろん、遠く離れた土地で同じ形を使うこともあります。むしろその重なりを見るために全方言を同時に並べています。押したときに「同じ言い方の地域」が出るのもこのためです。",
        },
        {
          q: "方言から逆に意味を調べたいです。",
          a: "この面は意味を先に決める作りなので逆引きはできません。語から調べたいときは方言辞典を、どこの言葉か当てたいときは「この方言、何弁？」を使ってください。",
        },
        {
          q: "自由な文を方言にしたいです。",
          a: "そちらは方言変換のページです。この面は決まったひとことを全国で見くらべる用で、任意の文は扱いません。",
        },
      ]}
      related={[
        { href: "/translate", label: "🗣️ 自由な文を方言に変換" },
        { href: "/doko", label: "🗾 どこの言葉か当てる" },
        { href: "/dict", label: "📚 方言辞典" },
        { href: "/shindan", label: "🔮 方言タイプ診断" },
      ]}
    />
  );
}

function KurabePage() {
  const [phraseKey, setPhraseKey] = useState<string | null>(null);
  const [pick, setPick] = useState<{ dialect: string; text: string } | null>(null);

  function selectPhrase(key: string) {
    track("kurabe_start", { phrase: key });
    setPhraseKey(key);
    setPick(null);
  }

  function selectDialect(dialect: string, text: string) {
    track("kurabe_complete", { phrase: phraseKey ?? "", dialect, answer: text });
    setPick({ dialect, text });
  }

  // ───────── 意味を選ぶ ─────────
  if (!phraseKey) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="section-title">🗾 全国方言くらべ</h1>
          <p className="text-sub text-sm leading-relaxed">
            同じひとことが、全国35の方言でどう変わるか。まず、くらべたいひとことを選んでください。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SHINDAN_QUESTIONS.map((q, i) => (
            <button
              key={q.key}
              onClick={() => selectPhrase(q.key)}
              className="!rounded-xl border border-line shadow-[0_2px_10px_rgba(34,48,63,0.07)] p-3.5 min-h-[64px] flex items-center gap-2.5 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all"
              style={{
                background: ["#FFF3F0", "#EFF6F1", "#FFF8E6", "#F0F4FA", "#F6F0FA", "#FFF1F6"][i % 6],
              }}
            >
              <span className="text-2xl shrink-0" aria-hidden>
                {EMOJI[q.key] ?? "💬"}
              </span>
              <span className="font-bold text-sm leading-snug">{q.key}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-sub leading-relaxed">
          収録している言い方は方言ラボの辞書データによるものです。方言は地域・世代によって差があり、
          ここに載っている形が唯一の言い方というわけではありません。
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/translate" className="btn-ghost">🗣️ 自由な文を方言に翻訳</Link>
          <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        </div>
        <KurabeIntro />
      </div>
    );
  }

  const standard = SHINDAN_PHRASES[STANDARD]?.[phraseKey] ?? phraseKey;

  // ───────── 選んだ言い方の結果 ─────────
  if (pick) {
    const same = [STANDARD, ...REGIONS.flatMap((r) => r.dialects)].filter(
      (d) => SHINDAN_PHRASES[d]?.[phraseKey] === pick.text,
    );
    const t = typeByDialect(pick.dialect);
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/kurabe` : "https://hogen.mainichi-lab.com/kurabe";
    const shareText = `【方言ラボ】「${phraseKey}」を私は「${pick.text}」って言う。${pick.dialect}の言い方でした。あなたはどう言う？ #方言ラボ`;
    // Wordle型: 自分が選んだ言い方は伏せ字。何弁だったかも出さない
    const shareBlockText = shareBlock([
      `全国方言くらべ「${phraseKey}」`,
      `🗣️ 私の言い方は「${maskWord(pick.text)}」（${charLen(pick.text)}文字）`,
      `同じ言い方を収録している地域は${same.length} あなたはどう言う？ #方言ラボ`,
    ]);

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card p-7 text-center space-y-4 anim-fade-up">
          <p className="text-sm text-sub tracking-widest">あなたが選んだ言い方</p>
          <div className="font-display font-bold text-3xl sm:text-4xl break-words">「{pick.text}」</div>
          {t && (
            <div className="flex justify-center">
              <TypeAvatar type={t} size={88} />
            </div>
          )}
          <p className="text-sm">
            これは <strong className="text-primary-text">{pick.dialect}</strong>
            {REGION_OF[pick.dialect] && <span className="text-sub">（{REGION_OF[pick.dialect]}）</span>} の言い方として
            収録されています。
          </p>
          <p className="text-sm text-sub">標準語なら「{standard}」</p>
          {same.length > 1 && (
            <div className="text-sm bg-paper border border-line rounded-xl p-3">
              <p className="font-bold mb-1.5">同じ言い方を収録している地域（{same.length}）</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {same.map((d) => (
                  <span key={d} className="chip bg-primary/10 text-primary-text !text-sm">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
          <ShareBar text={shareText} url={url} block={shareBlockText} />
          {t && (
            <Link href={`/c/${t.slug}`} className="btn-secondary text-sm inline-block">
              {pick.dialect}のキャラを見る
            </Link>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => setPick(null)} className="btn-primary min-h-[48px]">
            一覧に戻る
          </button>
          <button onClick={() => setPhraseKey(null)} className="btn-secondary min-h-[48px]">
            別のひとことをくらべる
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/shindan" className="btn-ghost">🔮 方言タイプ診断</Link>
          <Link href="/kawaii" className="btn-ghost">💗 かわいい方言トーナメント</Link>
          <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        </div>
      </div>
    );
  }

  // ───────── 全国一覧 ─────────
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="text-center space-y-2">
        <p className="text-sm text-sub tracking-widest">全国方言くらべ</p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">「{phraseKey}」は、どう言う？</h1>
        <p className="text-sub text-sm">
          標準語では「{standard}」。自分が使う言い方をタップすると、その言い方の地域が分かります。
        </p>
      </div>

      {REGIONS.map((r) => (
        <section key={r.name} className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="hanko-sq !w-6 !h-6 !text-sm">地</span>
            {r.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {r.dialects.map((d) => {
              const text = SHINDAN_PHRASES[d]?.[phraseKey];
              if (!text) return null;
              return (
                <button
                  key={d}
                  onClick={() => selectDialect(d, text)}
                  className="card !rounded-xl p-3.5 min-h-[64px] text-left flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  <span className="chip bg-indigo/10 text-indigo !text-sm shrink-0">{d}</span>
                  <span className="font-bold text-sm break-words min-w-0">{text}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="card p-4 text-center space-y-2">
        <p className="text-sm text-sub">標準語の言い方も選べます</p>
        <button
          onClick={() => selectDialect(STANDARD, standard)}
          className="btn-secondary min-h-[48px]"
        >
          「{standard}」を選ぶ
        </button>
      </div>

      <p className="text-sm text-sub leading-relaxed">
        ※ 掲載している言い方は方言辞典サイト・自治体公開資料等を参照して独自に編集したものです。
        方言は地域・世代で差があり、同じ県内でも言い方が分かれることがあります。
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setPhraseKey(null)} className="btn-secondary min-h-[48px]">
          別のひとことをくらべる
        </button>
        <Link href="/translate" className="btn-ghost">🗣️ 自由な文を方言に翻訳</Link>
      </div>
      <KurabeIntro />
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
      <KurabePage />
      <PageDates route="/kurabe" type="WebApplication" name="全国方言くらべ | 方言ラボ" />
    </>
  );
}
