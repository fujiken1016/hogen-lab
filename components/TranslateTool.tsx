"use client";

// 方言変換の実行部。
// - dialect を渡すと「標準語 ⇄ その方言」に固定（/translate/[slug] 用）
// - 渡さないと全方言から選べる従来のUI（/translate 用）
// どちらも同じ /api/translate を使う。挙動・エラー文言は既存のまま。

import { useState } from "react";
import ShareBar from "@/components/ShareBar";
import { DIALECTS, speak, unlockBadge } from "@/lib/data";
import { track } from "@/lib/ga";
import { shareBlock } from "@/lib/share_text";

type Result = { translation: string; reading: string; note: string };

const BASE = "https://hogen.mainichi-lab.com";

export default function TranslateTool({ dialect, slug }: { dialect?: string; slug?: string }) {
  const [text, setText] = useState("");
  const [from, setFrom] = useState(dialect ? "標準語" : "標準語");
  const [to, setTo] = useState(dialect ?? "大阪弁");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function translate() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "翻訳に失敗しました");
      } else {
        setResult(data);
        unlockBadge("translate_first");
        track("translate_done", { from, to, fixed_dialect: dialect ?? "" });
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setFrom(to);
    setTo(from);
    if (result) setText(result.translation);
    setResult(null);
  }

  const url = dialect && slug ? `${BASE}/translate/${slug}` : `${BASE}/translate`;
  // 変換結果はユーザー自身の文＝伏せる意味がないので、そのまま短く貼れる形にする
  const shareBlockText = result
    ? shareBlock([
        `${from} → ${to} に変換してみた`,
        `🗣️「${result.translation.slice(0, 60)}${result.translation.length > 60 ? "…" : ""}」`,
        `あなたの言葉も${to}にできます #方言ラボ #${to}変換`,
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

        <button
          onClick={translate}
          disabled={loading || !text.trim() || from === to}
          className="btn-primary w-full min-h-[48px]"
        >
          {loading ? "変換中…" : `${to}に変換する`}
        </button>
        {from === to && <p className="text-sm text-sub">変換元と変換先が同じです</p>}
      </div>

      {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      {result && (
        <div className="card p-5 space-y-3">
          <div className="chip bg-indigo/10 text-indigo">{to}</div>
          <div className="text-xl font-bold break-words">{result.translation}</div>
          <div className="text-sm text-sub break-words">{result.reading}</div>
          <div className="text-sm bg-paper border border-line rounded-xl p-3">💡 {result.note}</div>
          <button onClick={() => speak(result.translation)} className="btn-secondary text-sm min-h-[44px]">
            🔊 読み上げる
          </button>
          <ShareBar text={shareBlockText ?? ""} url={url} block={shareBlockText} />
          <p className="text-[11px] text-sub leading-relaxed">
            ※ 変換結果はAIによる生成です。方言には地域差・世代差があり、
            ここに出る言い方が唯一の正解というわけではありません。
          </p>
        </div>
      )}
    </div>
  );
}
