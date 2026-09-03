import { SITE, jpDate, pageDates } from "@/lib/page_dates";

/**
 * ページの「公開日／最終更新日」を、可視の <time> と JSON-LD の両方で出す。
 *
 * 可視テキストと構造化データを **同じ1つの値** から作るので、両者が食い違わない
 * （解答速報のFAQで採った「可視テキストとJSON-LDを完全同期」と同じ流儀）。
 * 日付は git の履歴由来（lib/page_dates.json ← scripts/gen_page_dates.mjs）。
 *
 * @param route   "/about" のようなパス
 * @param type    schema.org の型。既定は WebPage
 * @param name    JSON-LD の name（省略時は出さない）
 * @param jsonLdOnly  可視表示は別の場所で出しているページ（記事など）で true
 */
export function PageDates({
  route,
  type = "WebPage",
  name,
  description,
  jsonLdOnly = false,
}: {
  route: string;
  type?: string;
  name?: string;
  description?: string;
  jsonLdOnly?: boolean;
}) {
  const d = pageDates(route);
  if (!d) return null;

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    url: SITE + (route === "/" ? "/" : route),
    inLanguage: "ja",
    datePublished: d.published,
    dateModified: d.modified,
  };
  if (name) ld.name = name;
  if (description) ld.description = description;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
      {!jsonLdOnly && (
        <p className="text-[11px] text-sub text-center mt-8 mb-1 leading-relaxed">
          公開：<time dateTime={d.published}>{jpDate(d.published)}</time>
          {d.modified !== d.published && (
            <>
              {"　"}最終更新：<time dateTime={d.modified}>{jpDate(d.modified)}</time>
            </>
          )}
        </p>
      )}
    </>
  );
}
