// タイプごとの擬人化マスコット v6「ANIME」
// フラットなアニメ基調のレイヤードSVG。パーツ単位でアニメする:
//   まばたき(av-eyes) / 口パク(av-mouth) / 耳ピク(p-ear-*) / しっぽふり(p-tail) /
//   腕ふり(p-arm-*) / 道具ゆれ(av-item) / ほっぺ明滅(p-blush) / きらめき(p-spark)
// 全体は v5 のトイ挙動（char-idle＋連動影＋タップでぴょん）を継承。
// すべて決定論的（SSR安全）。3Dレンダー期のPNGは廃止（リアルすぎるため）。
"use client";

import { useState } from "react";
import CharScene from "@/components/scenes";
import { DialectType } from "@/lib/types";

const OUTLINE = "#3B2B45";
const CREAM = "#FFF7EF";
const BLUSH = "#FF9FB2";

const PALETTES = [
  { body: "#FF6B6B", light: "#FF9E9E", dark: "#E03131" }, // ビビッドレッド
  { body: "#5C7CFA", light: "#93A8FF", dark: "#3B5BDB" }, // ビビッドブルー
  { body: "#FFC53D", light: "#FFE08A", dark: "#F59F00" }, // ビビッドイエロー
  { body: "#69DB7C", light: "#A3ECB0", dark: "#37B24D" }, // ビビッドグリーン
  { body: "#B197FC", light: "#D3C3FF", dark: "#7950F2" }, // ビビッドバイオレット
  { body: "#FF87B7", light: "#FFB8D4", dark: "#E64980" }, // ビビッドピンク
  { body: "#3BC9DB", light: "#8AE3EE", dark: "#1098AD" }, // ビビッドシアン
  { body: "#FFA94D", light: "#FFCC94", dark: "#E8590C" }, // ビビッドオレンジ
  { body: "#FDFDFD", light: "#FFFFFF", dark: "#CED4DA" }, // 白（うさぎ・パンダ用）
  { body: "#C69B72", light: "#E0BE9C", dark: "#8C6544" }, // 茶（たぬき・犬用）
];

type Animal =
  | "human"
  | "cat"
  | "dog"
  | "fox"
  | "rabbit"
  | "bear"
  | "lion"
  | "monkey"
  | "bird"
  | "cow"
  | "panda"
  | "tanuki";
type Hat =
  | "shachi"
  | "hachimaki"
  | "beanie"
  | "flower"
  | "strawhat"
  | "towel"
  | "mage"
  | "ribbon"
  | "leafband"
  | "beret"
  | "sprout"
  | "none";
type Item =
  | "mic"
  | "fan"
  | "cherry"
  | "onigiri"
  | "teacup"
  | "peach"
  | "mikan"
  | "fish"
  | "mallet"
  | "star"
  | "fugu"
  | "bachi"
  | "kiritanpo"
  | "apple"
  | "none";
type Cfg = {
  animal: Animal;
  shape: 0 | 1 | 2;
  hat: Hat;
  item: Item;
  glasses?: boolean;
  brows?: boolean;
  palette: number;
};

// キャラ設定表: ご当地モチーフ × 性格
const CFG: Record<string, Cfg> = {
  std: { animal: "human", shape: 1, hat: "none", item: "none", glasses: true, palette: 1 },
  kansai: { animal: "cat", shape: 0, hat: "hachimaki", item: "mic", palette: 2 }, // 吉本魂の猫
  kyoto: { animal: "fox", shape: 2, hat: "ribbon", item: "fan", palette: 5 }, // お稲荷さんの狐
  hakata: { animal: "human", shape: 0, hat: "hachimaki", item: "none", brows: true, palette: 0 }, // 熱男
  tsugaru: { animal: "human", shape: 1, hat: "beanie", item: "apple", palette: 0 }, // りんご県
  hokkaido: { animal: "bear", shape: 1, hat: "beanie", item: "fish", palette: 9 }, // ヒグマ
  sendai: { animal: "bird", shape: 1, hat: "ribbon", item: "none", palette: 7 }, // すずめ踊り
  nagoya: { animal: "human", shape: 0, hat: "shachi", item: "none", glasses: true, palette: 2 }, // 金しゃち
  hiroshima: { animal: "lion", shape: 0, hat: "hachimaki", item: "none", brows: true, palette: 7 },
  izumo: { animal: "human", shape: 2, hat: "mage", item: "none", palette: 4 }, // 宮司さん
  tosa: { animal: "dog", shape: 1, hat: "strawhat", item: "none", palette: 9 }, // 土佐犬×麦わら
  kagoshima: { animal: "dog", shape: 0, hat: "mage", item: "none", brows: true, palette: 1 }, // せごどんの犬
  okinawa: { animal: "lion", shape: 1, hat: "flower", item: "none", palette: 0 }, // シーサー
  akita: { animal: "dog", shape: 1, hat: "beanie", item: "kiritanpo", palette: 2 }, // 秋田犬
  yamagata: { animal: "human", shape: 2, hat: "hachimaki", item: "cherry", palette: 3 },
  ibaraki: { animal: "human", shape: 1, hat: "hachimaki", item: "none", palette: 3 },
  niigata: { animal: "bird", shape: 2, hat: "hachimaki", item: "onigiri", palette: 8 }, // トキ
  kanazawa: { animal: "cat", shape: 2, hat: "ribbon", item: "fan", palette: 2 }, // 雅ねこ
  shinshu: { animal: "monkey", shape: 2, hat: "leafband", item: "none", palette: 9 }, // 山の哲学ざる
  shizuoka: { animal: "human", shape: 1, hat: "sprout", item: "teacup", palette: 3 }, // 茶畑
  kobe: { animal: "cat", shape: 2, hat: "beret", item: "none", palette: 1 }, // おしゃれ猫
  okayama: { animal: "monkey", shape: 1, hat: "hachimaki", item: "peach", palette: 5 }, // 桃太郎のおとも
  sanuki: { animal: "human", shape: 0, hat: "hachimaki", item: "teacup", palette: 2 }, // うどん
  iyo: { animal: "human", shape: 1, hat: "flower", item: "mikan", palette: 2 },
  kumamoto: { animal: "bear", shape: 0, hat: "hachimaki", item: "none", brows: true, palette: 1 }, // もっこす熊
  nagasaki: { animal: "cat", shape: 2, hat: "beret", item: "none", palette: 6 }, // 尾曲がり猫
  iwate: { animal: "dog", shape: 0, hat: "beanie", item: "none", palette: 8 }, // わんこ（そば）
  fukushima: { animal: "cow", shape: 1, hat: "none", item: "peach", palette: 0 }, // 赤べこ
  toyama: { animal: "bird", shape: 2, hat: "hachimaki", item: "fish", palette: 8 }, // 雷鳥
  hida: { animal: "monkey", shape: 0, hat: "leafband", item: "mallet", palette: 0 }, // さるぼぼ
  ise: { animal: "dog", shape: 1, hat: "ribbon", item: "none", palette: 8 }, // おかげ犬
  wakayama: { animal: "panda", shape: 1, hat: "flower", item: "mikan", palette: 8 }, // 熊野パンダ
  tottori: { animal: "rabbit", shape: 1, hat: "towel", item: "star", palette: 8 }, // 因幡の白兎
  yamaguchi: { animal: "human", shape: 2, hat: "hachimaki", item: "fugu", palette: 1 },
  awa: { animal: "tanuki", shape: 0, hat: "none", item: "bachi", palette: 9 }, // 阿波狸合戦
  oita: { animal: "monkey", shape: 1, hat: "towel", item: "none", palette: 7 }, // 高崎山×温泉
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// タイプのテーマカラー（結果画面の背景などで使う）
export function avatarColors(slug: string): { body: string; dark: string } {
  const cfg = CFG[slug];
  const p = PALETTES[cfg?.palette ?? hash(slug) % 8];
  return { body: p.body, dark: p.dark };
}

// 体型（頭頂y≈14、足元y≈106）
const BODIES = [
  "M60 12 C 88 12 100 34 100 62 C 100 90 84 106 60 106 C 36 106 20 90 20 62 C 20 34 32 12 60 12 Z",
  "M60 16 C 90 16 104 40 104 64 C 104 92 86 106 60 106 C 34 106 16 92 16 64 C 16 40 30 16 60 16 Z",
  "M60 10 C 78 10 94 40 97 66 C 100 92 84 106 60 106 C 36 106 20 92 23 66 C 26 40 42 10 60 10 Z",
];

export default function TypeAvatar({
  type,
  size = 96,
  float = false,
  dance = false,
  bg = false,
  still = false,
}: {
  type: DialectType;
  size?: number;
  float?: boolean;
  dance?: boolean; // 結果ヒーロー用の大きめダンス
  bg?: boolean; // ご当地背景（図鑑カード用。キャラは少し縮小して風景を見せる）
  still?: boolean; // 全アニメ停止（マーキー等の大量表示でのパフォーマンス用）
}) {
  const [hop, setHop] = useState(false);
  const h = hash(type.slug);
  const cfg: Cfg =
    CFG[type.slug] ?? { animal: "human", shape: (h % 3) as 0 | 1 | 2, hat: "hachimaki", item: "none", palette: h % 8 };
  const p = PALETTES[cfg.palette];
  const gid = `g-${type.slug}`;
  const eyeStyle = h % 7; // 0グロス/1にっこり/2キリッ/3たれ目/4ジト目/5星目/6ウインク
  const mouthStyle = (h >> 2) % 6; // 0スマイル/1あんぐり/2波/3ぺろ/4おちょぼ/5にかっ
  const muzzleMouth = (h >> 6) % 3; // 動物口: 0ω/1あんぐり舌/2ω舌ぺろ
  const blushStyle = (h >> 9) % 3; // 0ツヤ線/1まる/2照れ斜線
  const a = cfg.animal;
  const darkPatch = a === "panda" ? OUTLINE : "#6B4A35";
  const hasTail = a === "cat" || a === "fox" || a === "dog" || a === "monkey" || a === "cow" || a === "lion";
  // キャラごとにパーツアニメのタイミングをずらす（決定論的なのでSSR安全）
  const delay = (base: number, mod: number, step: number) => `${((h >> base) % mod) * step}s`;
  const dEyes = { animationDelay: delay(3, 9, 0.5) };
  const dMouth = { animationDelay: delay(5, 11, 0.6) };
  const dItem = { animationDelay: delay(0, 5, 0.4) };
  const dEar = { animationDelay: delay(7, 7, 0.7) };
  const dTail = { animationDelay: delay(2, 6, 0.3) };
  const dArm = { animationDelay: delay(4, 5, 0.5) };
  const dWrap = delay(2, 8, 0.4);

  return (
    <span
      className={`char-wrap ${float ? "avatar-float" : ""} ${still ? "char-still" : ""}`}
      style={{ width: size, height: size }}
      onClick={() => {
        setHop(true);
        setTimeout(() => setHop(false), 650);
      }}
    >
      <span className="char-shadow" style={{ animationDelay: dWrap }} />
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        role="img"
        aria-label={`${type.name}のキャラクター`}
        className={`char-img ${dance ? "char-dance" : ""} ${hop ? "char-hop" : ""}`}
        style={{ animationDelay: hop ? "0s" : dWrap }}
      >
        {bg && <CharScene slug={type.slug} />}
        <g transform={bg ? "translate(9.6 19.2) scale(0.84)" : undefined}>
        <defs>
          {/* アニメ調のやわらかい立体感（左上ハイライトのラジアル） */}
          <radialGradient id={gid} cx="0.38" cy="0.3" r="0.85">
            <stop offset="0%" stopColor={p.light} />
            <stop offset="55%" stopColor={p.body} />
            <stop offset="100%" stopColor={p.dark} />
          </radialGradient>
        </defs>

        {/* きらめき（キャラの周り） */}
        <path className="p-spark" d="M18 30 l 1.8 3.6 3.6 1.8 -3.6 1.8 -1.8 3.6 -1.8 -3.6 -3.6 -1.8 3.6 -1.8 Z" fill="#FFD43B" />
        <path className="p-spark" style={{ animationDelay: "1.2s" }} d="M102 22 l 1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5 Z" fill="#FFD43B" />

        {/* ---- しっぽ（体の後ろ・ふりふり） ---- */}
        {hasTail && (
          <g className="p-tail" style={dTail}>
            {a === "cow" ? (
              <g>
                <path d="M97 88 Q 112 84 110 68" stroke={OUTLINE} strokeWidth="7" fill="none" strokeLinecap="round" />
                <path d="M97 88 Q 112 84 110 68" stroke={p.body} strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="110" cy="66" r="4.5" fill={darkPatch} stroke={OUTLINE} strokeWidth="2" />
              </g>
            ) : a === "monkey" || a === "lion" ? (
              <g>
                <path d="M96 90 Q 115 86 112 64" stroke={OUTLINE} strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M96 90 Q 115 86 112 64" stroke={p.body} strokeWidth="4.5" fill="none" strokeLinecap="round" />
                {a === "lion" && <circle cx="112" cy="62" r="5" fill={p.dark} stroke={OUTLINE} strokeWidth="2" />}
              </g>
            ) : (
              <g>
                <path d="M95 92 Q 117 88 111 62 Q 108 52 100 56" stroke={OUTLINE} strokeWidth="11" fill="none" strokeLinecap="round" />
                <path d="M95 92 Q 117 88 111 62 Q 108 52 100 56" stroke={p.body} strokeWidth="7" fill="none" strokeLinecap="round" />
                <path d="M111 62 Q 108 52 100 56" stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
              </g>
            )}
          </g>
        )}
        {a === "rabbit" && <circle cx="97" cy="92" r="7" fill={CREAM} stroke={OUTLINE} strokeWidth="2.5" />}

        {/* ---- 頭のうしろに出るパーツ ---- */}
        {a === "lion" && (
          <g>
            <circle cx="60" cy="40" r="38" fill={p.dark} stroke={OUTLINE} strokeWidth="2.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <circle key={deg} cx="60" cy="40" r="7" fill={p.dark} stroke={OUTLINE} strokeWidth="2" transform={`rotate(${deg} 60 40) translate(0 -36)`} />
            ))}
          </g>
        )}
        {a === "cat" && (
          <>
            <g className="p-ear-l" style={dEar}>
              <path d="M34 28 L 39 5 L 55 18 Z" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M38 22 L 41 10 L 50 17 Z" fill={BLUSH} />
            </g>
            <g className="p-ear-r" style={dEar}>
              <path d="M86 28 L 81 5 L 65 18 Z" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M82 22 L 79 10 L 70 17 Z" fill={BLUSH} />
            </g>
          </>
        )}
        {a === "fox" && (
          <>
            <g className="p-ear-l" style={dEar}>
              <path d="M32 30 L 37 0 L 56 16 Z" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M37 22 L 40 8 L 50 16 Z" fill={CREAM} />
            </g>
            <g className="p-ear-r" style={dEar}>
              <path d="M88 30 L 83 0 L 64 16 Z" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M83 22 L 80 8 L 70 16 Z" fill={CREAM} />
            </g>
          </>
        )}
        {a === "rabbit" && (
          <>
            <g className="p-ear-l" style={dEar}>
              <ellipse cx="45" cy="8" rx="7.5" ry="17" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" transform="rotate(-12 45 8)" />
              <ellipse cx="45" cy="9" rx="3.5" ry="11" fill={BLUSH} transform="rotate(-12 45 9)" />
            </g>
            <g className="p-ear-r" style={dEar}>
              <ellipse cx="75" cy="8" rx="7.5" ry="17" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" transform="rotate(12 75 8)" />
              <ellipse cx="75" cy="9" rx="3.5" ry="11" fill={BLUSH} transform="rotate(12 75 9)" />
            </g>
          </>
        )}
        {(a === "bear" || a === "panda" || a === "tanuki") && (
          <>
            <g className="p-ear-l" style={dEar}>
              <circle cx="36" cy="17" r="10" fill={a === "bear" ? p.body : darkPatch} stroke={OUTLINE} strokeWidth="2.5" />
              {a === "bear" && <circle cx="36" cy="17" r="4.5" fill={CREAM} />}
            </g>
            <g className="p-ear-r" style={dEar}>
              <circle cx="84" cy="17" r="10" fill={a === "bear" ? p.body : darkPatch} stroke={OUTLINE} strokeWidth="2.5" />
              {a === "bear" && <circle cx="84" cy="17" r="4.5" fill={CREAM} />}
            </g>
          </>
        )}
        {a === "cow" && (
          <g stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round">
            <path d="M40 14 C 34 4 44 2 48 10 L 46 16 Z" fill="#FFE08A" />
            <path d="M80 14 C 86 4 76 2 72 10 L 74 16 Z" fill="#FFE08A" />
            <g className="p-ear-l" style={dEar}>
              <ellipse cx="29" cy="28" rx="9" ry="5.5" fill={p.body} transform="rotate(-25 29 28)" />
            </g>
            <g className="p-ear-r" style={dEar}>
              <ellipse cx="91" cy="28" rx="9" ry="5.5" fill={p.body} transform="rotate(25 91 28)" />
            </g>
          </g>
        )}
        {a === "bird" && (
          <g stroke={OUTLINE} strokeWidth="2" strokeLinecap="round">
            <path d="M56 12 Q 54 4 48 2" fill="none" />
            <path d="M60 11 Q 60 2 60 0" fill="none" />
            <path d="M64 12 Q 66 4 72 2" fill="none" />
          </g>
        )}

        {/* ---- 体（グラデ＋足） ---- */}
        <ellipse cx="46" cy="105" rx="9" ry="6" fill={p.dark} stroke={OUTLINE} strokeWidth="2.5" />
        <ellipse cx="74" cy="105" rx="9" ry="6" fill={p.dark} stroke={OUTLINE} strokeWidth="2.5" />
        <path d={BODIES[cfg.shape]} fill={`url(#${gid})`} stroke={OUTLINE} strokeWidth="3" />

        {/* ---- 腕（左右で逆位相にふりふり） ---- */}
        <g className="p-arm-l" style={dArm}>
          <ellipse cx="22" cy="70" rx="7" ry="10" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" transform="rotate(24 22 70)" />
        </g>
        <g className="p-arm-r" style={dArm}>
          <ellipse cx="98" cy="70" rx="7" ry="10" fill={p.body} stroke={OUTLINE} strokeWidth="2.5" transform="rotate(-24 98 70)" />
        </g>

        {/* たれ耳（体の上に重ねる） */}
        {a === "dog" && (
          <>
            <g className="p-ear-l" style={dEar}>
              <ellipse cx="31" cy="34" rx="8.5" ry="15" fill={p.dark} stroke={OUTLINE} strokeWidth="2.5" transform="rotate(18 31 34)" />
              <ellipse cx="32" cy="37" rx="4" ry="9" fill={p.body} opacity="0.5" transform="rotate(18 32 37)" />
            </g>
            <g className="p-ear-r" style={dEar}>
              <ellipse cx="89" cy="34" rx="8.5" ry="15" fill={p.dark} stroke={OUTLINE} strokeWidth="2.5" transform="rotate(-18 89 34)" />
              <ellipse cx="88" cy="37" rx="4" ry="9" fill={p.body} opacity="0.5" transform="rotate(-18 88 37)" />
            </g>
          </>
        )}
        {a === "monkey" && (
          <g stroke={OUTLINE} strokeWidth="2.5">
            <g className="p-ear-l" style={dEar}>
              <circle cx="27" cy="50" r="7.5" fill={p.body} />
              <circle cx="27" cy="50" r="3.5" fill={CREAM} stroke="none" />
            </g>
            <g className="p-ear-r" style={dEar}>
              <circle cx="93" cy="50" r="7.5" fill={p.body} />
              <circle cx="93" cy="50" r="3.5" fill={CREAM} stroke="none" />
            </g>
          </g>
        )}

        {/* ---- 顔 ---- */}
        <ellipse cx="60" cy="64" rx="30" ry="32" fill={CREAM} />
        {/* 頭のツヤ */}
        <ellipse cx="45" cy="21" rx="12" ry="5.5" fill="#fff" opacity="0.4" transform="rotate(-16 45 21)" />
        {/* ほっぺ（照れ明滅＋ツヤ線） */}
        <g className="p-blush">
          {blushStyle === 2 ? (
            <g stroke={BLUSH} strokeWidth="2.2" strokeLinecap="round">
              <path d="M33.5 67.5 l -3 5 M38 67.5 l -3 5 M42.5 67.5 l -3 5" />
              <path d="M81.5 67.5 l 3 5 M86 67.5 l 3 5 M77 67.5 l 3 5" />
            </g>
          ) : (
            <>
              <ellipse cx="39" cy="70.5" rx={blushStyle === 1 ? 6 : 7} ry={blushStyle === 1 ? 5.4 : 4.6} fill={BLUSH} opacity={blushStyle === 1 ? 0.75 : 1} />
              <ellipse cx="81" cy="70.5" rx={blushStyle === 1 ? 6 : 7} ry={blushStyle === 1 ? 5.4 : 4.6} fill={BLUSH} opacity={blushStyle === 1 ? 0.75 : 1} />
              {blushStyle === 0 && (
                <>
                  <path d="M35.5 70 l 2.4 -1.6 M39.5 72.3 l 2.4 -1.6" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
                  <path d="M77.5 70 l 2.4 -1.6 M81.5 72.3 l 2.4 -1.6" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
                </>
              )}
            </>
          )}
        </g>

        {/* パンダ・たぬきの目のまわり */}
        {(a === "panda" || a === "tanuki") && (
          <g fill={darkPatch}>
            <ellipse cx="46.5" cy="58" rx="10.5" ry="13" transform="rotate(-12 46.5 58)" />
            <ellipse cx="73.5" cy="58" rx="10.5" ry="13" transform="rotate(12 73.5 58)" />
            <ellipse cx="46.5" cy="58.5" rx="8.2" ry="10" fill="#fff" />
            <ellipse cx="73.5" cy="58.5" rx="8.2" ry="10" fill="#fff" />
          </g>
        )}

        {cfg.brows && (
          <>
            <path d="M39 47 L 53 50" stroke={OUTLINE} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M81 47 L 67 50" stroke={OUTLINE} strokeWidth="4.5" strokeLinecap="round" />
          </>
        )}

        {/* 目（特大グロス目・まばたき） */}
        <g className="av-eyes" style={dEyes}>
          {eyeStyle === 1 ? (
            <>
              {/* にっこり閉じ目 */}
              <path d="M40 60 Q 46.5 51 53 60" stroke={OUTLINE} strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <path d="M67 60 Q 73.5 51 80 60" stroke={OUTLINE} strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <path d="M38.5 58.5 l -2.6 -1.4 M81.5 58.5 l 2.6 -1.4" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* 左目（ウインクは常に開き目） */}
              <g transform={eyeStyle === 3 ? "rotate(-8 46.5 58.5)" : undefined}>
                <ellipse cx="46.5" cy="58.5" rx="7" ry="8.4" fill="#241C20" />
                <ellipse cx="46.5" cy="62.8" rx="4.5" ry="2.9" fill={p.body} opacity="0.55" />
                {eyeStyle === 5 ? (
                  <path d="M48.6 51.8 l 1.1 2.3 2.3 1.1 -2.3 1.1 -1.1 2.3 -1.1 -2.3 -2.3 -1.1 2.3 -1.1 Z" fill="#fff" />
                ) : (
                  <>
                    <circle cx="49.4" cy={eyeStyle === 3 ? 57.2 : 55} r="2.9" fill="#fff" />
                    <circle cx="43.6" cy="61.3" r="1.4" fill="#fff" opacity="0.95" />
                  </>
                )}
                {eyeStyle === 4 && (
                  <>
                    <rect x="39.2" y="49.6" width="14.6" height="5.8" fill={CREAM} />
                    <path d="M39.5 55.4 h 14" stroke={OUTLINE} strokeWidth="2.4" strokeLinecap="round" />
                  </>
                )}
              </g>
              {/* 右目（ウインクは閉じアーチ） */}
              {eyeStyle === 6 ? (
                <path d="M67 59 Q 73.5 52 80 59" stroke={OUTLINE} strokeWidth="3.6" fill="none" strokeLinecap="round" />
              ) : (
                <g transform={eyeStyle === 3 ? "rotate(8 73.5 58.5)" : undefined}>
                  <ellipse cx="73.5" cy="58.5" rx="7" ry="8.4" fill="#241C20" />
                  <ellipse cx="73.5" cy="62.8" rx="4.5" ry="2.9" fill={p.body} opacity="0.55" />
                  {eyeStyle === 5 ? (
                    <path d="M75.6 51.8 l 1.1 2.3 2.3 1.1 -2.3 1.1 -1.1 2.3 -1.1 -2.3 -2.3 -1.1 2.3 -1.1 Z" fill="#fff" />
                  ) : (
                    <>
                      <circle cx="76.4" cy={eyeStyle === 3 ? 57.2 : 55} r="2.9" fill="#fff" />
                      <circle cx="70.6" cy="61.3" r="1.4" fill="#fff" opacity="0.95" />
                    </>
                  )}
                  {eyeStyle === 4 && (
                    <>
                      <rect x="66.2" y="49.6" width="14.6" height="5.8" fill={CREAM} />
                      <path d="M66.5 55.4 h 14" stroke={OUTLINE} strokeWidth="2.4" strokeLinecap="round" />
                    </>
                  )}
                </g>
              )}
              {eyeStyle === 2 && (
                <>
                  <path d="M39.5 48.5 L 52.5 51" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
                  <path d="M80.5 48.5 L 67.5 51" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
                </>
              )}
            </>
          )}
        </g>

        {cfg.glasses && (
          <g stroke={OUTLINE} strokeWidth="2.8" fill="none">
            <circle cx="47" cy="58" r="9.5" fill="rgba(255,255,255,0.35)" />
            <circle cx="73" cy="58" r="9.5" fill="rgba(255,255,255,0.35)" />
            <path d="M56.5 58 L 63.5 58" />
          </g>
        )}

        {/* ---- 鼻・マズル（モチーフの動物らしさの決め手） ---- */}
        {(a === "dog" || a === "bear" || a === "lion" || a === "panda" || a === "tanuki") && (
          <>
            <ellipse cx="60" cy="74" rx="11.5" ry="8" fill="#FFFDF6" opacity="0.95" />
            <path d="M55.5 68.5 h 9 q 1.4 0 0.8 1.4 l -4 4.4 q -1.3 1.4 -2.6 0 l -4 -4.4 q -0.6 -1.4 0.8 -1.4 Z" fill={OUTLINE} />
            <circle cx="58" cy="70" r="1.1" fill="#fff" opacity="0.7" />
          </>
        )}
        {a === "cat" && (
          <path d="M57.3 68.8 h 5.4 l -2.7 3.4 Z" fill="#FF8FA5" stroke={OUTLINE} strokeWidth="1.4" strokeLinejoin="round" />
        )}
        {a === "fox" && <path d="M57.3 68.8 h 5.4 l -2.7 3.4 Z" fill={OUTLINE} />}
        {a === "rabbit" && (
          <path d="M57.5 69 h 5 l -2.5 3 Z" fill="#FF8FA5" stroke={OUTLINE} strokeWidth="1.3" strokeLinejoin="round" />
        )}
        {a === "monkey" && (
          <>
            <circle cx="56.5" cy="70.5" r="1.3" fill={OUTLINE} />
            <circle cx="63.5" cy="70.5" r="1.3" fill={OUTLINE} />
          </>
        )}
        {a === "cow" && (
          <>
            <ellipse cx="60" cy="74.5" rx="13" ry="8.5" fill="#FFC9D4" stroke={OUTLINE} strokeWidth="2.2" />
            <ellipse cx="54.5" cy="72.5" rx="1.8" ry="2.4" fill={OUTLINE} />
            <ellipse cx="65.5" cy="72.5" rx="1.8" ry="2.4" fill={OUTLINE} />
          </>
        )}

        {/* 口（鳥はくちばし・口パク） */}
        <g className="av-mouth" style={dMouth}>
          {a === "bird" ? (
            <path d="M53 69 L 67 69 L 60 78 Z" fill="#F5A32B" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
          ) : a === "dog" || a === "bear" || a === "lion" || a === "panda" || a === "tanuki" || a === "cat" ? (
            <>
              {/* 動物口: ω / あんぐり舌 / ω舌ぺろ（人中つき） */}
              <path d="M60 72.6 v 2.2" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
              {muzzleMouth === 1 ? (
                <>
                  <path d="M53 74.8 Q 60 82.5 67 74.8 Z" fill={OUTLINE} />
                  <path d="M56.5 78.2 Q 60 81 63.5 78.2 L 63 79.6 Q 60 82 57 79.6 Z" fill="#FF7B92" />
                </>
              ) : (
                <>
                  <path d="M52.5 74.6 q 3.7 4.4 7.5 0.4 q 3.8 4 7.5 -0.4" stroke={OUTLINE} strokeWidth="3" fill="none" strokeLinecap="round" />
                  {muzzleMouth === 2 && (
                    <ellipse cx="63" cy="79.2" rx="2.8" ry="3.2" fill="#FF7B92" stroke={OUTLINE} strokeWidth="1.4" />
                  )}
                </>
              )}
            </>
          ) : a === "rabbit" ? (
            <>
              <path d="M55 72.5 q 5 4 10 0" stroke={OUTLINE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <rect x="56.5" y="74" width="7" height="5.5" rx="1.5" fill="#fff" stroke={OUTLINE} strokeWidth="1.6" />
              <path d="M60 74 v 5.5" stroke={OUTLINE} strokeWidth="1.2" />
            </>
          ) : a === "cow" ? (
            <path d="M55 78.5 q 5 3.5 10 0" stroke={OUTLINE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          ) : (
            <>
              {mouthStyle === 0 && (
                <path d="M51 72 Q 60 81 69 72" stroke={OUTLINE} strokeWidth="3.2" fill="none" strokeLinecap="round" />
              )}
              {mouthStyle === 1 && (
                <g>
                  <ellipse cx="60" cy="76" rx="5.5" ry="6.5" fill={OUTLINE} />
                  <ellipse cx="60" cy="79" rx="3" ry="3" fill="#FF7B92" />
                </g>
              )}
              {mouthStyle === 2 && (
                <path d="M51 74 Q 55.5 79 60 74 Q 64.5 79 69 74" stroke={OUTLINE} strokeWidth="3.2" fill="none" strokeLinecap="round" />
              )}
              {mouthStyle === 3 && (
                <>
                  <path d="M51 72 Q 60 80 69 72" stroke={OUTLINE} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  <ellipse cx="64.5" cy="77.5" rx="3" ry="3.6" fill="#FF7B92" stroke={OUTLINE} strokeWidth="1.5" />
                </>
              )}
              {mouthStyle === 4 && <circle cx="60" cy="75" r="2.7" fill={OUTLINE} />}
              {mouthStyle === 5 && (
                <>
                  <path d="M50.5 72 Q 60 84 69.5 72 Z" fill={OUTLINE} />
                  <path d="M53.5 72.8 h 13 v 2.6 q -6.5 1.8 -13 0 Z" fill="#fff" />
                  <path d="M56 79.5 Q 60 82.5 64 79.5 L 63.4 80.8 Q 60 83.2 56.6 80.8 Z" fill="#FF7B92" />
                </>
              )}
            </>
          )}
        </g>

        {/* ひげ（猫・狐） */}
        {(a === "cat" || a === "fox") && (
          <g stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round">
            <path d="M22 62 L 34 64" />
            <path d="M22 70 L 34 69" />
            <path d="M98 62 L 86 64" />
            <path d="M98 70 L 86 69" />
          </g>
        )}
        {/* たぬきの頭の葉っぱ */}
        {a === "tanuki" && (
          <g className="p-ear-l" style={dEar}>
            <path d="M60 20 L 60 12" stroke="#5B8C3E" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="60" cy="9" rx="8" ry="5" fill="#6FA84C" stroke={OUTLINE} strokeWidth="1.8" />
          </g>
        )}

        {/* ---------- かぶりもの ---------- */}
        {cfg.hat === "shachi" && (
          <g strokeLinejoin="round">
            {/* 金のしゃちほこ: 頭上で弧を描き、尾びれが高く跳ね上がる */}
            <path d="M76 20 C 82 8 94 4 100 10 C 92 10 88 14 88 20 C 92 20 96 24 94 28 C 86 26 78 28 76 20 Z" fill="#FFD43B" stroke={OUTLINE} strokeWidth="2.2" />
            <path d="M34 30 C 36 14 62 8 78 18 L 76 20 C 78 28 70 32 62 30 C 52 27 42 27 34 30 Z" fill="#FFD43B" stroke={OUTLINE} strokeWidth="2.2" />
            {/* 背びれ・うろこ・顔 */}
            <path d="M50 13 l 3 -6 3 6 Z M59 11 l 3 -6 3 6 Z" fill="#FFA94D" stroke={OUTLINE} strokeWidth="1.6" />
            <path d="M46 23 q 3 -4 6 0 M54 20.5 q 3 -4 6 0 M62 20.5 q 3 -4 6 0" stroke="#E8590C" strokeWidth="1.4" fill="none" />
            <circle cx="40" cy="25" r="1.8" fill={OUTLINE} />
            <path d="M34 30 l -4.5 2.5 4 2.5" fill="#FFD43B" stroke={OUTLINE} strokeWidth="2" />
          </g>
        )}
        {cfg.hat === "hachimaki" && (
          <g stroke={OUTLINE} strokeWidth="2">
            <path d="M28 34 C 40 26 80 26 92 34 L 92 42 C 78 34 42 34 28 42 Z" fill={p.dark} />
            <circle cx="94" cy="38" r="4" fill={p.dark} />
            <path d="M96 40 l 8 8 M98 36 l 10 3" stroke={p.dark} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
        {cfg.hat === "beanie" && (
          <g stroke={OUTLINE} strokeWidth="2">
            <path d="M28 38 C 30 16 90 16 92 38 L 92 44 C 76 36 44 36 28 44 Z" fill={p.dark} />
            <circle cx="60" cy="15" r="7" fill={CREAM} />
          </g>
        )}
        {cfg.hat === "flower" && (
          <g className="p-ear-r" style={dEar} stroke={OUTLINE} strokeWidth="1.5">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="84" cy="28" rx="7" ry="4" fill="#FF5C8A" transform={`rotate(${deg} 84 28)`} />
            ))}
            <circle cx="84" cy="28" r="4" fill="#FFD43B" />
          </g>
        )}
        {cfg.hat === "strawhat" && (
          <g stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round">
            <ellipse cx="60" cy="32" rx="40" ry="9" fill="#F5D76E" />
            <path d="M36 30 C 36 12 84 12 84 30 C 76 26 44 26 36 30 Z" fill="#F5D76E" />
            <path d="M38 26 C 52 21 68 21 82 26 L 82 31 C 68 26 52 26 38 31 Z" fill="#FF4D6D" stroke="none" />
          </g>
        )}
        {cfg.hat === "towel" && (
          <g>
            <rect x="38" y="18" width="44" height="12" rx="4" fill="#fff" stroke={OUTLINE} strokeWidth="2" />
            <path d="M44 22 h 32 M44 26 h 32" stroke="#B9CBD6" strokeWidth="1.5" />
          </g>
        )}
        {cfg.hat === "mage" && (
          <g stroke={OUTLINE} strokeWidth="2">
            <path d="M34 34 C 44 26 76 26 86 34 L 86 40 C 74 33 46 33 34 40 Z" fill="#372A4D" />
            <rect x="52" y="12" width="16" height="10" rx="5" fill="#372A4D" transform="rotate(-12 60 17)" />
          </g>
        )}
        {cfg.hat === "ribbon" && (
          <g className="p-ear-r" style={dEar} stroke={OUTLINE} strokeWidth="1.8" strokeLinejoin="round">
            <path d="M82 26 L 69 18 L 71 32 Z" fill="#FF5C8A" />
            <path d="M82 26 L 95 18 L 93 32 Z" fill="#FF5C8A" />
            <circle cx="82" cy="26" r="4" fill="#E6395C" />
          </g>
        )}
        {cfg.hat === "leafband" && (
          <g stroke={OUTLINE} strokeWidth="2">
            <path d="M28 34 C 40 26 80 26 92 34 L 92 42 C 78 34 42 34 28 42 Z" fill="#4B3BC4" />
            <rect x="50" y="29" width="20" height="9" rx="2" fill="#E3E8FF" />
            <path d="M56 33 q 4 -5 8 0 q -4 4 -8 0" fill="#4B3BC4" stroke="none" />
          </g>
        )}
        {cfg.hat === "beret" && (
          <g stroke={OUTLINE} strokeWidth="2.2">
            <path d="M30 34 C 28 16 92 12 90 32 C 74 24 44 26 30 34 Z" fill={p.dark} />
            <circle cx="62" cy="14" r="3" fill={p.dark} />
          </g>
        )}
        {cfg.hat === "sprout" && (
          <g className="p-ear-l" style={dEar} stroke={OUTLINE} strokeWidth="1.8">
            <path d="M60 24 L 60 15" stroke="#5B8C3E" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 16 q -10 -8 -14 1 q 8 5 14 -1" fill="#6FA84C" />
            <path d="M60 16 q 10 -8 14 1 q -8 5 -14 -1" fill="#8BC34A" />
          </g>
        )}

        {/* ---------- 持ち物（ゆらゆら動く） ---------- */}
        <g className="av-item" style={dItem}>
          {cfg.item === "mic" && (
            <g>
              <rect x="100" y="66" width="6" height="18" rx="3" fill="#4A4A4A" stroke={OUTLINE} strokeWidth="1.5" transform="rotate(18 103 75)" />
              <circle cx="106" cy="62" r="7" fill="#8A8A8A" stroke={OUTLINE} strokeWidth="2" />
            </g>
          )}
          {cfg.item === "fan" && (
            <g>
              <path d="M100 78 L 92 58 A 18 18 0 0 1 112 62 Z" fill="#FFF3E0" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
              <path d="M100 78 L 96 60 M100 78 L 104 61" stroke={OUTLINE} strokeWidth="1" />
              <circle cx="100" cy="65" r="3" fill="#FF4D6D" />
            </g>
          )}
          {cfg.item === "cherry" && (
            <g>
              <path d="M102 60 q 3 8 -1 13 M104 60 q 6 6 6 12" stroke="#5B8C3E" strokeWidth="2" fill="none" />
              <circle cx="101" cy="76" r="5" fill="#FF4D6D" stroke={OUTLINE} strokeWidth="1.8" />
              <circle cx="110" cy="74" r="5" fill="#E6395C" stroke={OUTLINE} strokeWidth="1.8" />
            </g>
          )}
          {cfg.item === "onigiri" && (
            <g>
              <path d="M104 60 L 114 76 L 94 76 Z" fill="#fff" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
              <rect x="100" y="70" width="8" height="6" fill="#2E4636" />
            </g>
          )}
          {cfg.item === "teacup" && (
            <g stroke={OUTLINE} strokeWidth="1.8">
              <path d="M96 66 h 18 v 7 a 9 7 0 0 1 -18 0 Z" fill="#3BC9DB" />
              <ellipse cx="105" cy="66" rx="9" ry="3" fill="#8AE3EE" />
              <path d="M101 60 q 1 -4 0 -6 M108 60 q 1 -4 0 -6" stroke="#B9CBD6" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}
          {cfg.item === "peach" && (
            <g>
              <circle cx="104" cy="70" r="8" fill="#FFB8D4" stroke={OUTLINE} strokeWidth="2" />
              <path d="M104 62 Q 104 58 108 56" stroke="#5B8C3E" strokeWidth="2" fill="none" />
              <path d="M104 63 Q 100 70 104 78" stroke="#FF87B7" strokeWidth="1.5" fill="none" />
            </g>
          )}
          {cfg.item === "mikan" && (
            <g>
              <circle cx="104" cy="71" r="7.5" fill="#FFA94D" stroke={OUTLINE} strokeWidth="2" />
              <ellipse cx="104" cy="63" rx="4" ry="2" fill="#5B8C3E" stroke={OUTLINE} strokeWidth="1.2" />
            </g>
          )}
          {cfg.item === "fish" && (
            <g stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round">
              <ellipse cx="103" cy="70" rx="10" ry="5.5" fill="#8AE3EE" />
              <path d="M112 70 L 118 65 L 118 75 Z" fill="#8AE3EE" />
              <circle cx="97" cy="68.5" r="1.5" fill={OUTLINE} stroke="none" />
            </g>
          )}
          {cfg.item === "mallet" && (
            <g stroke={OUTLINE} strokeWidth="1.8">
              <rect x="102" y="58" width="4" height="20" rx="2" fill="#A86038" transform="rotate(14 104 68)" />
              <rect x="94" y="54" width="18" height="9" rx="3" fill="#C97B4A" transform="rotate(14 103 58)" />
            </g>
          )}
          {cfg.item === "star" && (
            <path
              d="M105 58 l 2.6 5.6 6.1 0.7 -4.5 4.2 1.2 6 -5.4 -3 -5.4 3 1.2 -6 -4.5 -4.2 6.1 -0.7 Z"
              fill="#FFD43B"
              stroke={OUTLINE}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
          {cfg.item === "fugu" && (
            <g>
              <circle cx="104" cy="70" r="8" fill="#B9CBD6" stroke={OUTLINE} strokeWidth="2" />
              <circle cx="101" cy="68" r="1.5" fill={OUTLINE} />
              <path d="M104 62 l 1 -4 M110 65 l 3 -3 M112 71 l 4 0 M110 76 l 3 3" stroke={OUTLINE} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M99 74 q 3 2 6 0" stroke={OUTLINE} strokeWidth="1.2" fill="none" />
            </g>
          )}
          {cfg.item === "bachi" && (
            <g strokeLinecap="round">
              <path d="M100 78 L 110 60" stroke={OUTLINE} strokeWidth="6" />
              <path d="M106 80 L 118 66" stroke={OUTLINE} strokeWidth="6" />
              <path d="M100 78 L 110 60" stroke="#C97B4A" strokeWidth="3.5" />
              <path d="M106 80 L 118 66" stroke="#C97B4A" strokeWidth="3.5" />
            </g>
          )}
          {cfg.item === "kiritanpo" && (
            <g stroke={OUTLINE} strokeWidth="1.8">
              <rect x="102" y="52" width="5" height="26" rx="2" fill="#A86038" transform="rotate(10 104 65)" />
              <ellipse cx="106" cy="58" rx="5" ry="9" fill="#FFE08A" transform="rotate(10 106 58)" />
            </g>
          )}
          {cfg.item === "apple" && (
            <g>
              <circle cx="104" cy="71" r="7.5" fill="#FF6B6B" stroke={OUTLINE} strokeWidth="2" />
              <path d="M104 64 Q 104 59 108 57" stroke="#5F4128" strokeWidth="2" fill="none" />
              <ellipse cx="108" cy="60" rx="3.5" ry="2" fill="#6FA84C" stroke={OUTLINE} strokeWidth="1.2" />
            </g>
          )}
        </g>
        </g>
      </svg>
    </span>
  );
}
