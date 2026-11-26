// 記事用の概念図（インラインSVG・文字は本文の内容だけ）。K78（2026-11-26）：文字だけの塊を図で割るために新設。
// 色は currentColor＋透過（ライト/ダーク両方で読める）。375px幅で 14px 以上になるよう viewBox を 340 幅で組む。
// ※絵ではなく「関係・順序の図解」だけを描く。数値は載せない（数値の図は BarFig）。

type Step = { title: string; sub?: string };

/** 縦に並べた手順・変化の図（上から下へ矢印） */
export function StepFig({
  steps,
  ariaLabel,
  caption,
}: {
  steps: Step[];
  ariaLabel: string;
  caption: string;
}) {
  const W = 340;
  const boxH = 56;
  const gap = 26;
  const H = steps.length * boxH + (steps.length - 1) * gap + 4;
  return (
    <figure className="my-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        style={{ display: "block", width: "100%", maxWidth: 480, height: "auto" }}
      >
        {steps.map((s, i) => {
          const y = 2 + i * (boxH + gap);
          return (
            <g key={s.title}>
              <rect x="2" y={y} width={W - 4} height={boxH} rx="10" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.35" />
              <text x={W / 2} y={y + (s.sub ? 23 : 34)} textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">
                {s.title}
              </text>
              {s.sub && (
                <text x={W / 2} y={y + 43} textAnchor="middle" fontSize="14" fill="currentColor" fillOpacity="0.8">
                  {s.sub}
                </text>
              )}
              {i < steps.length - 1 && (
                <path
                  d={`M ${W / 2} ${y + boxH + 3} L ${W / 2} ${y + boxH + gap - 5} M ${W / 2 - 6} ${y + boxH + gap - 11} L ${W / 2} ${y + boxH + gap - 4} L ${W / 2 + 6} ${y + boxH + gap - 11}`}
                  stroke="currentColor"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="text-sm text-sub leading-relaxed mt-1.5">{caption}</figcaption>
    </figure>
  );
}

/** 2つ（または3つ）の区分を並べて比べる図（見出し＋項目の縦リスト） */
export function CompareFig({
  cols,
  ariaLabel,
  caption,
}: {
  cols: { head: string; items: string[] }[];
  ariaLabel: string;
  caption: string;
}) {
  const W = 340;
  const n = cols.length;
  const gap = 10;
  const colW = (W - 4 - gap * (n - 1)) / n;
  const rows = Math.max(...cols.map((c) => c.items.length));
  const headH = 40;
  const rowH = 36;
  const H = headH + rows * rowH + 12;
  return (
    <figure className="my-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        style={{ display: "block", width: "100%", maxWidth: 480, height: "auto" }}
      >
        {cols.map((c, i) => {
          const x = 2 + i * (colW + gap);
          return (
            <g key={c.head}>
              <rect x={x} y="2" width={colW} height={H - 4} rx="10" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.35" />
              <text x={x + colW / 2} y="27" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">
                {c.head}
              </text>
              <line x1={x + 10} x2={x + colW - 10} y1={headH} y2={headH} stroke="currentColor" strokeOpacity="0.25" />
              {c.items.map((t, j) => (
                <text key={t} x={x + colW / 2} y={headH + 24 + j * rowH} textAnchor="middle" fontSize="15" fill="currentColor">
                  {t}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="text-sm text-sub leading-relaxed mt-1.5">{caption}</figcaption>
    </figure>
  );
}
