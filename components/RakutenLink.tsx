"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/ga";

/**
 * 記事内の楽天アフィリエイトリンク（PrBox から使う）。
 *
 * なぜ存在するか：楽天アフィリエイトは**サイト別の計測IDが1本も登録されていない**ため
 * （AFF_SLOTS.md §楽天アフィリエイトID）、楽天のレポートでは方言ラボ単独のクリック数が取れない。
 * せめて「サイト側で何クリック出たか」だけでも自前で測れるように GA4 イベントを付ける。
 *
 * ⚠️ ここで測れるのは**クリックまで**。楽天側の成果（CV・報酬）とは接続できない。
 *    接続には site_pointback_id の登録が必要で、それはフジケン本人の操作（AFF_SLOTS.md 参照）。
 */
export default function RakutenLink({
  href,
  slot,
  book,
  className,
  children,
}: {
  href: string;
  /** AFF_SLOTS.md のスロット名 */
  slot?: string;
  /** 書名（どの本が押されたかを分ける） */
  book: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={() =>
        track("rakuten_click", {
          aff_slot: slot ?? "",
          book,
          // どの記事から押されたか。SSR時は空になるのでクリック時に読む
          page_path: typeof window !== "undefined" ? window.location.pathname : "",
        })
      }
    >
      {children}
    </a>
  );
}
