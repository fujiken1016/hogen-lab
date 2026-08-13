"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * ナビ方針（2026-08 見直し）
 * ツールが9本になり、1行の横スクロールナビでは「見えていないタブがある」ことに気づけず、
 * スマホ（375px）で横スクロール前提になっていた。そこで:
 *  - 常設ナビは主要4本だけ（横スクロールなし・折り返しもなし）
 *  - 残りは「メニュー」パネルにグループ分けして全部載せる（到達性は落とさない）
 *  - タップ標的は最低44pxを確保する
 */

type Item = { href: string; label: string; emoji: string };

/** 遊ぶ（1画面で完結するツール） */
const TOOLS: Item[] = [
  { href: "/shindan", label: "方言タイプ診断", emoji: "🀄" },
  { href: "/quiz", label: "方言クイズ検定", emoji: "🏅" },
  { href: "/doko", label: "方言あて", emoji: "🗾" },
  { href: "/kawaii", label: "かわいい方言対決", emoji: "💗" },
  { href: "/aishou", label: "方言相性診断", emoji: "💞" },
  { href: "/kurabe", label: "全国方言くらべ", emoji: "🔍" },
  { href: "/translate", label: "方言に翻訳", emoji: "✍️" },
];

/** 調べる・読む */
const READS: Item[] = [
  { href: "/dict", label: "みんなの辞書", emoji: "📖" },
  { href: "/today", label: "今日の方言", emoji: "🗓" },
  { href: "/blog", label: "読みもの", emoji: "📰" },
];

/** 常設で出す主要導線（横スクロールを出さないため4本まで） */
const PRIMARY: Item[] = [
  { href: "/shindan", label: "診断", emoji: "🀄" },
  { href: "/quiz", label: "検定", emoji: "🏅" },
  { href: "/doko", label: "方言あて", emoji: "🗾" },
  { href: "/dict", label: "辞書", emoji: "📖" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ページ遷移したらパネルは必ず閉じる（開きっぱなしで中身がズレるのを防ぐ）
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escで閉じる
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const panelLink = (n: Item) => (
    <Link
      key={n.href}
      href={n.href}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-2 min-h-[48px] px-3 py-2 rounded-xl text-sm transition-colors ${
        isActive(n.href) ? "bg-white/20 text-gold font-bold" : "bg-white/5 hover:bg-white/15 active:bg-white/20"
      }`}
    >
      <span aria-hidden className="text-base leading-none">{n.emoji}</span>
      <span className="leading-tight">{n.label}</span>
    </Link>
  );

  return (
    <header className="bg-indigo-deep text-white sticky top-0 z-20 shadow-md border-b-2 border-gold/70">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="hanko group-hover:rotate-6 transition-transform">方</span>
          <span className="font-display text-lg sm:text-xl font-bold tracking-widest">
            方言<span className="text-gold">ラボ</span>
          </span>
        </Link>

        {/* 主要導線（sm以上のみ常設表示。横スクロールを作らない） */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {PRIMARY.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 min-h-[40px] flex items-center rounded-full transition-all ${
                isActive(n.href) ? "bg-white/15 text-gold font-bold" : "opacity-85 hover:opacity-100 hover:bg-white/10"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <Link
            href="/shindan"
            className="bg-primary hover:bg-primary-deep text-white text-[11px] sm:text-xs font-bold rounded-full px-3.5 sm:px-4 min-h-[44px] flex items-center shadow-sm active:scale-95 transition-transform"
          >
            無料診断
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="global-menu"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors"
          >
            <span aria-hidden className="text-base leading-none">{open ? "✕" : "☰"}</span>
            <span className="text-[11px] font-bold">メニュー</span>
          </button>
        </div>
      </div>

      {/* メニューパネル：全ツールをグループ分けして掲載（到達性を落とさない） */}
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-0 z-0 bg-black/30 cursor-default"
          />
          <div
            id="global-menu"
            className="relative z-10 border-t border-white/15 bg-indigo-deep max-h-[75vh] overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto px-4 py-3 space-y-3">
              <section>
                <h2 className="text-[11px] tracking-widest text-gold/90 font-bold px-1 pb-1.5">🎮 ツールで遊ぶ</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">{TOOLS.map(panelLink)}</div>
              </section>
              <section>
                <h2 className="text-[11px] tracking-widest text-gold/90 font-bold px-1 pb-1.5">📚 調べる・読む</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">{READS.map(panelLink)}</div>
              </section>
              <nav className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/70 pt-1 pb-1">
                <Link href="/" onClick={() => setOpen(false)} className="inline-flex items-center min-h-[40px] px-1 hover:text-gold">
                  ホーム
                </Link>
                <Link href="/about" onClick={() => setOpen(false)} className="inline-flex items-center min-h-[40px] px-1 hover:text-gold">
                  運営者情報
                </Link>
                <Link href="/contact" onClick={() => setOpen(false)} className="inline-flex items-center min-h-[40px] px-1 hover:text-gold">
                  お問い合わせ
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
