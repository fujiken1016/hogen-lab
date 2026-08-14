"use client";

// 方言変換の実行部。
// - dialect を渡すと「標準語 ⇄ その方言」に固定（/translate/[slug] 用）
// - 渡さないと全方言から選べる従来のUI（/translate 用）
//
// 変換は端末内で完結する辞典ベース（lib/translate_dict.ts）。外部APIは呼ばない。
// 置き換えたのは辞典に載っている語だけ。語尾・活用はそのまま残し、何を置き換えたかを必ず見せる。

import { useState } from "react";
import ShareBar from "@/components/ShareBar";
import { DIALECTS, STANDARD, speak, unlockBadge } from "@/lib/data";
import { track } from "@/lib/ga";
import { shareBlock } from "@/lib/share_text";
import { convert, type ConvertResult } from "@/lib/translate_dict";

const BASE = "https://hogen.mainichi-lab.com";

export default function TranslateTool({ dialect, slug }: { dialect?: string; slug?: string }) {
  const [text, setText] = useState("");
  const [from, setFrom] = useState(STANDARD);
  const [to, setTo] = useState(dialect ?? "大阪弁");
  const [result, setResult] = useState<ConvertResult | null>(null);
  // 変換のたびにカードを描き直して「1拍」見せる（同じ結果でも押したことが分かるように）
  const [runId, setRunId] = useState(0);
  const [shownPair, setShownPair] = useState({ from: STANDARD, to: dialect ?? "大阪弁" });

  function run() {
    if (!text.trim() || from === to) return;
    const r = convert(text, from, to);
    setResult(r);
    setShownPair({ from, to });
    setRunId((n) => n + 1);
    if (r.hits.length > 0) unlockBadge("translate_first");
    track("translate_run", {
      from,
      to,
      dialect: dialect ?? (to === STANDARD ? from : to),
      hits: r.hits.length,
      fixed_dialect: dialect ?? "",
    });
  }

  function swap() {
    setFrom(to);
    setTo(from);
    if (result) setText(result.output);
    setResult(null);
  }

  const url = dialect && slug ? `${BASE}/translate/${slug}` : `${BASE}/translate`;
  // 変換結果はユーザー自身の文＝伏せる意味がないので、そのまま短く貼れる形にする
  const shareBlockText =
    result && result.hits.length > 0
      ? shareBlock([
          `${shownPair.from} → ${shownPair.to} に変換してみた`,
          `🗣️「${result.output.slice(0, 60)}${result.output.length > 60 ? "…" : ""}」`,
          `辞典に載っている語を置き換えるツールです #方言ラボ #${shownPair.to}変換`,
        ])
      : undefined;

  return (
    <div className="space-y-4">
      <div className="card p-5 space-y-4">
        {dialect ? (
          // 方言固定モード: 方向だけ切り替える（ページのテーマを外さない）
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-line rounded-xl px-3 py-2.5 text-center font-bold text-sm bg-paper min-h-[44px] flex items-center justify-center">
              {from}
            </div>
            <button onClick={swap} className="btn-secondary px-3 min-h-[44px]" title="向きを入れ替える">
              ⇄
            </button>
            <div className="flex-1 border border-primary/40 rounded-xl px-3 py-2.5 text-center font-bold text-sm bg-primary/5 text-primary min-h-[44px] flex items-center justify-center">
              {to}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="select-base flex-1 min-h-[44px]">
              {DIALECTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <button onClick={swap} className="btn-secondary px-3 min-h-[44px]" title="入れ替え">
              ⇄
            </button>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="select-base flex-1 min-h-[44px]">
              {DIALECTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`${from}の文を入力（500文字まで）`}
          rows={4}
          maxLength={500}
          className="input-base resize-none"
        />

        <button onClick={run} disabled={!text.trim() || from === to} className="btn-primary w-full min-h-[48px]">
          {to}に変換する
        </button>
        {from === to && <p className="text-sm text-sub">変換元と変換先が同じです</p>}
      </div>

      {result && result.hits.length > 0 && (
        <div key={runId} className="card p-5 space-y-3 anim-pop">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="chip bg-indigo/10 text-indigo">{shownPair.to}</div>
            <span className="text-xs text-sub">{result.hits.length}語を置き換えました</span>
          </div>

          <div className="text-xl font-bold break-words leading-relaxed">
            {result.segments.map((s, i) =>
              s.hit ? (
                <mark key={i} className="bg-gold/40 text-ink rounded px-0.5">
                  {s.text}
                </mark>
              ) : (
                <span key={i}>{s.text}</span>
              ),
            )}
          </div>

          <p className="text-[11px] text-sub leading-relaxed bg-paper border border-line rounded-xl p-3">
            ※ 辞典に収録されている語だけを置き換えています。語尾や活用は変換していないため、
            実際の話し方とは異なる場合があります。「これが正しい{shownPair.to}」というものではなく、
            方言ラボの辞典に載っている言い方の提示です。
          </p>

          <div className="space-y-2">
            <h3 className="text-sm font-bold">置き換えた語（{result.hits.length}）</h3>
            <ul className="space-y-2">
              {result.hits.map((h, i) => (
                <li key={`${h.source}-${i}`} className="bg-paper border border-line rounded-xl px-3 py-2 text-sm">
                  <div className="break-words">
                    <span className="text-sub">{h.source}</span>
                    <span className="text-sub mx-1.5">→</span>
                    <b className="text-primary">{h.target}</b>
                  </div>
                  <div className="text-xs text-sub break-words mt-0.5">
                    意味：{h.meaning}
                    {h.alts.length > 0 && <>／別の言い方：{h.alts.join("・")}</>}
                  </div>
                  {h.example && <div className="text-xs text-sub break-words mt-0.5">用例：{h.example}</div>}
                  <div className="text-[10px] text-sub mt-0.5">
                    出典：方言ラボの{h.origin}データ（{shownPair.to}）
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => speak(result.output)} className="btn-secondary text-sm min-h-[44px]">
            🔊 読み上げる
          </button>
          <ShareBar text={shareBlockText ?? ""} url={url} block={shareBlockText} />
        </div>
      )}

      {result && result.hits.length === 0 && (
        <div key={runId} className="card p-5 space-y-3 anim-pop">
          <div className="chip bg-gold/20 text-ink">置き換えなし</div>
          <p className="text-sm font-bold leading-relaxed">
            この文には、{shownPair.to}の辞典に収録されている語が含まれていませんでした。
          </p>
          <p className="text-xs text-sub leading-relaxed">
            方言ラボの変換は、辞典に載っている語だけを置き換えるしくみです（AIが文を作り直すことはしません）。
            収録語が入っていない文は、そのままの形で返します。
          </p>
          {result.suggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold">{shownPair.to}で置き換えられる語の例</h3>
              <p className="text-xs text-sub">タップすると入力欄に足せます。</p>
              <div className="flex flex-wrap gap-2">
                {result.suggestions.map((s) => (
                  <button
                    key={s.input}
                    onClick={() => setText((t) => (t ? `${t}${s.input}` : s.input))}
                    className="btn-secondary text-sm min-h-[44px]"
                  >
                    {s.input} → {s.output}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
