"use client";

import { track } from "@/lib/ga";
import { useCopy } from "@/lib/clipboard";
import { shareUrls } from "@/lib/types";

/**
 * シェア導線。
 *
 * block を渡すと Wordle型（ネタバレなしの短いテキスト＋絵文字）でシェアする。
 * - コピー／X／LINE すべて block を本文に使う（貼られたときに同じ形で伝わるようにする）
 * - block は「答え」を含めない。含めるのは「結果の形」と「どのツールか」だけ
 * - block を渡さない場合は従来どおり text を使う（既存の呼び出しを壊さない）
 */
export default function ShareBar({ text, url, block }: { text: string; url: string; block?: string }) {
  const { status, copy: runCopy } = useCopy();
  const body = block ?? text;
  const links = shareUrls(body, url);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  // GA4: どの画面からどこへシェアされたか（method=x/line/copy/native）
  // share_style で Wordle型かどうかも見る（イベント名・既存パラメータは変えない）
  function trackShare(method: string) {
    track("share", {
      method,
      content_type: window.location.pathname,
      share_style: block ? "wordle" : "plain",
    });
  }

  async function copy() {
    trackShare("copy");
    // 失敗しても例外は投げない。結果は下のメッセージで必ずユーザーに見せる
    await runCopy(`${body}\n${url}`);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {block && (
        // 何がコピーされるかを先に見せる。答えは入っていないことが目で分かるようにする
        <div className="w-full max-w-sm bg-paper border border-line rounded-xl px-3 py-2.5 text-left">
          <p className="text-sm text-sub font-bold mb-1">📋 コピーされる文（答えは入りません）</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{block}</p>
          <p className="text-sm text-sub break-all mt-0.5">{url}</p>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("x")}
          className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-bold rounded-full px-4 py-2 min-h-[48px] hover:opacity-80 transition-opacity"
        >
          𝕏 ポスト
        </a>
        <a
          href={links.line}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("line")}
          className="inline-flex items-center gap-1.5 bg-[#06C755] text-[#053a1c] text-sm font-bold rounded-full px-4 py-2 min-h-[48px] hover:opacity-80 transition-opacity"
        >
          LINEで送る
        </a>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 bg-white border border-line text-sm font-bold rounded-full px-4 py-2 min-h-[48px] hover:border-indigo transition-colors"
        >
          {status === "ok"
            ? "✓ コピーしました"
            : status === "fail"
              ? "⚠️ コピーできませんでした"
              : block
                ? "📋 結果をコピー"
                : "🔗 リンクをコピー"}
        </button>
        {canNativeShare && (
          <button
            onClick={() => {
              trackShare("native");
              navigator.share({ text: body, url }).catch(() => {});
            }}
            className="inline-flex items-center gap-1.5 bg-white border border-line text-sm font-bold rounded-full px-4 py-2 min-h-[48px] hover:border-indigo transition-colors"
          >
            📤 その他
          </button>
        )}
      </div>
      {/* コピーの結果は、読める長さだけ必ず表示する */}
      <p aria-live="polite" className="text-sm font-bold text-center min-h-[1.25rem]">
        {status === "ok" && (
          <span className="text-indigo">{block ? "結果をコピーしました" : "リンクをコピーしました"}</span>
        )}
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
