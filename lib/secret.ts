// シークレットキャラ（ブラインドボックスのレア枠）
// 診断結果の確定時に低確率で出現し、引き当てると図鑑のモザイクが解放される。
// 抽選は回答指紋から決定論的に行う（同じ回答なら同じ結果＝リロードで乱数ガチャ不可）。

export type SecretChar = {
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  rate: number; // 出現確率（0〜1）
  rateLabel: string;
};

export const SECRETS: SecretChar[] = [
  {
    slug: "ryujin",
    name: "ことだま龍神",
    tagline: "全国の方言を千年聞き続けた、言葉の神様",
    desc: "日本中の「ありがとう」も「あほか」も、ぜんぶ聞いて育った言葉の龍神さま。あなたの話す言葉には、土地の記憶と人の情が宿っている——それを一番よく知っている存在です。龍神に出会えたあなたの言葉は、今日からちょっとだけ縁起がよくなります。",
    rate: 0.0001,
    rateLabel: "出現率0.01%",
  },
  {
    slug: "zashiki",
    name: "ざしきわらしちゃん",
    tagline: "会えた人に福を運ぶ、いたずら好きの座敷童",
    desc: "古い家の奥で、方言むかし話を聞くのが大好きな座敷童。気に入った人の診断にだけ、こっそり遊びに来ます。ざしきわらしに会えた家は栄えると言いますから、今日のあなたはかなりツイてます。",
    rate: 0.001,
    rateLabel: "出現率0.1%",
  },
];

// シークレット専用の高解像度乱数（1/100万刻み。0.01%を表現するため）
// 回答指紋から決定論的に生成: 同じ回答なら同じ結果＝リロードでのガチャ稼ぎ不可
export function secretRand(seed: string): number {
  const s = seed + "|secret";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000000) / 1000000;
}

// 0〜1の乱数（決定論的なジッター値）からシークレットを抽選。ハズレはnull
export function rollSecret(rand: number): SecretChar | null {
  let acc = 0;
  for (const s of SECRETS) {
    acc += s.rate;
    if (rand < acc) return s;
  }
  return null;
}

const SECRET_KEY = "hogen-secrets-unlocked";

export function unlockedSecrets(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SECRET_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function unlockSecret(slug: string): void {
  try {
    const cur = unlockedSecrets();
    if (!cur.includes(slug)) {
      localStorage.setItem(SECRET_KEY, JSON.stringify([...cur, slug]));
    }
  } catch {}
}
