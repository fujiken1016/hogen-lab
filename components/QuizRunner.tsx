"use client";

// 方言別「○○弁検定」の実行部（/quiz/[slug] から方言名を受け取る）。
//
// UX上の約束（既存ツールと同じ作法）:
// - 自動で進む要素を作らない。回答後は必ずユーザーのタップで次へ進む。
// - 連打・二重回答は lock で防ぐ。タップ標的は48px以上。
// - 判定は「不正解」と断定せず「辞典では〜として収録」と書く（/doko と同じ）。
//   辞典が他の方言にも同じ語を収録していれば、その場で併記する。

import Link from "next/link";
import { useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import ShareBar from "@/components/ShareBar";
import { shuffle, unlockBadge } from "@/lib/data";
import { track } from "@/lib/ga";
import { AnnotatedQ, annotatedQuiz, quizSlug } from "@/lib/quiz_meta";

type PlayQ = AnnotatedQ & { order: number[] };
type Log = { q: PlayQ; picked: number };

export default function QuizRunner({ dialect }: { dialect: string }) {
  const slug = quizSlug(dialect) ?? "";
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [questions, setQuestions] = useState<PlayQ[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const lock = useRef(false);

  const correct = logs.filter((l) => l.picked === l.q.answer).length;
  const q = questions[index];

  function start() {
    track("quiz_start", { dialect, dialect_slug: slug });
    // 選択肢の並びはタップ時に決めるのでSSRとの不一致は起きない
    setQuestions(annotatedQuiz(dialect).map((qq) => ({ ...qq, order: shuffle(qq.choices.map((_, i) => i)) })));
    setIndex(0);
    setPicked(null);
    setLogs([]);
    lock.current = false;
    setPhase("play");
  }

  function choose(originalIdx: number) {
    if (picked !== null || lock.current) return; // 連打・二重回答の防止
    lock.current = true;
    setPicked(originalIdx);
    setLogs((ls) => [...ls, { q, picked: originalIdx }]);
    lock.current = false;
  }

  function next() {
    if (picked === null) return;
    if (index + 1 >= questions.length) {
      const hit = logs.filter((l) => l.picked === l.q.answer).length;
      const score = hit / questions.length;
      if (score >= 0.8) unlockBadge(`quiz_${dialect}`);
      track("quiz_complete", {
        dialect,
        dialect_slug: slug,
        score: Math.round(score * 100),
        correct: hit,
        total: questions.length,
        passed: score >= 0.8,
      });
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  // ───────── はじめる前 ─────────
  if (phase === "intro") {
    return (
      <div className="card p-6 space-y-4 text-center">
        <div className="flex items-center justify-center gap-3 text-xs font-bold text-indigo">
          <span>✓ 全8問</span>
          <span>✓ 約1分</span>
          <span>✓ 登録不要</span>
        </div>
        <button onClick={start} className="btn-primary text-lg px-10 py-4 w-full sm:w-auto min-h-[52px]">
          {dialect}検定をはじめる
        </button>
        <p className="text-[11px] text-sub leading-relaxed text-left">
          出題は<strong>方言ラボ辞典に収録している語</strong>だけです。
          <strong>出典を1語ずつ照合した語</strong>を先に出し、辞典が他の方言にも同じ語を収録している場合は
          その場で併記します。方言には地域差・世代差があり、
          ここでの「答え」は<strong>辞典の語釈</strong>であって、
          <strong>あなたの言葉が間違いという意味ではありません</strong>。
        </p>
      </div>
    );
  }

  // ───────── 結果 ─────────
  if (phase === "done") {
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 80;
    const shareText = `【方言ラボ】${dialect}検定 ${passed ? "合格🎉" : "挑戦"}！ ${questions.length}問中${correct}問が辞典と一致（${score}点）あなたも挑戦してみて！ #方言ラボ #${dialect}検定`;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/quiz/${slug}`
        : `https://hogen.mainichi-lab.com/quiz/${slug}`;

    return (
      <div className="space-y-4">
        <div className="card p-8 text-center space-y-5 anim-fade-up">
          {passed && <Confetti />}
          <div className={`text-5xl ${passed ? "anim-pop" : ""}`}>{passed ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold">{passed ? `${dialect}検定 合格！` : "もう少し！"}</h2>
          <p className="text-lg font-bold">
            {questions.length}問中 {correct}問が辞典と一致
            <span className="text-sub text-sm font-normal">（{score}点）</span>
          </p>
          {passed && (
            <p className="text-amber-800 bg-gold/15 border border-gold/40 rounded-xl p-3 text-sm">
              🏅 「{dialect} 検定合格」バッジを獲得しました
            </p>
          )}
          <ShareBar text={shareText} url={url} />
        </div>

        {/* 結果は自動で流さず、自分のペースで読み返せるように全問残す */}
        <div className="card p-5 space-y-3">
          <h3 className="font-bold text-sm">📋 出題のふりかえり（全{logs.length}問）</h3>
          <ul className="space-y-2">
            {logs.map((l, i) => {
              const ok = l.picked === l.q.answer;
              return (
                <li
                  key={i}
                  className={`rounded-xl border p-3 text-sm ${ok ? "border-green-500/50 bg-green-50" : "border-indigo/40 bg-indigo/5"}`}
                >
                  <div className="font-bold">
                    {ok ? "⭕" : "📖"}
                    {l.q.word ? `「${l.q.word}」= ` : ""}
                    {l.q.choices[l.q.answer]}
                  </div>
                  <div className="text-xs text-sub mt-1">{l.q.explain}</div>
                  {!ok && (
                    <div className="text-xs text-indigo mt-1">あなたの回答：{l.q.choices[l.picked]}</div>
                  )}
                  {l.q.also.length > 0 && (
                    <div className="text-[11px] text-sub mt-1">
                      ※ この語は辞典では{l.q.also.slice(0, 4).join("・")}
                      {l.q.also.length > 4 ? "ほか" : ""}にも収録があります
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-sub leading-relaxed">
            ※ 判定は方言ラボ辞典の語釈にもとづくものです。方言は地域・世代で差があり、
            あなたの言葉が誤りという意味ではありません。違いに気づいたら「みんなの辞書」からお知らせください。
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={start} className="btn-primary min-h-[44px]">
            もう一度
          </button>
          <Link href="/quiz" className="btn-secondary min-h-[44px] inline-flex items-center">
            ほかの方言の検定
          </Link>
        </div>
      </div>
    );
  }

  // ───────── 出題中 ─────────
  const progress = Math.round((index / questions.length) * 100);
  const isLast = index + 1 >= questions.length;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-sub">
          <span>{dialect}検定</span>
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
        <h2 className="text-lg font-bold break-words">{q.q}</h2>
        {q.verified && (
          <p className="text-[11px] text-sub">📚 出典照合済みの語です（DICT_AUDIT の照合リスト）</p>
        )}
        <div className="grid gap-2">
          {q.order.map((originalIdx) => {
            let cls = "border-line hover:border-primary hover:bg-primary/5";
            if (picked !== null) {
              if (originalIdx === q.answer) cls = "border-green-500 bg-green-50";
              else if (originalIdx === picked) cls = "border-indigo/60 bg-indigo/5";
              else cls = "border-line text-sub/60";
            }
            return (
              <button
                key={originalIdx}
                onClick={() => choose(originalIdx)}
                disabled={picked !== null}
                className={`border rounded-xl px-4 py-3.5 min-h-[48px] text-left bg-white transition-colors break-words ${cls}`}
              >
                {q.choices[originalIdx]}
                {picked !== null && originalIdx === picked && originalIdx !== q.answer && (
                  <span className="block text-[10px] text-indigo mt-0.5">あなたの回答</span>
                )}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="space-y-3">
            <div
              className={`text-sm rounded-xl p-3 anim-pop border ${
                picked === q.answer ? "border-green-500/50 bg-green-50" : "border-indigo/40 bg-indigo/5"
              }`}
            >
              <p className="font-bold">
                {picked === q.answer
                  ? "⭕ 辞典と一致！"
                  : `📖 辞典では${q.word ? `「${q.word}」を` : ""}「${q.choices[q.answer]}」として収録しています`}
              </p>
              <p className="mt-1">{q.explain}</p>
              {q.also.length > 0 && (
                <p className="text-[11px] text-sub mt-1.5">
                  ※ この語は辞典では{q.also.slice(0, 4).join("・")}
                  {q.also.length > 4 ? "ほか" : ""}にも収録があります。{dialect}だけの言葉とは限りません。
                </p>
              )}
            </div>
            <button onClick={next} className="btn-primary w-full min-h-[48px]">
              {isLast ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
