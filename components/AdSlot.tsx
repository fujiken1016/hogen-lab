"use client";

import { useEffect } from "react";

/**
 * AdSense 手動ユニット枠（設計正本: memory/adsense_placement_plan.md）
 *
 * 🔒 安全設計: NEXT_PUBLIC_ADSENSE_CLIENT が未設定のあいだは **null を返し、
 * DOMに何も出力しない**。審査通過前にデプロイされても広告ユニットは一切設置されない。
 * 通過後にやること（Phase 0）:
 *   1. .env に NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-8289616283786904 を設定
 *   2. AdSense管理画面でユニット ART_END（レスポンシブ）を作成し、slot番号を
 *      NEXT_PUBLIC_ADSENSE_SLOT_ART_END に設定
 *   3. ビルド→デプロイ→375px検証（scrollWidth===375 / CLS<0.1 / FVに広告なし）
 *
 * 配置ルール（プラン§7）: 記事ページのみ・上下40px・min-heightでCLS対策・
 * ラベルは「スポンサーリンク」固定。アプリ画面には置かない。
 */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOTS: Record<string, string | undefined> = {
  ART_END: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ART_END,
  ART_MID: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ART_MID,
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ name }: { name: "ART_END" | "ART_MID" }) {
  const slot = SLOTS[name];
  const enabled = Boolean(CLIENT && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告ブロッカー等。何もしない
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="ad-slot">
      <span className="ad-label">スポンサーリンク</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
