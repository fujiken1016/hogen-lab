"use client";

// 診断結果の閲覧ページ（シェアリンクの着地先）
// /r/XXXX — 相性コードから相手の結果を復元して表示する。
// 見ている人が診断済み（端末に結果保存あり）なら、自動でふたりの相性鑑定も表示。
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CompatCard from "@/components/CompatCard";
import TypeAvatar, { avatarColors } from "@/components/TypeAvatar";
import { decodeCode, loadMyResult, type MyResult } from "@/lib/compat";
import { ARCHETYPES, LEVEL_LABELS, LEVEL_LINES, PERSONA_MODS } from "@/lib/data";
import { MASCOT_NAMES, typeBySlug } from "@/lib/types";

export default function ResultViewPage() {
  const params = useParams<{ code: string }>();
  const [mine, setMine] = useState<MyResult | null>(null);
  useEffect(() => {
    setMine(loadMyResult());
  }, []);

  const decoded = decodeCode(String(params.code ?? ""));
  if (!decoded) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-16">
        <div className="text-5xl">🤔</div>
        <h1 className="text-3xl font-bold">このコードは見つかりませんでした</h1>
        <p className="text-sub text-sm">リンクが欠けているかも。送り主にもう一度確認してみてください。</p>
        <Link href="/shindan" className="btn-primary inline-flex">自分の診断をはじめる</Link>
      </div>
    );
  }

  const { type, cluster, level, code } = decoded;
  const archetype = ARCHETYPES[cluster];
  const personaMod = (PERSONA_MODS[cluster] ?? [])[level - 1] ?? "";
  const heroColor = avatarColors(type.slug);
  const myDecoded = mine ? decodeCode(mine.code) : null;
  const isSelf = mine?.code === code;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 相手の結果ヒーロー */}
      <div className="card overflow-hidden anim-fade-up shine">
        <div
          className="sunburst text-white text-center px-6 pt-8 pb-9 space-y-3"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 20%, ${heroColor.body}66, transparent), linear-gradient(168deg, ${heroColor.dark} 0%, #182A3E 85%)`,
          }}
        >
          <span className="sparkle text-2xl" style={{ top: "14%", left: "12%" }}>✦</span>
          <span className="sparkle text-lg" style={{ top: "28%", right: "10%", animationDelay: "0.9s" }}>✦</span>
          <span className="sparkle text-xl" style={{ top: "68%", right: "16%", animationDelay: "0.4s" }}>✧</span>
          <p className="text-gold text-sm font-bold tracking-widest">
            {isSelf ? "YOUR HOGEN TYPE" : "FRIEND'S HOGEN TYPE"}
          </p>
          <div className="flex justify-center anim-pop">
            <TypeAvatar type={type} size={140} dance />
          </div>
          <p className="text-gold text-sm font-bold">
            {type.dialect}タイプ × {archetype.label}・{LEVEL_LABELS[level - 1]}
          </p>
          <h1 className="leading-tight px-2 text-3xl">
            <span className="block text-sm text-white/80 font-bold tracking-[0.15em] mb-1">— {personaMod} —</span>
            <span className={`font-display font-bold text-goldgrad tracking-tight ${MASCOT_NAMES[type.slug].length >= 8 ? "text-3xl sm:text-5xl" : "text-4xl sm:text-5xl"}`}>
              {MASCOT_NAMES[type.slug]}
            </span>
            <span className="text-sm align-top text-white/60 ml-1">ⓒ</span>
          </h1>
          <p className="text-sm opacity-90">
            {type.emoji} {type.tagline}
          </p>
          <p>
            <span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-1">
              <span className="text-white/70 text-sm">相性コード</span>
              <span className="font-display font-bold text-xl text-gold tracking-[0.2em]">{code}</span>
            </span>
          </p>
        </div>
        <div className="p-6 space-y-5 -mt-4 bg-white rounded-t-2xl relative">
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl flex items-center gap-1.5">
              <span className="hanko !w-5 !h-5 !text-sm !rounded">性</span>基本性格
            </h3>
            <p className="leading-relaxed text-sm">
              {archetype.desc}
              {LEVEL_LINES[level - 1]}
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl flex items-center gap-1.5">
              <span className="hanko !w-5 !h-5 !text-sm !rounded !bg-indigo">言</span>
              {type.dialect}気質
            </h3>
            <p className="leading-relaxed text-sm text-sub">{type.desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">💘 恋愛スタイル</div>
              <p className="text-sub">{archetype.love}</p>
            </div>
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">📖 この人のトリセツ</div>
              <p className="text-sub">{archetype.torisetsu}</p>
            </div>
          </div>
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm">
            <div className="font-bold mb-1">😂 {type.dialect}キャラあるある</div>
            <p className="text-sub">{type.aruaru}</p>
          </div>
        </div>
      </div>

      {/* 見ている人が診断済み → 自動で相性鑑定 */}
      {!isSelf && myDecoded && (
        <>
          <div className="text-center text-sm font-bold text-indigo anim-fade-up">
            ⬇ あなた（{mine?.name ?? MASCOT_NAMES[myDecoded.type.slug]}）との相性
          </div>
          <CompatCard
            a={{ type: myDecoded.type, cluster: myDecoded.cluster, level: myDecoded.level, label: "あなた" }}
            b={{ type, cluster, level, label: MASCOT_NAMES[type.slug] }}
          />
        </>
      )}

      {/* 未診断 → 診断への導線（診断後に自動でこの人との相性を表示） */}
      {!isSelf && !myDecoded && (
        <div className="card p-6 text-center space-y-3">
          <p className="font-bold">この人との相性、気になりませんか？</p>
          <p className="text-sm text-sub">2分の診断であなたのキャラが決まると、そのまま2人の相性が出ます</p>
          <Link href={`/shindan?vs=${code}`} className="btn-primary cta-glow inline-flex px-10 py-3.5">
            診断して相性を見る（無料）
          </Link>
        </div>
      )}

      {isSelf && (
        <p className="text-center text-sm text-sub">これはあなた自身の結果ページです。このURLをそのままシェアできます。</p>
      )}
    </div>
  );
}
