import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import type { ReactNode } from "react";
import { ARTICLES, otherArticles, type Article } from "@/lib/articles";

/** 楽天アフィリエイトID（2026-08-12 取得・全記事共通） */
const RAKUTEN_ID = "5684fd12.0952a564.5684fd13.520271a6";

export function rakutenLink(targetUrl: string): string {
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=${encodeURIComponent(
    targetUrl
  )}&link_type=hybrid_url`;
}

/**
 * 紹介する書籍1点。url は楽天ブックスの商品ページ直リンク（item.rakuten.co.jp/book/…）。
 * 検索結果ページへのリンクは CVR が低いので新規に作らない（affiliate_links.md の方針）。
 */
export type PrBook = { name: string; meta?: string; url: string };

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="section-head mt-10 mb-4 scroll-mt-20">
      <span className="hanko-sq">方</span>
      <span className="ttl">{children}</span>
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-7 mb-2.5 text-base font-bold flex items-center gap-2">
      <span className="w-1.5 h-5 rounded-full bg-primary/70 shrink-0" />
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.95] mb-4">{children}</p>;
}

/** 引用・補足のかこみ */
export function Note({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="my-5 rounded-xl border border-indigo/25 bg-indigo/[0.05] px-4 py-3.5">
      {title && <div className="text-xs font-bold text-indigo mb-1.5 tracking-wide">{title}</div>}
      <div className="text-[13.5px] leading-[1.9] text-ink/85">{children}</div>
    </div>
  );
}

/** 方言の語をひとつ紹介するカード */
export function WordCard({
  word,
  reading,
  dialect,
  meaning,
  example,
  children,
}: {
  word: string;
  reading?: string;
  dialect: string;
  meaning: string;
  example: string;
  children?: ReactNode;
}) {
  return (
    <div className="card p-4 sm:p-5 my-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-bold text-primary-deep">{word}</span>
        {reading && <span className="text-xs text-sub">{reading}</span>}
        <span className="chip bg-indigo/10 text-indigo ml-auto">{dialect}</span>
      </div>
      <p className="text-sm font-bold mt-2">{meaning}</p>
      <p className="text-[13.5px] text-sub mt-2 bg-paper/70 rounded-lg px-3 py-2 border border-line">
        「{example}」
      </p>
      {children && <div className="text-[13.5px] leading-[1.9] mt-3">{children}</div>}
    </div>
  );
}

/** ランキング記事の1位分 */
export function RankItem({
  rank,
  dialect,
  phrase,
  meaning,
  example,
  children,
}: {
  rank: number;
  dialect: string;
  phrase: string;
  meaning: string;
  example: string;
  children: ReactNode;
}) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return (
    <div className="card p-4 sm:p-5 my-4 relative overflow-hidden">
      <div
        className="absolute -right-3 -top-4 font-display font-black text-[76px] leading-none text-primary/[0.07] select-none"
        aria-hidden
      >
        {rank}
      </div>
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-primary text-white">
            {medal ? `${medal} ` : ""}第{rank}位
          </span>
          <span className="font-bold">{dialect}</span>
        </div>
        <p className="font-display text-2xl font-bold text-primary-deep mt-2.5">{phrase}</p>
        <p className="text-sm font-bold text-sub mt-1">{meaning}</p>
        <p className="text-[13.5px] mt-2.5 bg-paper/70 rounded-lg px-3 py-2 border border-line">
          「{example}」
        </p>
        <div className="text-[13.5px] leading-[1.9] mt-3">{children}</div>
      </div>
    </div>
  );
}

/**
 * 楽天アフィリエイト枠（PR表記つき）。
 * 掲載できるのは「記事の内容に直接つながる書籍」だけ。1記事あたり最大2点まで（AFF_SLOTS.md）。
 */
export function PrBox({
  title,
  body,
  books,
  slot,
}: {
  title: string;
  body: string;
  /** 紹介する書籍（楽天ブックスの商品ページ直リンク）。最大2点 */
  books: PrBook[];
  /** アフィリ差し替え用スロット名（AFF_SLOTS.md 参照） */
  slot?: string;
}) {
  return (
    <aside
      data-aff={slot}
      className="my-7 rounded-2xl border-2 border-dashed border-gold/60 bg-gold/[0.07] p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="chip bg-gold/80 text-white text-[10px] tracking-widest">PR</span>
        <span className="text-[11px] text-sub">広告（アフィリエイトリンク）を含みます</span>
      </div>
      <p className="font-bold text-[15px] mb-1.5">{title}</p>
      <p className="text-[13.5px] leading-[1.9] text-ink/85 mb-3.5">{body}</p>
      <ul className="space-y-2.5">
        {books.map((b) => (
          <li key={b.url}>
            <a
              href={rakutenLink(b.url)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex min-h-[48px] items-center gap-2.5 rounded-xl border border-gold/70 bg-white/70 px-3.5 py-2.5 hover:bg-white"
            >
              <span className="min-w-0 break-words">
                <span className="block text-[13.5px] font-bold leading-[1.6]">{b.name}</span>
                {b.meta && (
                  <span className="mt-0.5 block text-[11.5px] leading-[1.5] text-sub">
                    {b.meta}
                  </span>
                )}
              </span>
              <span aria-hidden className="ml-auto shrink-0 text-gold">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[11px] leading-[1.7] text-sub">
        リンク先は楽天ブックスの商品ページです。価格・在庫は変わることがあります。
      </p>
    </aside>
  );
}

/** 参考文献・出典の一覧（記事末に置く） */
export function Sources({ items }: { items: { label: string; url?: string }[] }) {
  return (
    <section className="mt-10 rounded-xl border border-line bg-paper/60 px-4 py-4">
      <h2 className="text-xs font-bold tracking-wide text-sub mb-2.5">参考・出典</h2>
      <ul className="space-y-1.5 text-[12px] leading-[1.85] text-sub">
        {items.map((s) => (
          <li key={s.label} className="flex gap-2">
            <span aria-hidden className="text-sub/60">
              ・
            </span>
            <span className="min-w-0 break-words">
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {s.label}
                </a>
              ) : (
                s.label
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-sub/70 mt-3 leading-[1.8]">
        方言は同じ県内でも地域・世代によって差があります。掲載内容と異なる言い方をご存じの場合は
        <Link href="/contact" className="text-primary hover:underline">
          お問い合わせ
        </Link>
        からお知らせください。
      </p>
    </section>
  );
}

/** 診断への誘導 */
export function ShindanCta({
  title = "あなたの言葉は、何弁？",
  body = "14問・約2分で、全国35体のご当地キャラからあなたの相棒が決まります。結果は4桁コードで友達と相性チェックもできます。",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="my-8 rounded-2xl seigaiha border border-indigo/25 p-5 sm:p-6 text-center">
      <p className="font-display text-xl font-bold mb-2">{title}</p>
      <p className="text-[13.5px] text-sub leading-[1.9] mb-4 max-w-md mx-auto">{body}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/shindan" className="btn-primary">
          無料で方言診断をはじめる
        </Link>
        <Link href="/aishou" className="btn-secondary text-sm">
          相性チェッカーを試す
        </Link>
      </div>
    </div>
  );
}

/** 記事の外枠（ヘッダー・本文・関連記事） */
export function ArticleShell({ article, children }: { article: Article; children: ReactNode }) {
  const related = otherArticles(article.slug, 3);
  const jpDate = article.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1年$2月$3日");

  return (
    <article className="max-w-2xl mx-auto">
      <nav className="text-[11px] text-sub mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-primary">
          方言ラボ
        </Link>
        <span aria-hidden>›</span>
        <Link href="/blog" className="hover:text-primary">
          読みもの
        </Link>
        <span aria-hidden>›</span>
        <span className="text-ink/70">{article.category}</span>
      </nav>

      <header className="mb-7">
        <p className="text-[11px] text-sub mb-3">※本ページはプロモーションが含まれています</p>
        <div className="text-5xl mb-3" aria-hidden>
          {article.emoji}
        </div>
        <h1 className="font-display text-[26px] sm:text-3xl font-bold leading-[1.5] tracking-wide">
          {article.title}
        </h1>
        <p className="text-[14px] text-sub leading-[1.9] mt-3.5">{article.lead}</p>
        <div className="flex items-center gap-3 text-[11px] text-sub mt-4 pt-4 border-t border-line">
          <span className="chip bg-indigo/10 text-indigo">{article.category}</span>
          <span>{jpDate}</span>
          <span>読了 約{article.readMin}分</span>
        </div>
      </header>

      <div>{children}</div>

      {/* AdSense ART_END（本文末・関連リンク群の手前40px）。CLIENT未設定時はnull＝審査中は何も出ない */}
      <AdSlot name="ART_END" />

      <footer className="mt-12 pt-7 border-t border-line">
        {/* 記事を読み終えた人が、そのまま1分で遊べるツールへ行けるようにする */}
        <div className="section-head mb-4">
          <span className="hanko-sq">遊</span>
          <span className="ttl">
            1分で遊べる方言ツール
            <span className="sub">PLAY IN A MINUTE</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-9">
          {[
            { href: "/doko", emoji: "🗾", title: "この方言どこ？", desc: "全8問の方言あて" },
            { href: "/kawaii", emoji: "💗", title: "かわいい方言対決", desc: "8語のトーナメント" },
            { href: "/kurabe", emoji: "🔤", title: "全国方言くらべ", desc: "同じ一言の35通り" },
            { href: "/shindan", emoji: "🔮", title: "方言タイプ診断", desc: "14問であなたの相棒" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="card p-3.5 min-h-[64px] flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-2xl shrink-0" aria-hidden>
                {t.emoji}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold leading-snug">{t.title}</span>
                <span className="block text-[11px] text-sub mt-0.5">{t.desc}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="section-head mb-4">
          <span className="hanko-sq">続</span>
          <span className="ttl">
            ほかの読みもの
            <span className="sub">MORE ARTICLES</span>
          </span>
        </div>
        <div className="grid gap-2.5">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="card p-3.5 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-2xl shrink-0" aria-hidden>
                {a.emoji}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-bold leading-snug">{a.title}</span>
                <span className="block text-[11px] text-sub mt-1">
                  {a.category}・約{a.readMin}分
                </span>
              </span>
            </Link>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link href="/blog" className="btn-ghost text-sm">
            読みもの一覧へ →
          </Link>
        </p>
      </footer>
    </article>
  );
}

export { ARTICLES };
