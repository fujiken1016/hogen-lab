// 宮崎弁（/translate/miyazaki）の辞典 lib/miyazaki.ts の整合チェック。J669。
// 実行: node --experimental-strip-types scripts/check_miyazaki.mjs
import { MIYAZAKI_ENTRIES, MIYAZAKI_SOURCES } from "../lib/miyazaki.ts";

const MIN_WORDS = 30; // /translate/[slug] の足切り（lib/translate_meta.ts MIN_WORDS）と同じ
let ng = 0;
const fail = (m) => { console.log("NG", m); ng++; };
const keys = new Set(MIYAZAKI_SOURCES.map((s) => s.key));
const seen = new Set();
for (const e of MIYAZAKI_ENTRIES) {
  if (!e.word || !e.meaning) fail(`空欄 ${e.word}`);
  if (seen.has(e.word)) fail(`重複 ${e.word}`);
  seen.add(e.word);
  if (!e.src?.length) fail(`出典なし ${e.word}`);
  for (const k of e.src ?? []) if (!keys.has(k)) fail(`未定義の出典キー ${e.word}:${k}`);
  if (!e.note) fail(`根拠メモなし ${e.word}`);
  // Wikipedia(F) だけを根拠にした語は入れない
  if (e.src.length && e.src.every((k) => k === "F")) fail(`Wikipediaのみ ${e.word}`);
}
// 用例は資料にある文だけ（作文禁止）。用例を持つ語は A の談話・注記が根拠であること
for (const e of MIYAZAKI_ENTRIES) if (e.example && !e.src.includes("A")) fail(`用例の根拠が資料Aにない ${e.word}`);
if (MIYAZAKI_ENTRIES.length < MIN_WORDS) fail(`語数 ${MIYAZAKI_ENTRIES.length} < ${MIN_WORDS}`);
console.log(`語数 ${MIYAZAKI_ENTRIES.length} / 出典 ${MIYAZAKI_SOURCES.length} / NG ${ng}`);
process.exit(ng ? 1 : 0);
