// 1面だけ title / description を個別に指定する表（共通テンプレートの文面は変えない）。
//
// 🔴 2026-10-23 /translate/kagoshima のみ。根拠（GSC sc-domain:mainichi-lab.com・page=*hogen.mainichi-lab.com・
// 2026-10-07〜10-20 の14日・観測日 2026-10-23）：
//   kagoshima 表示 2,550 / クリック 40 / CTR 1.6% / 平均順位 7.0。サイト内で表示数2位なのに CTR がほぼ最下位。
//   クエリ内訳＝「薩摩弁 変換」450表示 1.8%／「薩摩弁」199表示 0.5%／「薩摩弁変換」119表示 0.8%／
//   「鹿児島弁 変換」496表示 2.4%／「鹿児島弁変換」47表示 0%（順位 5.5〜7.5）。
//   現行 title は「鹿児島弁（薩摩弁） 変換｜…」＝「鹿児島弁変換」「薩摩弁変換」という連続した語が
//   どこにも無い（括弧とスペースで割れている）。
// 手本（開いた日 2026-10-23）：
//   daiya.blog/kagoshima「鹿児島弁変換ツール | 薩摩弁・鹿児島弁一覧…」
//   xn--urss5w6nbnz8e.com/satsuma/「鹿児島弁変換ツール - 薩摩弁を学ぶ…」
//   8toch.net/translate/?lang=st「薩摩弁に変換 | 恋する方言変換」
//   → 3つとも「◯◯弁変換(ツール)」を連続した語で先頭に置く。パクった点＝連続語＋「ツール」を先頭に。
// ⚠️ これは仮説であって実測ではない。効果判定＝2026-11-07 以降に同じ条件（14日）で再測（副業/流入診断_2026-10-23.md）。
// 対照＝同じ日付で何も変えていない他の translate 面（okinawa など）。

export const TITLE_OVERRIDE: Record<string, (area: string) => string> = {
  kagoshima: (area) =>
    `鹿児島弁変換・薩摩弁変換ツール｜標準語⇄鹿児島弁を双方向に変換（${area}）| 方言ラボ`,
};

/** description の先頭文を差し替える面（辞典語数・言い換え例は共通ロジックのまま後ろに続く） */
export const DIR_LINE_OVERRIDE: Record<string, (area: string) => string> = {
  kagoshima: (area) =>
    `鹿児島弁（薩摩弁）を標準語に、標準語を鹿児島弁（${area}）に、⇄ で双方向に変換できる無料ツール。`,
};
