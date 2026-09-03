// 各ページの「公開日 / 最終更新日」を **git のコミット履歴から** 生成して
// lib/page_dates.json に書き出す。build の前に必ず走る（package.json の prebuild）。
//
// なぜ必要か
//   AdSense の要件①は「十分な独自コンテンツ＋定期更新」。2026-09-03 の実測では
//   hogen 105面は JSON-LD の datePublished も dateModified も <time> も **全て0件** だった。
//   毎日のように更新しているのに、それが機械可読な形で外に出ていない状態だった。
//
// 捏造しないための決めごと
//   - 日付は必ず git 由来。手で書かない。
//   - 「更新」とみなすのは、そのページ固有のソース（ルートのファイル or そのページの
//     データ）が変わったコミットだけ。**共有レイアウトや日付表示の追加そのものは数えない**
//     （数えると、日付を入れた日に全105面が同じ日付になって不自然になる）。
//   - 動的ルート（/translate/[slug]・/quiz/[slug]）は、その方言名が実際に出てくる
//     コミットを `git log -G` で拾う。方言ごとに違う日付になるのはそのため。
//
// 出力: lib/page_dates.json  { "/blog/xxx": { "published": "2026-08-12", "modified": "2026-08-28" }, ... }

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function git(args) {
  try {
    return execFileSync("git", ["-C", ROOT, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return "";
  }
}

const TODAY = new Date().toISOString().slice(0, 10);

/** そのパス群を最後に変更したコミットの日付 */
function lastDate(paths) {
  const out = git(["log", "-1", "--format=%cs", "--", ...paths]).trim();
  return out || null;
}

/** そのパス群が最初に追加されたコミットの日付 */
function firstDate(paths) {
  const out = git(["log", "--diff-filter=A", "--format=%cs", "--", ...paths]).trim();
  if (!out) return null;
  const lines = out.split("\n").filter(Boolean);
  return lines[lines.length - 1];
}

/** needle を含む行を触ったコミットのうち、最後 / 最初の日付（方言別ページ用） */
function lastDateMatching(needle, paths) {
  const out = git(["log", "-1", "--format=%cs", `-G${needle}`, "--", ...paths]).trim();
  return out || null;
}
function firstDateMatching(needle, paths) {
  const out = git(["log", "--format=%cs", `-G${needle}`, "--", ...paths]).trim();
  if (!out) return null;
  const lines = out.split("\n").filter(Boolean);
  return lines[lines.length - 1];
}

const max = (a, b) => (!a ? b : !b ? a : a > b ? a : b);
const min = (a, b) => (!a ? b : !b ? a : a < b ? a : b);

// ---------------------------------------------------------------------------
// ルート定義
// ---------------------------------------------------------------------------
const STATIC_ROUTES = {
  "/": ["app/page.tsx", "app/HomeClient.tsx"],
  "/shindan": ["app/shindan"],
  "/blog": ["app/blog/page.tsx"],
  "/aishou": ["app/aishou"],
  "/translate": ["app/translate/page.tsx"],
  "/quiz": ["app/quiz/page.tsx"],
  "/doko": ["app/doko", "lib/doko_pool.ts"],
  "/kawaii": ["app/kawaii"],
  "/kurabe": ["app/kurabe"],
  "/today": ["app/today"],
  "/dict": ["app/dict"],
  "/about": ["app/about"],
  "/privacy": ["app/privacy"],
  "/disclaimer": ["app/disclaimer"],
  "/contact": ["app/contact"],
};

// 方言データの正本。/translate/[slug]・/quiz/[slug] はここの「その方言の行」が
// 動いた日を更新日として使う。
const DIALECT_DATA = [
  "lib/data.ts",
  "lib/words_extra.ts",
  "lib/doko_pool.ts",
  "lib/verified_quiz_words.ts",
  "lib/translate_dict.ts",
];

// ---------------------------------------------------------------------------
async function main() {
  const dates = {};

  for (const [route, paths] of Object.entries(STATIC_ROUTES)) {
    const present = paths.filter((p) => existsSync(path.join(ROOT, p)));
    if (!present.length) continue;
    const published = firstDate(present) || TODAY;
    const modified = max(lastDate(present) || published, published);
    dates[route] = { published, modified };
  }

  // 読みもの（公開日は lib/articles.ts の date が正。更新日は記事ファイルの履歴）
  const articlesSrc = readFileSync(path.join(ROOT, "lib/articles.ts"), "utf8");
  const arts = [...articlesSrc.matchAll(/slug:\s*"([^"]+)"[\s\S]*?date:\s*"(\d{4}-\d{2}-\d{2})"/g)];
  for (const [, slug, date] of arts) {
    const file = `app/blog/${slug}/page.tsx`;
    if (!existsSync(path.join(ROOT, file))) continue;
    const modified = max(lastDate([file]) || date, date);
    dates[`/blog/${slug}`] = { published: date, modified };
  }

  // 方言別ページ。lib/*_meta.ts をそのまま読めないので、ビルド済みの一覧を
  // TYPES（lib/types.ts）の slug ↔ dialect 対応から作る。
  const typesSrc = readFileSync(path.join(ROOT, "lib/types.ts"), "utf8");
  // 書き順が `slug → dialect` の要素と `dialect → slug` の要素が混在しているので両方拾う
  const bySlug = new Map();
  for (const [, dialect, slug] of typesSrc.matchAll(
    /dialect:\s*"([^"]+)"[\s\S]{0,400}?slug:\s*"([a-z0-9-]+)"/g
  )) {
    if (!bySlug.has(slug)) bySlug.set(slug, dialect);
  }
  for (const [, slug, dialect] of typesSrc.matchAll(
    /slug:\s*"([a-z0-9-]+)"[\s\S]{0,400}?dialect:\s*"([^"]+)"/g
  )) {
    if (!bySlug.has(slug)) bySlug.set(slug, dialect);
  }

  const groups = [
    { prefix: "/translate", tpl: "app/translate/[slug]" },
    { prefix: "/quiz", tpl: "app/quiz/[slug]" },
  ];
  const tplFirst = {};
  for (const g of groups) tplFirst[g.prefix] = firstDate([g.tpl]) || TODAY;

  for (const g of groups) {
    for (const [slug, dialect] of bySlug) {
      // その方言の行が動いた日。無ければテンプレート作成日にフォールバック。
      const dLast = lastDateMatching(dialect, DIALECT_DATA);
      const dFirst = firstDateMatching(dialect, DIALECT_DATA);
      const published = max(tplFirst[g.prefix], dFirst || tplFirst[g.prefix]);
      const modified = max(dLast || published, published);
      dates[`${g.prefix}/${slug}`] = { published, modified };
    }
  }

  const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
  const out = path.join(ROOT, "lib/page_dates.json");
  const next = JSON.stringify(sorted, null, 1) + "\n";
  const prev = existsSync(out) ? readFileSync(out, "utf8") : "";
  if (prev !== next) writeFileSync(out, next);
  console.log(
    `page_dates: ${Object.keys(sorted).length} routes${prev === next ? "（変化なし）" : "（更新）"}`
  );
}

main();
