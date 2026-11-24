// 宮崎弁（/translate/miyazaki）専用の辞典。J669（2026-11-24）。
//
// 🔴 なぜ lib/data.ts の DIALECTS / WORDS に入れていないか
//   方言を DIALECTS に足すと、診断（TYPES）・検定（QUIZZES）・/doko・/kurabe・/dict・トップなど
//   全面に波及する（「全35方言」の表記も数十面にある）。AdSense 審査中は共通テンプレート経由の
//   全面波及をしない運用なので、この方言だけは「変換ページ1面」として独立させる。
//   wordsOf(d) だけがここの語を返す（lib/data.ts）。REAL_DIALECTS には入らないので、
//   他のどの面の件数・一覧・出題にも出ない。
//
// 🔴 収録の基準（DICT_AUDIT.md の方針）
//   一次資料（国立国語研究所の談話データと注記・宮崎大学の研究者の論文）で
//   「その語がその意味で宮崎で使われる」と書いてあるものだけ。
//   新聞（宮崎日日新聞の九州4紙合同アンケート）は一般の人が挙げた語の裏取りに使い、
//   Wikipedia「宮崎弁」は語彙の節に個別の出典が無いので、単独では採用しない（補助のみ）。
//   用例は資料に載っている文だけ。作文した例文は入れない（example が空のままの語が多いのはそのため）。
//   資料に載っていた語でも、標準語と取り違えやすい語や、語尾変化でしか現れない語は入れていない。
//
// 検査: node --experimental-strip-types scripts/check_miyazaki.mjs

import type { WordEntry } from "./data";

export const MIYAZAKI_DIALECT = "宮崎弁";
export const MIYAZAKI_SLUG = "miyazaki";

export type MiyazakiSource = {
  key: string;
  label: string;
  url: string;
  /** この面を開いて確認した日（YYYY-MM-DD） */
  checked: string;
};

export const MIYAZAKI_SOURCES: MiyazakiSource[] = [
  {
    key: "A",
    label:
      "国立国語研究所『全国方言談話データベース 日本のふるさとことば集成』第18巻（福岡・大分・宮崎）宮崎県宮崎市青島（1981年収録）の談話・共通語訳・注記・方言の特色の解説",
    url: "https://repository.ninjal.ac.jp/record/2274/files/kksrc_013-18.pdf",
    checked: "2026-11-24",
  },
  {
    key: "B",
    label: "早野慎吾（宮崎大学）「地域のことばと日本語教育―宮崎で日本語を教える人のために―」",
    url: "https://miyazaki-u.repo.nii.ac.jp/record/6457/files/hayano02.pdf",
    checked: "2026-11-24",
  },
  {
    key: "C",
    label: "早野慎吾（宮崎大学）「文字に書かれた宮崎方言」『地域文化研究』第2号（2008）",
    url: "https://miyazaki-u.repo.nii.ac.jp/record/244/files/CBK2-4.pdf",
    checked: "2026-11-24",
  },
  {
    key: "D",
    label: "宮崎日日新聞「標準語だと思っていた宮崎弁『なおす』『はわく』『からう』」（2023-11-20・会員限定記事のため見出しと冒頭のみ確認）",
    url: "https://kumanichi.com/articles/1238356",
    checked: "2026-11-24",
  },
  {
    key: "E",
    label: "宮崎日日新聞「後世に残したい宮崎弁1位は『てげてげ』」（同アンケート・2023-11-20）",
    url: "https://www.kumanichi.com/articles/1238352",
    checked: "2026-11-24",
  },
  {
    key: "F",
    label: "Wikipedia「宮崎弁」（語彙の節に個別の出典が無いため、他の資料と一致した語の補助確認だけに使用）",
    url: "https://ja.wikipedia.org/wiki/宮崎弁",
    checked: "2026-11-24",
  },
];

/** 語ごとの出典キーと、確認の根拠メモ（画面の「出典」欄に出す） */
export type MiyazakiWord = WordEntry & { src: string[]; note: string };

// meaning は lib/translate_dict.ts の glossesOf() が「、」で割って標準語側の見出しにする。
// 8文字を超える・「〜」を含む・括弧の中の説明は変換の見出しにならない（それでよい）。
export const MIYAZAKI_ENTRIES: MiyazakiWord[] = [
  // ---- 宮崎大学（早野慎吾）の論文で意味まで書かれている語 ----
  { word: "てげ", meaning: "とても", example: "", src: ["B", "E", "F"], note: "早野論文B「宮崎方言と言えばテゲ（とても）…」。新聞Eも「てげてげ」を1位に挙げる" },
  { word: "てげてげ", meaning: "ほどほどに、適当に", example: "", src: ["E"], note: "九州4紙の合同アンケートで『後世に残したい宮崎弁』1位。意味は新聞の記載「『適当』『ほどほどに』」" },
  { word: "ぐらしー", meaning: "かわいそう", example: "", src: ["B"], note: "早野論文B「グラシー（かわいそう）」" },
  { word: "なおす", meaning: "片付ける", example: "", src: ["B", "D"], note: "早野論文Bが宮崎の『地方共通語』（方言と気づかず標準語として使う語）の代表に挙げる。新聞Dも『標準語だと思っていた宮崎弁』として見出しに挙げる" },
  { word: "はわく", meaning: "掃く", example: "", src: ["B", "D"], note: "早野論文Bが『ワク（掃く）』、新聞Dの見出しが『はわく』" },
  { word: "からう", meaning: "背負う", example: "", src: ["B", "D"], note: "早野論文B『カラウ（背負う）』。新聞Dの見出しにも載る" },
  { word: "こしょー", meaning: "唐辛子", example: "", src: ["C"], note: "早野論文C「宮崎市の伝統方言では唐辛子をコショー…と表現する」（形は標準語と同じで、指すものが違う）" },
  { word: "だんご", meaning: "蒸しパン、饅頭", example: "", src: ["C"], note: "早野論文C「蒸しパンや饅頭をダンゴと表現する」（宮崎市の伝統方言）" },
  { word: "むぞらしい", meaning: "かわいい", example: "", src: ["B"], note: "早野論文B「宮崎市（日向方言）ではムゾラシ」。語尾は他の形容詞にそろえて表記。論文は『現在は共通語のカワイイに置き換わった』と書いている" },
  { word: "びきたろ", meaning: "カエル", example: "", src: ["B"], note: "早野論文B「蛙は宮崎市ではビキタロ」（伝統方言。現在はカエルが主流）" },
  { word: "くろじん", meaning: "青あざ", example: "", src: ["B"], note: "早野論文B「青あざは宮崎市ではクロジン」（伝統方言。その後アオジンタンが広がったと記載）。原文PDFの文字化けを前後の文脈で読んだ" },
  { word: "だれやめ", meaning: "晩酌", example: "", src: ["C"], note: "早野論文C「ダレヤメとは晩酌のことである」（宮崎市橘通りの店の表示の例）" },
  { word: "けずる", meaning: "髪をすく", example: "", src: ["B"], note: "早野論文B「ケズル（すく、髪を〜）」。古語が方言として残った例として紹介" },
  { word: "じゃがじゃが", meaning: "そうだそうだ", example: "", src: ["C"], note: "早野論文C「ジャガジャガ（そうだそうだ）…同意を表すときに使われる宮崎方言形」" },
  { word: "いっちゃが", meaning: "いいよ", example: "", src: ["C"], note: "早野論文C「イッチャガは、宮崎方言形で『いいよ』の意味」" },
  { word: "やまいもをほる", meaning: "酔ってくだをまく", example: "", src: ["B"], note: "早野論文B「ヤマイモヲホル（酔ってくだをまく）」（慣用句）" },

  // ---- 国立国語研究所の談話データ（宮崎市青島・1981年収録）の注記・共通語訳 ----
  { word: "よだきい", meaning: "面倒だ、おっくうだ", example: "", src: ["A", "F"], note: "A注記〔1〕「ヨダキー（古語『よだけし』の転）」を『やる気が起きない・苦しい・きつい・おっくうだ』と同様の意味合いの語とする" },
  { word: "のさん", meaning: "つらい、きつい", example: "", src: ["A", "F"], note: "A注記〔1〕が『ヨダキー』と並べて挙げる語（意味合いは同じ括り）。Fは『辛い』" },
  { word: "じょさん", meaning: "おじいさん", example: "オマエンカタン ジョサン（あなたの家のおじいさん）", src: ["A"], note: "A注記〔11〕「『おじいさん』『おばあさん』を『ジョサン』『バサン』と言う」。用例は談話の原文と共通語訳" },
  { word: "ばさん", meaning: "おばあさん", example: "", src: ["A"], note: "A注記〔11〕" },
  { word: "ふむ", meaning: "履く", example: "", src: ["A"], note: "A注記〔13〕「靴や草履や下駄などを『履く』ことを『フム』と言う」" },
  { word: "じょーり", meaning: "草履", example: "", src: ["A"], note: "A注記〔14〕「『草履』は『ジョリ』または『ジョーリ』と言う」" },
  { word: "のみかた", meaning: "焼酎を飲む会合", example: "", src: ["A"], note: "A注記〔22〕「一般に『焼酎を飲む会合』のことを言う」" },
  { word: "ふちー", meaning: "太い、大きい", example: "", src: ["A"], note: "A注記〔28〕「フテ。太い。大きい。『フティ』『フティー』『フチ』『フチー』が一般的」。本ページは『ふちー』で表記" },
  { word: "しゃち", meaning: "舎弟", example: "", src: ["A"], note: "A注記〔29〕「舎弟。『弟』の意」" },
  { word: "ぐわんたれ", meaning: "粗悪品", example: "", src: ["A"], note: "A注記〔42〕「『粗悪品』の意。人についても言う」" },
  { word: "ながらめ", meaning: "トコブシ", example: "", src: ["A"], note: "A注記〔34〕「貝の名前。トコブシ」" },
  { word: "しょけ", meaning: "ざる、かご", example: "", src: ["A"], note: "A注記〔21〕「『ショケ』は、『ざる』または『かご』」" },
  { word: "けんどん", meaning: "けれども", example: "ヒジョーニ シンパイ シヨッタケンドン（非常に心配していたけれども）", src: ["A", "F"], note: "A注記〔5〕「逆接は、『けれども』の転じた『ケンドン』が一般的。『ケンド』とも言う」" },
  { word: "まこつ", meaning: "本当に", example: "マコツナ（本当にね）", src: ["A"], note: "Aの談話で『マコツ』『マーコツ』に共通語訳『本当に』が付く（談話中に十数例）" },
  { word: "んにゃ", meaning: "いいえ、いや", example: "", src: ["A"], note: "A「方言の特色」音韻(10)『ンニヤ（いいえ）』。談話では『ンニャ』に共通語訳『いや』" },
  { word: "んめー", meaning: "うまい", example: "", src: ["A"], note: "A「方言の特色」音韻(10)「語頭の『ン』が見られる。ンニヤ（いいえ）、ンメー（うまい）」" },
  { word: "そんげ", meaning: "そんなに", example: "", src: ["A", "F"], note: "Aの談話で『ソンゲ』に共通語訳『そんなに』（『ソンゲワ ナラン＝そんなには ならない』）" },
  { word: "あんげな", meaning: "あんな", example: "", src: ["A", "F"], note: "Aの談話で『アンゲナ』に共通語訳『あんな』" },
  { word: "たげ", meaning: "お互い", example: "", src: ["A"], note: "Aの談話『タゲ…と言っていたな、こちらのことばでね』に共通語訳『お互い』。話者自身が土地のことばと明言している" },
  { word: "ほんで", meaning: "それで", example: "", src: ["A"], note: "Aの談話で『ホンデ』『ホデ』に共通語訳『それで』（『ホンデン』は『それでも』）" },
  { word: "よき", meaning: "たくさん", example: "", src: ["A"], note: "Aの談話『ソンゲ ヨキ クレチェン イカンカラ＝そんなに たくさん やっても いけないから』。確認できた例は談話中1か所のみ" },
  { word: "じゃろ", meaning: "だろう", example: "あれが ゆくじゃろ（あの人が行くだろう）", src: ["A", "F"], note: "A「方言の特色」文法(5)「推量表現は『ジャロ』。高年層は『ドー』も用いる」。用例は資料の例文をひらがなにしたもの" },
  { word: "じゃかい", meaning: "だから", example: "", src: ["A"], note: "Aの談話で『ジャカイ』に共通語訳『だから』（『サカナワネ＝魚はね』の前）" },
];

/** lib/data.ts の wordsOf() が返す形（src・note を除く） */
export const MIYAZAKI_WORDS: WordEntry[] = MIYAZAKI_ENTRIES.map(({ word, meaning, example }) => ({
  word,
  meaning,
  example,
}));

/** 方言の特色（国立国語研究所の資料の「方言の特色」の節から。宮崎市青島・1981年収録） */
export const MIYAZAKI_FEATURES: { label: string; std: string; dia: string; note?: string }[] = [
  { label: "「〜い」の形容詞", std: "赤い／黒い／寒い／明るい", dia: "あけ／くり・くりー／さみー／あかり", note: "連母音が溶けて縮む（アイ→エー、オイ→イー、ウイ→イー）" },
  { label: "買った・会って", std: "買った／会って／歌った", dia: "こーた／おーて／うとーた", note: "ワ行の五段動詞は、「て」「た」の前でウ音便になる" },
  { label: "断定", std: "〜だ", dia: "〜じゃ／〜ちゃ" },
  { label: "推量", std: "〜だろう", dia: "〜じゃろ", note: "高年層は「〜どー」も使う" },
  { label: "敬意のある言い方", std: "〜なさる", dia: "〜なはる／〜なる", note: "軽い敬語には「〜やる」。命令形は「〜なはい」「〜ない」" },
  { label: "方向を表す助詞", std: "〜に・〜へ", dia: "〜さね", note: "例：どっちさね いた（どちらに行った）" },
  { label: "理由を表す助詞", std: "〜から", dia: "〜かり／〜かい", note: "高年層は「かり」が一般的。若い世代は「から」も使う" },
  { label: "逆接", std: "〜けれども", dia: "〜けんどん／〜けんど" },
  { label: "終助詞の「の」", std: "〜の？", dia: "〜と？", note: "例：おまえ いくと？（あなたは行くの？）" },
  { label: "否定", std: "起きない／見ない", dia: "おけん／みらん", note: "一段活用の動詞が二段に活用する。共通語の広がりで一段活用も混じる" },
  { label: "過去の習慣", std: "〜ていた", dia: "〜よった", note: "注記では「ヨッタ」を過去の習慣を表す形としている" },
];
