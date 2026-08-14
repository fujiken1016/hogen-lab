"use client";

// 多角相性カード（占い級のボリューム）
// スコア＋5軸チャート＋五行＋性格の噛み合わせ＋ラッキー方言＋ケンカ予報＋開運アクション
import { useEffect, useState } from "react";
import SecretAvatar from "@/components/SecretAvatar";
import ShareBar from "@/components/ShareBar";
import { meter, shareBlock } from "@/lib/share_text";
import TypeAvatar from "@/components/TypeAvatar";
import { buildCompat } from "@/lib/compat";
import { SHINDAN_PHRASES, wordsOf } from "@/lib/data";
import { DialectType, MASCOT_NAMES } from "@/lib/types";

function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export type CompatPerson = { type: DialectType; cluster?: string; level?: number; label: string };

/**
 * shareUrl を渡した画面（/aishou）だけ、カードの末尾にシェア導線を出す。
 * 診断結果ページ（/shindan・/r）は下に専用のシェア枠があるので渡さない＝二重表示にしない。
 */
export default function CompatCard({ a, b, shareUrl }: { a: CompatPerson; b: CompatPerson; shareUrl?: string }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(t);
  }, [a.type.slug, b.type.slug]);

  const luckyWordOf = (dialect: string, seed: string) => {
    const pool = wordsOf(dialect);
    if (!pool.length) return "";
    const w = pool[hashOf(seed) % pool.length];
    return `${w.word}（${w.meaning}）`;
  };
  const c = buildCompat(a, b, luckyWordOf);
  const nakanaori = SHINDAN_PHRASES[b.type.dialect]?.["ありがとう"] ?? "ありがとう";

  return (
    <div className="card overflow-hidden">
      {/* スコアヒーロー */}
      <div
        className="text-center px-6 py-7 space-y-3 text-white sunburst"
        style={{ background: "linear-gradient(160deg, #4B3BC4 0%, #6C5CE7 60%, #FF4D6D 130%)" }}
      >
        <p className="text-xs font-bold tracking-[0.3em] text-white/80">AISHOU KANTEI</p>
        <div className="flex justify-center items-center gap-3 sm:gap-5">
          <div className="text-center">
            <TypeAvatar type={a.type} size={84} />
            <div className="text-[11px] mt-1 font-bold">{a.label}</div>
            <div className="text-[10px] text-white/70">{a.type.dialect}</div>
          </div>
          <span className="text-3xl font-black text-gold">×</span>
          <div className="text-center">
            <TypeAvatar type={b.type} size={84} />
            <div className="text-[11px] mt-1 font-bold">{b.label}</div>
            <div className="text-[10px] text-white/70">{b.type.dialect}</div>
          </div>
        </div>
        <div className="font-display font-black text-6xl anim-pop">
          {c.score}
          <span className="text-2xl">%</span>
        </div>
        <div className="font-bold">{c.title}</div>
        <p className="text-sm text-white/85 leading-relaxed max-w-md mx-auto">{c.comment}</p>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* 5軸チャート */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <span className="hanko !w-5 !h-5 !text-[10px] !rounded">診</span>5つの相性軸
          </h3>
          {c.axes.map((ax, i) => (
            <div key={ax.label}>
              <div className="flex items-center gap-3">
                <span className="w-28 text-xs font-bold shrink-0">
                  {ax.icon} {ax.label}
                </span>
                <div className="flex-1 bg-line/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out bg-primary bar-shimmer"
                    style={{ width: `${grown ? ax.n * 20 : 0}%`, transitionDelay: `${i * 0.1}s` }}
                  />
                </div>
                <span className="text-gold text-xs w-16 text-right tracking-tight shrink-0">
                  {"★".repeat(ax.n)}
                  {"☆".repeat(5 - ax.n)}
                </span>
              </div>
              <p className="text-[11px] text-sub mt-0.5 ml-[7.75rem] leading-relaxed max-sm:ml-0">{ax.text}</p>
            </div>
          ))}
        </div>

        {/* 五行の関係 */}
        <div className="bg-indigo/5 border border-indigo/15 rounded-xl p-4 space-y-1">
          <div className="font-bold text-sm text-indigo">☯ ことだま五行 — {c.gogyo.label}</div>
          <p className="text-xs text-sub leading-relaxed">{c.gogyo.text}</p>
        </div>

        {/* 性格の噛み合わせ（両者のコードがある時だけ） */}
        {c.clusterRel && (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 space-y-1">
            <div className="font-bold text-sm text-amber-800">🧩 性格の噛み合わせ</div>
            <p className="text-xs text-sub leading-relaxed">{c.clusterRel}</p>
          </div>
        )}

        {/* ふたりのラッキー方言 */}
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-paper rounded-xl px-3.5 py-2.5">
            <span className="font-bold text-primary">✦ {a.label}から贈る方言</span>
            <p className="mt-1 font-bold text-sm">{c.luckyA}</p>
          </div>
          <div className="bg-paper rounded-xl px-3.5 py-2.5">
            <span className="font-bold text-primary">✦ {b.label}から贈る方言</span>
            <p className="mt-1 font-bold text-sm">{c.luckyB}</p>
          </div>
        </div>

        {/* ケンカ予報＋仲直り＋開運アクション */}
        <div className="space-y-2 text-xs">
          <div className="bg-paper rounded-xl px-3.5 py-2.5">
            <span className="font-bold">⚡ ケンカ予報</span>
            <p className="mt-1 text-sub leading-relaxed">{c.kenka}</p>
            <p className="mt-1.5">
              仲直りの合言葉は {b.type.dialect}で「<b className="text-primary">{nakanaori}</b>」
            </p>
          </div>
          <div className="bg-paper rounded-xl px-3.5 py-2.5">
            <span className="font-bold">🎐 ふたりの開運アクション</span>
            <p className="mt-1 text-sub leading-relaxed">{c.action}</p>
          </div>
        </div>

        {shareUrl && (
          <div className="border-t border-line pt-4">
            {/* Wordle型: タイプ名も鑑定文も出さず、スコアの「形」だけ渡す */}
            <ShareBar
              text={`【方言ラボ】相性チェッカーで鑑定したら${c.score}%でした #方言ラボ`}
              url={shareUrl}
              block={shareBlock([
                `方言タイプ相性チェッカー`,
                `${meter(c.score, 8, "💗", "🤍")} ${c.score}%`,
                `あなたたちは何%？ コード2つ入れるだけ #方言ラボ`,
              ])}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// re-export（aishouページで使う）
export { MASCOT_NAMES };
export type { DialectType };
export { SecretAvatar };
