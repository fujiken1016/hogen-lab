// 方言の「別名」。title / description / 本文に入れて、実際に検索されている呼び方で拾えるようにする。
//
// 根拠は Search Console 実測（2026-08-03〜08-28・sc-domain:mainichi-lab.com、
// page=*https://hogen.mainichi-lab.com で絞り込み）。
// 例：/translate/ise のタイトルは「伊勢弁」だが、実際に表示されているクエリは
//     「三重弁 変換」68表示・「三重弁変換」4表示で、クリックは3件しか取れていなかった。
//     /quiz/okinawa も「うちなーぐち検定」11表示・掲載順位9.0でクリック0。
//
// 掲載の方針（推測で増やさない）:
// - SC で実際に表示が出ている呼び方を最優先で入れる（下の「実測」印）
// - それ以外は「その県で一般にそう呼ばれることがある」と言い切れるものだけ
// - 県内に複数の方言圏があり、県名＋弁が特定の方言を指さないものは入れない
//   （兵庫＝神戸弁/播州弁/但馬弁、島根＝出雲弁/石見弁、岐阜＝美濃弁/飛騨弁、
//    青森＝津軽弁/南部弁 は、いずれも「県名＋弁」が一意にならないので不採用）
// - 文面は「〜と呼ばれることもあります」に留め、「＝同じもの」と断定しない

export const DIALECT_ALIASES: Record<string, string[]> = {
  伊勢弁: ["三重弁"], // 実測: 「三重弁 変換」68表示 / 「三重弁変換」4表示
  土佐弁: ["高知弁"], // 実測: 「高知弁 変換」20表示・クリック5
  沖縄方言: ["沖縄弁", "うちなーぐち"], // 実測: 「うちなーぐち検定」11表示・順位9.0でクリック0
  博多弁: ["福岡弁"], // 実測: 「福岡弁 変換」「福岡弁変換」（/c/hakata に順位54〜76で当たっていた）
  鳥取弁: ["因幡弁"], // 実測: 「因幡弁」1表示
  鹿児島弁: ["薩摩弁"], // 実測(2026-09-02サジェスト): 「薩摩弁 変換」「薩摩弁 標準語 変換」が実在
  阿波弁: ["徳島弁"],
  讃岐弁: ["香川弁"],
  伊予弁: ["愛媛弁"],
  仙台弁: ["宮城弁"],
  金沢弁: ["石川弁"],
  信州弁: ["長野弁"],
};

/** その方言の別名（無ければ空配列） */
export function aliasesOf(dialect: string): string[] {
  return DIALECT_ALIASES[dialect] ?? [];
}

/** title に差し込む「（三重弁）」「（沖縄弁・うちなーぐち）」。別名が無ければ空文字 */
export function aliasParen(dialect: string): string {
  const a = aliasesOf(dialect);
  return a.length ? `（${a.join("・")}）` : "";
}

/** 本文・description に置く一文。別名が無ければ空文字 */
export function aliasSentence(dialect: string, area: string): string {
  const a = aliasesOf(dialect);
  if (!a.length) return "";
  return `${dialect}は${area}のことばで、「${a.join("」「")}」と呼ばれることもあります。`;
}
