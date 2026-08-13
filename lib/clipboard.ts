"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * クリップボード操作の共通ユーティリティ。
 *
 * navigator.clipboard は「存在しない」（非セキュアコンテキスト・古いブラウザ）と
 * 「存在するが権限拒否で reject する」（NotAllowedError）の2通りで失敗する。
 * どちらも未catchだと Uncaught (in promise) になり、ユーザーには何も起きないように見える。
 * ここで両方を吸収し、成否を boolean で返す（例外は投げない）。
 */

export type CopyStatus = "idle" | "ok" | "fail";

/** UX原則: フィードバックは「見えた気がするだけ」で消さない。認識できる長さ出す。 */
export const COPY_OK_MS = 3500;
/** 失敗時は手動コピーを促す文言を読ませる必要があるので、さらに長く出す。 */
export const COPY_FAIL_MS = 7000;

/** テキストをクリップボードへコピー。例外は投げず、成功可否を返す。 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 権限拒否・非セキュアコンテキスト等 → 下の旧APIフォールバックへ */
  }
  return legacyCopy(text);
}

/** document.execCommand("copy") による旧来のフォールバック。 */
function legacyCopy(text: string): boolean {
  if (typeof document === "undefined" || !document.body) return false;
  let ta: HTMLTextAreaElement | null = null;
  try {
    ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    // 画面を動かさずに選択するため、視覚的に見えない位置へ固定
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.padding = "0";
    ta.style.border = "none";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    if (ta && ta.parentNode) ta.parentNode.removeChild(ta);
  }
}

/**
 * コピー実行＋表示ステータスを扱うフック。
 * setTimeout はハンドルを保持し、再コピー・アンマウント・reset() で必ずクリアする
 * （遅延コールバックが後から別の文脈の表示を書き換えないようにする）。
 */
export function useCopy() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  /** 表示状態を初期化（再診断などで画面をリセットする時に呼ぶ）。 */
  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  const copy = useCallback(
    async (text: string) => {
      clearTimer();
      setStatus("idle");
      const ok = await copyText(text);
      if (!alive.current) return ok;
      setStatus(ok ? "ok" : "fail");
      timer.current = setTimeout(
        () => {
          timer.current = null;
          if (alive.current) setStatus("idle");
        },
        ok ? COPY_OK_MS : COPY_FAIL_MS,
      );
      return ok;
    },
    [clearTimer],
  );

  return { status, copy, reset };
}
