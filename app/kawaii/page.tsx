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

/** n個からr個を選ぶ組み合わせの数（解説文の中で出場の組み合わせ数を出すのに使う） */
function combinations(n: number, r: number): number {
  let out = 1;
  for (let i = 0; i < r; i++) out = (out * (n - i)) / (i + 1);
  return Math.round(out);
}

/**
 * ページ下部の静的解説。
 *
 * 🔴 2026-09-14：以前はこれを「対戦中」の分岐にだけ置いていた。
 * ＝**最初に開いた人にも検索エンジンにも1文字も見えていなかった**（可読テキスト480字・本文0字）。
 * しかも読ませたい相手（まだ遊んでいない人）にいちばん見えず、
 * 集中してほしい対戦中にだけ出るという、いちばん逆の置き方だった。
 * 今はイントロと結果の両方に置き、対戦中には出さない。
 */
function KawaiiIntro({ pool }: { pool: number }) {
  return (
    <ToolIntro
      heading="かわいい方言対決について"
      paragraphs={[
        `全国から選んだ${pool}語の方言を8語ぶんだけ抽選して、1対1で勝ち抜き戦をするミニゲームです。かわいいと思った方をタップするだけ。全7試合で、あなたの「いちばんかわいい方言」が1語に決まります。`,
        "「めんこい」「はんなり」「ちばりよー」——意味も響きも違う言葉を、意味の正しさではなく音の好みだけで比べます。正解はありません。だから、同じ8語でも人によって優勝が変わります。",
      ]}
      steps={[
        {
          t: "トーナメントを始める",
          d: `ボタンを押した時点で、${pool}語から8語が抽選されて対戦表が組まれます。組み合わせは毎回変わるので、2回目に同じ顔ぶれになることはほとんどありません。`,
        },
        {
          t: "2語のうち好きな方をタップ",
          d: "画面には方言・地方・意味・例文が両方に出ます。意味を読んでから選んでも、音だけで選んでもかまいません。1回戦4試合、準決勝2試合、決勝1試合の全7試合です。",
        },
        {
          t: "勝った語をひと呼吸おいて見る",
          d: "選んでも自動では次に進みません。どちらが勝ったか、その語の意味と例文がひと画面出てから「次の対戦へ」を押します。押すまで止まっているので、読んでいる途中で画面が切り替わることはありません。",
        },
        {
          t: "優勝を持ち帰る",
          d: "決勝が終わると優勝した1語が出ます。共有用の文面では優勝語が伏せ字になっているので、送られた相手は自分でもやってみるまで答えが分かりません。",
        },
      ]}
      facts={[
        {
          h: "出場する語の選び方",
          body: [
            `候補にしているのは${pool}語です。かわいさで有名な語を寄せ集めたのではなく、「1方言につき1語まで」という決め方で並べています。同じ地方の言葉どうしで潰し合わないためです。`,
            "候補に入れるとき、その語が辞典に同じ書き方で載っているかを毎回つき合わせています。辞典から語が消えたり表記を直したりしたときに、この対戦だけ古い語が残り続けることを防ぐためで、照合に通らない語は自動的に出場しません。画面に出る意味と例文も、その場で辞典から引いています。",
            `8語の選び方は単純な抽選です。${pool}語から8語を選ぶ組み合わせは${combinations(pool, 8).toLocaleString()}通りあるので、毎回ほぼ違う顔ぶれになります。`,
          ],
        },
        {
          h: "「かわいい」に正解を置かない理由",
          body: [
            "この対戦は投票数を集計していません。あなたが押した結果は端末の外に出ず、全国ランキングにもなりません。出るのは「あなたが選ぶとこうなる」という1つの結果だけです。",
            "かわいさの感じ方は、育った土地・その語を誰が言うのを聞いてきたか・音の並びの好みで決まります。多数決にすると、知名度の高い語がただ上に来るだけで、自分の好みが分からなくなります。だから勝敗は最後まであなたの一票で決めます。",
            "同じ理由で、負けた語に「不人気」という表示はしません。1回戦で消えた語も、次に遊べば決勝まで残ることがあります。",
          ],
        },
      ]}
      faq={[
        {
          q: "毎回同じ語ばかり出ます。",
          a: "8語は抽選なので、続けて遊ぶと重なることはあります。ただし対戦の組み合わせは組み直されるので、同じ語でも当たる相手が変わり、勝ち上がりも変わります。",
        },
        {
          q: "自分の地元の言葉が出てきません。",
          a: "候補は1方言につき1語までにしているため、地元の言葉が1語しか入っていないことがあります。その1語も抽選から外れれば出てきません。収録語そのものを見たいときは、方言辞典か今日の方言の一覧からたどってください。",
        },
        {
          q: "選び直せますか？",
          a: "選んだあとに戻る機能はありません。押した時点で勝敗が確定します。やり直したいときは、結果画面からもう一度始めてください（語の抽選からやり直しになります）。",
        },
        {
          q: "結果はどこかに保存されますか？",
          a: "保存していません。ページを離れると結果は消えます。残したいときは、決勝のあとに出る共有ボタンから持ち出してください。",
        },
      ]}
      related={[
        { href: "/blog/kawaii-hogen-ranking", label: "📰 かわいい方言ランキングを読む" },
        { href: "/kurabe", label: "🔤 全国方言くらべ" },
        { href: "/shindan", label: "🔮 方言タイプ診断" },
        { href: "/dict", label: "📖 方言辞典" },
      ]}
    />
  );
}

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
            方言には土地ごと・世代ごとのばらつきがあり、近い土地で同じ語を使うこともあります。
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/blog/kawaii-hogen-ranking" className="btn-ghost">📰 かわいい方言ランキングを読む</Link>
          <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        </div>
        <KawaiiIntro pool={total} />
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
        <KawaiiIntro pool={total} />
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
