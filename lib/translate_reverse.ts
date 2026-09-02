// 「方言 → 標準語」（逆方向）の需要表。
//
// 背景：/translate/[slug] は最初から ⇄ トグルで「方言 → 標準語」も動く。
// しかし title / description / 本文が「標準語 → 方言」しか名乗っていなかったため、
// 逆方向で検索している人には、機能があること自体が伝わっていなかった。
//
// 根拠＝2026-09-02 に Google サジェスト（complete/search・hl=ja）を自分で実測した結果。
// 35方言すべてを2パターン（「<方言名> 標準語」「<方言名>を標準語」）＋別名で引き、
// **逆方向の語順で実在したものだけ**をここに載せている。
// サジェストは「そのクエリが実在するか」の一次シグナルであって検索ボリュームではない
// （実数は未取得）。実在しなかった26方言には逆方向の文言を付けない＝推測で35方言に広げない。
//
// name = そのクエリで実際に使われている呼び方（鹿児島弁は「薩摩弁」、沖縄方言は「沖縄弁」で実在した）

export type ReverseDemand = { name: string; queries: string[] };

export const REVERSE_DEMAND: Record<string, ReverseDemand> = {
  津軽弁: { name: "津軽弁", queries: ["津軽弁 標準語 変換", "津軽弁を標準語に変換", "津軽弁 から 標準語"] },
  秋田弁: { name: "秋田弁", queries: ["秋田弁を標準語に"] },
  京都弁: { name: "京都弁", queries: ["京都弁 標準語 変換"] },
  大阪弁: { name: "大阪弁", queries: ["大阪弁 標準語 変換", "大阪弁を標準語 変換"] },
  土佐弁: { name: "土佐弁", queries: ["土佐弁 標準語 変換"] },
  博多弁: { name: "博多弁", queries: ["博多弁 から 標準語 変換", "博多弁を標準語に変換"] },
  熊本弁: { name: "熊本弁", queries: ["熊本弁 標準語 変換"] },
  鹿児島弁: { name: "薩摩弁", queries: ["薩摩弁 標準語 変換"] },
  沖縄方言: {
    name: "沖縄弁",
    queries: ["沖縄弁 標準語 変換", "沖縄弁 から 標準語 変換", "うちなーぐちを標準語に変換"],
  },
};

/** 逆方向のクエリが実在した方言か */
export function hasReverseDemand(dialect: string): boolean {
  return !!REVERSE_DEMAND[dialect];
}

/** 逆方向の文言に使う呼び方（実測クエリで使われている名前。無ければ方言名そのもの） */
export function reverseName(dialect: string): string {
  return REVERSE_DEMAND[dialect]?.name ?? dialect;
}
