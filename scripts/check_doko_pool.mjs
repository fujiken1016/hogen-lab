// /doko の出題プール（lib/doko_pool.ts）が「正解が一意」条件を守れているかの機械チェック。
//
// なぜ要るか: 2026-09-02 の「でぼちん」、2026-09-03 の「いけず」「いずい」など、
// **本辞典自身が複数方言に収録している語がプールに残っていた**取りこぼしが繰り返し見つかった。
// 表記ゆれ統一で語が統合されると「1方言だけ」という前提が後から崩れるので、目視では追えない。
//
// 使い方: node scripts/check_doko_pool.mjs
//   MULTI が1件でも出たら、その語は出典を確認したうえでプールから外す（辞典からは消さない）。
import fs from "fs";

const root = new URL("../", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");

// gen_words_extra.mjs の norm() と同じ正規化（カナ→ひらがな畳み込みを含む）
const norm = (s) =>
  String(s)
    .replace(/[〜ー、。!?？！\s・（）()]/g, "")
    .replace(/^〜/, "")
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** 辞典全体の 語 → 収録方言の一覧 */
const index = new Map();
const add = (dialect, word) => {
  const k = norm(word);
  if (!index.has(k)) index.set(k, new Set());
  index.get(k).add(dialect);
};

const dataTs = read("lib/data.ts");
const wordsBlock = dataTs.slice(
  dataTs.indexOf("export const WORDS"),
  dataTs.indexOf("export const QUIZZES")
);
let dialect = null;
for (const line of wordsBlock.split("\n")) {
  const d = line.match(/^\s{2}"?([^\s":]+)"?:\s*\[/);
  if (d) { dialect = d[1]; continue; }
  const w = line.match(/\{\s*word:\s*"([^"]+)"/);
  if (w && dialect) add(dialect, w[1]);
}

dialect = null;
for (const line of read("lib/words_extra.ts").split("\n")) {
  const d = line.match(/^\s{2}"([^"]+)":\s*\[/);
  if (d) { dialect = d[1]; continue; }
  const w = line.match(/^\s*"word":\s*"([^"]+)"/);
  if (w && dialect) add(dialect, w[1]);
}

const seeds = [
  ...read("lib/doko_pool.ts").matchAll(/^\s*\{ word: "([^"]+)", dialect: "([^"]+)" \},/gm),
].map((m) => ({ word: m[1], dialect: m[2] }));

let multi = 0;
let missing = 0;
for (const seed of seeds) {
  const found = index.get(norm(seed.word));
  if (!found) {
    console.log(`MISSING 辞典に無い: ${seed.word}（${seed.dialect}）`);
    missing++;
  } else if (found.size > 1) {
    console.log(`MULTI   ${seed.word}［${seed.dialect}］→ 辞典の収録: ${[...found].join("、")}`);
    multi++;
  } else if (!found.has(seed.dialect)) {
    console.log(`MISMATCH ${seed.word}［${seed.dialect}］→ 辞典の収録: ${[...found].join("、")}`);
    missing++;
  }
}

console.log(`\nプール ${seeds.length}語 / 辞典 ${index.size}語 → MULTI ${multi}件・要修正 ${missing}件`);
process.exit(multi + missing > 0 ? 1 : 0);
