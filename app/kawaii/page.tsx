"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import ShareBar from "@/components/ShareBar";
import TypeAvatar from "@/components/TypeAvatar";
import { track } from "@/lib/ga";
import { charLen, maskWord, shareBlock } from "@/lib/share_text";
import { KawaiiEntry, buildKawaiiBracket, kawaiiCandidates } from "@/lib/tools";
import { typeByDialect } from "@/lib/types";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

type Phase = "intro" | "play" | "result";

/** 出場数に応じたラウンド名（8→準々決勝、4→準決勝、2→決勝） */
function roundName(n: number): string {
  if (n <= 2) return "決勝";
  if (n <= 4) return "準決勝";
  if (n <= 8) return "1回戦";
  return "予選";
}

function EntryCard({
  e,
  onClick,
  dimmed,
  won,
}: {
  e: KawaiiEntry;
  onClick?: () => void;
  dimmed?: boolean;
  won?: boolean;
}) {
  const t = typeByDialect(e.dialect);
  const inner = (
    <>
      <div className="flex items-center justify-center gap-2">
        {t && <TypeAvatar type={t} size={54} />}
        <div className="text-left min-w-0">
          <div className="font-display font-bold text-2xl leading-tight break-words">{e.word}</div>
          <div className="text-sm text-primary-text font-bold">
            {e.dialect}
            <span className="text-sub font-normal">・{e.region}</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-sub mt-2 leading-relaxed">{e.meaning}</div>
    </>
  );
  const base = "w-full rounded-2xl border-2 p-4 min-h-[112px] bg-white text-center transition-all";
  if (!onClick) {
    return (
      <div
        className={`${base} ${won ? "border-gold bg-gold/10" : "border-line"} ${dimmed ? "opacity-45" : ""}`}
      >
        {inner}
      </div>
    );
  }
  return (
    <button onClick={onClick} className={`${base} border-line hover:border-primary hover:bg-primary/5 active:scale-[0.98]`}>
      {inner}
    </button>
  );
}

function KawaiiPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<KawaiiEntry[]>([]);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winners, setWinners] = useState<KawaiiEntry[]>([]);
  const [picked, setPicked] = useState<KawaiiEntry | null>(null);
  const [finalist, setFinalist] = useState<KawaiiEntry | null>(null); // 準優勝
  const [history, setHistory] = useState<KawaiiEntry[]>([]); // 勝ち上がった語（表示用）
  // 連打で2試合ぶん進んでしまうのを防ぐ
  const lock = useRef(false);

  const total = kawaiiCandidates().length;
  const left = round[matchIdx * 2];
  const right = round[matchIdx * 2 + 1];
  const matchesInRound = Math.floor(round.length / 2);

  function start() {
    const bracket = buildKawaiiBracket(8);
    track("kawaii_start", { entries: bracket.length });
    setRound(bracket);
    setMatchIdx(0);
    setWinners([]);
    setPicked(null);
    setFinalist(null);
    setHistory([]);
    lock.current = false;
    setPhase("play");
  }

  function choose(e: KawaiiEntry) {
    if (lock.current || picked) return;
    lock.current = true;
    setPicked(e);
  }

  function next() {
    if (!picked) return;
    const nextWinners = [...winners, picked];
    const loser = picked === left ? right : left;
    const isFinal = round.length === 2;

    if (isFinal) {
      track("kawaii_complete", { winner: picked.word, dialect: picked.dialect, region: picked.region });
      setFinalist(loser ?? null);
      setHistory((h) => [...h, picked]);
      setPhase("result");
      return;
    }

    setHistory((h) => [...h, picked]);

    if (matchIdx + 1 >= matchesInRound) {
      // 次のラウンドへ
      setRound(nextWinners);
      setWinners([]);
      setMatchIdx(0);
    } else {
      setWinners(nextWinners);
      setMatchIdx((i) => i + 1);
    }
    setPicked(null);
    lock.current = false;
  }

  // ───────── イントロ ─────────
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="section-title">💗 かわいい方言トーナメント</h1>
          <p className="text-sub text-sm leading-relaxed">
            全国{total}語から抽選した8語が1対1で対決。好きな方をタップしていくだけで、
            あなたの「いちばんかわいい方言」が決まります。
          </p>
        </div>
        <div className="card p-6 space-y-4 text-center">
          <div className="flex justify-center gap-1 flex-wrap">
            {["北海道弁", "京都弁", "広島弁", "博多弁", "沖縄方言"].map((d) => {
              const t = typeByDialect(d);
              return t ? <TypeAvatar key={d} type={t} size={56} /> : null;
            })}
          </div>
          <div className="flex items-center justify-center gap-3 text-sm font-bold text-indigo">
            <span>✓ 全7対戦</span>
            <span>✓ 約1分</span>
            <span>✓ 登録不要</span>
          </div>
          <button onClick={start} className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
            トーナメントを始める
          </button>
          <p className="text-sm text-sub leading-relaxed text-left">
            出場する語と意味は方言ラボ辞典の収録内容です。どれが「かわいい」かは好みの問題なので、正解はありません。
            方言は地域差・世代差があり、同じ言葉が近隣の地域で使われることもあります。
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/blog/kawaii-hogen-ranking" className="btn-ghost">📰 かわいい方言ランキングを読む</Link>
          <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        </div>
      </div>
    );
  }

  // ───────── 結果 ─────────
  if (phase === "result") {
    const champ = history[history.length - 1];
    const t = champ ? typeByDialect(champ.dialect) : undefined;
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/kawaii` : "https://hogen.mainichi-lab.com/kawaii";
    const shareText = champ
      ? `【方言ラボ】かわいい方言トーナメント優勝は「${champ.word}」（${champ.dialect}／${champ.meaning}）！ あなたの推し方言は？ #方言ラボ`
      : "【方言ラボ】かわいい方言トーナメント #方言ラボ";
    // Wordle型: 優勝した語は伏せ字。文字数と地方だけ出して「何それ」と思わせる
    const shareBlockText = champ
      ? shareBlock([
          `かわいい方言トーナメント（全8語）`,
          `🏆 わたしの優勝は「${maskWord(champ.word)}」（${charLen(champ.word)}文字・${champ.region}）`,
          `あなたの推し方言は？ #方言ラボ`,
        ])
      : undefined;

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card p-8 text-center space-y-5 anim-fade-up">
          <Confetti />
          <p className="text-sm text-sub tracking-widest">あなたの優勝方言</p>
          {t && (
            <div className="flex justify-center">
              <TypeAvatar type={t} size={96} />
            </div>
          )}
          {champ && (
            <>
              <div className="font-display font-bold text-4xl sm:text-5xl break-words">{champ.word}</div>
              <div className="text-sm font-bold text-primary-text">
                {champ.dialect}
                <span className="text-sub font-normal">・{champ.region}</span>
              </div>
              <p className="text-sm">意味：{champ.meaning}</p>
              <p className="text-sm bg-paper border border-line rounded-xl p-3 text-left">
                例文：{champ.example}
              </p>
            </>
          )}
          {finalist && (
            <p className="text-sm text-sub">
              準優勝：「{finalist.word}」（{finalist.dialect}／{finalist.meaning}）
            </p>
          )}
          <ShareBar text={shareText} url={url} block={shareBlockText} />
        </div>

        <div className="card p-5 space-y-2">
          <h3 className="font-bold text-xl">🏁 勝ち上がりの記録</h3>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span key={`${h.word}-${i}`} className="chip bg-primary/10 text-primary-text !text-sm">
                {h.word}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={start} className="btn-primary">もう一度（別の8語）</button>
          <Link href="/shindan" className="btn-secondary">方言タイプ診断へ</Link>
          <Link href="/doko" className="btn-secondary">この方言どこの言葉？</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/kurabe" className="btn-ghost">🗾 全国方言くらべ</Link>
          <Link href="/blog/kawaii-hogen-ranking" className="btn-ghost">📰 かわいい方言ランキング</Link>
          <Link href="/dict" className="btn-ghost">📖 辞典</Link>
        </div>
      </div>
    );
  }

  // ───────── 対戦中 ─────────
  if (!left || !right) return null;
  const label = roundName(round.length);
  const isFinal = round.length === 2;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-sm text-sub">
        <span className="font-bold text-primary-text">{label}</span>
        <span>
          {isFinal ? "最後の対戦" : `${matchIdx + 1} / ${matchesInRound} 試合目`}
        </span>
      </div>

      <p className="text-center font-bold text-sm">かわいいと思う方をタップ</p>

      {picked ? (
        // 選んだ結果は自動で流さない。勝者を見せてから、自分で次へ進む
        <div className="space-y-3 anim-fade-up">
          <EntryCard e={left} won={picked === left} dimmed={picked !== left} />
          <div className="text-center text-sm text-sub font-bold">VS</div>
          <EntryCard e={right} won={picked === right} dimmed={picked !== right} />
          <div className="card p-4 text-center space-y-2 anim-pop">
            <p className="font-bold">
              🏅「{picked.word}」が{isFinal ? "優勝" : "勝ち上がり"}！
            </p>
            <p className="text-sm text-sub">
              {picked.dialect}・{picked.region}／{picked.meaning}
            </p>
            <p className="text-sm text-left bg-paper border border-line rounded-xl p-2.5">
              例文：{picked.example}
            </p>
            <button onClick={next} className="btn-primary w-full min-h-[52px]">
              {isFinal ? "優勝を見る" : "次の対戦へ"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <EntryCard e={left} onClick={() => choose(left)} />
          <div className="text-center text-sm text-sub font-bold">VS</div>
          <EntryCard e={right} onClick={() => choose(right)} />
        </div>
      )}
      <ToolIntro
        heading="かわいい方言対決について"
        paragraphs={[
          "全国の方言フレーズがトーナメント形式で対戦し、あなたの「かわいい」の一票で優勝が決まる投票型のミニゲームです。8語のうちどちらがかわいいかを直感で選んでいくだけ。約1分で、あなただけの「かわいい方言優勝」が決まります。",
          "「なんしよっと？」「〜しちょる」「〜やん」——同じ意味でも土地によって響きはまったく違います。対戦カードは毎回シャッフルされるので、やるたびに違う組み合わせが楽しめます。結果はシェアして友だちの優勝と見比べるのがおすすめです。",
        ]}
        related={[
          { href: "/kurabe", label: "🔤 全国方言くらべ" },
          { href: "/shindan", label: "🔮 方言タイプ診断" },
          { href: "/translate", label: "🗣️ 方言変換" },
        ]}
      />
    </div>
  );
}

/**
 * 日付証跡（公開日・最終更新日）は、ツールの画面状態（読み込み中・出題中など）に関係なく
 * 必ず出す必要があるので、内部の分岐の外側で描画する。
 */
export default function Page() {
  return (
    <>
      <KawaiiPage />
      <PageDates route="/kawaii" type="WebApplication" name="かわいい方言対決 | 方言ラボ" />
    </>
  );
}
