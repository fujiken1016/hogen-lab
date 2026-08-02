// シークレットキャラのSVG v2（TypeAvatar v6と同じレイヤードアニメ構造）
// ryujin: 金の龍神 — 枝角・突き出た鼻先・たてがみ・背びれトゲ・腹ウロコ・長ひげで「龍」の記号を明確に
// zashiki: 座敷童 — ぱっつん前髪・横髪・V字襟・帯＋帯結び・袖・足袋で「着物の子」の記号を明確に
"use client";

import { useState } from "react";
import CharScene from "@/components/scenes";

const OUTLINE = "#3B2B45";
const CREAM = "#FFF7EF";
const BLUSH = "#FF9FB2";

export default function SecretAvatar({
  slug,
  size = 96,
  dance = false,
  bg = false,
}: {
  slug: string;
  size?: number;
  dance?: boolean;
  bg?: boolean; // ご当地（天界/座敷）背景
}) {
  const [hop, setHop] = useState(false);
  const gid = `sg-${slug}`;
  return (
    <span
      className="char-wrap"
      style={{ width: size, height: size }}
      onClick={() => {
        setHop(true);
        setTimeout(() => setHop(false), 650);
      }}
    >
      <span className="char-shadow" />
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        role="img"
        aria-label={slug === "ryujin" ? "ことだま龍神" : "ざしきわらしちゃん"}
        className={`char-img ${dance ? "char-dance" : ""} ${hop ? "char-hop" : ""}`}
      >
        {bg && <CharScene slug={slug} />}
        <g transform={bg ? "translate(9.6 19.2) scale(0.84)" : undefined}>
        <defs>
          <radialGradient id={gid} cx="0.38" cy="0.3" r="0.85">
            {slug === "ryujin" ? (
              <>
                <stop offset="0%" stopColor="#FFE9A3" />
                <stop offset="55%" stopColor="#FFD43B" />
                <stop offset="100%" stopColor="#E8A33D" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FF7B92" />
                <stop offset="55%" stopColor="#F03E5E" />
                <stop offset="100%" stopColor="#C2255C" />
              </>
            )}
          </radialGradient>
        </defs>

        {/* きらめき多め（レア感） */}
        <path className="p-spark" d="M14 30 l 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#FFD43B" />
        <path className="p-spark" style={{ animationDelay: "0.8s" }} d="M106 24 l 1.6 3.2 3.2 1.6 -3.2 1.6 -1.6 3.2 -1.6 -3.2 -3.2 -1.6 3.2 -1.6 Z" fill="#FFD43B" />
        <path className="p-spark" style={{ animationDelay: "1.6s" }} d="M12 80 l 1.4 2.8 2.8 1.4 -2.8 1.4 -1.4 2.8 -1.4 -2.8 -2.8 -1.4 2.8 -1.4 Z" fill="#8AE3EE" />

        {slug === "ryujin" ? (
          <>
            {/* しっぽ（太め＋炎型のヒレ先・ふりふり） */}
            <g className="p-tail">
              <path d="M94 90 Q 116 84 110 60" stroke={OUTLINE} strokeWidth="13" fill="none" strokeLinecap="round" />
              <path d="M94 90 Q 116 84 110 60" stroke="#FFD43B" strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d="M110 62 C 104 52 112 46 118 42 C 116 48 120 52 116 58 C 114 61 112 62 110 62 Z" fill="#FF8787" stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round" />
            </g>
            {/* 枝分かれした鹿角（龍の記号その1） */}
            <g stroke={OUTLINE} strokeWidth="2.4" strokeLinejoin="round" fill="#F5D76E">
              <path d="M40 20 C 36 12 34 6 28 2 C 34 3 37 5 39 8 C 38 4 39 2 42 0 C 42 5 44 8 46 12 C 48 15 47 18 44 20 Z" />
              <path d="M80 20 C 84 12 86 6 92 2 C 86 3 83 5 81 8 C 82 4 81 2 78 0 C 78 5 76 8 74 12 C 72 15 73 18 76 20 Z" />
            </g>
            {/* たてがみ（顔まわりのもこもこ・龍の記号その2） */}
            <g fill="#FFF3BF" stroke={OUTLINE} strokeWidth="2.2">
              <path d="M24 34 C 14 32 10 40 16 46 C 8 48 10 58 18 58 C 14 64 22 70 28 66 L 32 40 Z" />
              <path d="M96 34 C 106 32 110 40 104 46 C 112 48 110 58 102 58 C 106 64 98 70 92 66 L 88 40 Z" />
            </g>
            {/* 背びれトゲ（頭頂・龍の記号その3） */}
            <path d="M50 14 L 55 4 L 58 13 L 62 3 L 66 13 L 70 5 L 73 15 Z" fill="#FF8787" stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round" />
            {/* 小さな翼（ぱたぱた） */}
            <g className="p-arm-l">
              <path d="M18 64 Q 2 56 6 42 Q 18 48 24 58 Z" fill="#FFE9A3" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
            </g>
            <g className="p-arm-r">
              <path d="M102 64 Q 118 56 114 42 Q 102 48 96 58 Z" fill="#FFE9A3" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
            </g>
            {/* 体 */}
            <ellipse cx="46" cy="105" rx="9" ry="6" fill="#E8A33D" stroke={OUTLINE} strokeWidth="2.5" />
            <ellipse cx="74" cy="105" rx="9" ry="6" fill="#E8A33D" stroke={OUTLINE} strokeWidth="2.5" />
            <path d="M60 12 C 88 12 100 34 100 62 C 100 90 84 106 60 106 C 36 106 20 90 20 62 C 20 34 32 12 60 12 Z" fill={`url(#${gid})`} stroke={OUTLINE} strokeWidth="3" />
            {/* 腹のウロコ板（龍の記号その4） */}
            <g>
              <path d="M42 74 C 42 66 78 66 78 74 L 78 96 C 78 104 42 104 42 96 Z" fill={CREAM} stroke={OUTLINE} strokeWidth="2.4" />
              <path d="M43.5 80 h 33 M43.5 87 h 33 M44.5 94 h 31" stroke={OUTLINE} strokeWidth="1.8" opacity="0.55" />
            </g>
            {/* 頭のツヤ */}
            <ellipse cx="46" cy="20" rx="11" ry="5" fill="#fff" opacity="0.4" transform="rotate(-14 46 20)" />
            {/* ほっぺ */}
            <g className="p-blush">
              <ellipse cx="36" cy="56" rx="6.5" ry="4.4" fill={BLUSH} />
              <ellipse cx="84" cy="56" rx="6.5" ry="4.4" fill={BLUSH} />
            </g>
            {/* 目（グロス目・まばたき） */}
            <g className="av-eyes">
              <ellipse cx="45" cy="45" rx="7" ry="8.2" fill="#241C20" />
              <ellipse cx="75" cy="45" rx="7" ry="8.2" fill="#241C20" />
              <ellipse cx="45" cy="49.2" rx="4.5" ry="2.8" fill="#FFD43B" opacity="0.6" />
              <ellipse cx="75" cy="49.2" rx="4.5" ry="2.8" fill="#FFD43B" opacity="0.6" />
              <circle cx="47.8" cy="41.8" r="2.8" fill="#fff" />
              <circle cx="77.8" cy="41.8" r="2.8" fill="#fff" />
              <circle cx="42.2" cy="48" r="1.3" fill="#fff" opacity="0.95" />
              <circle cx="72.2" cy="48" r="1.3" fill="#fff" opacity="0.95" />
            </g>
            {/* 突き出た鼻先マズル（龍の記号その5）＋口パク */}
            <g>
              <path d="M42 56 C 42 48 78 48 78 56 L 78 62 C 78 70 42 70 42 62 Z" fill="#FFE9A3" stroke={OUTLINE} strokeWidth="2.6" />
              {/* 鼻のこぶ＋鼻の穴 */}
              <circle cx="52" cy="53.5" r="3" fill="#FFD43B" stroke={OUTLINE} strokeWidth="1.6" />
              <circle cx="68" cy="53.5" r="3" fill="#FFD43B" stroke={OUTLINE} strokeWidth="1.6" />
              <ellipse cx="52" cy="54" rx="1.1" ry="1.5" fill={OUTLINE} />
              <ellipse cx="68" cy="54" rx="1.1" ry="1.5" fill={OUTLINE} />
            </g>
            <g className="av-mouth">
              <path d="M50 62.5 Q 60 69 70 62.5" stroke={OUTLINE} strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* 牙2本 */}
              <path d="M52.5 63.6 l 2.2 3.4 2.2 -2.6 Z" fill="#fff" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M67.5 63.6 l -2.2 3.4 -2.2 -2.6 Z" fill="#fff" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round" />
            </g>
            {/* 長いひげ（龍の記号その6・ゆらゆら） */}
            <g className="av-item" stroke={OUTLINE} strokeWidth="2.4" fill="none" strokeLinecap="round">
              <path d="M42 58 C 30 60 24 68 26 80 C 27 85 24 88 20 88" />
              <path d="M78 58 C 90 60 96 68 94 80 C 93 85 96 88 100 88" />
            </g>
            {/* 如意宝珠 */}
            <g className="av-item">
              <circle cx="98" cy="94" r="7" fill="#FF6B6B" stroke={OUTLINE} strokeWidth="2" />
              <path d="M98 84 q -3.5 2.6 0 6 q 3.5 -3.4 0 -6" fill="#FFD43B" stroke={OUTLINE} strokeWidth="1.4" />
              <circle cx="95.8" cy="92" r="1.8" fill="#fff" opacity="0.8" />
            </g>
          </>
        ) : (
          <>
            {/* 座敷わらし: 後ろ髪（おかっぱの丸いシルエット） */}
            <path d="M60 8 C 88 8 98 28 97 46 C 96.5 56 92 60 88 60 L 32 60 C 28 60 23.5 56 23 46 C 22 28 32 8 60 8 Z" fill="#33283D" stroke={OUTLINE} strokeWidth="3" />
            {/* 横髪（顔の両サイドに垂れる） */}
            <path d="M26 40 C 24 52 24 62 27 72 C 31 74 35 73 37 70 L 36 42 Z" fill="#33283D" stroke={OUTLINE} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M94 40 C 96 52 96 62 93 72 C 89 74 85 73 83 70 L 84 42 Z" fill="#33283D" stroke={OUTLINE} strokeWidth="2.4" strokeLinejoin="round" />

            {/* 体（赤い着物） */}
            <path d="M60 46 C 82 46 92 60 92 78 C 92 96 80 104 60 104 C 40 104 28 96 28 78 C 28 60 38 46 60 46 Z" fill={`url(#${gid})`} stroke={OUTLINE} strokeWidth="3" />
            {/* V字の襟合わせ（着物の記号その1: 白衿2本＋合わせ線） */}
            <path d="M46 50 L 60 70 L 60 78 L 40 58 Z" fill={CREAM} stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M74 50 L 60 70 L 60 78 L 80 58 Z" fill={CREAM} stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round" />
            {/* 袖（両サイドのゆったり布・ふりふり） */}
            <g className="p-arm-l">
              <path d="M34 62 C 24 64 20 74 22 84 C 28 88 36 87 40 82 L 38 64 Z" fill="#F03E5E" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M23.5 80 C 28 83.5 34 83 38.5 79.5" stroke={CREAM} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>
            <g className="p-arm-r">
              <path d="M86 62 C 96 64 100 74 98 84 C 92 88 84 87 80 82 L 82 64 Z" fill="#F03E5E" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M96.5 80 C 92 83.5 86 83 81.5 79.5" stroke={CREAM} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>
            {/* 帯＋帯結び（着物の記号その2） */}
            <path d="M30 84 C 42 90 78 90 90 84 L 90 92 C 78 98 42 98 30 92 Z" fill="#FFB800" stroke={OUTLINE} strokeWidth="2.4" />
            <circle cx="60" cy="90" r="4.5" fill="#E8590C" stroke={OUTLINE} strokeWidth="2" />
            {/* 着物の柄（白い小花） */}
            <g fill="#fff" opacity="0.85">
              <circle cx="42" cy="74" r="1.6" />
              <circle cx="78" cy="72" r="1.6" />
              <circle cx="50" cy="82" r="1.6" />
              <circle cx="72" cy="82" r="1.6" />
            </g>
            {/* 足袋 */}
            <ellipse cx="48" cy="104" rx="7.5" ry="5" fill="#fff" stroke={OUTLINE} strokeWidth="2.4" />
            <ellipse cx="72" cy="104" rx="7.5" ry="5" fill="#fff" stroke={OUTLINE} strokeWidth="2.4" />

            {/* 顔 */}
            <ellipse cx="60" cy="42" rx="24" ry="23" fill={CREAM} />
            {/* ぱっつん前髪（水平ラインのおかっぱ・ツヤ入り） */}
            <path d="M34 40 C 34 18 86 18 86 40 L 86 42 L 79 42 L 78 37 L 70 42 L 60 38 L 50 42 L 42 37 L 41 42 L 34 42 Z" fill="#33283D" stroke={OUTLINE} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M42 24 C 48 20 58 19 64 20" stroke="#5C4A6E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            {/* 赤い玉かんざし */}
            <circle cx="82" cy="30" r="3.2" fill="#FF4D6D" stroke={OUTLINE} strokeWidth="1.8" />
            {/* ほっぺ（まんまる） */}
            <g className="p-blush">
              <circle cx="44" cy="52" r="5" fill={BLUSH} />
              <circle cx="76" cy="52" r="5" fill={BLUSH} />
            </g>
            {/* 目（グロス目・まばたき） */}
            <g className="av-eyes">
              <ellipse cx="49" cy="48" rx="6.2" ry="7.4" fill="#241C20" />
              <ellipse cx="71" cy="48" rx="6.2" ry="7.4" fill="#241C20" />
              <ellipse cx="49" cy="51.6" rx="3.9" ry="2.5" fill="#F03E5E" opacity="0.55" />
              <ellipse cx="71" cy="51.6" rx="3.9" ry="2.5" fill="#F03E5E" opacity="0.55" />
              <circle cx="51.5" cy="45" r="2.5" fill="#fff" />
              <circle cx="73.5" cy="45" r="2.5" fill="#fff" />
            </g>
            {/* 口（にこっ・口パク） */}
            <g className="av-mouth">
              <path d="M54 58 Q 60 63 66 58" stroke={OUTLINE} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            </g>
            {/* てまり（ゆらゆら） */}
            <g className="av-item">
              <circle cx="100" cy="96" r="8" fill="#8AE3EE" stroke={OUTLINE} strokeWidth="2" />
              <path d="M93 92.5 q 7 3.5 14 0 M93 99.5 q 7 -3.5 14 0" stroke="#FF4D6D" strokeWidth="1.7" fill="none" />
              <path d="M100 88 v 16" stroke="#FFB800" strokeWidth="1.7" />
            </g>
          </>
        )}
        </g>
      </svg>
    </span>
  );
}
