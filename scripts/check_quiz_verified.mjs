// 検定（/quiz/[slug]）の出題語が「出典照合済み」かの機械チェック。
//
// なぜ要るか: DICT_AUDIT.md は「検定出題語の照合率 280/280」を看板の数字にしているが、
// これまで人が数えていた。/doko のプールから語を外すと検定側の照合済み判定も一緒に落ちる
// （lib/quiz_meta.ts の isVerified が DOKO_SEEDS ∪ VERIFIED_QUIZ_WORDS の和集合なので）。
// 外した語を VERIFIED_QUIZ_WORDS に移し忘れると、気づかないまま照合率が下がる。
//
// 使い方: node scripts/check_quiz_verified.mjs
//   未照合の設問が出たら、その語を出典で照合して VERIFIED_QUIZ_WORDS に足すか、
//   出典が取れないなら設問そのものを差し替える。
import fs from "fs";

const root = new URL("../", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");

// lib/quiz_meta.ts の wordOfQuestion() と同じ: 設問文「「◯◯」の意味は？」から見出し語を取る
const wordOfQuestion = (q) => {
  const m = q.match(/「([^」]+)」/);
  if (!m) return null;
  return m[1].replace(/^[〜～]/, "").trim() || null;
};

// ── QUIZZES（lib/data.ts）: 方言 → 設問8問
const dataTs = read("lib/data.ts");
const quizBlock = dataTs.slice(dataTs.indexOf("export const QUIZZES"));
const quizzes = new Map();
let dialect = null;
for (const line of quizBlock.split("\n")) {
  const d = line.match(/^\s{2}"?([^\s":]+)"?:\s*\[/);
  if (d) {
    dialect = d[1];
    quizzes.set(dialect, []);
    continue;
  }
  if (/^\};/.test(line)) break;
  const q = line.match(/\{\s*q:\s*"([^"]+)"/);
  if (q && dialect) quizzes.get(dialect).push(q[1]);
}

// ── 照合済みの「方言 語」の組: DOKO_SEEDS ∪ VERIFIED_QUIZ_WORDS
const verified = new Set();
for (const m of read("lib/doko_pool.ts").matchAll(
  /\{\s*word:\s*"([^"]+)",\s*dialect:\s*"([^"]+)"\s*\}/g
)) {
  verified.add(`${m[2]} ${m[1]}`);
}
for (const m of read("lib/verified_quiz_words.ts").matchAll(
  /\{\s*word:\s*"([^"]+)",\s*dialect:\s*"([^"]+)"/g
)) {
  verified.add(`${m[2]} ${m[1]}`);
}

// ── 突き合わせ
let total = 0;
let ok = 0;
const missing = [];
for (const [d, qs] of quizzes) {
  for (const q of qs) {
    total++;
    const w = wordOfQuestion(q);
    // 見出し語を取り出せない設問（語を問う形になっていないもの）は照合の対象外
    if (!w) continue;
    if (verified.has(`${d} ${w}`)) ok++;
    else missing.push(`${d}／${w}`);
  }
}

console.log(
  `検定 ${quizzes.size}方言 / 全${total}問（うち語を問う設問 ${ok + missing.length}問） → 照合済み ${ok}/${
    ok + missing.length
  }`
);
if (missing.length) {
  console.log(`\n未照合 ${missing.length}件:`);
  for (const m of missing) console.log(`  - ${m}`);
  process.exit(1);
}
