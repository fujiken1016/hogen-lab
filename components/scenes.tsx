// キャラカードのご当地背景 v2 — 全37種（35方言＋シークレット2体）を1枚ずつ固有の風景に。
// キャラ本体が中央を覆うため、ランドマークは「上部帯・左右コーナー・足元の地面帯」に配置。
// 彩度はキャラより一段抑えつつ、遠景→中景→地面の3層で描き込む。

type SkyCfg = [string, string];

// slug → 空のグラデーション（風景の時間帯・土地柄に合わせる）
const SKIES: Record<string, SkyCfg> = {
  hokkaido: ["#BFE0F7", "#F0F9FF"],
  tsugaru: ["#CCE7F5", "#FFF6E6"],
  akita: ["#C4D9EE", "#EEF6FF"],
  iwate: ["#CFE9F5", "#FFF8EC"],
  sendai: ["#CBEAD8", "#FDFFEF"],
  yamagata: ["#D6EFD2", "#FFFBE2"],
  fukushima: ["#CBE4F7", "#FFF2E5"],
  ibaraki: ["#FFDDC4", "#FFF4E0"], // 神磯の日の出
  niigata: ["#FFE9B8", "#FFFBE6"],
  toyama: ["#C8DEF5", "#EFF8FF"],
  kanazawa: ["#DFE9F0", "#FBF7EE"], // 雪化粧の兼六園
  shinshu: ["#C9E6FA", "#F0FBF2"],
  shizuoka: ["#C4E4FA", "#EDFAF0"],
  nagoya: ["#F7E7C4", "#FFF9E8"],
  hida: ["#D3E7F5", "#F8FBF1"],
  ise: ["#FFD9B8", "#FFF2DC"], // 夫婦岩の朝焼け
  kyoto: ["#FFDFD2", "#FFF4E6"], // 夕暮れの東山
  kansai: ["#FFE7C9", "#FFF8E8"],
  kobe: ["#F7D9C8", "#F0F4FA"], // 港の夕方
  wakayama: ["#D5EFDC", "#FFF9E5"],
  tottori: ["#FFE3B3", "#FFF6DE"],
  izumo: ["#E2DFF2", "#F8F5FF"], // 神在月の空
  okayama: ["#FFE8D6", "#FFF9EC"],
  hiroshima: ["#CBE9F3", "#F0FBFF"],
  yamaguchi: ["#D2ECF7", "#F4FCFF"],
  sanuki: ["#FDEECC", "#FFFBEA"],
  awa: ["#C6E7F2", "#EDFAFF"],
  iyo: ["#FFE9C9", "#F2FAEA"],
  tosa: ["#BEE3F2", "#EAF9FF"],
  hakata: ["#39355F", "#6C5CE7"], // 中洲の夜
  oita: ["#F7DFD3", "#FDF4EC"],
  kumamoto: ["#D6ECD9", "#FDF9E6"],
  nagasaki: ["#FFCDA8", "#FFEBD9"], // 稲佐山の夕景
  kagoshima: ["#FFDAC2", "#FFF0DE"],
  okinawa: ["#BFF0EC", "#F0FFFA"],
  ryujin: ["#3A2A5E", "#8A6BAF"], // 天界
  zashiki: ["#4A3A35", "#8A6E52"], // 行灯の灯る座敷
};

/* ---------- 小物ヘルパー ---------- */
const ROCK = "#8B8FA0";

function Sun({ x, y, r = 7, c = "#FFD98A" }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <>
      <circle cx={x} cy={y} r={r + 4} fill={c} opacity="0.3" />
      <circle cx={x} cy={y} r={r} fill={c} opacity="0.95" />
    </>
  );
}

function Puff({ x, y, s = 1, o = 0.9 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g fill="#fff" opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="0" r="5" />
      <circle cx="6" cy="-2.5" r="6" />
      <circle cx="12" cy="0" r="5" />
      <rect x="-4" y="0" width="20" height="5" rx="2.5" />
    </g>
  );
}

function Birds({ x, y, c = "#8B99A8" }: { x: number; y: number; c?: string }) {
  return <path d={`M${x} ${y} q 4 -4 8 0 M${x + 12} ${y + 4} q 4 -4 8 0`} stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" />;
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 6 L 16 6 L 13 10 L 3 10 Z" fill="#B0704E" />
      <path d="M8 6 V -4 L 15 4 Z" fill="#fff" stroke="#C9CFD8" strokeWidth="0.8" />
    </g>
  );
}

function Fir({ x, y, s = 1, snow = false }: { x: number; y: number; s?: number; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -22 L 8 -10 L -8 -10 Z M0 -16 L 10 -2 L -10 -2 Z M0 -8 L 12 8 L -12 8 Z" fill="#5E8C5B" />
      {snow && <path d="M0 -22 L 4 -16 L -4 -16 Z" fill="#fff" />}
      <rect x="-2" y="8" width="4" height="6" rx="1.5" fill="#8A6B4C" />
    </g>
  );
}

/* ---------- slugごとの固有シーン ---------- */
function Art({ slug }: { slug: string }) {
  switch (slug) {
    case "hokkaido": // 大雪山と雪原・雪だるま・モミの木
      return (
        <>
          <path d="M-6 44 L 14 20 L 26 34 L 38 22 L 56 44 Z" fill="#A9C6E4" />
          <path d="M9 26 L 14 20 L 19 26 Q 14 29 9 26 Z M33 28 L 38 22 L 43 28 Q 38 31 33 28 Z" fill="#fff" />
          <g fill="#fff" opacity="0.95">
            <circle cx="98" cy="14" r="2" /><circle cx="110" cy="26" r="1.6" /><circle cx="90" cy="34" r="1.5" /><circle cx="12" cy="56" r="1.6" />
          </g>
          <path d="M3 98 Q 30 90 60 98 Q 90 105 117 96 L 117 117 L 3 117 Z" fill="#fff" />
          <ellipse cx="15" cy="105" rx="6.5" ry="5.5" fill="#F4F9FF" stroke="#BFD4E8" strokeWidth="1.4" />
          <circle cx="15" cy="96.5" r="4.4" fill="#F4F9FF" stroke="#BFD4E8" strokeWidth="1.4" />
          <circle cx="13.6" cy="95.6" r="0.7" fill="#3B2B45" /><circle cx="16.6" cy="95.6" r="0.7" fill="#3B2B45" />
          <path d="M12 99 L 6 96" stroke="#8A6B4C" strokeWidth="1.4" />
          <Fir x={106} y={96} s={0.9} snow />
        </>
      );
    case "tsugaru": // 岩木山とりんご園
      return (
        <>
          <path d="M-8 46 L 20 16 L 48 46 Z" fill="#9FB8D6" />
          <path d="M14 22 L 20 16 L 26 22 Q 20 26 14 22 Z" fill="#fff" />
          <Puff x={90} y={16} s={0.8} />
          <path d="M3 99 Q 60 92 117 99 L 117 117 L 3 117 Z" fill="#BCDCA8" />
          <g>
            <circle cx="104" cy="88" r="10" fill="#95C77E" />
            <rect x="102" y="96" width="4" height="9" rx="2" fill="#8A6B4C" />
            <circle cx="99" cy="85" r="2.6" fill="#E5534B" /><circle cx="109" cy="89" r="2.6" fill="#E5534B" /><circle cx="105" cy="82" r="2.6" fill="#E5534B" />
          </g>
          <circle cx="14" cy="104" r="3" fill="#E5534B" /><circle cx="22" cy="108" r="2.4" fill="#E5534B" opacity="0.8" />
        </>
      );
    case "akita": // かまくらと雪
      return (
        <>
          <g fill="#fff" opacity="0.95">
            <circle cx="16" cy="16" r="2.2" /><circle cx="30" cy="30" r="1.6" /><circle cx="96" cy="20" r="2" /><circle cx="108" cy="36" r="1.6" /><circle cx="104" cy="10" r="1.5" />
          </g>
          <path d="M3 98 Q 30 91 60 98 Q 90 104 117 97 L 117 117 L 3 117 Z" fill="#fff" />
          <path d="M4 106 a 13 13 0 0 1 26 0 Z" fill="#F4F9FF" stroke="#BFD4E8" strokeWidth="1.6" />
          <path d="M11 106 a 6 7 0 0 1 12 0 Z" fill="#FFB35C" opacity="0.9" />
          <Fir x={108} y={98} s={0.85} snow />
        </>
      );
    case "iwate": // 岩手山と牧場の柵
      return (
        <>
          <path d="M-10 46 Q 18 14 46 46 Z" fill="#A9BFD8" />
          <path d="M13 30 Q 18 24 23 30 Q 18 33 13 30 Z" fill="#fff" />
          <Birds x={94} y={18} />
          <Puff x={98} y={28} s={0.7} />
          <path d="M3 99 Q 60 92 117 99 L 117 117 L 3 117 Z" fill="#B9DCA6" />
          <g stroke="#8A6B4C" strokeWidth="2.2" strokeLinecap="round">
            <path d="M92 114 V 100 M104 115 V 101 M116 114 V 100" />
            <path d="M88 104 L 117 102 M88 110 L 117 108" />
          </g>
        </>
      );
    case "sendai": // 七夕飾りと杜の都
      return (
        <>
          <g>
            <circle cx="14" cy="12" r="5" fill="#FF87B7" />
            <path d="M10 16 q -1 14 1 24 M14 17 q 0 15 0 26 M18 16 q 1 14 -1 24" stroke="#FFB8D4" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </g>
          <g>
            <circle cx="106" cy="14" r="5" fill="#8AE3EE" />
            <path d="M102 18 q -1 13 1 22 M106 19 q 0 14 0 24 M110 18 q 1 13 -1 22" stroke="#B7EEF5" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </g>
          <path d="M3 99 Q 60 92 117 99 L 117 117 L 3 117 Z" fill="#A8D6A0" />
          <circle cx="14" cy="96" r="7" fill="#7FB877" /><circle cx="26" cy="99" r="5.5" fill="#95C78B" /><circle cx="104" cy="97" r="6.5" fill="#7FB877" />
        </>
      );
    case "yamagata": // さくらんぼと蔵王
      return (
        <>
          <path d="M78 42 L 100 20 L 122 42 Z" fill="#AFC6DC" />
          <path d="M95 25 L 100 20 L 105 25 Q 100 28 95 25 Z" fill="#fff" />
          <g>
            <circle cx="16" cy="26" r="11" fill="#95C77E" />
            <rect x="14" y="34" width="4" height="10" rx="2" fill="#8A6B4C" />
            <path d="M12 24 q 0 -6 3 -8 M20 26 q 0 -5 -2 -8" stroke="#5E8C5B" strokeWidth="1.4" fill="none" />
            <circle cx="11" cy="27" r="2.8" fill="#E5304E" /><circle cx="20" cy="29" r="2.8" fill="#C2255C" />
          </g>
          <path d="M3 99 Q 60 92 117 99 L 117 117 L 3 117 Z" fill="#BCDCA8" />
          <circle cx="106" cy="104" r="3" fill="#E5304E" /><circle cx="112" cy="108" r="2.4" fill="#C2255C" opacity="0.85" />
        </>
      );
    case "fukushima": // 磐梯山と猪苗代湖の白鳥
      return (
        <>
          <path d="M-8 46 L 18 18 L 30 30 L 40 24 L 58 46 Z" fill="#9FB8D6" />
          <Puff x={92} y={14} s={0.8} />
          <path d="M3 98 Q 60 92 117 98 L 117 117 L 3 117 Z" fill="#A5D4E8" />
          <path d="M10 104 q 4 -2 8 0 M96 107 q 4 -2 8 0" stroke="#fff" strokeWidth="1.8" fill="none" opacity="0.8" />
          <g transform="translate(100 96)">
            <path d="M0 4 Q 4 6 8 4 L 7 7 Q 4 8.5 1 7 Z" fill="#fff" />
            <path d="M7 4 Q 10 1 8 -3 Q 11 -2 11 1" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="10" cy="-2.6" r="1.6" fill="#fff" /><path d="M11.5 -2.6 l 2.4 0.8 -2.4 0.8 Z" fill="#F5A32B" />
          </g>
        </>
      );
    case "ibaraki": // 神磯の鳥居と日の出
      return (
        <>
          <Sun x={60} y={14} r={8} c="#FF9D6E" />
          <path d="M40 14 h 40 M36 22 h 48" stroke="#FFC9A3" strokeWidth="1.6" opacity="0.7" />
          <Birds x={90} y={24} />
          <path d="M3 98 Q 30 93 60 98 Q 90 103 117 97 L 117 117 L 3 117 Z" fill="#8FBFD4" />
          <g transform="translate(8 78)">
            <path d="M0 24 Q 4 14 10 12 Q 16 14 20 24 Z" fill={ROCK} />
            <g fill="#E5645C">
              <rect x="1" y="-2" width="18" height="3" rx="1.5" />
              <rect x="3" y="3" width="14" height="2.4" rx="1.2" />
              <rect x="4" y="3" width="2.6" height="11" />
              <rect x="13.4" y="3" width="2.6" height="11" />
              <rect x="9" y="-2" width="2.4" height="5" />
            </g>
          </g>
          <path d="M34 104 q 5 -3 10 0 M74 107 q 5 -3 10 0 M100 103 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" />
        </>
      );
    case "niigata": // 棚田とトキ
      return (
        <>
          <Sun x={20} y={14} r={7} c="#FFCD7A" />
          <g transform="translate(94 16)">
            <path d="M0 6 Q 8 -2 18 2 Q 12 4 8 8 Q 14 8 18 12 Q 8 12 0 6 Z" fill="#F5B8C4" />
            <circle cx="1" cy="5.4" r="1.8" fill="#fff" /><path d="M-0.6 5.2 l -4 1 3.6 1.4" stroke="#E5645C" strokeWidth="1.4" fill="none" />
          </g>
          <path d="M3 92 Q 60 86 117 92 L 117 117 L 3 117 Z" fill="#EFD98E" />
          <path d="M3 100 Q 60 95 117 100 M3 108 Q 60 104 117 108" stroke="#D9B856" strokeWidth="1.6" fill="none" />
          <g stroke="#B98F2E" strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M12 100 v -8 M12 92 q -3 -1 -4 -4 M12 92 q 3 -1 4 -4" />
            <path d="M108 102 v -8 M108 94 q -3 -1 -4 -4 M108 94 q 3 -1 4 -4" />
          </g>
        </>
      );
    case "toyama": // 立山連峰と雨晴海岸
      return (
        <>
          <path d="M-8 42 L 8 20 L 20 32 L 34 14 L 50 34 L 62 24 L 78 42 Z" fill="#9FB8D6" />
          <path d="M3 26 L 8 20 L 13 26 Q 8 29 3 26 Z M28 21 L 34 14 L 40 21 Q 34 25 28 21 Z M57 30 L 62 24 L 67 30 Q 62 33 57 30 Z" fill="#fff" />
          <path d="M3 99 Q 30 94 60 99 Q 90 104 117 98 L 117 117 L 3 117 Z" fill="#9CCBDD" />
          <g transform="translate(98 84)">
            <path d="M2 16 Q 4 6 9 4 Q 14 6 16 16 Z" fill={ROCK} />
            <path d="M9 4 L 9 -2 M9 -2 q -6 -2 -8 2 q 5 2 8 -2 q 6 -2 8 2 q -5 2 -8 -2" stroke="#5E8C5B" strokeWidth="1.8" fill="none" />
          </g>
          <path d="M14 105 q 5 -3 10 0 M46 108 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" />
        </>
      );
    case "kanazawa": // 徽軫灯籠と雪吊り
      return (
        <>
          <g fill="#fff" opacity="0.9">
            <circle cx="60" cy="10" r="1.6" /><circle cx="90" cy="16" r="1.4" /><circle cx="24" cy="12" r="1.4" />
          </g>
          <g transform="translate(8 72)" fill="#6E6558">
            <path d="M6 0 Q 10 -4 14 0 L 13 3 L 7 3 Z" />
            <rect x="8.5" y="3" width="3" height="4" />
            <path d="M6 7 h 8 l -1 3 h -6 Z" />
            <path d="M7 10 L 3 26 M13 10 L 17 26" stroke="#6E6558" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g transform="translate(100 70)">
            <path d="M0 30 L 0 -4" stroke="#8A6B4C" strokeWidth="2" />
            <g stroke="#A88F6B" strokeWidth="1.1">
              <path d="M0 -4 L -12 22 M0 -4 L -6 24 M0 -4 L 6 24 M0 -4 L 12 22" />
            </g>
            <circle cx="-6" cy="18" r="7" fill="#5E8C5B" /><circle cx="7" cy="19" r="6" fill="#6FA84C" />
          </g>
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#D7E4D2" />
          <ellipse cx="34" cy="108" rx="22" ry="5" fill="#A5C9DD" opacity="0.8" />
        </>
      );
    case "shinshu": // 北アルプスと山小屋
      return (
        <>
          <path d="M-8 46 L 6 24 L 14 32 L 26 10 L 40 32 L 48 22 L 60 46 Z" fill="#93AECF" />
          <path d="M20 19 L 26 10 L 32 19 Q 26 23 20 19 Z M2 30 L 6 24 L 10 30 Q 6 32 2 30 Z" fill="#fff" />
          <Birds x={92} y={16} />
          <path d="M3 99 Q 60 93 117 99 L 117 117 L 3 117 Z" fill="#B9DCA6" />
          <g transform="translate(98 88)">
            <path d="M0 10 L 8 0 L 16 10 Z" fill="#B0704E" />
            <rect x="2" y="10" width="12" height="7" fill="#D9C7A8" stroke="#8A6B4C" strokeWidth="1.2" />
            <rect x="6.5" y="12" width="3.4" height="5" fill="#8A6B4C" />
          </g>
          <g fill="#fff"><circle cx="14" cy="106" r="1.4" /><circle cx="24" cy="110" r="1.2" /><circle cx="42" cy="107" r="1.3" /></g>
        </>
      );
    case "shizuoka": // 富士山と茶畑
      return (
        <>
          <path d="M18 44 L 52 8 Q 60 4 68 8 L 102 44 Z" fill="#8FA8CC" />
          <path d="M44 16 L 52 8 Q 60 4 68 8 L 76 16 Q 60 26 44 16 Z" fill="#fff" />
          <Sun x={106} y={14} r={6} c="#FF9D8A" />
          <path d="M3 96 Q 60 90 117 96 L 117 117 L 3 117 Z" fill="#7FB069" />
          <path d="M3 102 Q 30 97 60 102 Q 90 106 117 101 M3 110 Q 30 105 60 110 Q 90 113 117 109" stroke="#5E8C5B" strokeWidth="3" fill="none" />
        </>
      );
    case "nagoya": // 金鯱の名古屋城
      return (
        <>
          <g transform="translate(6 8)">
            <path d="M6 36 Q 17 30 28 36 Z" fill="#3E7C6B" />
            <rect x="9" y="36" width="16" height="7" fill="#F5F1E6" stroke="#8B99A8" strokeWidth="1.2" />
            <path d="M4 43 Q 17 37 30 43 Z" fill="#3E7C6B" />
            <rect x="7" y="43" width="20" height="8" fill="#F5F1E6" stroke="#8B99A8" strokeWidth="1.2" />
            <path d="M8 30 q 2 -4 3 0 M23 30 q 2 -4 3 0" stroke="#E8A33D" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M9 36 Q 17 26 25 36" fill="#3E7C6B" />
          </g>
          <g fill="#FFD43B" opacity="0.9"><circle cx="98" cy="14" r="1.8" /><circle cx="108" cy="24" r="1.4" /><circle cx="90" cy="30" r="1.3" /></g>
          <Puff x={92} y={16} s={0.7} />
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#C9DDA8" />
        </>
      );
    case "hida": // 白川郷の合掌造り
      return (
        <>
          <path d="M76 40 L 98 16 L 122 40 Z" fill="#A9BFD8" />
          <path d="M93 21 L 98 16 L 103 21 Q 98 24 93 21 Z" fill="#fff" />
          <g stroke="#8A7355" strokeWidth="1.6">
            <path d="M4 46 L 19 22 L 34 46 Z" fill="#D9C7A8" />
            <path d="M12 46 L 12 37 L 26 37 L 26 46 Z" fill="#8A7355" stroke="none" />
            <path d="M8 39 L 30 39" stroke="#B59F76" strokeWidth="1.2" />
          </g>
          <g fill="#fff" opacity="0.9"><circle cx="60" cy="12" r="1.6" /><circle cx="50" cy="20" r="1.3" /></g>
          <path d="M3 100 Q 30 93 60 100 Q 90 106 117 99 L 117 117 L 3 117 Z" fill="#EFF6EE" />
        </>
      );
    case "ise": // 夫婦岩と朝日
      return (
        <>
          <Sun x={60} y={12} r={7} c="#FF9D6E" />
          <Birds x={16} y={20} />
          <path d="M3 97 Q 30 92 60 97 Q 90 102 117 96 L 117 117 L 3 117 Z" fill="#96C4D6" />
          <g transform="translate(84 70)">
            <path d="M2 30 Q 4 12 11 8 Q 18 12 20 30 Z" fill={ROCK} />
            <path d="M24 30 Q 25 20 29 17 Q 33 20 34 30 Z" fill={ROCK} />
            <path d="M10 10 Q 20 14 28 18" stroke="#B59F76" strokeWidth="2.6" fill="none" />
            <path d="M14 12.5 v 4 M19 14.5 v 4 M24 16.5 v 4" stroke="#B59F76" strokeWidth="1.6" />
            <path d="M11 8 q 1.5 -3 3 -4 l 0.6 2.4 q 1.8 -1.4 3.6 -1.4 l -1 2.6" stroke="#8A7355" strokeWidth="1.4" fill="none" />
          </g>
          <path d="M12 104 q 5 -3 10 0 M40 107 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" />
        </>
      );
    case "kyoto": // 五重塔と紅葉
      return (
        <>
          <g transform="translate(6 4)" fill="#6E5A52">
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <path d={`M${3 + i * 1.6} ${8 + i * 8.5} Q 14 ${3 + i * 8.5} ${25 - i * 1.6} ${8 + i * 8.5} L ${23 - i * 1.6} ${11 + i * 8.5} L ${5 + i * 1.6} ${11 + i * 8.5} Z`} />
                <rect x={8 + i * 0.9} y={11 + i * 8.5} width={12 - i * 1.8} height="6" fill="#A88F7A" />
              </g>
            ))}
            <path d="M14 8 V 0" stroke="#6E5A52" strokeWidth="1.8" />
          </g>
          <g fill="#E5645C" opacity="0.9">
            <path d="M100 14 l 2 3 3 -1 -1 3 3 2 -3 2 1 3 -3 -1 -2 3 -2 -3 -3 1 1 -3 -3 -2 3 -2 -1 -3 3 1 Z" />
            <circle cx="112" cy="30" r="1.6" /><circle cx="92" cy="34" r="1.4" />
          </g>
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#D9C4A8" />
          <circle cx="104" cy="106" r="2" fill="#E5645C" /><circle cx="14" cy="108" r="1.8" fill="#E5645C" opacity="0.8" />
        </>
      );
    case "kansai": // 大阪城とビル街
      return (
        <>
          <g transform="translate(6 10)">
            <path d="M4 32 Q 15 26 26 32 Z" fill="#3E7C6B" />
            <rect x="7" y="32" width="16" height="7" fill="#F5F1E6" stroke="#8B99A8" strokeWidth="1.2" />
            <path d="M2 39 Q 15 33 28 39 Z" fill="#3E7C6B" />
            <rect x="5" y="39" width="20" height="8" fill="#F5F1E6" stroke="#8B99A8" strokeWidth="1.2" />
            <path d="M7 26 q 1.6 -3.4 2.6 0 M20.4 26 q 1.6 -3.4 2.6 0" stroke="#E8A33D" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M7 32 Q 15 23 23 32" fill="#3E7C6B" />
          </g>
          <g fill="#AEB8CC">
            <rect x="94" y="22" width="9" height="30" rx="1.5" />
            <rect x="106" y="14" width="10" height="38" rx="1.5" />
          </g>
          <g fill="#fff" opacity="0.85">
            <rect x="96" y="26" width="2.2" height="2.2" /><rect x="96" y="32" width="2.2" height="2.2" />
            <rect x="108.5" y="18" width="2.2" height="2.2" /><rect x="108.5" y="24" width="2.2" height="2.2" />
          </g>
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#C9DDA8" />
        </>
      );
    case "kobe": // ポートタワーと港
      return (
        <>
          <path d="M70 34 Q 95 20 122 34 Z" fill="#A9BFD8" opacity="0.8" />
          <g transform="translate(10 8)">
            <path d="M4 0 h 12 M2 40 h 16" stroke="#D64545" strokeWidth="2.4" />
            <path d="M5 0 C 1 14 1 26 3 40 M15 0 C 19 14 19 26 17 40 M10 0 V 40" stroke="#D64545" strokeWidth="1.8" fill="none" />
            <path d="M3 12 h 14 M2.4 24 h 15.2" stroke="#D64545" strokeWidth="1.4" />
          </g>
          <Sun x={104} y={16} r={6} c="#FFB35C" />
          <path d="M3 98 Q 60 93 117 98 L 117 117 L 3 117 Z" fill="#8FB4D4" />
          <Boat x={94} y={98} />
          <path d="M14 106 q 5 -3 10 0 M44 109 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
        </>
      );
    case "wakayama": // 那智の滝とみかん
      return (
        <>
          <g transform="translate(8 6)">
            <path d="M0 44 Q 4 20 10 8 Q 16 20 20 44 Z" fill="#7E9C86" />
            <rect x="7.5" y="10" width="5" height="30" fill="#fff" opacity="0.95" rx="2" />
            <path d="M6 42 q 4 3 8 0" stroke="#fff" strokeWidth="2.2" fill="none" />
            <g fill="#C9524A">
              <rect x="14" y="2" width="8" height="2" rx="1" />
              <rect x="15" y="5" width="6" height="1.6" rx="0.8" />
              <rect x="15.4" y="5" width="1.6" height="6" /><rect x="19" y="5" width="1.6" height="6" />
            </g>
          </g>
          <path d="M3 98 Q 60 92 117 98 L 117 117 L 3 117 Z" fill="#A8CC8F" />
          <g>
            <circle cx="104" cy="92" r="9" fill="#95C77E" />
            <rect x="102" y="99" width="4" height="8" rx="2" fill="#8A6B4C" />
            <circle cx="100" cy="90" r="2.6" fill="#FFA94D" /><circle cx="108" cy="94" r="2.6" fill="#FFA94D" /><circle cx="105" cy="87" r="2.4" fill="#FFA94D" />
          </g>
        </>
      );
    case "tottori": // 砂丘とらくだ
      return (
        <>
          <Sun x={100} y={14} r={7} c="#FFB35C" />
          <Birds x={14} y={16} c="#B9AA8F" />
          <path d="M3 92 Q 30 80 62 92 Q 92 102 117 88 L 117 117 L 3 117 Z" fill="#EFD9A3" />
          <path d="M3 104 Q 40 96 80 104" stroke="#D9BC7E" strokeWidth="1.8" fill="none" />
          <g transform="translate(90 88)" fill="#B98F5E">
            <path d="M2 12 Q 2 6 6 5 Q 8 1 11 3 Q 13 0 16 3 Q 20 2 21 7 Q 24 8 23 12 Z" />
            <rect x="4" y="12" width="2.2" height="6" /><rect x="9" y="12" width="2.2" height="6" /><rect x="14" y="12" width="2.2" height="6" /><rect x="19" y="12" width="2.2" height="6" />
            <path d="M2 8 Q -1 7 -1 3 Q 1 4 2 6" />
            <circle cx="-0.4" cy="2.6" r="2" />
          </g>
        </>
      );
    case "izumo": // 出雲大社の大しめ縄
      return (
        <>
          <g transform="translate(4 6)">
            <path d="M2 20 Q 26 12 50 20 L 48 26 Q 26 19 4 26 Z" fill="#B59F76" />
            <path d="M8 21.5 q 4 -3 8 0 M20 20 q 4 -3 8 0 M32 20.5 q 4 -3 8 0" stroke="#8A7355" strokeWidth="1.8" fill="none" />
            <path d="M14 25 q -1 7 -3 10 q 5 -1 6 -6 Z M36 24 q 1 7 3 10 q -5 -1 -6 -6 Z" fill="#A88F6B" />
            <rect x="12" y="30" width="4.5" height="5" fill="#fff" opacity="0.9" />
            <rect x="34" y="29" width="4.5" height="5" fill="#fff" opacity="0.9" />
          </g>
          <g fill="#fff" opacity="0.85"><circle cx="100" cy="14" r="1.8" /><circle cx="110" cy="26" r="1.4" /><circle cx="92" cy="32" r="1.3" /></g>
          <Puff x={94} y={18} s={0.75} />
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#CBC4DD" />
        </>
      );
    case "okayama": // 烏城と桃
      return (
        <>
          <g transform="translate(6 10)">
            <path d="M4 30 Q 15 24 26 30 Z" fill="#4A4550" />
            <rect x="7" y="30" width="16" height="7" fill="#6E6878" stroke="#3B3641" strokeWidth="1.2" />
            <path d="M2 37 Q 15 31 28 37 Z" fill="#4A4550" />
            <rect x="5" y="37" width="20" height="8" fill="#6E6878" stroke="#3B3641" strokeWidth="1.2" />
            <path d="M8 24 q 1.6 -3 2.6 0 M19.4 24 q 1.6 -3 2.6 0" stroke="#E8A33D" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g transform="translate(96 16)">
            <circle cx="8" cy="8" r="7.5" fill="#FFB8D4" />
            <path d="M8 1.5 Q 8 -2 11 -4" stroke="#5E8C5B" strokeWidth="1.8" fill="none" />
            <path d="M8 2 Q 4.5 8 8 14.5" stroke="#FF87B7" strokeWidth="1.4" fill="none" />
          </g>
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#C9DDA8" />
        </>
      );
    case "hiroshima": // 海に立つ大鳥居ともみじ
      return (
        <>
          <path d="M70 30 Q 96 18 122 30 Z" fill="#A9C6B8" opacity="0.7" />
          <path d="M3 96 Q 30 91 60 96 Q 90 101 117 95 L 117 117 L 3 117 Z" fill="#96C4D6" />
          <g transform="translate(8 62)" fill="#D64545">
            <path d="M0 2 Q 13 -3 26 2 L 25 6 Q 13 2 1 6 Z" />
            <rect x="3" y="8" width="20" height="2.6" rx="1.3" />
            <rect x="5.5" y="8" width="3" height="26" />
            <rect x="17.5" y="8" width="3" height="26" />
            <rect x="2" y="30" width="4" height="7" transform="rotate(14 4 33)" />
            <rect x="20" y="30" width="4" height="7" transform="rotate(-14 22 33)" />
            <rect x="11.5" y="2" width="3" height="9" />
          </g>
          <path d="M100 16 l 2 3 3 -1 -1 3 3 2 -3 2 1 3 -3 -1 -2 3 -2 -3 -3 1 1 -3 -3 -2 3 -2 -1 -3 3 1 Z" fill="#E5645C" />
          <path d="M40 104 q 5 -3 10 0 M78 107 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" />
        </>
      );
    case "yamaguchi": // 錦帯橋とふぐ
      return (
        <>
          <g stroke="#B0704E" strokeWidth="2.8" fill="none">
            <path d="M-2 30 Q 12 16 26 30 Q 40 16 54 30 Q 68 16 82 30 Q 96 16 110 30" />
          </g>
          <path d="M-2 30 H 117" stroke="#8A5A3C" strokeWidth="2" />
          <path d="M6 30 v 6 M26 30 v 6 M54 30 v 6 M82 30 v 6 M108 30 v 6" stroke="#8A5A3C" strokeWidth="1.8" />
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#96C4D6" />
          <g transform="translate(96 92) rotate(-18)">
            <ellipse cx="7" cy="6" rx="8" ry="6" fill="#C9D4E0" />
            <path d="M14 6 l 5 -3.4 v 6.8 Z" fill="#C9D4E0" />
            <circle cx="3.6" cy="4.4" r="1.2" fill="#3B2B45" />
            <path d="M5 1 l 0.8 -2.4 M9 1.6 l 1.6 -2 M12 3 l 2.2 -1.4" stroke="#8B99A8" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M2 8 q 2.4 1.6 5 0" stroke="#3B2B45" strokeWidth="1" fill="none" />
          </g>
          <path d="M14 106 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" />
        </>
      );
    case "sanuki": // 讃岐富士と瀬戸内の島々
      return (
        <>
          <path d="M2 44 Q 20 14 38 44 Z" fill="#8FAF87" />
          <Sun x={102} y={14} r={6} c="#FFCD7A" />
          <path d="M3 98 Q 60 93 117 98 L 117 117 L 3 117 Z" fill="#A5CFDD" />
          <path d="M84 98 Q 92 92 100 98 Z M104 99 Q 110 95 116 99 Z" fill="#8FAF87" />
          <Boat x={20} y={100} />
          <path d="M52 106 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" />
        </>
      );
    case "awa": // 大鳴門橋と渦潮
      return (
        <>
          <g stroke="#C9CFD8" strokeWidth="2.2" fill="none">
            <path d="M-2 28 H 117" strokeWidth="3" />
            <path d="M18 28 V 10 M92 28 V 10" strokeWidth="3.4" />
            <path d="M-2 22 Q 18 8 55 12 Q 92 8 117 22" />
            <path d="M28 28 v -9 M40 28 v -12 M55 28 v -13 M70 28 v -12 M82 28 v -9" strokeWidth="1.4" />
          </g>
          <path d="M3 98 Q 60 93 117 98 L 117 117 L 3 117 Z" fill="#8FBFD4" />
          <g stroke="#fff" strokeWidth="2" fill="none" opacity="0.95">
            <path d="M14 106 a 6 6 0 1 1 6 6 a 4 4 0 1 0 4 -4 a 2.4 2.4 0 1 0 2.4 -2.4" />
            <path d="M92 109 a 4.5 4.5 0 1 1 4.5 4.5 a 3 3 0 1 0 3 -3" />
          </g>
        </>
      );
    case "iyo": // みかんの段々畑と道後の湯
      return (
        <>
          <Sun x={104} y={14} r={6} c="#FFCD7A" />
          <g stroke="#D8C4CE" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85">
            <path d="M96 40 q -4 -6 0 -11 q 4 -5 0 -10" />
            <path d="M106 42 q -4 -6 0 -11" />
          </g>
          <path d="M3 90 L 34 90 L 34 98 L 3 98 Z M3 98 L 50 98 L 50 106 L 3 106 Z M3 106 L 70 106 L 70 117 L 3 117 Z" fill="#A8CC8F" />
          <path d="M34 90 Q 75 88 117 96 L 117 117 L 70 117 L 70 106 L 50 106 L 50 98 L 34 98 Z" fill="#95BF7C" />
          <g fill="#FFA94D">
            <circle cx="12" cy="94" r="2.2" /><circle cx="24" cy="94" r="2.2" />
            <circle cx="16" cy="102" r="2.2" /><circle cx="38" cy="102" r="2.2" />
            <circle cx="24" cy="111" r="2.2" /><circle cx="56" cy="111" r="2.2" />
          </g>
        </>
      );
    case "tosa": // 太平洋の荒波とカツオ
      return (
        <>
          <Sun x={20} y={14} r={7} c="#FFCD7A" />
          <Birds x={90} y={14} />
          <path d="M3 94 Q 20 86 34 94 Q 30 84 40 82 Q 34 96 48 94 Q 70 90 90 96 Q 105 99 117 94 L 117 117 L 3 117 Z" fill="#7FAECC" />
          <path d="M8 96 q 6 -4 12 0 M34 90 q 3 -4 8 -2" stroke="#fff" strokeWidth="2.2" fill="none" opacity="0.9" />
          <g transform="translate(92 86) rotate(-24)">
            <path d="M0 6 Q 7 0 15 5 L 21 1 L 20 8 L 21 12 L 14 9 Q 7 12 0 6 Z" fill="#5E7E9C" />
            <path d="M2 6 Q 8 3 13 6" stroke="#3B5A78" strokeWidth="1.4" fill="none" />
            <circle cx="4" cy="5" r="1.2" fill="#fff" />
          </g>
        </>
      );
    case "hakata": // 中洲の屋台と夜景
      return (
        <>
          <circle cx="96" cy="12" r="5" fill="#FFE9A3" opacity="0.95" />
          <g fill="#4B4778">
            <rect x="88" y="24" width="9" height="28" rx="1.5" />
            <rect x="100" y="18" width="11" height="34" rx="1.5" />
          </g>
          <g fill="#FFD98A" opacity="0.95">
            <rect x="90.5" y="28" width="2.2" height="2.2" /><rect x="90.5" y="34" width="2.2" height="2.2" />
            <rect x="103" y="22" width="2.2" height="2.2" /><rect x="103" y="28" width="2.2" height="2.2" /><rect x="107" y="25" width="2.2" height="2.2" />
          </g>
          <g transform="translate(4 14)">
            <rect x="0" y="8" width="30" height="3" fill="#8A6B4C" />
            <path d="M2 11 h 26 v 9 q -6.5 3 -13 0 q -6.5 3 -13 0 Z" fill="#D64545" />
            <path d="M8 11 v 9 M15 11 v 8 M22 11 v 9" stroke="#A83232" strokeWidth="1.2" />
            <rect x="2" y="0" width="4" height="8" fill="#8A6B4C" /><rect x="24" y="0" width="4" height="8" fill="#8A6B4C" />
            <ellipse cx="33" cy="6" rx="3" ry="4.2" fill="#FF8A5C" />
            <path d="M10 24 q -1.4 -4 1 -7 M18 24 q -1.4 -4 1 -7" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.8" />
          </g>
          <path d="M3 100 Q 60 95 117 100 L 117 117 L 3 117 Z" fill="#3A3660" />
          <path d="M20 106 q 4 -2.4 8 0 M60 108 q 4 -2.4 8 0 M96 105 q 4 -2.4 8 0" stroke="#8B87B8" strokeWidth="1.6" fill="none" />
        </>
      );
    case "oita": // 海地獄と湯けむり
      return (
        <>
          <g stroke="#D8C4CE" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.9">
            <path d="M12 42 q -5 -7 0 -13 q 5 -6 0 -12" />
            <path d="M24 46 q -5 -7 0 -13 q 5 -6 0 -12" />
            <path d="M98 42 q -5 -7 0 -13 q 5 -6 0 -12" />
            <path d="M110 46 q -5 -7 0 -13" />
          </g>
          <path d="M100 20 a 6 6 0 0 1 6 -5 a 6 6 0 0 1 6 5 Z" fill="#D64545" opacity="0" />
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#E3D2BC" />
          <ellipse cx="26" cy="107" rx="18" ry="6" fill="#5EC4D4" opacity="0.95" />
          <path d="M18 104 q 4 -2 8 0 M28 108 q 4 -2 8 0" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.8" />
          <ellipse cx="98" cy="108" rx="12" ry="4.5" fill="#C9CFD8" opacity="0.8" />
        </>
      );
    case "kumamoto": // 熊本城と阿蘇の噴煙
      return (
        <>
          <g transform="translate(6 10)">
            <path d="M4 30 Q 15 23 26 30 Z" fill="#3B3641" />
            <rect x="7" y="30" width="16" height="7" fill="#F5F1E6" stroke="#8B99A8" strokeWidth="1.2" />
            <path d="M2 37 Q 15 30 28 37 Z" fill="#3B3641" />
            <rect x="5" y="37" width="20" height="8" fill="#F5F1E6" stroke="#8B99A8" strokeWidth="1.2" />
            <path d="M8 24 q 1.6 -3 2.6 0 M19.4 24 q 1.6 -3 2.6 0" stroke="#E8A33D" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <path d="M84 44 Q 100 26 122 44 Z" fill="#8FAF87" />
          <path d="M100 28 q 1 -6 -2 -10 M105 28 q 2 -5 0 -9" stroke="#C9CFD8" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M3 100 Q 60 94 117 100 L 117 117 L 3 117 Z" fill="#A8CC8F" />
        </>
      );
    case "nagasaki": // 稲佐山の夕景と港の教会
      return (
        <>
          <Sun x={60} y={12} r={7} c="#FF8A5C" />
          <path d="M66 30 Q 92 18 122 30 Z" fill="#8A7BA0" opacity="0.8" />
          <g transform="translate(8 12)">
            <rect x="4" y="14" width="14" height="16" fill="#E8E2D5" stroke="#B0A895" strokeWidth="1.2" />
            <path d="M2 14 L 11 6 L 20 14 Z" fill="#B0704E" />
            <rect x="9" y="0" width="4" height="7" fill="#E8E2D5" stroke="#B0A895" strokeWidth="1" />
            <path d="M11 -4 v 5 M9 -2 h 4" stroke="#8A7355" strokeWidth="1.4" />
            <rect x="9.5" y="20" width="3" height="5" fill="#8A7BA0" />
          </g>
          <path d="M3 98 Q 60 93 117 98 L 117 117 L 3 117 Z" fill="#B08FA8" />
          <Boat x={92} y={100} />
          <g fill="#FFD98A" opacity="0.9"><circle cx="20" cy="104" r="1" /><circle cx="34" cy="108" r="1" /><circle cx="58" cy="105" r="1" /><circle cx="76" cy="109" r="1" /></g>
        </>
      );
    case "kagoshima": // 桜島と錦江湾
      return (
        <>
          <path d="M-6 50 L 12 26 L 22 32 L 34 22 L 46 32 L 56 50 Z" fill="#A08876" />
          <path d="M12 26 L 22 32 L 34 22 L 30 16 L 16 18 Z" fill="#7E6B5C" />
          <g stroke="#D8CDC4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9">
            <path d="M22 14 q 4 -7 -1 -12" />
            <path d="M30 12 q 4 -6 0 -10" />
            <path d="M15 15 q 2 -5 0 -8" />
          </g>
          <Sun x={104} y={16} r={6} c="#FF9D8A" />
          <path d="M3 98 Q 60 93 117 98 L 117 117 L 3 117 Z" fill="#8FB4D4" />
          <Boat x={96} y={100} />
          <path d="M14 106 q 5 -3 10 0 M48 108 q 5 -3 10 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
        </>
      );
    case "okinawa": // 首里城とエメラルドの海
      return (
        <>
          <g transform="translate(4 8)">
            <path d="M2 16 Q 16 8 30 16 L 28 20 Q 16 14 4 20 Z" fill="#C9524A" />
            <rect x="6" y="20" width="20" height="8" fill="#E5645C" stroke="#A83232" strokeWidth="1.2" />
            <path d="M0 28 Q 16 22 32 28 L 32 32 L 0 32 Z" fill="#C9524A" />
            <path d="M8 14 q 1.4 -2.6 2.2 0 M22 14 q 1.4 -2.6 2.2 0" stroke="#E8A33D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </g>
          <Puff x={92} y={12} s={0.85} />
          <path d="M3 96 Q 30 91 60 96 Q 90 101 117 95 L 117 117 L 3 117 Z" fill="#5EC4B8" />
          <path d="M3 104 Q 30 100 60 104 Q 90 108 117 103" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" />
          <g transform="translate(100 20)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="0" cy="0" rx="6" ry="3.4" fill="#FF5C8A" transform={`rotate(${deg})`} />
            ))}
            <circle r="2.6" fill="#FFD43B" />
          </g>
        </>
      );
    case "ryujin": // 天界の雲海と金の光
      return (
        <>
          <circle cx="60" cy="16" r="9" fill="#FFF3BF" opacity="0.95" />
          <circle cx="60" cy="16" r="14" fill="#FFE9A3" opacity="0.3" />
          <g fill="#FFD43B" opacity="0.85">
            <path d="M16 12 l 1.8 3.6 3.6 1.8 -3.6 1.8 -1.8 3.6 -1.8 -3.6 -3.6 -1.8 3.6 -1.8 Z" />
            <path d="M104 24 l 1.4 2.8 2.8 1.4 -2.8 1.4 -1.4 2.8 -1.4 -2.8 -2.8 -1.4 2.8 -1.4 Z" />
            <circle cx="94" cy="10" r="1.4" /><circle cx="26" cy="34" r="1.3" /><circle cx="110" cy="44" r="1.3" />
          </g>
          <path d="M52 26 L 44 44 M60 28 L 60 46 M68 26 L 76 44" stroke="#FFE9A3" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          <Puff x={2} y={100} s={1.1} o={0.95} />
          <Puff x={38} y={106} s={1.3} o={0.9} />
          <Puff x={86} y={102} s={1.1} o={0.95} />
          <path d="M3 108 Q 60 100 117 108 L 117 117 L 3 117 Z" fill="#fff" opacity="0.9" />
        </>
      );
    case "zashiki": // 行灯の灯る古民家の座敷
      return (
        <>
          <g stroke="#6E5A48" strokeWidth="2">
            <rect x="6" y="6" width="34" height="42" fill="#F5EEDD" />
            <path d="M17.3 6 V 48 M28.6 6 V 48 M6 20 H 40 M6 34 H 40" strokeWidth="1.4" />
          </g>
          <g stroke="#6E5A48" strokeWidth="2">
            <rect x="80" y="6" width="34" height="42" fill="#F5EEDD" />
            <path d="M91.3 6 V 48 M102.6 6 V 48 M80 20 H 114 M80 34 H 114" strokeWidth="1.4" />
          </g>
          <g transform="translate(12 74)">
            <rect x="2" y="0" width="14" height="20" rx="2" fill="#FFE9A3" stroke="#6E5A48" strokeWidth="1.8" />
            <path d="M9 0 V 20" stroke="#D9BC7E" strokeWidth="1.2" />
            <rect x="0" y="20" width="18" height="3" rx="1.5" fill="#6E5A48" />
            <circle cx="9" cy="10" r="7" fill="#FFD98A" opacity="0.5" />
          </g>
          <path d="M3 98 L 117 98 L 117 117 L 3 117 Z" fill="#9CA86E" />
          <path d="M3 104 H 117 M3 111 H 117 M40 98 V 117 M80 98 V 117" stroke="#7E8A55" strokeWidth="1.4" />
          <circle cx="102" cy="106" r="5" fill="#E5645C" />
          <path d="M98 104 q 4 4 8 0 M102 101.5 v 9" stroke="#FFD43B" strokeWidth="1.2" fill="none" />
        </>
      );
    default:
      return null;
  }
}

// キャラの背面に敷くご当地シーン（角丸クリップ付き）
export default function CharScene({ slug }: { slug: string }) {
  const sky = SKIES[slug];
  if (!sky) return null;
  const gid = `sky-${slug}`;
  const cid = `clip-${slug}`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
        <clipPath id={cid}>
          <rect x="3" y="3" width="114" height="114" rx="16" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        <rect x="3" y="3" width="114" height="114" rx="16" fill={`url(#${gid})`} />
        <Art slug={slug} />
      </g>
      <rect x="3" y="3" width="114" height="114" rx="16" fill="none" stroke="rgba(59,43,69,0.14)" strokeWidth="1.5" />
    </g>
  );
}
