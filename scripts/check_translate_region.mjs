// 地方まとめ変換ページ（J671）の検査。代表語が辞典に実在し、台帳 status=ok（宮崎弁は資料確認済みの37語）であること。
// 実行: node --experimental-strip-types scripts/check_translate_region.mjs
import fs from "node:fs";
import { REGIONS_PAGE, regionTitle, regionDescription } from "../lib/translate_region.ts";
import { TYPES } from "../lib/types.ts";
import { wordsOf, SHINDAN_PHRASES, SHINDAN_QUESTIONS } from "../lib/data.ts";

const slugOf = Object.fromEntries(TYPES.map((x) => [x.dialect, x.slug]));
const v = JSON.parse(fs.readFileSync(new URL("../data_src/verified_words.json", import.meta.url), "utf8")).entries;
let ng = 0;
for (const cfg of Object.values(REGIONS_PAGE)) {
  const t = regionTitle(cfg), ds = regionDescription(cfg);
  console.log(cfg.slug, "title:", t, "| desc字数:", [...ds].length);
  if ([...ds].length > 125) { console.log("NG description 125字超"); ng++; }
  if (cfg.phraseKeys.length > 8) { console.log("NG 比較表8行超"); ng++; }
  for (const dd of cfg.dialects) {
    if (dd.name !== "宮崎弁" && slugOf[dd.name] !== dd.slug) { console.log("NG slugが types.ts とずれ", dd.name, dd.slug, slugOf[dd.name]); ng++; }
    const words = wordsOf(dd.name);
    for (const w of dd.picks) {
      const e = words.find((x) => x.word === w);
      if (!e) { console.log("NG 辞典に無い", dd.name, w); ng++; continue; }
      if (dd.name !== "宮崎弁") {
        const t = v.find((x) => x.dialect === dd.name && x.word === w);
        if (!t || t.status !== "ok") { console.log("NG 台帳okでない", dd.name, w, t?.status); ng++; }
      }
    }
    if (dd.name !== "宮崎弁") {
      const m = SHINDAN_PHRASES[dd.name] ?? {};
      for (const k of cfg.phraseKeys) if (!m[k]) { console.log("NG 比較表のキー欠け", dd.name, k); ng++; }
    }
  }
  for (const k of cfg.phraseKeys) if (!SHINDAN_QUESTIONS.find((q) => q.key === k)) { console.log("NG 質問キー不明", k); ng++; }
  if (slugOf[cfg.excluded.name] !== cfg.excluded.slug) { console.log("NG 除外方言のslugずれ", cfg.excluded.name); ng++; }
}
console.log(ng === 0 ? "OK（NG 0件）" : `NG ${ng}件`);
process.exit(ng ? 1 : 0);
