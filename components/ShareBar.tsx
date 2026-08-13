"use client";

import { useState } from "react";
import { track } from "@/lib/ga";
import { shareUrls } from "@/lib/types";

export default function ShareBar({ text, url }: { text: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const links = shareUrls(text, url);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  // GA4: どの画面からどこへシェアされたか（method=x/line/copy/native）
  function trackShare(method: string) {
    track("share", { method, content_type: window.location.pathname });
  }

  async function copy() {
    trackShare("copy");
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard未対応環境では無視 */
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <a
        href={links.x}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare("x")}
        className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-bold rounded-full px-4 py-2 hover:opacity-80 transition-opacity"
      >
        𝕏 ポスト
      </a>
      <a
        href={links.line}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare("line")}
        className="inline-flex items-center gap-1.5 bg-[#06C755] text-white text-sm font-bold rounded-full px-4 py-2 hover:opacity-80 transition-opacity"
      >
        LINEで送る
      </a>
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 bg-white border border-line text-sm font-bold rounded-full px-4 py-2 hover:border-indigo transition-colors"
      >
        {copied ? "✓ コピーしました" : "🔗 リンクをコピー"}
      </button>
      {canNativeShare && (
        <button
          onClick={() => {
            trackShare("native");
            navigator.share({ text, url }).catch(() => {});
          }}
          className="inline-flex items-center gap-1.5 bg-white border border-line text-sm font-bold rounded-full px-4 py-2 hover:border-indigo transition-colors"
        >
          📤 その他
        </button>
      )}
    </div>
  );
}
