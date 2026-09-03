"use client";

// キャラ紹介ページ — 図鑑からキャラをタップで到達。
// ご当地背景つきヒーロー＋プロフィール＋方言サンプル＋あいさつ集＋相性キャラ＋前後ナビ
import Link from "next/link";
import { useParams } from "next/navigation";
import CompatCard from "@/components/CompatCard";
import { useEffect, useState } from "react";
import TypeAvatar, { avatarColors } from "@/components/TypeAvatar";
import { decodeCode, loadMyResult, type MyResult } from "@/lib/compat";
import { track } from "@/lib/ga";
import { SHINDAN_PHRASES, wordsOf } from "@/lib/data";
import { aliasParen } from "@/lib/dialect_alias";
import SecretAvatar from "@/components/SecretAvatar";
import { SECRETS, unlockedSecrets } from "@/lib/secret";
import {
  TRANSLATE_AREA_OF,
  TRANSLATE_DIALECTS,
  translateSiblings,
  translateSlug,
} from "@/lib/translate_meta";
import { MASCOT_NAMES, TYPES, typeBySlug } from "@/lib/types";

const GREETING_KEYS = ["ありがとう", "じゃあね", "とてもおいしい", "久しぶり"] as const;

export default function CharPage() {
  const params = useParams<{ slug: string }>();
  const [mine, setMine] = useState<MyResult | null>(null);
  const [opened, setOpened] = useState<string[]>([]);
  useEffect(() => {
    setMine(loadMyResult());
    setOpened(unlockedSecrets());
  }, []);

  // シークレットキャラのページ（未解放なら正体を明かさないティザー）
  const secret = SECRETS.find((x) => x.slug === String(params.slug ?? ""));
  if (secret) {
    const isOpen = opened.includes(secret.slug);
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center">
          <Link href="/#zukan" className="inline-flex min-h-[48px] items-center text-sm font-bold text-primary-text hover:underline">← 図鑑にもどる</Link>
        </div>
        <div className="rounded-2xl overflow-hidden border-2 border-gold relative">
          <div
            className="sunburst text-center px-6 py-9 space-y-4"
            style={{ background: "linear-gradient(160deg, #241C3A 0%, #3A2A5E 55%, #4B3BC4 100%)" }}
          >
            <span className="sparkle text-2xl" style={{ top: "8%", left: "10%" }}>✦</span>
            <span className="sparkle text-lg" style={{ top: "16%", right: "12%", animationDelay: "0.8s" }}>✧</span>
            <span className="sparkle text-xl" style={{ bottom: "14%", left: "16%", animationDelay: "1.4s" }}>✦</span>
            <p className="text-gold text-sm font-bold tracking-[0.4em]">★ S E C R E T ★</p>
            <div className="relative inline-block">
              <div className={isOpen ? "" : "secret-hidden"}>
                <SecretAvatar slug={secret.slug} size={200} dance bg={isOpen} />
              </div>
              {!isOpen && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <span className="text-7xl font-bold text-white/95 drop-shadow-lg font-display">？</span>
                </div>
              )}
            </div>
            <h1 className="font-display font-bold text-3xl text-goldgrad tracking-wide">
              {isOpen ? secret.name : "？？？"}
            </h1>
            <p className="text-white/85 text-sm font-bold">
              {isOpen ? secret.tagline : "その正体は、出会った者にしか明かされない——"}
            </p>
            {isOpen ? (
              <p className="text-white/70 text-sm leading-relaxed max-w-md mx-auto">{secret.desc}</p>
            ) : (
              <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                方言診断の結果発表の瞬間、ごくまれに降臨する幻のキャラ。
                <br />
                狙って出すことはできません。出会えるかは、その日の言霊しだい。
              </p>
            )}
            <p className="inline-block rounded-full border border-gold/50 text-gold text-sm font-bold px-4 py-1">
              {secret.rateLabel}{isOpen ? " — 出会済み・図鑑解放済み" : ""}
            </p>
          </div>
        </div>
        <div className="card p-6 text-center space-y-3">
          {isOpen ? (
            <>
              <p className="font-bold">あなたは{secret.name}に出会えた、選ばれし人です</p>
              <p className="text-sm text-sub">この確率を引いた強運、今日は大事に使ってください</p>
            </>
          ) : (
            <p className="font-bold">今日の診断で、降臨するかも…？</p>
          )}
          <Link href="/shindan" className="btn-primary cta-glow inline-flex px-10 py-3.5">
            {isOpen ? "もう一度診断する" : "診断をはじめる（無料）"}
          </Link>
        </div>
      </div>
    );
  }

  const type = typeBySlug(String(params.slug ?? ""));
  if (!type || type.slug === "std") {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-16">
        <div className="text-5xl">🔍</div>
        <h1 className="text-3xl font-bold">このキャラは見つかりませんでした</h1>
        <Link href="/#zukan" className="btn-primary inline-flex">図鑑にもどる</Link>
      </div>
    );
  }

  const heroColor = avatarColors(type.slug);
  const name = MASCOT_NAMES[type.slug];
  const allWords = wordsOf(type.dialect);
  const words = allWords.slice(0, 6);
  // このページは noindex, follow のまま。検索から「○○弁 変換」で迷い込んだ人を、
  // 正しい受け皿 /translate/<同地域> へ確実に送る（SC実測で /c/hakata・/c/okayama 等が
  // 「福岡弁 変換」「岡山弁変換」で順位50〜76に出ていた。サイクル14の発見①）。
  const tSlug = TRANSLATE_DIALECTS.includes(type.dialect) ? translateSlug(type.dialect) : undefined;
  const area = TRANSLATE_AREA_OF[type.dialect] ?? "";
  const alias = aliasParen(type.dialect);
  const siblings = tSlug ? translateSiblings(type.dialect).slice(0, 6) : [];
  const phrases = SHINDAN_PHRASES[type.dialect] ?? {};
  const zukan = TYPES.filter((t) => t.slug !== "std");
  const idx = zukan.findIndex((t) => t.slug === type.slug);
  const prev = zukan[(idx - 1 + zukan.length) % zukan.length];
  const next = zukan[(idx + 1) % zukan.length];
  const bestTypes = type.best.map((s) => typeBySlug(s)).filter(Boolean);
  const trickyTypes = type.tricky.map((s) => typeBySlug(s)).filter(Boolean);
  const myDecoded = mine ? decodeCode(mine.code) : null;

  // 回遊導線のクリック計測。dest=遷移先の種別 / slot=ページ内のどの位置か /
  // dialect_slug=遷移先の地域slug（既存の quiz_start・translate_to_quiz と同じ命名流儀）
  const toTool = (dest: string, slot: string, dialectSlug?: string) => () =>
    track("char_to_tool", {
      dest,
      slot,
      char_slug: type.slug,
      dialect: type.dialect,
      dialect_slug: dialectSlug ?? "",
    });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* 前後ナビ */}
      <div className="flex items-center justify-between text-sm font-bold">
        <Link href={`/c/${prev.slug}`} className="btn-ghost">← {MASCOT_NAMES[prev.slug]}</Link>
        <Link href="/#zukan" className="inline-flex min-h-[48px] items-center text-primary-text hover:underline">図鑑にもどる</Link>
        <Link href={`/c/${next.slug}`} className="btn-ghost">{MASCOT_NAMES[next.slug]} →</Link>
      </div>

      {/* ヒーロー（ご当地背景つき） */}
      <div className="card overflow-hidden anim-fade-up">
        <div
          className="text-center px-6 pt-7 pb-8 space-y-3 text-white"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 20%, ${heroColor.body}55, transparent), linear-gradient(168deg, ${heroColor.dark} 0%, #182A3E 90%)`,
          }}
        >
          <p className="text-gold text-sm font-bold tracking-widest">CHARACTER FILE No.{String(idx + 1).padStart(2, "0")}</p>
          <div className="flex justify-center anim-pop">
            <TypeAvatar type={type} size={190} dance bg />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-goldgrad tracking-tight">
            {name}
            <span className="text-sm align-top text-white/60 ml-1">ⓒ</span>
          </h1>
          <p className="text-sm opacity-90">
            {type.emoji} {type.dialect}担当 —「{type.tagline}」
          </p>
        </div>
        <div className="p-6 space-y-5 -mt-3 bg-white rounded-t-2xl relative">
          {/* 「○○弁 変換」で来た人が最初に見る位置。キャラ紹介より先に正しい受け皿を出す */}
          {tSlug && (
            <div className="bg-primary/5 border border-primary/25 rounded-xl p-4 space-y-2">
              <p className="text-sm text-sub leading-relaxed">
                {type.dialect}
                {alias}を実際に変換したい方は、こちらの専用ページへどうぞ。
              </p>
              <Link
                href={`/translate/${tSlug}`}
                onClick={toTool("translate", "hero", tSlug)}
                className="btn-primary min-h-[48px] w-full inline-flex items-center justify-center text-sm"
              >
                🔤 {type.dialect}
                {alias} 変換ツールを開く
              </Link>
            </div>
          )}
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl flex items-center gap-1.5">
              <span className="hanko !w-5 !h-5 !text-sm !rounded">紹</span>どんなキャラ？
            </h3>
            <p className="leading-relaxed text-sm">{type.desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">💘 恋愛スタイル</div>
              <p className="text-sub">{type.love}</p>
            </div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
              <div className="font-bold mb-1">😂 あるある</div>
              <p className="text-sub">{type.aruaru}</p>
            </div>
          </div>

          {/* あいさつ集 */}
          <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-1.5">
              <span className="hanko !w-5 !h-5 !text-sm !rounded !bg-indigo">言</span>
              {type.dialect}のあいさつ
            </h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {GREETING_KEYS.filter((k) => phrases[k]).map((k) => (
                <div key={k} className="flex items-baseline gap-2 bg-paper rounded-xl px-3.5 py-2.5">
                  <span className="text-sm text-sub shrink-0 w-16">{k}</span>
                  <span className="font-bold">{phrases[k]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 方言サンプル */}
          <div className="space-y-2">
            <h3 className="font-bold text-xl flex items-center gap-1.5">
              <span className="hanko !w-5 !h-5 !text-sm !rounded !bg-indigo">辞</span>
              代表的な{type.dialect}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {words.map((w) => (
                <span key={w.word} className="chip bg-indigo/10 text-indigo" title={w.example}>
                  {w.word} <span className="opacity-60">= {w.meaning}</span>
                </span>
              ))}
            </div>
            {tSlug && (
              <Link
                href={`/translate/${tSlug}#words`}
                onClick={toTool("translate_words", "intro", tSlug)}
                className="text-sm font-bold text-primary-text hover:underline min-h-[48px] inline-flex items-center"
              >
                → {type.dialect}の言葉一覧（全{allWords.length}語・意味と例文つき）を見る
              </Link>
            )}
          </div>

          {/* 相性 */}
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-paper rounded-xl p-4 space-y-2">
              <div className="font-bold">💞 相性のいいキャラ</div>
              <div className="flex gap-3">
                {bestTypes.map((t) => (
                  <Link key={t!.slug} href={`/c/${t!.slug}`} className="text-center hover:-translate-y-0.5 transition-transform">
                    <TypeAvatar type={t!} size={56} />
                    <div className="text-sm font-bold text-primary-text truncate w-16">{MASCOT_NAMES[t!.slug]}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-paper rounded-xl p-4 space-y-2">
              <div className="font-bold">⚡ 火花が散る相手</div>
              <div className="flex gap-3">
                {trickyTypes.map((t) => (
                  <Link key={t!.slug} href={`/c/${t!.slug}`} className="text-center hover:-translate-y-0.5 transition-transform">
                    <TypeAvatar type={t!} size={56} />
                    <div className="text-sm font-bold text-indigo truncate w-16">{MASCOT_NAMES[t!.slug]}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 自分の結果があれば、このキャラとの相性 */}
      {myDecoded && myDecoded.type.slug !== type.slug && (
        <>
          <div className="text-center text-sm font-bold text-indigo">⬇ あなたと{name}の相性</div>
          <CompatCard
            a={{ type: myDecoded.type, cluster: myDecoded.cluster, level: myDecoded.level, label: "あなた" }}
            b={{ type, label: name }}
          />
        </>
      )}

      {/* 回遊カード。このページは noindex, follow なので、リンク自体は残る面（/translate・/quiz）に効く。
          SC実測で「福岡弁 変換」「岡山弁変換」「鹿児島弁 変換」などがこのキャラページに
          順位20〜76で当たっていたため、正しい受け皿へ確実に送る（新規URLは作らない）。 */}
      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-2xl">
          🧭 {area && `${area}の`}
          {type.dialect}
          {alias}を、もう少し
        </h2>
        <div className="grid gap-2">
          {tSlug && (
            <Link
              href={`/translate/${tSlug}`}
              onClick={toTool("translate", "cruise", tSlug)}
              className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
            >
              🔤 {type.dialect} 変換（標準語⇔{type.dialect}）
            </Link>
          )}
          {tSlug && (
            <Link
              href={`/translate/${tSlug}#words`}
              onClick={toTool("translate_words", "cruise", tSlug)}
              className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
            >
              📖 {type.dialect}の言葉一覧（全{allWords.length}語・例文つき）
            </Link>
          )}
          <Link
            href={`/quiz/${type.slug}`}
            onClick={toTool("quiz", "cruise", type.slug)}
            className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
          >
            🏅 {type.dialect}検定に挑戦（全8問・約1分）
          </Link>
          <Link
            href="/doko"
            onClick={toTool("doko", "cruise")}
            className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
          >
            🗾 この方言、何弁？あてクイズ
          </Link>
          <Link
            href="/dict"
            onClick={toTool("dict", "cruise")}
            className="btn-secondary min-h-[48px] inline-flex items-center justify-center text-sm"
          >
            📔 マイ方言辞典に登録する
          </Link>
        </div>
        {siblings.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-sm text-sub">近くの方言の変換ページ</p>
            <div className="flex flex-wrap gap-2">
              {siblings.map((d) => {
                const s = translateSlug(d);
                if (!s) return null;
                return (
                  <Link
                    key={d}
                    href={`/translate/${s}`}
                    onClick={toTool("translate_sibling", "cruise", s)}
                    className="chip bg-primary/10 text-primary-text min-h-[48px] inline-flex items-center"
                  >
                    {d} 変換
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="card p-6 text-center space-y-3">
        <p className="font-bold">{myDecoded ? "友達はどのキャラ？" : `あなたも${name}かも？`}</p>
        <Link href="/shindan" className="btn-primary px-8 py-3 min-h-[48px] inline-flex items-center">
          {myDecoded ? "友達に診断を送る" : "2分で診断する（無料）"}
        </Link>
      </div>
    </div>
  );
}
