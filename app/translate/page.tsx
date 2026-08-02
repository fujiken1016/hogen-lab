"use client";

import { useState } from "react";
import { DIALECTS, speak, unlockBadge } from "@/lib/data";

type Result = { translation: string; reading: string; note: string };

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("標準語");
  const [to, setTo] = useState("大阪弁");
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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="section-title">🗣️ 方言翻訳</h1>
        <p className="text-sub text-sm">全国{DIALECTS.length - 1}方言に対応。方言同士の翻訳もできます</p>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="select-base flex-1">
            {DIALECTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <button onClick={swap} className="btn-secondary px-3" title="入れ替え">
            ⇄
          </button>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="select-base flex-1">
            {DIALECTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`${from}の文を入力（500文字まで）`}
          rows={4}
          maxLength={500}
          className="input-base resize-none"
        />

        <button onClick={translate} disabled={loading || !text.trim() || from === to} className="btn-primary w-full">
          {loading ? "翻訳中…" : `${to}に翻訳する`}
        </button>
        {from === to && <p className="text-sm text-sub">翻訳元と翻訳先が同じです</p>}
      </div>

      {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      {result && (
        <div className="card p-5 space-y-3">
          <div className="chip bg-indigo/10 text-indigo">{to}</div>
          <div className="text-xl font-bold">{result.translation}</div>
          <div className="text-sm text-sub">{result.reading}</div>
          <div className="text-sm bg-paper border border-line rounded-xl p-3">💡 {result.note}</div>
          <button onClick={() => speak(result.translation)} className="btn-secondary text-sm">
            🔊 読み上げる
          </button>
        </div>
      )}
    </div>
  );
}
