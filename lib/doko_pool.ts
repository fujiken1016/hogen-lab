// /doko「この方言どこの言葉？」の出題プール。
// 2026-08 に1語ずつウェブ出典（goo全国方言辞典・自治体/観光公式・地方紙・大学資料など）と
// 突き合わせて選んだリスト。検証の範囲と結果は DICT_AUDIT.md に記録している。
//
// 追加するときの条件:
//  1. lib/data.ts か lib/words_extra.ts に同じ表記で収録されていること（意味・例文はそこから引く）
//  2. 出典で「その地方の語」と確認できること
//  3. 複数の地方で使われる語は入れない（正解が一意に決まらないため）
//     — 実際に「したっけ」「だいじ」「ささって」「ラーフル」などはこの理由で外した

export type DokoSeed = { word: string; dialect: string };

export const DOKO_SEEDS: DokoSeed[] = [
  // ── 北海道・東北（18語）
  { word: "なまら", dialect: "北海道弁" },
  { word: "じょっぴんかる", dialect: "北海道弁" },
  { word: "押ささる", dialect: "北海道弁" },
  { word: "ゆるくない", dialect: "北海道弁" },
  { word: "けやぐ", dialect: "津軽弁" },
  { word: "じょっぱり", dialect: "津軽弁" },
  { word: "まいね", dialect: "津軽弁" },
  { word: "どさ", dialect: "津軽弁" },
  { word: "おでんせ", dialect: "南部弁" },
  { word: "じゃじゃじゃ", dialect: "南部弁" },
  { word: "ごっしゃぐ", dialect: "仙台弁" },
  { word: "おだづもっこ", dialect: "仙台弁" },
  { word: "いずい", dialect: "仙台弁" },
  { word: "しったげ", dialect: "秋田弁" },
  { word: "どでんする", dialect: "秋田弁" },
  { word: "おしょうしな", dialect: "山形弁" },
  { word: "もっけだ", dialect: "山形弁" },
  { word: "むがさり", dialect: "山形弁" },
  // ── 関東（4語）
  { word: "ごじゃっぺ", dialect: "茨城弁" },
  { word: "いじやける", dialect: "茨城弁" },
  { word: "しゃあんめ", dialect: "茨城弁" },
  { word: "かんそいも", dialect: "茨城弁" },
  // ── 甲信越・北陸（12語）
  { word: "なじらね", dialect: "新潟弁" },
  { word: "じょんのび", dialect: "新潟弁" },
  { word: "のめしこき", dialect: "新潟弁" },
  { word: "まいどはや", dialect: "富山弁" },
  { word: "きのどくな", dialect: "富山弁" },
  { word: "つかえん", dialect: "富山弁" },
  // 「だちゃかん」「つるつるいっぱい」「きんかんなまなま」は 2026-08-31 に外した。
  // 金沢市公式の方言集 全5編・加藤和夫(2022) の石川県の方言景観・国語研 談話DB 第10巻の
  // いずれにも金沢（石川）を名指しした立項が無く、「だちゃかん」は富山（小矢部市）に、
  // 「つるつるいっぱい」は福井（福井市もてなしキャンペーン・福井弁グッズ）に実例が出た。
  // 辞典（lib/data.ts / lib/words_extra.ts）からは消していない＝未確認として残している。
  { word: "あんやと", dialect: "金沢弁" },
  { word: "いんぎらーっと", dialect: "金沢弁" },
  { word: "ずくなし", dialect: "信州弁" },
  { word: "ごしたい", dialect: "信州弁" },
  { word: "おこびれ", dialect: "信州弁" },
  { word: "なから", dialect: "信州弁" },
  // ── 東海（14語）
  { word: "ときんときん", dialect: "名古屋弁" },
  { word: "やっとかめ", dialect: "名古屋弁" },
  { word: "でら", dialect: "名古屋弁" },
  { word: "ちんちこちん", dialect: "名古屋弁" },
  { word: "ケッタ", dialect: "名古屋弁" },
  { word: "放課", dialect: "名古屋弁" },
  { word: "B紙", dialect: "名古屋弁" },
  { word: "まわし", dialect: "名古屋弁" },
  { word: "しょんない", dialect: "静岡弁" },
  { word: "みるい", dialect: "静岡弁" },
  { word: "だもんで", dialect: "静岡弁" },
  { word: "かんぴんたん", dialect: "伊勢弁" },
  { word: "はんちくたい", dialect: "飛騨弁" },
  { word: "雪またじ", dialect: "飛騨弁" },
  // ── 近畿（11語）
  { word: "おおきに", dialect: "京都弁" },
  { word: "かんにん", dialect: "京都弁" },
  { word: "はんなり", dialect: "京都弁" },
  { word: "おばんざい", dialect: "京都弁" },
  { word: "にぬき", dialect: "京都弁" },
  { word: "おこしやす", dialect: "京都弁" },
  { word: "いけず", dialect: "大阪弁" },
  { word: "いちびる", dialect: "大阪弁" },
  { word: "でぼちん", dialect: "大阪弁" },
  { word: "ダボ", dialect: "神戸弁" },
  { word: "つれもて", dialect: "和歌山弁" },
  // ── 中国（11語）
  { word: "ぶち", dialect: "広島弁" },
  { word: "かばちたれ", dialect: "広島弁" },
  { word: "いたしい", dialect: "広島弁" },
  { word: "もんげー", dialect: "岡山弁" },
  { word: "でーれー", dialect: "岡山弁" },
  { word: "ぼっけえ", dialect: "岡山弁" },
  { word: "おえん", dialect: "岡山弁" },
  { word: "おいでませ", dialect: "山口弁" },
  { word: "まめなかね", dialect: "出雲弁" },
  { word: "ちょんぼし", dialect: "出雲弁" },
  { word: "うちげ", dialect: "鳥取弁" },
  // ── 四国（13語）
  { word: "こじゃんと", dialect: "土佐弁" },
  { word: "いごっそう", dialect: "土佐弁" },
  { word: "はちきん", dialect: "土佐弁" },
  { word: "おきゃく", dialect: "土佐弁" },
  { word: "まっこと", dialect: "土佐弁" },
  { word: "じょんならん", dialect: "讃岐弁" },
  { word: "まんでがん", dialect: "讃岐弁" },
  { word: "ほっこ", dialect: "讃岐弁" },
  { word: "むつごい", dialect: "讃岐弁" },
  { word: "ぞなもし", dialect: "伊予弁" },
  { word: "もんた", dialect: "伊予弁" },
  { word: "ほなけん", dialect: "阿波弁" },
  { word: "えっとぶり", dialect: "阿波弁" },
  // ── 九州・沖縄（17語）
  { word: "とっとーと", dialect: "博多弁" },
  { word: "しゃーしい", dialect: "博多弁" },
  { word: "ちかっぱ", dialect: "博多弁" },
  { word: "すいとーよ", dialect: "博多弁" },
  { word: "あとぜき", dialect: "熊本弁" },
  { word: "もっこす", dialect: "熊本弁" },
  { word: "さしより", dialect: "熊本弁" },
  { word: "わっぜ", dialect: "鹿児島弁" },
  { word: "おやっとさあ", dialect: "鹿児島弁" },
  { word: "げんね", dialect: "鹿児島弁" },
  { word: "めんそーれ", dialect: "沖縄方言" },
  { word: "なんくるないさ", dialect: "沖縄方言" },
  { word: "ちばりよー", dialect: "沖縄方言" },
  { word: "ちむどんどん", dialect: "沖縄方言" },
  { word: "よだきい", dialect: "大分弁" },
  { word: "みじょか", dialect: "長崎弁" },
  { word: "やぐらしか", dialect: "長崎弁" },
];
