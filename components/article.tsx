import Link from "next/link";
import type { ReactNode } from "react";
import { ARTICLES, otherArticles, type Article } from "@/lib/articles";

/** 楽天アフィリエイトID（2026-08-12 取得・全記事共通） */
const RAKUTEN_ID = "5684fd12.0952a564.5684fd13.520271a6";

export function rakutenLink(targetUrl: string): string {
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_ID}/?pc=${encodeURIComponent(
    targetUrl
  )}&link_type=hybrid_url`;
}

/** 楽天市場の検索URL（キーワードから組み立て） */
export function rakutenSearch(keyword: string): string {
  return rakutenLink(`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`);
}

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

/** 楽天アフィリエイト枠（PR表記つき） */
export function PrBox({
  title,
  keyword,
  body,
  linkLabel = "楽天市場で探す",
}: {
  title: string;
  keyword: string;
  body: string;
  linkLabel?: string;
}) {
  return (
    <aside className="my-7 rounded-2xl border-2 border-dashed border-gold/60 bg-gold/[0.07] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="chip bg-gold/80 text-white text-[10px] tracking-widest">PR</span>
        <span className="text-[11px] text-sub">広告（アフィリエイトリンク）を含みます</span>
      </div>
      <p className="font-bold text-[15px] mb-1.5">{title}</p>
      <p className="text-[13.5px] leading-[1.9] text-ink/85 mb-3.5">{body}</p>
      <a
        href={rakutenSearch(keyword)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="btn-secondary !border-gold/70 text-sm"
      >
        {linkLabel} <span aria-hidden>↗</span>
      </a>
    </aside>
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

      <footer className="mt-12 pt-7 border-t border-line">
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
