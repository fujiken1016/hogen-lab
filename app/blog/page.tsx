import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import DialectIndex from "@/components/DialectIndex";
import { PageDates } from "@/components/PageDates";
import { eyeFor } from "@/lib/eye";

const TITLE = "方言の読みもの一覧｜ランキング・地域差・言語学のはなし | 方言ラボ";
const DESC =
  "全国の方言をもっと知るための読みもの。かわいい方言ランキング、標準語だと思ってた方言、三大方言の比較、東西の境界線、敬語の地域差、否定形と人称の地域差、発音のちがい、アイヌ語地名、九州方言の区画まで、出典つきで解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog" },
  ...ogMeta({ title: TITLE, description: DESC, path: "/blog" }),
};

export default function BlogIndex() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <img
          src="/eye/column-1280.webp"
          srcSet="/eye/column-640.webp 640w, /eye/column-1280.webp 1280w"
          sizes="(min-width: 672px) 672px, 100vw"
          width={1280}
          height={720}
          alt="山のふもとの町並みのイラスト"
          fetchPriority="high"
          decoding="async"
          className="block w-full h-auto aspect-video object-cover rounded-2xl mb-5"
        />
        <h1 className="font-display text-3xl font-bold tracking-wide">読みもの</h1>
        <p className="text-sm text-sub leading-relaxed mt-3">
          方言のランキング、言語学のはなし、診断の使い方まで。
          <br className="max-sm:hidden" />
          ことばの背景を知ると、診断の結果がもっと面白くなります。
        </p>
        <p className="text-sm text-sub mt-2">※画像はイメージ（AI生成のイラスト）です</p>
      </header>

      <div className="grid gap-3.5">
        {[...ARTICLES].reverse().map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="card overflow-hidden flex flex-col sm:flex-row hover:-translate-y-0.5 transition-transform"
          >
            <img
              src={eyeFor(a.slug).small}
              width={640}
              height={360}
              alt=""
              loading="lazy"
              decoding="async"
              className="block w-full sm:w-44 h-auto aspect-video sm:aspect-auto sm:self-stretch object-cover shrink-0"
            />
            <span className="min-w-0 p-4 sm:p-5">
              <span className="flex items-center gap-2 mb-1.5">
                <span className="chip bg-indigo/10 text-indigo">{a.category}</span>
                <span className="text-sm text-sub">約{a.readMin}分</span>
              </span>
              <span className="block font-bold text-base leading-snug">{a.title}</span>
              <span className="block text-sm text-sub leading-[1.85] mt-1.5">{a.lead}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* 全国35方言の索引。/blog はクロール済みの面なので、ここから未クロールの
          /translate/<地域>・/quiz/<地域> へ直リンクを通す（2026-09-03） */}
      <div className="mt-10">
        <DialectIndex heading="読んだ方言を、実際に試す" sub="ALL DIALECTS" mark="試" />
      </div>

      <div className="mt-9 rounded-2xl seigaiha border border-indigo/25 p-5 text-center">
        <p className="font-display text-lg font-bold mb-2">読んだあとは、診断で答え合わせ</p>
        <p className="text-sm text-sub leading-[1.9] mb-4">
          10問・約2分。全国のご当地キャラから、あなたの言葉に近い相棒が見つかります。
        </p>
        <Link href="/shindan" className="btn-primary">
          無料で方言診断をはじめる
        </Link>
      </div>
      <PageDates route="/blog" type="CollectionPage" name="方言の読みもの一覧 | 方言ラボ" />
    </div>
  );
}
