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

export default function KurabePage() {
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
        <p className="text-[11px] text-sub leading-relaxed">
          収録している言い方は方言ラボの辞書データによるものです。方言は地域・世代によって差があり、
          ここに載っている形が唯一の言い方というわけではありません。
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link href="/translate" className="btn-ghost">🗣️ 自由な文を方言に翻訳</Link>
          <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        </div>
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
          <p className="text-xs text-sub tracking-widest">あなたが選んだ言い方</p>
          <div className="font-display font-bold text-3xl sm:text-4xl break-words">「{pick.text}」</div>
          {t && (
            <div className="flex justify-center">
              <TypeAvatar type={t} size={88} />
            </div>
          )}
          <p className="text-sm">
            これは <strong className="text-primary">{pick.dialect}</strong>
            {REGION_OF[pick.dialect] && <span className="text-sub">（{REGION_OF[pick.dialect]}）</span>} の言い方として
            収録されています。
          </p>
          <p className="text-xs text-sub">標準語なら「{standard}」</p>
          {same.length > 1 && (
            <div className="text-xs bg-paper border border-line rounded-xl p-3">
              <p className="font-bold mb-1.5">同じ言い方を収録している地域（{same.length}）</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {same.map((d) => (
                  <span key={d} className="chip bg-primary/10 text-primary !text-[11px]">
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
        <div className="flex flex-wrap justify-center gap-2 text-xs">
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
        <p className="text-xs text-sub tracking-widest">全国方言くらべ</p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">「{phraseKey}」は、どう言う？</h1>
        <p className="text-sub text-xs">
          標準語では「{standard}」。自分が使う言い方をタップすると、その言い方の地域が分かります。
        </p>
      </div>

      {REGIONS.map((r) => (
        <section key={r.name} className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <span className="hanko-sq !w-6 !h-6 !text-[10px]">地</span>
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
                  <span className="chip bg-indigo/10 text-indigo !text-[10px] shrink-0">{d}</span>
                  <span className="font-bold text-sm break-words min-w-0">{text}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="card p-4 text-center space-y-2">
        <p className="text-xs text-sub">標準語の言い方も選べます</p>
        <button
          onClick={() => selectDialect(STANDARD, standard)}
          className="btn-secondary min-h-[48px]"
        >
          「{standard}」を選ぶ
        </button>
      </div>

      <p className="text-[11px] text-sub leading-relaxed">
        ※ 掲載している言い方は方言辞典サイト・自治体公開資料等を参照して独自に編集したものです。
        方言は地域・世代で差があり、同じ県内でも言い方が分かれることがあります。
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setPhraseKey(null)} className="btn-secondary min-h-[48px]">
          別のひとことをくらべる
        </button>
        <Link href="/translate" className="btn-ghost">🗣️ 自由な文を方言に翻訳</Link>
      </div>
      <ToolIntro
        heading="全国方言くらべについて"
        paragraphs={[
          "「ありがとう」「とても」「捨てる」のような身近なひとことが、全国35の方言でどう言われるかを一覧で見くらべられるツールです。同じ意味の言葉を横に並べると、東日本と西日本の境界線や、九州・東北の中でのグラデーションが一目で見えてきます。",
          "掲載している言い方は、辞典類・自治体資料と照合しながら整備しています。地域による言い方の違いは連続的で、県境でくっきり分かれるわけではありません。ここでは代表的な形を載せているので、「うちの地域はもうちょっと違う」という発見も含めて楽しんでください。",
        ]}
        related={[
          { href: "/translate", label: "🗣️ 自由な文を方言に変換" },
          { href: "/dict", label: "📚 方言辞典" },
          { href: "/quiz", label: "🏅 方言クイズ検定" },
        ]}
      />
      <PageDates route="/kurabe" type="WebApplication" name="全国方言くらべ | 方言ラボ" />
    </div>
  );
}
