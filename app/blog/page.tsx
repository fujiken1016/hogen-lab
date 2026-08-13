import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "読みもの一覧 | 方言ラボ",
  description:
    "全国の方言をもっと知るための読みもの。かわいい方言ランキング、標準語だと思ってた方言、三大方言の比較、方言が生まれる理由、「ありがとう」の語源めぐり、アクセントの日本地図、うちなーぐち入門まで。",
};

export default function BlogIndex() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <div className="text-5xl mb-3" aria-hidden>
          📖
        </div>
        <h1 className="font-display text-3xl font-bold tracking-wide">読みもの</h1>
        <p className="text-sm text-sub leading-relaxed mt-3">
          方言のランキング、言語学のはなし、診断の使い方まで。
          <br className="max-sm:hidden" />
          ことばの背景を知ると、診断の結果がもっと面白くなります。
        </p>
      </header>

      <div className="grid gap-3.5">
        {[...ARTICLES].reverse().map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="card p-4 sm:p-5 flex gap-4 hover:-translate-y-0.5 transition-transform"
          >
            <span className="text-4xl sm:text-5xl shrink-0 leading-none" aria-hidden>
              {a.emoji}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2 mb-1.5">
                <span className="chip bg-indigo/10 text-indigo">{a.category}</span>
                <span className="text-[11px] text-sub">約{a.readMin}分</span>
              </span>
              <span className="block font-bold text-[15px] leading-snug">{a.title}</span>
              <span className="block text-[13px] text-sub leading-[1.85] mt-1.5">{a.lead}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-9 rounded-2xl seigaiha border border-indigo/25 p-5 text-center">
        <p className="font-display text-lg font-bold mb-2">読んだあとは、診断で答え合わせ</p>
        <p className="text-[13px] text-sub leading-[1.9] mb-4">
          14問・約2分。全国のご当地キャラから、あなたの言葉に近い相棒が見つかります。
        </p>
        <Link href="/shindan" className="btn-primary">
          無料で方言診断をはじめる
        </Link>
      </div>
    </div>
  );
}
