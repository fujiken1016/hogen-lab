// 記事用の横棒グラフ（インラインSVG）。数字は呼び出し側が実測値を渡す。
// ラベルを棒の上に置くので、長いラベルでも375px幅で崩れない。色は currentColor ＋ 透過で、ライト/ダークの両方で読める。

export type BarItem = { label: string; value: number; dim?: boolean };

export function BarFig({
  items,
  max,
  unit,
  ariaLabel,
  caption,
}: {
  items: BarItem[];
  max: number;
  unit: string;
  ariaLabel: string;
  caption: string;
}) {
  const W = 340;
  const rowH = 46;
  const barX = 0;
  const barMax = 262; // 値の文字を右に置く余白を残す
  const H = items.length * rowH + 4;
  return (
    <figure className="my-5">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={ariaLabel}
          style={{ display: "block", width: "100%", maxWidth: 480, height: "auto" }}
        >
          {items.map((it, i) => {
            const y = i * rowH + 2;
            const w = it.value === 0 ? 0 : Math.max(4, Math.round((it.value / max) * barMax));
            return (
              <g key={it.label}>
                <text x={barX} y={y + 15} fontSize="14" fill="currentColor">
                  {it.label}
                </text>
                <rect
                  x={barX}
                  y={y + 22}
                  width={barMax}
                  height="14"
                  rx="3"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
                {w > 0 && (
                  <rect
                    x={barX}
                    y={y + 22}
                    width={w}
                    height="14"
                    rx="3"
                    fill="currentColor"
                    fillOpacity={it.dim ? 0.3 : 0.7}
                  />
                )}
                <text x={barMax + 10} y={y + 34} fontSize="14" fontWeight="700" fill="currentColor">
                  {it.value}
                  {unit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="text-sm text-sub mt-2 leading-[1.8]">{caption}</figcaption>
    </figure>
  );
}
