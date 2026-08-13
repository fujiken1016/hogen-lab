// GA4 カスタムイベント送信の薄いラッパー。
// gtag が未ロード（広告ブロッカー・SSR・開発中）でも例外を出さずに黙って捨てる。
// 測定ID自体は app/layout.tsx で設定している（毎日ラボ共通ストリーム）。

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* 計測失敗でUIを壊さない */
  }
}
