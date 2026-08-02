// data_src/words_*.json を集約して lib/words_extra.ts を生成する。
// 既存WORDSとの重複・ファイル間重複は除外。実行: node --experimental-strip-types scripts/gen_words_extra.mjs
import fs from "fs";
import { WORDS } from "../lib/data.ts";

const dir = new URL("../data_src/", import.meta.url);
const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("words_") && f.endsWith(".json"))
  .sort();

const norm = (s) => String(s).replace(/[〜ー、。!?？！\s・（）()]/g, "").replace(/^〜/, "");

const extra = {};
let added = 0;
let skipped = 0;
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
  for (const [d, ws] of Object.entries(j)) {
    if (!WORDS[d]) {
      console.warn(`[warn] 未知の方言キー: ${d} (${f}) — スキップ`);
      continue;
    }
    const existing = new Set((WORDS[d] ?? []).map((w) => norm(w.word)));
    extra[d] ??= [];
    const cur = new Set(extra[d].map((w) => norm(w.word)));
    for (const w of ws) {
      const k = norm(w.word ?? "");
      if (!k || !w.meaning || existing.has(k) || cur.has(k)) {
        skipped++;
        continue;
      }
      cur.add(k);
      extra[d].push({ word: w.word, meaning: w.meaning, example: w.example ?? "" });
      added++;
    }
  }
}

const ts =
  "// 自動生成ファイル。scripts/gen_words_extra.mjs が data_src/words_*.json から生成する。手動編集しない。\n" +
  'import type { WordEntry } from "./data";\n\n' +
  "export const EXTRA_WORDS: Record<string, WordEntry[]> = " +
  JSON.stringify(extra, null, 2) +
  ";\n";
fs.writeFileSync(new URL("../lib/words_extra.ts", import.meta.url), ts);
console.log(`生成完了: 追加${added}語 / 重複スキップ${skipped}語 / 対象${Object.keys(extra).length}方言 / 入力${files.length}ファイル`);
