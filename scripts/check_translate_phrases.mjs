// 標準語→方言の変換で、語・慣用句の一部だけが別の意味の語に当たって壊れていないかを、全方言で数える。
//
// 経緯（J449・2026-11-12）: 「調子に乗る」を津軽弁・新潟弁へ変換すると「あいつはあんべに乗る」と壊れた。
// 原因＝最長一致で「調子」だけが辞典の「あんべ（具合・調子）」に当たる。lib/translate_protect.ts に
// 保護語句を置き、辞典に全体の見出しが無いときは分けずに残す。
//
// 検査:
//   A. 回帰: 「調子に乗る」「調子に乗っている」「お調子者」が全方言で 「調子」単独の置換 を起こさない
//   B. 保護語句ぜんぶ×全方言: 語句の内側だけを置き換える部分置換が 0 件
//   C. 意味が通る部分置換は保たれている（具合が悪い→あんべが悪い 等）
//   D. 参考: 辞典の複合語（標準語の見出し 3字以上）×全方言の部分置換の総数（ゲートではなく件数の報告）
// 使い方: node --experimental-strip-types scripts/check_translate_phrases.mjs   （NG があれば exit 1）
import { DIALECTS, STANDARD, wordsOf } from "../lib/data.ts";
import { convert, glossesOf } from "../lib/translate_dict.ts";
import { PROTECTED_PHRASES } from "../lib/translate_protect.ts";

let ng = 0;
const fail = (m) => { ng++; console.log("NG", m); };

// A
for (const d of DIALECTS) {
  for (const t of ["あいつは調子に乗る", "あいつは調子に乗っている", "お調子者"]) {
    const r = convert(t, STANDARD, d);
    // 「調子」単独の置換（元の語が 調子 だけ）を禁止。辞典に「調子に乗る」全体の見出しがあるときは source が長いので当たらない
    const lone = r.hits.filter((h) => h.source === "調子");
    if (lone.length) fail(`A ${d} 「${t}」→「${r.output}」`);
  }
}

// B
let bCases = 0;
for (const d of DIALECTS) {
  for (const p of PROTECTED_PHRASES) {
    const r = convert(p, STANDARD, d);
    bCases++;
    // 保護語句は、全体（以上）の見出しが無いかぎり1字も変えない
    const partial = r.hits.filter((h) => h.source.length < p.length);
    if (partial.length) fail(`B ${d} 「${p}」→「${r.output}」（${partial.map((h) => h.source + "→" + h.target).join("・")}）`);
  }
}

// C
const keep = [
  ["津軽弁", "具合が悪い", "あんべが悪い"],
  ["新潟弁", "調子が悪い", "あんべーが悪い"],
  ["伊勢弁", "知らない", "知らねー"],
  ["京都弁", "元の場所にしまう", "元の場所になおす"],
];
for (const [d, src, want] of keep) {
  const got = convert(src, STANDARD, d).output;
  if (got !== want) fail(`C ${d} 「${src}」→「${got}」（期待「${want}」）`);
}

// D 参考
const all = new Set();
for (const d of DIALECTS) for (const w of wordsOf(d)) for (const g of glossesOf(w.meaning)) if (g.length >= 3) all.add(g);
let partial = 0;
const phrases = new Set();
for (const d of DIALECTS) {
  for (const g of all) {
    const r = convert(g, STANDARD, d);
    if (r.hits.length && r.output !== g && !(r.hits.length === 1 && r.hits[0].source === g)) { partial++; phrases.add(g); }
  }
}
console.log(`B 保護語句 ${PROTECTED_PHRASES.length} × 方言 ${DIALECTS.length} = ${bCases} 通りを検査`);
console.log(`D 参考: 辞典の複合語 ${all.size} × ${DIALECTS.length} 方言のうち、語句の一部だけが置き換わった組 ${partial} 件（語句 ${phrases.size} 種）`);
console.log(ng === 0 ? "OK 0 件" : `NG ${ng} 件`);
process.exit(ng === 0 ? 0 : 1);
