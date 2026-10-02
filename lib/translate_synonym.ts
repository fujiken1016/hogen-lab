// 「○○弁 翻訳」（＝「変換」の同義クエリ）の需要表。
//
// 背景：/translate/[slug] の title は 35面すべてが「◯◯弁 変換」と名乗っており、
// **「翻訳」という語を1面も使っていなかった**（2026-10-03 実測＝プリレンダHTML 35枚の
// <title> で「翻訳」を含むもの 0件／35枚の本文全体を通しても出現2回）。
// ところが lib/translate_meta.ts 冒頭のURL分割の根拠には、当初から
// 「『博多弁 変換』『関西弁 翻訳』のように、方言名＋変換/翻訳が実際に検索されている」と
// 書かれていた。＝**設計意図に翻訳は入っていたが、実装が一度も名乗らなかった**。
//
// 根拠＝memory/hogen_translate_gsc_2026-10.md（2026-10-01 取得・過去28日 2026/09/01〜09/28）の
// 「表示はあるのにクリック0のクエリ 上位20」に実在した「翻訳」クエリだけをここに載せている。
//   博多弁 翻訳    97表示  9.4位  クリック0
//   広島弁 翻訳    37表示  8.1位  クリック0 ／ 広島弁翻訳 34表示 8.7位 クリック0
//   土佐弁 翻訳    26表示  6.3位  クリック0
//   沖縄弁 翻訳    24表示  7.1位  クリック0
//   名古屋弁 翻訳  21表示  8.2位  クリック0
//
// 🔴 この5方言はいずれも「◯◯弁 変換」側でも勝てていない面（博多 CTR0.7%／沖縄 CTR0%／
// 広島 2.9%／名古屋 1.4%／土佐 1.5%）。**CTRが取れている面（岡山20.1%・和歌山12.0%・
// 茨城11.3%・福島9.7%）には「翻訳」クエリが実測に存在しないので、触らない**＝勝っている面の
// title を実験で壊さない。
//
// ⚠️ 限界（断定しないため）：参照したのは上位20行の表であって **252語の全件リストではない**。
// 21位以下に「翻訳」クエリがさらに在る可能性は否定できない。全件を取り直した回で足す。
// ⚠️ ここに載せたのは「そのクエリが実在し、かつ1クリックも取れていない」事実のみ。
// 「titleに語を足せば取れる」は仮説であって実測ではない（判定日＝2026-10-19）。

/** name = そのクエリで実際に使われている呼び方（沖縄方言は「沖縄弁」で実在した） */
export type SynonymDemand = { name: string; impressions: number; position: number };

export const SYNONYM_DEMAND: Record<string, SynonymDemand> = {
  博多弁: { name: "博多弁", impressions: 97, position: 9.4 },
  広島弁: { name: "広島弁", impressions: 71, position: 8.1 },
  土佐弁: { name: "土佐弁", impressions: 26, position: 6.3 },
  沖縄方言: { name: "沖縄弁", impressions: 24, position: 7.1 },
  名古屋弁: { name: "名古屋弁", impressions: 21, position: 8.2 },
};

/** 「翻訳」クエリが実測で存在した方言か（＝titleで「翻訳」も名乗る対象） */
export function hasSynonymDemand(dialect: string): boolean {
  return !!SYNONYM_DEMAND[dialect];
}

/** titleの先頭セグメントに使う見出し語。SERPで切れない位置に「翻訳」を置くため先頭側に入れる */
export function convertHead(dialect: string): string {
  return hasSynonymDemand(dialect) ? "変換・翻訳" : "変換";
}
