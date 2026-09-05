// 見出し語と例文の食い違いを機械で洗う。
//
// なぜ要るか（第24回・第25回で実証）:
//   出雲弁「ごしなさい」は例文が「ごしなはい」、金沢弁「たいばら」は例文が「だいばら」だった。
//   どちらも見出し語のほうが誤りで、26回の目視監査では誰も気づかなかった。
//   「その語が自分の例文に出てこない」項目を機械で並べれば、この型は最初の数十行で見つかる。
//
// 判定: 例文に見出し語の語幹（末尾を最大2字まで削ったもの／2字語は1字まで）が現れるか。
//   活用（たく→たっきょる、ほる→ほって）や連濁は落としきれないので、これは**ゲートではなく
//   候補リスト**。exit code は常に 0。人が上から順に見て、真の食い違いだけを直す。
//
// 使い方: node --experimental-strip-types scripts/check_word_example.mjs
import fs from "fs";

const root = new URL("../", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");

// 見出し語・例文の比較用。カナ→ひらがな、記号除去に加えて、
// 連濁（が→か 等）と促音・長音を畳んで比べる。
const kana = (s) =>
  String(s)
    .replace(/[〜～ー、。!?？！\s・（）()「」]/g, "")
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const DEVOICE = {
  が: "か", ぎ: "き", ぐ: "く", げ: "け", ご: "こ",
  ざ: "さ", じ: "し", ず: "す", ぜ: "せ", ぞ: "そ",
  だ: "た", ぢ: "ち", づ: "つ", で: "て", ど: "と",
  ば: "は", び: "ひ", ぶ: "ふ", べ: "へ", ぼ: "ほ",
  ぱ: "は", ぴ: "ひ", ぷ: "ふ", ぺ: "へ", ぽ: "ほ",
};
const norm = (s) =>
  kana(s)
    .replace(/っ/g, "")
    .replace(/[ぁ-ゖ]/g, (c) => DEVOICE[c] ?? c);

/** data.ts（手書き）と words_extra.ts（生成）から {方言, 語, 語釈, 例文} を集める */
const entries = [];
const dataTs = read("lib/data.ts");
const block = dataTs.slice(
  dataTs.indexOf("export const WORDS"),
  dataTs.indexOf("export const QUIZZES")
);
let dialect = null;
for (const line of block.split("\n")) {
  const d = line.match(/^\s{2}"?([^\s":]+)"?:\s*\[/);
  if (d) { dialect = d[1]; continue; }
  const m = line.match(
    /\{\s*word:\s*"([^"]+)",\s*meaning:\s*"([^"]+)",\s*example:\s*"([^"]+)"/
  );
  if (m && dialect) entries.push({ src: "data.ts", dialect, word: m[1], meaning: m[2], example: m[3] });
}
dialect = null;
let cur = {};
for (const line of read("lib/words_extra.ts").split("\n")) {
  const d = line.match(/^\s{2}"([^"]+)":\s*\[/);
  if (d) { dialect = d[1]; continue; }
  const w = line.match(/^\s*"word":\s*"([^"]+)"/);
  if (w) { cur = { src: "words_extra.ts", dialect, word: w[1] }; continue; }
  const mn = line.match(/^\s*"meaning":\s*"([^"]+)"/);
  if (mn) { cur.meaning = mn[1]; continue; }
  const ex = line.match(/^\s*"example":\s*"([^"]+)"/);
  if (ex && cur.word) { cur.example = ex[1]; entries.push(cur); cur = {}; }
}

const flagged = [];
for (const e of entries) {
  const w = norm(e.word);
  const x = norm(e.example);
  if (!w || !x) continue;
  const maxCut = w.length <= 2 ? 1 : 2;
  let hit = false;
  for (let cut = 0; cut <= maxCut && !hit; cut++) {
    const stem = w.slice(0, w.length - cut);
    if (stem.length >= 1 && x.includes(stem)) hit = true;
  }
  if (!hit) flagged.push(e);
}

console.log(
  `全 ${entries.length}語のうち ${flagged.length}語で「例文に見出し語の語幹が出てこない」`
);
console.log("※活用形の取りこぼしを含む候補リスト。上から見て真の食い違いだけ直すこと。\n");
for (const e of flagged) {
  console.log(`${e.dialect}\t${e.word}（${e.meaning}）\t例文: ${e.example}\t[${e.src}]`);
}
