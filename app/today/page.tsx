"use client";

import { useEffect, useState } from "react";
import ShareBar from "@/components/ShareBar";
import { TodayWord, allWords, speak, todayWord } from "@/lib/data";
import { charLen, maskWord, shareBlock } from "@/lib/share_text";
import { REGION_OF } from "@/lib/tools";
import { ToolIntro } from "@/components/ToolIntro";

export default function TodayPage() {
  const [today, setToday] = useState<TodayWord | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("すべて");

  // 日付依存のためマウント後に確定（SSRとの不一致回避）
  useEffect(() => setToday(todayWord()), []);

  if (!today) return <p className="text-center text-sub py-16">読み込み中…</p>;

  const words = allWords();
  const dialects = ["すべて", ...Array.from(new Set(words.map((w) => w.dialect)))];
  const shown = filter === "すべて" ? words : words.filter((w) => w.dialect === filter);
  const shareText = `【今日の方言】${today.dialect}「${today.word}」＝${today.meaning}。例:「${today.example}」 #方言ラボ`;
  const url = typeof window !== "undefined" ? `${window.location.origin}/today` : "";
  // Wordle型: 語も意味も伏せ字。文字数と地方だけ出して「何それ」と思わせる
  const shareBlockText = shareBlock([
    `今日の方言（${new Date().getMonth() + 1}/${new Date().getDate()}）`,
    `📖「${maskWord(today.word)}」（${charLen(today.word)}文字・${REGION_OF[today.dialect] ?? "日本"}のことば）意味わかる？`,
    `毎日ひとつ変わります #方言ラボ`,
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="section-title text-center">📅 今日の方言</h1>

      <div className="card p-8 text-center space-y-4">
        <div className="text-sm text-sub">
          {new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}の方言（{today.dialect}）
        </div>
        <div className="text-4xl font-bold font-display">{today.word}</div>
        <div className="text-lg text-sub">{today.meaning}</div>
        <div className="bg-paper border border-line rounded-xl p-4 text-left">
          <span className="text-xs text-sub block mb-1">例文</span>
          {today.example}
        </div>
        <div className="flex justify-center">
          <button onClick={() => speak(today.example)} className="btn-secondary text-sm">
            🔊 例文を読み上げる
          </button>
        </div>
        <ShareBar text={shareText} url={url} block={shareBlockText} />
      </div>

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
      <ToolIntro
        heading="今日の方言について"
        paragraphs={[
          "全国の方言から毎日1語を選んで紹介する日替わりコーナーです。意味と使い方の例文つきで、知らない土地の言葉に1日1語だけ触れられます。掲載している語は、辞典・自治体資料などの出典と照合しながら整備している当サイトの方言データベース（2,700語超）から選ばれています。",
          "「この言い方、うちの地元と同じだ」「同じ言葉なのに意味が違う」といった発見が毎日の楽しみになるよう、地域の偏りが出ないように選んでいます。気に入った語があれば、方言辞典ページで関連語も調べられます。",
        ]}
        related={[
          { href: "/dict", label: "📚 方言辞典" },
          { href: "/kurabe", label: "🔤 全国方言くらべ" },
          { href: "/shindan", label: "🔮 方言タイプ診断" },
        ]}
      />
    </div>
  );
}
