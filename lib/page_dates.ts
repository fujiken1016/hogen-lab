// ページごとの公開日・最終更新日。
// **正本は git の履歴**で、`scripts/gen_page_dates.mjs` が build 前に page_dates.json を
// 生成する（package.json の prebuild）。ここを手で書き換えないこと——次のビルドで消える。
//
// 目的＝「更新しているのに、更新していることが外から見えない」状態の解消。
// JSON-LD の datePublished/dateModified と、画面に出る <time> の両方をこの1つの値から作り、
// 表記と構造化データが食い違わないようにしている。

import RAW from "./page_dates.json";

export type PageDate = { published: string; modified: string };

const DATES = RAW as Record<string, PageDate>;

export const SITE = "https://hogen.mainichi-lab.com";

/** 正規化したルート（末尾スラッシュなし・先頭スラッシュあり） */
function norm(route: string): string {
  if (!route.startsWith("/")) route = "/" + route;
  if (route.length > 1 && route.endsWith("/")) route = route.slice(0, -1);
  return route;
}

export function pageDates(route: string): PageDate | undefined {
  return DATES[norm(route)];
}

/** 2026-09-03 → 2026年9月3日 */
export function jpDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[1])}年${Number(m[2])}月${Number(m[3])}日`;
}
