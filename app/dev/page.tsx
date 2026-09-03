"use client";

// キャラデザイン確認室（内部用・ナビからはリンクしない）
// シークレット2体の大型プレビュー＋全35キャラのバリエーション一覧
import SecretAvatar from "@/components/SecretAvatar";
import TypeAvatar from "@/components/TypeAvatar";
import { SECRETS } from "@/lib/secret";
import { MASCOT_NAMES, TYPES } from "@/lib/types";

export default function DevCharsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">キャラデザイン確認室</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">シークレット2体（実寸より大きめ・全アニメ有効）</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SECRETS.map((s) => (
            <div
              key={s.slug}
              className="rounded-2xl border-2 border-gold p-6 text-center space-y-3"
              style={{ background: "linear-gradient(160deg, #241C3A, #3A2A5E)" }}
            >
              <div className="flex justify-center">
                <SecretAvatar slug={s.slug} size={230} dance bg />
              </div>
              <div className="text-goldgrad font-display font-bold text-2xl">{s.name}</div>
              <p className="text-white/80 text-sm">{s.tagline}</p>
              <p className="text-white/50 text-sm">{s.rateLabel}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">全35キャラ（目・口・ほっぺのバリエーション確認用）</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {TYPES.filter((t) => t.slug !== "std").map((t) => (
            <div key={t.slug} className="card !rounded-xl p-2 text-center">
              <div className="flex justify-center">
                <TypeAvatar type={t} size={92} bg />
              </div>
              <div className="text-sm font-bold text-primary-text truncate">{MASCOT_NAMES[t.slug]}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
