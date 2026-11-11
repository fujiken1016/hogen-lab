// 記事冒頭の目次（<h2 id> へのページ内リンク）。見出し一覧は呼び出し側が渡す。
export function ArticleToc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="目次" className="my-5 rounded-xl border border-line px-4 py-3">
      <div className="text-sm font-bold mb-1">目次</div>
      <ol className="list-decimal pl-5 text-base leading-[1.7]">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="inline-flex min-h-[48px] items-center text-primary-text underline underline-offset-2">
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
