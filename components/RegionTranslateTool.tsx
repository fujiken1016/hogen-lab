"use client";

// 地方まとめの変換ツール（/translate/tohoku・/translate/kyushu）。J671（2026-11-24 新設）。
// 1回の入力で、その地方の全方言に同時に変換して並べる。変換そのものは既存の convert()（辞典の語だけを置き換える）。
// 外部APIは呼ばない。何を置き換えたかを方言ごとに必ず見せる（TranslateTool と同じ流儀）。
// 既存の TranslateTool には触っていない（個別ページの挙動を変えないため）。

import Link from "next/link";
import { useState } from "react";
import { STANDARD } from "@/lib/data";
import { track } from "@/lib/ga";
import { convert, type ConvertResult } from "@/lib/translate_dict";

type Dia = { name: string; short: string; slug: string };
type Mode = "to" | "from";
type Row = { dia: Dia; res: ConvertResult };

export default function RegionTranslateTool({
  region,
  label,
  dialects,
  samples,
}: {
  region: string;
  label: string;
  dialects: Dia[];
  samples: string[];
}) {
  const [mode, setMode] = useState<Mode>("to");
  const [fromDia, setFromDia] = useState(dialects[0].name);
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  // 変換のたびにカードを描き直して「1拍」見せる
  const [runId, setRunId] = useState(0);
  const [shown, setShown] = useState<{ mode: Mode; from: string }>({ mode: "to", from: STANDARD });

  function changeMode(m: Mode) {
    if (m === mode) return;
    setMode(m);
    setRows(null);
  }

  function run() {
    if (!text.trim()) return;
    let out: Row[];
    if (mode === "to") {
      out = dialects.map((dia) => ({ dia, res: convert(text, STANDARD, dia.name) }));
    } else {
      const dia = dialects.find((x) => x.name === fromDia) ?? dialects[0];
      out = [{ dia, res: convert(text, dia.name, STANDARD) }];
    }
    setRows(out);
    setShown({ mode, from: mode === "to" ? STANDARD : fromDia });
    setRunId((n) => n + 1);
    track("translate_region_run", {
      region,
      mode,
      hits: out.reduce((s, r) => s + r.res.hits.length, 0),
    });
  }

  const totalHits = rows ? rows.reduce((s, r) => s + r.res.hits.length, 0) : 0;
  const btnOn = "bg-primary/10 border-primary/60 text-primary-text";

  return (
    <div className="space-y-4">
      <div className="card p-5 space-y-4">
        <div role="group" aria-label="変換の向き" className="grid grid-cols-1 gap-2">
          <button
            type="button"
            aria-pressed={mode === "to"}
            onClick={() => changeMode("to")}
            className={`btn-secondary min-h-[48px] text-sm font-bold ${mode === "to" ? btnOn : ""}`}
          >
            標準語 → {label}
          </button>
          <button
            type="button"
            aria-pressed={mode === "from"}
            onClick={() => changeMode("from")}
            className={`btn-secondary min-h-[48px] text-sm font-bold ${mode === "from" ? btnOn : ""}`}
          >
            {label} → 標準語
          </button>
        </div>

        {mode === "from" ? (
          <div className="space-y-1.5">
            <label htmlFor="region-from" className="text-sm font-bold block">
              どの方言の文ですか
            </label>
            <select
              id="region-from"
              value={fromDia}
              onChange={(e) => setFromDia(e.target.value)}
              className="select-base w-full min-h-[48px]"
            >
              {dialects.map((x) => (
                <option key={x.name} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-sm text-sub leading-relaxed">
            標準語の文を1つ入れると、{dialects.length}方言の言い方を<b>同時に</b>並べて出します。
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="region-text" className="text-sm font-bold block">
            {mode === "to" ? "標準語の文（500文字まで）" : `${fromDia}の文（500文字まで）`}
          </label>
          <textarea
            id="region-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === "to" ? "例：今日はとても寒いね。こっちにおいで" : `${fromDia}の文を入力`}
            rows={4}
            maxLength={500}
            className="input-base resize-none"
          />
        </div>

        {mode === "to" && samples.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-sm text-sub">タップすると入力欄に入ります。</p>
            <div className="flex flex-wrap gap-2">
              {samples.map((s) => (
                <button key={s} type="button" onClick={() => setText(s)} className="btn-secondary text-sm min-h-[48px]">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="button" onClick={run} disabled={!text.trim()} className="btn-primary w-full min-h-[48px]">
          {mode === "to" ? `${dialects.length}方言にまとめて変換する` : "標準語に変換する"}
        </button>
      </div>

      {rows && (
        <div key={runId} className="space-y-3 anim-pop" aria-live="polite">
          <p className="text-sm text-sub text-center">
            {shown.mode === "to"
              ? `${rows.length}方言に変換しました（置き換えた語は合計${totalHits}語）`
              : `${shown.from} → 標準語（置き換えた語は${totalHits}語）`}
          </p>
          {rows.map(({ dia, res }) => (
            <div key={dia.name} className="card p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip bg-indigo/10 text-indigo">{shown.mode === "to" ? dia.name : "標準語"}</span>
                <span className="text-sm text-sub">
                  {res.hits.length > 0 ? `${res.hits.length}語を置き換えました` : "置き換えなし"}
                </span>
              </div>
              <div className="text-lg font-bold break-words leading-relaxed">
                {res.segments.map((s, i) =>
                  s.hit ? (
                    <mark key={i} className="bg-gold/40 text-ink rounded px-0.5">
                      {s.text}
                    </mark>
                  ) : (
                    <span key={i}>{s.text}</span>
                  ),
                )}
              </div>
              {res.hits.length > 0 ? (
                <ul className="space-y-1">
                  {res.hits.map((h, i) => (
                    <li key={`${h.source}-${i}`} className="text-sm text-sub break-words leading-relaxed">
                      {h.source} → <b className="text-primary-text">{h.target}</b>（{h.meaning}）
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-sub leading-relaxed">
                  この文には、{dia.name}の辞典に収録されている語が含まれていませんでした。そのままの形で返しています。
                </p>
              )}
              <Link
                href={`/translate/${dia.slug}`}
                className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text underline underline-offset-2"
              >
                {dia.name}の変換ページ（言葉の一覧つき）へ
              </Link>
            </div>
          ))}
          <p className="text-sm text-sub leading-relaxed bg-paper border border-line rounded-xl p-3">
            ※ 辞典に収録されている語だけを置き換えています。語尾や活用は変換していないため、実際の話し方とは異なる場合があります。
            「これが正しい{label}」というものではなく、方言ラボの辞典に載っている言い方の提示です。
          </p>
        </div>
      )}
    </div>
  );
}
