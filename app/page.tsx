"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bush, Cloud, Moon, Stars, Sun, Tree, WaveEdge } from "@/components/Scenery";
import SecretAvatar from "@/components/SecretAvatar";
import { SECRETS, unlockedSecrets } from "@/lib/secret";
import TypeAvatar from "@/components/TypeAvatar";
import { ARTICLES } from "@/lib/articles";
import { DIALECTS, QUIZZES, TodayWord, allBadges, allWords, getBadges, todayWord } from "@/lib/data";
import { MASCOT_NAMES, TYPES } from "@/lib/types";

const TICKER = [
  "なんしよっと？",
  "めっちゃええやん",
  "なまらうまい",
  "だんだん",
  "へばな！",
  "ちばりよー",
  "こじゃんとえいちや",
  "おおきに",
  "ばりよかね！",
  "したっけね〜",
  "でーれーうめえ",
  "わっぜよかど",
  "ぶちええっちゃ",
  "いぎなりいいっちゃ",
  "めたうまいだに",
  "がんこいいがいね",
];

const FEATURES = [
  { href: "/doko", title: "この方言どこ？", desc: "全8問・約1分の方言あて", emoji: "🗾" },
  { href: "/kawaii", title: "かわいい方言対決", desc: "8語のトーナメントで推しを決める", emoji: "💗" },
  { href: "/kurabe", title: "全国方言くらべ", desc: "同じひとことの全国35通り", emoji: "🔤" },
  { href: "/aishou", title: "相性チェッカー", desc: "コード2つで即・相性鑑定", emoji: "💞" },
  { href: "/translate", title: "方言翻訳", desc: "AIが35方言を相互翻訳", emoji: "🗣️" },
  { href: "/quiz", title: "クイズ検定", desc: "合格してバッジを集める", emoji: "🏅" },
  { href: "/today", title: "今日の方言", desc: "1日1語、新しい出会い", emoji: "📅" },
  { href: "/dict", title: "みんなの辞書", desc: "地元の言い回しを投稿", emoji: "📖" },
  { href: "/blog", title: "読みもの", desc: "ランキング・言語学コラム", emoji: "📰" },
];

const STEPS = [
  { n: "01", t: "14問にこたえる", d: "言葉づかい8問＋性格6問を選ぶだけ。約2分。" },
  { n: "02", t: "キャラが判明", d: "35体のご当地キャラから、あなたの相棒が決まる。" },
  { n: "03", t: "友達と相性チェック", d: "リンクを送ると、2人の相性が%で出る。" },
];

export default function Home() {
  const [badges, setBadges] = useState<string[]>([]);
  const [today, setToday] = useState<TodayWord | null>(null);
  const [secretsOpened, setSecretsOpened] = useState<string[]>([]);

  useEffect(() => {
    setBadges(getBadges());
    setToday(todayWord());
    setSecretsOpened(unlockedSecrets());
  }, []);

  const badgeList = allBadges();
  const stats = [
    { n: DIALECTS.length - 1, unit: "方言", sub: "全国カバー" },
    { n: TYPES.length, unit: "キャラ", sub: "ご当地マスコット" },
    { n: Object.values(QUIZZES).flat().length, unit: "問", sub: "検定クイズ" },
    { n: allWords().length, unit: "語", sub: "方言辞典" },
  ];

  return (
    <div className="space-y-9">
      {/* 方言ティッカー */}
      <div className="full-bleed border-y border-line bg-white/80 -mt-6 overflow-hidden">
        <div className="marquee-track py-2 text-sm font-bold text-indigo/80">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-4 whitespace-nowrap">
              {t} <span className="text-primary/50 pl-4">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ヒーロー */}
      <section className="relative grid md:grid-cols-[1.15fr_1fr] items-center gap-8 anim-fade-up">
        {/* 背景あしらい: 空と緑（コンテンツより先に描いて背面に） */}
        <Sun className="w-14 sm:w-16 -top-4 right-0 md:right-6" />
        <Cloud className="w-24 top-8 right-[34%] cloud-drift opacity-90 max-md:hidden" />
        <Cloud className="w-16 -top-2 left-[40%] cloud-drift opacity-70" style={{ animationDelay: "1.8s" }} />
        {/* モバイルはキャラ列と重なるため木・茂みは置かない（雲と太陽のみ） */}
        <div className="space-y-5">
          <p className="text-primary font-bold tracking-[0.25em] text-xs">
            HOGEN TYPE SHINDAN
          </p>
          <h1 className="font-display font-bold leading-none">
            <span className="block text-2xl sm:text-3xl text-sub mb-2">あなたの言葉は、</span>
            <span className="text-7xl sm:text-8xl tracking-tight">
              何<span className="text-primary">弁</span>？
            </span>
          </h1>
          <p className="text-sub text-sm leading-relaxed max-w-md">
            言葉と性格の14問でわかる「方言キャラタイプ診断」。性格も、恋愛傾向も、友達との相性も。
            ふるさとの言葉が、あなたを教えてくれる。
          </p>
          <div className="flex items-center gap-3 text-xs font-bold text-indigo">
            <span>✓ 約2分</span>
            <span>✓ 全14問</span>
            <span>✓ 登録不要</span>
          </div>
          <div className="relative inline-block">
            <Link href="/shindan" className="btn-primary cta-glow text-lg px-12 py-4">
              診断をはじめる
            </Link>
            <span className="stamp w-14 h-14 text-sm absolute -top-5 -right-6">無料</span>
          </div>
          {/* モバイル用キャラ列（PCでは右カラムに表示） */}
          <div className="md:hidden pt-3 space-y-1">
            <div className="flex justify-center gap-6">
              <span className="bubble !text-[10px] rotate-[-4deg]">なんしよっと？</span>
              <span className="bubble !text-[10px] rotate-[3deg]">めっちゃええやん</span>
            </div>
            <div className="flex -space-x-2 justify-center">
              {[9, 11, 29, 21, 34, 5, 16].map((idx, i) => (
                <div key={idx} style={{ transform: `rotate(${[-6, 4, -3, 5, -4, 3, -5][i]}deg)` }}>
                  <div className="avatar-float" style={{ animationDelay: `${i * 0.35}s` }}>
                    <TypeAvatar type={TYPES[idx]} size={56} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-md:hidden">
          {/* キャラたちの足元に木と茂み */}
          <Tree className="w-14 -bottom-8 -left-4 tree-sway opacity-90" />
          <Bush className="w-24 -bottom-6 right-0 opacity-80" />
          <div className="grid grid-cols-3 gap-2 justify-items-center pt-8">
            {[10, 12, 30].map((idx, i) => (
              <div key={idx} className="relative avatar-float" style={{ animationDelay: `${i * 0.35}s` }}>
                {i === 0 && (
                  <span className="bubble absolute -top-9 -left-3 whitespace-nowrap">なんしよっと？</span>
                )}
                <TypeAvatar type={TYPES[idx]} size={92} />
              </div>
            ))}
            {[3, 22, 34].map((idx, i) => (
              <div key={idx} className="relative avatar-float" style={{ animationDelay: `${(i + 3) * 0.35}s` }}>
                {i === 2 && (
                  <span className="bubble absolute -top-9 right-0 whitespace-nowrap">めっちゃええやん</span>
                )}
                <TypeAvatar type={TYPES[idx]} size={92} />
              </div>
            ))}
          </div>
          <span className="tate absolute -right-2 top-0 font-display text-sm text-sub/70 max-lg:hidden">
            ふるさとの言葉と、遊ぼう。
          </span>
        </div>
      </section>

      {/* キャラ・ステッカー・マーキー（POP MARTグッズ風の斜めテープ帯） */}
      <div className="full-bleed overflow-hidden -rotate-1 scale-x-105 bg-gold/20 border-y-2 border-dashed border-gold/50 shadow-sm">
        <div className="marquee-track marquee-rev items-center py-2">
          {[...TYPES, ...TYPES].map((t, i) => (
            <span key={i} className="px-2.5 shrink-0">
              <TypeAvatar type={t} size={52} still />
            </span>
          ))}
        </div>
      </div>

      {/* 統計バンド（紺の全幅・夜空あしらい） */}
      <div className="full-bleed bg-indigo-deep text-white relative overflow-hidden">
        <Stars className="w-44 top-0 left-[3%] opacity-70" />
        <Stars className="w-32 bottom-0 right-[18%] opacity-50" />
        <Moon className="w-9 top-2 right-[4%] opacity-90 max-sm:hidden" />
        <div className="max-w-5xl mx-auto grid grid-cols-4 divide-x divide-white/15 relative">
          {stats.map((s) => (
            <div key={s.unit} className="py-5 text-center">
              <div className="font-black text-2xl sm:text-3xl text-gold leading-none">
                {s.n}
                <span className="text-xs font-bold ml-0.5 text-white/80">{s.unit}</span>
              </div>
              <div className="text-[10px] text-white/60 mt-1.5 tracking-widest">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* キャラのステッカー帯（逆方向マーキー） */}
      <div className="full-bleed overflow-hidden bg-white/70 border-y border-line -mt-3">
        <div className="marquee-track marquee-rev py-2 items-center">
          {[...TYPES, ...TYPES].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 shrink-0">
              <span style={{ transform: `rotate(${[-5, 4, -3, 5][i % 4]}deg)` }} className="inline-block">
                <TypeAvatar type={t} size={52} still />
              </span>
              <span className="chip !px-2 !py-0.5 !text-[10px] bg-primary/10 text-primary whitespace-nowrap">
                {MASCOT_NAMES[t.slug]}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 3ステップ */}
      <section className="space-y-5">
        <div className="section-head">
          <span className="hanko-sq">流</span>
          <div>
            <span className="sub">HOW TO PLAY</span>
            <h2 className="ttl">たった1分、3ステップ</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="!rounded-xl border border-line shadow-[0_2px_12px_rgba(34,48,63,0.06)] p-5 pr-16 relative overflow-hidden anim-fade-up"
              style={{ animationDelay: `${i * 0.12}s`, background: ["#FDEFEC", "#FFF6E0", "#EAF3F1"][i] }}
            >
              <span className="font-display font-bold text-6xl text-primary/10 absolute -top-2 right-2 select-none">
                {s.n}
              </span>
              <div className="absolute -bottom-2 -right-2 rotate-[-8deg]">
                <TypeAvatar type={TYPES[[1, 13, 33][i]]} size={62} />
              </div>
              <div className="text-xs font-bold text-primary mb-1">STEP {s.n}</div>
              <div className="font-bold mb-1">{s.t}</div>
              <p className="text-xs text-sub leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* キャラ図鑑 */}
      <section id="zukan" className="space-y-4 relative">
        <div className="section-head">
          <span className="hanko-sq">図</span>
          <div>
            <span className="sub">CHARACTER ZUKAN</span>
            <h2 className="ttl">方言キャラ図鑑 — 全{TYPES.length}体</h2>
          </div>
          <Link href="/shindan" className="ml-auto text-xs text-primary font-bold hover:underline shrink-0">
            自分のキャラを調べる →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {TYPES.filter((t) => t.slug !== "std").map((t, i) => (
            <div key={t.slug} style={{ transform: `rotate(${[-1.6, 1.2, -0.8, 1.8, -1.2][i % 5]}deg)` }}>
              <Link
                href={`/c/${t.slug}`}
                className="block !rounded-xl border border-line shadow-[0_2px_10px_rgba(34,48,63,0.07)] p-2.5 text-center hover:-translate-y-1 hover:shadow-lg transition-all anim-wiggle-hover anim-fade-up"
                style={{
                  animationDelay: `${Math.min(i * 0.03, 0.5)}s`,
                  background: ["#FFF3F0", "#FFF8E6", "#EFF6F1", "#F0F4FA", "#F9F0F7"][i % 5],
                }}
              >
                <div className="flex justify-center">
                  <TypeAvatar type={t} size={92} bg />
                </div>
                <div className="text-[10px] font-bold text-primary leading-tight mt-1 truncate">
                  {MASCOT_NAMES[t.slug]}
                </div>
                <div className="text-[10px] text-sub">{t.dialect}</div>
              </Link>
            </div>
          ))}
          {/* シークレット枠（未解放はモザイク＋？。診断で引き当てると解放） */}
          {SECRETS.map((s, i) => {
            const opened = secretsOpened.includes(s.slug);
            return (
              <div key={s.slug} style={{ transform: `rotate(${i % 2 ? 1.4 : -1.4}deg)` }}>
                <Link
                  href={`/c/${s.slug}`}
                  className="block !rounded-xl border-2 border-gold/70 p-2.5 text-center relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
                  style={{ background: "linear-gradient(160deg, #241C3A, #3A2A5E)" }}
                  title={opened ? s.name : "診断でごくまれに出現…"}
                >
                  <span className="sparkle text-xs" style={{ top: "6%", left: "10%" }}>✦</span>
                  <span className="sparkle text-xs" style={{ top: "14%", right: "8%", animationDelay: "1.2s" }}>✧</span>
                  <div className={`flex justify-center ${opened ? "" : "secret-hidden"}`}>
                    <SecretAvatar slug={s.slug} size={92} bg />
                  </div>
                  {!opened && (
                    <div className="absolute inset-x-0 top-6 grid place-items-center pointer-events-none">
                      <span className="text-5xl font-black text-white/95 drop-shadow-lg font-display">？</span>
                    </div>
                  )}
                  <div className="text-[10px] font-bold text-gold leading-tight mt-1 truncate">
                    {opened ? s.name : "？？？"}
                  </div>
                  <div className="text-[10px] text-white/60">{opened ? "SECRET" : s.rateLabel}</div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 機能 ＋ 今日の方言 */}
      <section className="grid lg:grid-cols-[1.2fr_1fr] gap-4 items-start relative">
        <Cloud className="w-20 -top-8 right-[6%] cloud-drift opacity-60 max-sm:hidden" />
        <div className="space-y-3">
          <div className="section-head">
            <span className="hanko-sq">遊</span>
            <div>
              <span className="sub">PLAY MORE</span>
              <h2 className="ttl">あそびかた</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map((f, i) => (
              <Link
                key={f.href}
                href={f.href}
                className="!rounded-xl border border-line shadow-[0_2px_10px_rgba(34,48,63,0.07)] p-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                style={{ background: ["#FFF3F0", "#EFF6F1", "#FFF8E6", "#F0F4FA", "#F6F0FA", "#FFF1F6"][i % 6] }}
              >
                <span className="text-3xl shrink-0">{f.emoji}</span>
                <span>
                  <span className="font-bold text-sm block">{f.title}</span>
                  <span className="text-[11px] text-sub">{f.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="section-head">
            <span className="hanko-sq">今</span>
            <div>
              <span className="sub">TODAY</span>
              <h2 className="ttl">今日の方言</h2>
            </div>
          </div>
          {today && (
            <Link href="/today" className="card !rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all">
              <div className="text-center shrink-0">
                <div className="chip bg-indigo/10 text-indigo">{today.dialect}</div>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xl font-display truncate">{today.word}</div>
                <div className="text-xs text-sub truncate">
                  {today.meaning} —「{today.example}」
                </div>
              </div>
              <span className="ml-auto text-primary text-sm shrink-0">→</span>
            </Link>
          )}
          <div className="card !rounded-xl p-4">
            <div className="text-xs font-bold mb-2">
              🏅 獲得バッジ（{badges.length}/{badgeList.length}）
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-hidden">
              {badgeList.map((b) => (
                <span
                  key={b.id}
                  title={b.desc}
                  className={`chip !text-[10px] !px-2 border ${
                    badges.includes(b.id)
                      ? "bg-gold/15 border-gold/60 text-amber-800"
                      : "bg-paper border-line text-sub/60"
                  }`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 読みもの（記事一覧への導線） */}
      <section className="space-y-3">
        <div className="section-head">
          <span className="hanko-sq">読</span>
          <div>
            <span className="sub">ARTICLES</span>
            <h2 className="ttl">読みもの</h2>
          </div>
          <Link href="/blog" className="ml-auto btn-ghost text-xs shrink-0">
            一覧へ →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {/* 記事が増えたのでトップは最新6本まで。残りは /blog へ */}
          {[...ARTICLES].reverse().slice(0, 6).map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="card !rounded-xl p-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <span className="text-3xl shrink-0" aria-hidden>
                {a.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-[13px] leading-snug line-clamp-2">{a.title}</span>
                <span className="block text-[11px] text-sub mt-1">
                  {a.category}・約{a.readMin}分
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* クロージングCTA（紺の全幅バンド・波打ち際の夜空） */}
      <div className="full-bleed bg-indigo-deep text-white -mb-6 relative overflow-hidden">
        {/* 上端: 生成りの紙から海へ入る波打ち際 */}
        <WaveEdge color="#faf7f0" flip className="h-7" />
        <Stars className="w-48 top-8 left-[5%] opacity-70" />
        <Stars className="w-36 top-4 right-[8%] opacity-60" />
        <Moon className="w-10 top-10 right-[5%] opacity-90 max-sm:hidden" />
        <div className="max-w-5xl mx-auto px-4 py-10 text-center space-y-6 relative">
          <div className="flex justify-center gap-1 flex-wrap opacity-95">
            {[1, 5, 9, 13, 17, 21, 25, 29, 33].map((idx, i) => (
              <div key={idx} className="avatar-float" style={{ animationDelay: `${i * 0.25}s` }}>
                <TypeAvatar type={TYPES[idx]} size={56} />
              </div>
            ))}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            さあ、あなたは<span className="text-gold">何弁</span>？
          </h2>
          <p className="text-white/70 text-sm">
            全国{DIALECTS.length - 1}方言・{TYPES.length}キャラ。あなたの相棒が待っています。
          </p>
          <div className="relative inline-block">
            <Link href="/shindan" className="btn-primary text-lg px-12 py-4">
              無料で診断をはじめる
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
