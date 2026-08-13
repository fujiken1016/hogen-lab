"use client";

import { track } from "@/lib/ga";
import { useCopy } from "@/lib/clipboard";
import { shareUrls } from "@/lib/types";

export default function ShareBar({ text, url }: { text: string; url: string }) {
  const { status, copy: runCopy } = useCopy();
  const links = shareUrls(text, url);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  // GA4: どの画面からどこへシェアされたか（method=x/line/copy/native）
  function trackShare(method: string) {
    track("share", { method, content_type: window.location.pathname });
  }

  async function copy() {
    trackShare("copy");
    // 失敗しても例外は投げない。結果は下のメッセージで必ずユーザーに見せる
    await runCopy(`${text}\n${url}`);
  }

  return (
    <div className="flex flex-col items-center gap-2">
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
        {status === "ok"
          ? "✓ コピーしました"
          : status === "fail"
            ? "⚠️ コピーできませんでした"
            : "🔗 リンクをコピー"}
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
    {/* コピーの結果は、読める長さだけ必ず表示する */}
    <p aria-live="polite" className="text-xs font-bold text-center min-h-[1.25rem]">
      {status === "ok" && <span className="text-indigo">リンクをコピーしました</span>}
      {status === "fail" && (
        <span className="text-indigo">
          コピーできませんでした。下のURLを長押し（右クリック）して手動でコピーしてください：
          <br />
          <span className="font-normal break-all select-all">{url}</span>
        </span>
      )}
    </p>
    </div>
  );
}
