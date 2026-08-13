"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import ShareBar from "@/components/ShareBar";
import TypeAvatar from "@/components/TypeAvatar";
import { track } from "@/lib/ga";
import { DokoQ, REGION_OF, buildDokoQuestions, dokoRank } from "@/lib/tools";
import { typeByDialect } from "@/lib/types";

const TOTAL = 8;

type Phase = "intro" | "play" | "result";
type Log = { q: DokoQ; picked: string; ok: boolean };

export default function DokoPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<DokoQ[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  // 連打対策: 1問1回答。次の問題を出したら解除する
  const lock = useRef(false);

  const q = questions[index];
  const correct = logs.filter((l) => l.ok).length;

  function start() {
    const qs = buildDokoQuestions(TOTAL);
    track("doko_start", { total: qs.length });
    setQuestions(qs);
    setIndex(0);
    setPicked(null);
    setLogs([]);
    lock.current = false;
    setPhase("play");
  }

  function choose(d: string) {
    if (lock.current || picked !== null || !q) return;
    lock.current = true;
    setPicked(d);
    setLogs((prev) => [...prev, { q, picked: d, ok: d === q.answer }]);
  }

  function next() {
    if (index + 1 >= questions.length) {
      const done = logs.filter((l) => l.ok).length;
      const rank = dokoRank(done, questions.length);
      track("doko_complete", {
        correct: done,
        total: questions.length,
        score: Math.round((done / questions.length) * 100),
        rank: rank.title,
      });
      setPhase("result");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    lock.current = false;
  }

  // ───────── イントロ ─────────
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="section-title">🗾 この方言、どこの言葉？</h1>
          <p className="text-sub text-sm leading-relaxed">
            全国35方言の中から8語を出題。意味を見て「どこの言葉か」を4択で当てるクイズです。
          </p>
        </div>
        <div className="card p-6 space-y-4 text-center">
          <div className="flex justify-center gap-1 flex-wrap">
            {["北海道弁", "京都弁", "土佐弁", "博多弁", "沖縄方言"].map((d) => {
              const t = typeByDialect(d);
              return t ? <TypeAvatar key={d} type={t} size={56} /> : null;
            })}
          </div>
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-indigo">
            <span>✓ 全8問</span>
            <span>✓ 約1分</span>
            <span>✓ 登録不要</span>
          </div>
          <button onClick={start} className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
            クイズをはじめる
          </button>
          <p className="text-[11px] text-sub leading-relaxed text-left">
            出題語は<strong>出典を1語ずつ照合したリスト</strong>だけを使い、
            ダミーの選択肢は<strong>正解の地方と隣り合わない地方</strong>から選んでいます。
            それでも方言には地域差・世代差があり、同じ言葉を別の土地で使うことはあります。
            ここでの「答え」は<strong>方言ラボ辞典の収録地域</strong>であって、あなたの言葉が間違いという意味ではありません。
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link href="/quiz" className="btn-ghost">🏅 方言クイズ検定へ</Link>
          <Link href="/dict" className="btn-ghost">📖 方言辞典を見る</Link>
        </div>
      </div>
    );
  }

  // ───────── 結果 ─────────
  if (phase === "result") {
    const rank = dokoRank(correct, questions.length);
    const score = Math.round((correct / questions.length) * 100);
    const shareText = `【方言ラボ】「この方言どこの言葉？」${questions.length}問中${correct}問的中（${score}点）／称号「${rank.title}」${rank.emoji} あなたの方言耳は何点？ #方言ラボ`;
    const url = typeof window !== "undefined" ? `${window.location.origin}/doko` : "https://hogen.mainichi-lab.com/doko";

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card p-8 text-center space-y-5 anim-fade-up">
          {correct === questions.length && <Confetti />}
          <div className="text-5xl anim-pop">{rank.emoji}</div>
          <div>
            <p className="text-xs text-sub tracking-widest">あなたの称号</p>
            <h2 className="text-2xl font-bold font-display mt-1">{rank.title}</h2>
          </div>
          <p className="text-lg font-bold">
            {questions.length}問中 {correct}問が辞典と一致
            <span className="text-sub text-sm font-normal">（{score}点）</span>
          </p>
          <p className="text-sm text-sub leading-relaxed">{rank.comment}</p>
          <ShareBar text={shareText} url={url} />
        </div>

        {/* 間違えた問題は消さずに残す。結果画面で自分のペースで読み返せるようにする */}
        <div className="card p-5 space-y-3">
          <h3 className="font-bold text-sm">📋 出題のふりかえり（全{logs.length}問）</h3>
          <ul className="space-y-2">
            {logs.map((l, i) => (
              <li
                key={i}
                className={`rounded-xl border p-3 text-sm ${l.ok ? "border-green-500/50 bg-green-50" : "border-indigo/40 bg-indigo/5"}`}
              >
                <div className="font-bold">
                  {l.ok ? "⭕" : "📖"}「{l.q.word}」= {l.q.meaning}
                </div>
                <div className="text-xs text-sub mt-1">
                  辞典の収録：{l.q.answer}（{REGION_OF[l.q.answer]}）
                  {l.q.sameRegionAlso.length > 0 && <span>・{l.q.sameRegionAlso.join("・")}</span>}
                  {!l.ok && <span className="text-indigo">／あなたの回答：{l.picked}</span>}
                </div>
                <div className="text-xs mt-1">例：{l.q.example}</div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-sub">
            ※ 「収録」は方言ラボ辞典の分類です（出題語は出典を1語ずつ照合しています）。同じ語を別の土地で使うこともあり、
            あなたの言葉が誤りという意味ではありません。違いに気づいたら「みんなの辞書」からお知らせください。
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={start} className="btn-primary">もう一度（別の8問）</button>
          <Link href="/shindan" className="btn-secondary">方言タイプ診断へ</Link>
          <Link href="/kawaii" className="btn-secondary">かわいい方言トーナメント</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link href="/kurabe" className="btn-ghost">🗾 全国方言くらべ</Link>
          <Link href="/quiz" className="btn-ghost">🏅 クイズ検定</Link>
          <Link href="/dict" className="btn-ghost">📖 辞典</Link>
        </div>
      </div>
    );
  }

  // ───────── 出題中 ─────────
  const progress = Math.round((index / questions.length) * 100);
  const answered = picked !== null;
  const isLast = index + 1 >= questions.length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-sub">
          <span>この方言どこの言葉？</span>
          <span>
            Q{index + 1} / {questions.length}・一致 {correct}
          </span>
        </div>
        <div className="h-2 bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-primary bar-shimmer rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-5 sm:p-6 space-y-4">
        <div className="text-center space-y-1">
          <div className="font-display font-bold text-3xl sm:text-4xl break-words">{q.word}</div>
          <div className="text-sm text-sub">意味：{q.meaning}</div>
        </div>

        <div className="grid gap-2">
          {q.choices.map((c) => {
            let cls = "border-line hover:border-primary hover:bg-primary/5";
            if (answered) {
              if (c === q.answer) cls = "border-green-500 bg-green-50";
              else if (c === picked) cls = "border-indigo/50 bg-indigo/5";
              else cls = "border-line text-sub/60";
            }
            return (
              <button
                key={c}
                onClick={() => choose(c)}
                disabled={answered}
                className={`border rounded-xl px-4 py-3.5 min-h-[52px] text-left bg-white transition-colors ${cls}`}
              >
                <span className="font-bold">{c}</span>
                <span className="text-xs text-sub ml-2">{REGION_OF[c]}</span>
                {answered && c === q.answer && <span className="text-[11px] text-green-700 ml-2">辞典の収録地域</span>}
                {answered && c === picked && c !== q.answer && (
                  <span className="text-[11px] text-indigo ml-2">あなたの回答</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="space-y-3 anim-pop">
            {/* 「不正解」と断定しない。辞典がどこの語として収録しているかを示す形にする */}
            <div className="text-sm bg-paper border border-line rounded-xl p-3 space-y-1">
              <p className="font-bold">
                {picked === q.answer ? "⭕ 辞典と一致！" : "📖 辞典では"}「{q.word}」は
                <span className="text-indigo">{q.answer}</span>（{REGION_OF[q.answer]}）の語として収録しています
              </p>
              <p className="text-xs">例文：{q.example}</p>
              {q.sameRegionAlso.length > 0 && (
                <p className="text-[11px] text-sub">※ 同じ{REGION_OF[q.answer]}の{q.sameRegionAlso.join("・")}にも収録があります。</p>
              )}
              {picked !== q.answer && (
                <p className="text-[11px] text-sub">
                  ※ {picked}でも使う、というご指摘は「みんなの辞書」からお寄せください。辞典に反映します。
                </p>
              )}
            </div>
            {/* 自動では進めない。読み終えてから自分で次へ */}
            <button onClick={next} className="btn-primary w-full min-h-[52px]">
              {isLast ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
