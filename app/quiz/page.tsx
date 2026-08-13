"use client";

import { useState } from "react";
import Confetti from "@/components/Confetti";
import ShareBar from "@/components/ShareBar";
import TypeAvatar from "@/components/TypeAvatar";
import { QUIZZES, QuizQ, shuffle, unlockBadge } from "@/lib/data";
import { track } from "@/lib/ga";
import { typeByDialect } from "@/lib/types";

type ShuffledQ = QuizQ & { order: number[] };

export default function QuizPage() {
  const [dialect, setDialect] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ShuffledQ[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];

  function start(d: string) {
    track("quiz_start", { dialect: d });
    // 選択肢の並びを毎回シャッフル（クリック時に実行するのでSSRとの不一致なし）
    setQuestions(QUIZZES[d].map((qq) => ({ ...qq, order: shuffle(qq.choices.map((_, i) => i)) })));
    setDialect(d);
    setIndex(0);
    setSelected(null);
    setCorrect(0);
    setDone(false);
  }

  function choose(originalIdx: number) {
    if (selected !== null) return;
    setSelected(originalIdx);
    if (originalIdx === q.answer) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      const score = correct / questions.length;
      if (score >= 0.8 && dialect) unlockBadge(`quiz_${dialect}`);
      track("quiz_complete", {
        dialect: dialect ?? "unknown",
        score: Math.round(score * 100),
        passed: score >= 0.8,
      });
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (!dialect) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="section-title">🏅 方言クイズ検定</h1>
          <p className="text-sub text-sm">8問中80%以上正解で検定合格バッジを獲得！</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.keys(QUIZZES).map((d, i) => {
            const t = typeByDialect(d);
            return (
              <button
                key={d}
                onClick={() => start(d)}
                className="card p-4 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all anim-wiggle-hover anim-fade-up flex items-center gap-3"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.6)}s` }}
              >
                {t && <TypeAvatar type={t} size={52} />}
                <div>
                  <div className="font-bold">{d} 検定</div>
                  <div className="text-xs text-sub mt-0.5">全8問・合格でバッジ</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (done) {
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 80;
    const shareText = `【方言ラボ】${dialect}検定 ${passed ? "合格🎉" : "挑戦"}！ スコア${score}点（${correct}/${questions.length}問正解）あなたも挑戦してみて！ #方言ラボ`;
    const url = typeof window !== "undefined" ? `${window.location.origin}/quiz` : "";
    return (
      <div className="max-w-2xl mx-auto card p-8 text-center space-y-5 anim-fade-up">
        {passed && <Confetti />}
        <div className={`text-5xl ${passed ? "anim-pop" : ""}`}>{passed ? "🎉" : "📚"}</div>
        <h2 className="text-2xl font-bold">{passed ? `${dialect}検定 合格！` : "もう少し！"}</h2>
        <p className="text-lg">
          {correct}/{questions.length}問正解（{score}点）
        </p>
        {passed && (
          <p className="text-amber-800 bg-gold/15 border border-gold/40 rounded-xl p-3 text-sm">
            🏅 「{dialect} 検定合格」バッジを獲得しました
          </p>
        )}
        <ShareBar text={shareText} url={url} />
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={() => start(dialect)} className="btn-secondary">
            もう一度
          </button>
          <button onClick={() => setDialect(null)} className="btn-secondary">
            検定を選ぶ
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round((index / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-sub">
          <span>{dialect}検定</span>
          <span>
            Q{index + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-primary bar-shimmer rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold">{q.q}</h2>
        <div className="grid gap-2">
          {q.order.map((originalIdx) => {
            let cls = "border-line hover:border-primary hover:bg-primary/5";
            if (selected !== null) {
              if (originalIdx === q.answer) cls = "border-green-500 bg-green-50";
              else if (originalIdx === selected) cls = "border-red-400 bg-red-50";
              else cls = "border-line text-sub/60";
            }
            return (
              <button
                key={originalIdx}
                onClick={() => choose(originalIdx)}
                className={`border rounded-xl px-4 py-3.5 text-left bg-white transition-colors ${cls}`}
              >
                {q.choices[originalIdx]}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="space-y-3">
            <p className="text-sm bg-paper border border-line rounded-xl p-3 anim-pop">
              {selected === q.answer ? "⭕ 正解！" : "❌ 不正解…"} {q.explain}
            </p>
            <button onClick={next} className="btn-primary w-full">
              {index + 1 >= questions.length ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
