// 一般語（/translate の方言別ページに全語が意味・例文つきで出る）の出典照合の進捗と整合チェック。
//
// なぜ要るか: 検定280問（check_quiz_verified.mjs）と /doko プール（check_doko_pool.mjs）は
// 機械で守れるようになったが、一般語には進捗を数える手段が無く「前回どこまでやったか」が
// DICT_AUDIT.md の本文（2500行）を読まないと分からなかった。
//
// 見ているもの:
//  1. 台帳（data_src/verified_words.json）の各語が、その方言の見出し語として辞典に実在するか
//  2. /translate/[slug] の meta description に出る語（各方言の先頭6語）の照合率
//     ＝ 一般語のうち最も露出が高く、断定に近い形で外に出ている集合
//
// 使い方: node scripts/check_verified_words.mjs
import fs from "fs";

const root = new URL("../", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");

// gen_words_extra.mjs の norm() と同じ正規化（カナ→ひらがな畳み込みを含む）
const norm = (s) =>
  String(s)
    .replace(/[〜ー、。!?？！\s・（）()]/g, "")
    .replace(/^〜/, "")
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** 方言 → 見出し語の配列（wordsOf() と同じ並び：手書き WORDS のあとに words_extra） */
const words = {};
const push = (d, w) => {
  (words[d] ??= []).push(w);
};

const dataTs = read("lib/data.ts");
const wordsBlock = dataTs.slice(
  dataTs.indexOf("export const WORDS"),
  dataTs.indexOf("export const QUIZZES")
);
let dialect = null;
for (const line of wordsBlock.split("\n")) {
  const d = line.match(/^\s{2}"?([^\s":]+)"?:\s*\[/);
  if (d) { dialect = d[1]; words[dialect] ??= []; continue; }
  const w = line.match(/\{\s*word:\s*"([^"]+)"/);
  if (w && dialect) push(dialect, w[1]);
}

const extra = {};
dialect = null;
for (const line of read("lib/words_extra.ts").split("\n")) {
  const d = line.match(/^\s{2}"([^"]+)":\s*\[/);
  if (d) { dialect = d[1]; extra[dialect] ??= []; continue; }
  const w = line.match(/^\s*"word":\s*"([^"]+)"/);
  if (w && dialect) extra[dialect].push(w[1]);
}
for (const [d, ws] of Object.entries(extra)) push(d, ...ws);

const has = (d, w) => (words[d] ?? []).some((x) => norm(x) === norm(w));

// 照合済みの3台帳
const verified = new Set();
const add = (w, d) => verified.add(`${norm(w)}|${d}`);
for (const m of read("lib/doko_pool.ts").matchAll(/^\s*\{ word: "([^"]+)", dialect: "([^"]+)" \},/gm)) add(m[1], m[2]);
for (const m of read("lib/verified_quiz_words.ts").matchAll(/word: "([^"]+)", dialect: "([^"]+)"/g)) add(m[1], m[2]);

const ledger = JSON.parse(read("data_src/verified_words.json")).entries;
let bad = 0;
for (const e of ledger) {
  if (!has(e.dialect, e.word)) {
    console.log(`MISSING 辞典に無い: ${e.word}（${e.dialect}）— 台帳と辞典がずれている`);
    bad++;
    continue;
  }
  if (e.status !== "unconfirmed") add(e.word, e.dialect);
}

// /translate/[slug] の meta description に出る語＝各方言の先頭6語
const META_N = 6;
let total = 0;
let done = 0;
const rest = [];
for (const d of Object.keys(words)) {
  for (const w of (words[d] ?? []).slice(0, META_N)) {
    total++;
    if (verified.has(`${norm(w)}|${d}`)) done++;
    else rest.push(`${d} ${w}`);
  }
}

const unconfirmed = ledger.filter((e) => e.status === "unconfirmed").length;
console.log(
  `\n一般語の台帳 ${ledger.length}語（うち出典で肯定 ${ledger.length - unconfirmed}語・未確認 ${unconfirmed}語）`
);
console.log(
  `/translate の meta に出る語（各方言の先頭${META_N}語）: ${done}/${total} 照合済み — 残り ${rest.length}語`
);
if (rest.length) console.log(`  残り: ${rest.join("、")}`);
process.exit(bad > 0 ? 1 : 0);
