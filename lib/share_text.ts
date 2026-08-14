// Wordle型シェアテキストの組み立て。
//
// 設計の肝（外部事例研究 tool_traffic_playbook.md より）:
// - 受け手が「自分もやってみたい」と思う情報だけを出し、**答えは出さない**。
//   Wordleが伸びたのは、絵文字グリッドが「結果の形」だけを見せて中身を伏せたから。
// - 短いテキスト＋固有URL。画像にしない（テキストは検索へ人を向かわせる）。
// - 絵文字は1行8個まで。375px幅で折り返さない長さに収める。

/** 1行に並べる絵文字の上限（375pxで折り返さないための上限） */
export const PER_LINE = 8;

/** 正誤の並びを絵文字ブロックにする（答えそのものは出さない） */
export function marks(results: boolean[], filled = "🟩", empty = "⬜"): string {
  const cells = results.map((ok) => (ok ? filled : empty));
  const lines: string[] = [];
  for (let i = 0; i < cells.length; i += PER_LINE) {
    lines.push(cells.slice(i, i + PER_LINE).join(""));
  }
  return lines.join("\n");
}

/** 割合をメーター状の絵文字にする（0〜100） */
export function meter(pct: number, cells = PER_LINE, filled = "🟪", empty = "⬜"): string {
  const n = Math.max(0, Math.min(cells, Math.round((pct / 100) * cells)));
  return filled.repeat(n) + empty.repeat(cells - n);
}

/** 語を伏せ字にする（文字数だけ伝える＝答えは出さない） */
export function maskWord(word: string, mark = "○"): string {
  const len = [...(word ?? "")].length;
  return mark.repeat(Math.max(1, Math.min(len, 12)));
}

/** 語の文字数（サロゲートペア安全） */
export function charLen(word: string): number {
  return [...(word ?? "")].length;
}

/** 行を組み立てる（空行・falsyは落とす）。URLはShareBar側で付けるのでここには入れない。 */
export function shareBlock(lines: (string | false | null | undefined)[]): string {
  return lines.filter((l): l is string => !!l && l.trim().length > 0).join("\n");
}
