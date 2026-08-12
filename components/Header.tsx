"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/shindan", label: "方言診断" },
  { href: "/aishou", label: "相性" },
  { href: "/translate", label: "翻訳" },
  { href: "/quiz", label: "クイズ検定" },
  { href: "/today", label: "今日の方言" },
  { href: "/dict", label: "みんなの辞書" },
  { href: "/blog", label: "読みもの" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-indigo-deep text-white sticky top-0 z-10 shadow-md border-b-2 border-gold/70">
      <div className="max-w-5xl mx-auto px-4 pt-2.5 sm:py-3 sm:flex sm:items-center sm:gap-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="hanko group-hover:rotate-6 transition-transform">方</span>
            <span className="font-display text-xl font-bold tracking-widest">
              方言<span className="text-gold">ラボ</span>
            </span>
          </Link>
          <Link
            href="/shindan"
            className="sm:hidden bg-primary text-white text-[11px] font-bold rounded-full px-3.5 py-1.5 shadow-sm active:scale-95 transition-transform"
          >
            無料診断
          </Link>
        </div>
        {/* モバイルは1行の横スクロールナビ（折り返しで縦を食わない） */}
        <nav className="flex gap-x-0.5 sm:gap-x-1 text-xs sm:text-sm overflow-x-auto no-scrollbar whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0 py-2 sm:py-0">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  active
                    ? "bg-white/15 text-gold font-bold"
                    : "opacity-85 hover:opacity-100 hover:bg-white/10 active:bg-white/15"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/shindan"
          className="ml-auto bg-primary hover:bg-primary-deep text-white text-xs font-bold rounded-full px-4 py-2 transition-colors shadow-sm max-sm:hidden shrink-0"
        >
          無料で診断する
        </Link>
      </div>
    </header>
  );
}
