// 記事用の小さな部品（K78・2026-11-28）：表（375px で縦に積む）と、大きい数字の並び。
// どちらも <figure> で包む＝article_audit の「図・画像」「視覚要素」に数えられる。共通テンプレ・共通CSSは変更しない（Tailwind のクラスだけ）。

export function ArticleTable({
  caption,
  heads,
  rows,
}: {
  caption: string;
  heads: string[];
  rows: string[][];
}) {
  return (
    <figure className="overflow-x-auto my-5">
      <figcaption className="text-sm text-sub leading-relaxed pb-2">{caption}</figcaption>
      <table aria-label={caption} className="w-full text-sm border-collapse max-md:block">
        <thead className="max-md:sr-only">
          <tr className="border-b border-line text-left align-bottom">
            {heads.map((h) => (
              <th key={h} scope="col" className="py-2 pr-3 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-md:block">
          {rows.map((r) => (
            <tr key={r.join("|")} className="border-b border-line align-top max-md:block max-md:py-2">
              {r.map((c, i) => (
                <td
                  key={heads[i]}
                  data-l={heads[i]}
                  className={
                    i === 0
                      ? "py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:font-bold"
                      : "py-2 pr-3 max-md:block max-md:pr-0 max-md:py-0.5 max-md:before:block max-md:before:text-[13px] max-md:before:text-sub max-md:before:content-[attr(data-l)]"
                  }
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** 大きい数字を2〜4個並べる。n は数字、unit は単位、label は何の数字か（1行で）。 */
export function BigNums({
  items,
  caption,
}: {
  items: { n: string; unit: string; label: string }[];
  caption: string;
}) {
  return (
    <figure className="my-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl border border-line px-3 py-3 text-center">
            <div className="font-display font-bold leading-none text-primary-deep">
              <span className="text-[44px]">{it.n}</span>
              <span className="text-base ml-0.5">{it.unit}</span>
            </div>
            <div className="text-sm text-sub leading-snug mt-2">{it.label}</div>
          </div>
        ))}
      </div>
      <figcaption className="text-sm text-sub leading-relaxed mt-1.5">{caption}</figcaption>
    </figure>
  );
}

/** 方言の文を1つずつ囲って見せる（例文の一覧。箇条書きより読みやすい） */
export function SentenceList({
  caption,
  items,
}: {
  caption: string;
  items: { s: string; note: string }[];
}) {
  return (
    <figure className="my-5">
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.s} className="rounded-xl border border-line bg-paper/60 px-3.5 py-2.5">
            <div className="text-base font-bold leading-snug">「{it.s}」</div>
            <div className="text-sm text-sub leading-relaxed mt-1">{it.note}</div>
          </li>
        ))}
      </ul>
      <figcaption className="text-sm text-sub leading-relaxed mt-1.5">{caption}</figcaption>
    </figure>
  );
}
