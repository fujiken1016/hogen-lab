// アニメ風の背景あしらい（雲・木・山・太陽・星・波）
// マスコットと同じ太アウトライン（#33272A）で世界観を統一。
// すべて装飾: pointer-events-none / aria-hidden。絶対配置で空きスペースに散らす。

const OUTLINE = "#33272A";

type DecoProps = { className?: string; style?: React.CSSProperties };

/* もくもく雲（ドリフトは .cloud-drift を付与） */
export function Cloud({ className = "", style }: DecoProps) {
  return (
    <svg viewBox="0 0 120 58" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      <g fill="#fff" stroke={OUTLINE} strokeWidth="2.5">
        <path d="M24 48 a 15 15 0 0 1 3 -29 a 19 19 0 0 1 36 -6 a 15 15 0 0 1 26 7 a 13 13 0 0 1 4 28 Z" />
      </g>
      <ellipse cx="42" cy="22" rx="10" ry="4.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

/* まるっこい木（ゆらゆらは .tree-sway を付与） */
export function Tree({ className = "", style }: DecoProps) {
  return (
    <svg viewBox="0 0 60 82" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      {/* 幹を先に描き、葉をしっかり被せて一体に見せる */}
      <rect x="26.5" y="40" width="7" height="34" rx="3.5" fill="#8C6544" stroke={OUTLINE} strokeWidth="2.5" />
      <g fill="#7FB069" stroke={OUTLINE} strokeWidth="2.5">
        <circle cx="16" cy="38" r="12" />
        <circle cx="44" cy="38" r="12" />
        <circle cx="30" cy="26" r="18" />
      </g>
      <circle cx="23" cy="17" r="4.5" fill="#fff" opacity="0.4" />
      <circle cx="41" cy="36" r="2.2" fill="#FF4D6D" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="18" cy="33" r="2.2" fill="#FF4D6D" stroke={OUTLINE} strokeWidth="1.2" />
      <circle cx="30" cy="40" r="2.2" fill="#FF4D6D" stroke={OUTLINE} strokeWidth="1.2" />
    </svg>
  );
}

/* こんもり茂み */
export function Bush({ className = "", style }: DecoProps) {
  return (
    <svg viewBox="0 0 90 40" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      <g fill="#9BC383" stroke={OUTLINE} strokeWidth="2.5">
        <circle cx="20" cy="28" r="14" />
        <circle cx="45" cy="22" r="17" />
        <circle cx="70" cy="28" r="13" />
      </g>
      <circle cx="38" cy="14" r="4" fill="#fff" opacity="0.4" />
    </svg>
  );
}

/* にこにこ太陽 */
export function Sun({ className = "", style }: DecoProps) {
  return (
    <svg viewBox="0 0 80 80" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      <g stroke="#E8A33D" strokeWidth="3.5" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path key={deg} d="M40 6 L 40 14" transform={`rotate(${deg} 40 40)`} />
        ))}
      </g>
      <circle cx="40" cy="40" r="18" fill="#F5C84C" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx="34" cy="38" r="1.8" fill={OUTLINE} />
      <circle cx="46" cy="38" r="1.8" fill={OUTLINE} />
      <path d="M34 44 Q 40 49 46 44" stroke={OUTLINE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="43" r="2.5" fill="#F2B8B5" opacity="0.9" />
      <circle cx="50" cy="43" r="2.5" fill="#F2B8B5" opacity="0.9" />
    </svg>
  );
}

/* 三日月（夜のバンド用） */
export function Moon({ className = "", style }: DecoProps) {
  return (
    <svg viewBox="0 0 60 60" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      <path d="M40 8 a 24 24 0 1 0 12 42 a 20 20 0 0 1 -12 -42 Z" fill="#F5D98C" stroke={OUTLINE} strokeWidth="2" />
      <circle cx="30" cy="26" r="1.6" fill={OUTLINE} />
      <path d="M27 33 Q 31 36 35 33" stroke={OUTLINE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* きらきら星の群れ（濃色バンド用） */
export function Stars({ className = "", style }: DecoProps) {
  const star = (x: number, y: number, s: number, o: number) => (
    <path
      key={`${x}-${y}`}
      d={`M${x} ${y - s} l ${s * 0.35} ${s * 0.65} ${s * 0.65} ${s * 0.35} -${s * 0.65} ${s * 0.35} -${s * 0.35} ${s * 0.65} -${s * 0.35} -${s * 0.65} -${s * 0.65} -${s * 0.35} ${s * 0.65} -${s * 0.35} Z`}
      fill="#F5D98C"
      opacity={o}
    />
  );
  return (
    <svg viewBox="0 0 200 80" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      {star(24, 22, 7, 0.9)}
      {star(70, 52, 4, 0.6)}
      {star(120, 18, 5, 0.75)}
      {star(168, 44, 6, 0.85)}
      {star(195, 14, 3.5, 0.55)}
    </svg>
  );
}

/* 海の波の縁取り（バンドの上端/下端に敷く。full-bleed内で使う） */
export function WaveEdge({
  color = "#faf7f0",
  flip = false,
  className = "",
}: DecoProps & { color?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 44"
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M0 24 C 90 42 180 8 270 24 C 360 40 450 8 540 24 C 630 40 720 8 810 24 C 900 40 990 8 1080 24 C 1170 40 1260 8 1350 24 C 1395 32 1420 28 1440 24 L 1440 44 L 0 44 Z"
        fill={color}
      />
    </svg>
  );
}

/* とおくの山なみ（セクションの足元に敷く） */
export function Hills({ className = "", style }: DecoProps) {
  return (
    <svg viewBox="0 0 400 70" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      <path d="M0 70 Q 70 12 150 58 Q 200 30 260 56 Q 330 6 400 52 L 400 70 Z" fill="#9BC383" opacity="0.5" />
      <path d="M0 70 Q 100 34 190 64 Q 280 30 400 66 L 400 70 Z" fill="#7FB069" opacity="0.6" />
    </svg>
  );
}
