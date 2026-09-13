"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Confetti from "@/components/Confetti";
import ShareBar from "@/components/ShareBar";
import TypeAvatar from "@/components/TypeAvatar";
import { track } from "@/lib/ga";
import { marks, shareBlock } from "@/lib/share_text";
import { DokoQ, REGION_OF, buildDokoQuestions, dokoRank } from "@/lib/tools";
import { DOKO_SEEDS } from "@/lib/doko_pool";
import { typeByDialect } from "@/lib/types";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

const TOTAL = 8;
// 解説文に出す出題プールの実数。プールを足し引きしたら自動で追従する
const POOL_WORDS = DOKO_SEEDS.length;
const POOL_DIALECTS = new Set(DOKO_SEEDS.map((s) => s.dialect)).size;

type Phase = "intro" | "play" | "result";
type Log = { q: DokoQ; picked: string; ok: boolean };

/**
 * ページ下部の静的解説。
 *
 * 🔴 2026-09-14：以前はこれを「出題中」の分岐にだけ置いていた。
 * ＝最初の画面にも検索エンジンにも1文字も出ていなかった（可読テキスト509字・本文0字）のに、
 * 問題を解いている最中だけ画面の下に長文がある、という置き方だった。
 * 今は最初の画面と結果に置き、出題中には出さない。
 */
function DokoIntro({ pool, dialects }: { pool: number; dialects: number }) {
  return (
    <ToolIntro
      heading="「この方言、何弁？」について"
      paragraphs={[
        `方言の語とその意味を見て、どの地方の言葉かを4択で当てる全${TOTAL}問のクイズです。出題プールは${dialects}方言・${pool}語。語そのものを知らなくても、音の並びから地方の見当をつけていく遊び方ができます。`,
        "当てるのは「県」ではなく「地方」です。方言は県境で切れず、隣の県にまたがることのほうが多いので、県単位で正解を1つに決めるとクイズとして成立しません。北海道・東北から九州・沖縄までの区切りで答えます。",
      ]}
      steps={[
        {
          t: "クイズをはじめる",
          d: `押した時点で${TOTAL}問が組まれます。同じ地方からは最大2問までにしてあるので、8問が特定の地方に偏ることはありません。同じ語が1回のクイズに二度出ることもありません。`,
        },
        {
          t: "語と意味を読む",
          d: "画面には方言の語と、その意味が出ます。意味が付いているのは、語だけでは推測の手がかりが足りないからです。意味のほうに土地の暮らしが出ていることがあります。",
        },
        {
          t: "4つの地方から選ぶ",
          d: "選択肢は4つ。1問1回答で、押した時点で正解か不正解かが確定します。連打しても2問進むことはありません。",
        },
        {
          t: "称号を受け取る",
          d: `${TOTAL}問終わると正解数に応じて5段階の称号が出ます。全問正解が「方言マイスター」、0〜1問が「まっさら耳」です。共有する文面には正解した語も地方も入らないので、送った相手の答えを先に教えてしまうことはありません。`,
        },
      ]}
      facts={[
        {
          h: "出題する語を絞り込んである",
          body: [
            `出題プールは${pool}語です。辞典には${dialects}方言よりも多くの方言と桁違いの語数が入っていますが、このクイズにはそのうちのごく一部しか使っていません。`,
            "入れる条件を3つ決めているためです。①辞典に同じ表記で収録されていること（意味と例文はそこから引く）②出典でその地方の語だと確認できること③複数の地方で使う語ではないこと。",
            "3つ目がいちばん多く落ちます。「したっけ」「だいじ」「ささって」「ラーフル」などは、実際に複数の土地で使うため正解が一意に決まらず、出題から外しました。「なまら」も、北海道の語として知られる一方で新潟でも使う実例が確認できたため外しています。こういう語は、地方を1つに絞る出題では不正解にする根拠がありません。",
          ],
        },
        {
          h: "はずれの選択肢の作り方",
          body: [
            "不正解の3つは、正解の地方と隣り合わない地方から選んでいます。たとえば正解が近畿なら、中国・中部のような隣接地方は選択肢に出しません。",
            "理由は、隣接地方が混ざると「どちらでも正しい」状態が起きるからです。近い土地ほど言い方を共有するので、隣を選択肢に入れると、知識のある人ほど迷って外すクイズになってしまいます。",
            "そのぶん、まったく見当がつかないときでも消去法が効きます。語の響きから東日本か西日本かだけでも見当がつけば、4択のうち2つは落とせる作りです。",
          ],
        },
      ]}
      faq={[
        {
          q: "この語、うちの地元でも言います。不正解にされました。",
          a: "正解にしているのは「辞典が収録している地方」で、ほかの土地で使わないという意味ではありません。ただし、複数地方で使うと確認できた語は出題から外す方針なので、心当たりがあればみんなの方言辞書から教えてください。実際にその指摘でプールから外した語があります。",
        },
        {
          q: "県名で答えたいです。",
          a: "地方単位にしています。方言は県境と一致しないので、県で正解を1つに決めると、答えが割れる問題ばかりになってしまいます。",
        },
        {
          q: "何回でも遊べますか？",
          a: `遊べます。${TOTAL}問は毎回組み直され、地方の配分も語の抽選もやり直されます。ただしプールは${pool}語なので、何度も続けると同じ語に当たります。`,
        },
        {
          q: "1つの方言をまとめて練習したいです。",
          a: "方言クイズ検定のほうが向いています。あちらは方言を1つ選んで、その方言だけの問題を続けて解く形です。この面は全国からばらばらに出るので、耳の広さを測る用途になります。",
        },
      ]}
      related={[
        { href: "/quiz", label: "🏅 方言クイズ検定（方言別）" },
        { href: "/dict", label: "📖 方言辞典で語を調べる" },
        { href: "/kurabe", label: "🔤 同じ意味を全国でくらべる" },
        { href: "/today", label: "📅 今日の方言" },
      ]}
    />
  );
}

function DokoPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<DokoQ[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  // 連打対策: 1問1回答。次の問題を出したら解除する
  const lock = useRef(false);

  const q = questions[index];
  const correct = logs.filter((l) => l.ok).length;

  function start() {
    const qs = buildDokoQuestions(TOTAL);
    track("doko_start", { total: qs.length });
    setQuestions(qs);
    setIndex(0);
    setPicked(null);
    setLogs([]);
    lock.current = false;
    setPhase("play");
  }

  function choose(d: string) {
    if (lock.current || picked !== null || !q) return;
    lock.current = true;
    setPicked(d);
    setLogs((prev) => [...prev, { q, picked: d, ok: d === q.answer }]);
  }

  function next() {
    if (index + 1 >= questions.length) {
      const done = logs.filter((l) => l.ok).length;
      const rank = dokoRank(done, questions.length);
      track("doko_complete", {
        correct: done,
        total: questions.length,
        score: Math.round((done / questions.length) * 100),
        rank: rank.title,
      });
      setPhase("result");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    lock.current = false;
  }

  // ───────── イントロ ─────────
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="section-title">🗾 この方言、何弁？</h1>
          <p className="text-sub text-sm leading-relaxed">
            全国35方言の中から8語を出題。意味を見て「どこの言葉か（何弁か）」を4択で当てるクイズです。
          </p>
        </div>
        <div className="card p-6 space-y-4 text-center">
          <div className="flex justify-center gap-1 flex-wrap">
            {["北海道弁", "京都弁", "土佐弁", "博多弁", "沖縄方言"].map((d) => {
              const t = typeByDialect(d);
              return t ? <TypeAvatar key={d} type={t} size={56} /> : null;
            })}
          </div>
          <div className="flex items-center justify-center gap-3 text-sm font-bold text-indigo">
            <span>✓ 全8問</span>
            <span>✓ 約1分</span>
            <span>✓ 登録不要</span>
          </div>
          <button onClick={start} className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
            クイズをはじめる
          </button>
          <p className="text-sm text-sub leading-relaxed text-left">
            出題語は<strong>出典を1語ずつ照合したリスト</strong>だけを使い、
            ダミーの選択肢は<strong>正解の地方と隣り合わない地方</strong>から選んでいます。
            それでも方言には地域差・世代差があり、同じ言葉を別の土地で使うことはあります。
            ここでの「答え」は<strong>方言ラボ辞典の収録地域</strong>であって、あなたの言葉が間違いという意味ではありません。
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/quiz" className="btn-ghost">🏅 方言クイズ検定へ</Link>
          <Link href="/dict" className="btn-ghost">📖 方言辞典を見る</Link>
        </div>
        <DokoIntro pool={POOL_WORDS} dialects={POOL_DIALECTS} />
      </div>
    );
  }

  // ───────── 結果 ─────────
  if (phase === "result") {
    const rank = dokoRank(correct, questions.length);
    const score = Math.round((correct / questions.length) * 100);
    const shareText = `【方言ラボ】「この方言どこの言葉？」${questions.length}問中${correct}問的中（${score}点）／称号「${rank.title}」${rank.emoji} あなたの方言耳は何点？ #方言ラボ`;
    const url = typeof window !== "undefined" ? `${window.location.origin}/doko` : "https://hogen.mainichi-lab.com/doko";
    // Wordle型: 出題語も正解の地方も出さず、当たり外れの形と称号だけ
    const shareBlockText = shareBlock([
      `この方言どこの言葉？ ${questions.length}問中${correct}問的中`,
      marks(logs.map((l) => l.ok)),
      `称号「${rank.title}」${rank.emoji} #方言ラボ`,
    ]);

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card p-8 text-center space-y-5 anim-fade-up">
          {correct === questions.length && <Confetti />}
          <div className="text-5xl anim-pop">{rank.emoji}</div>
          <div>
            <p className="text-sm text-sub tracking-widest">あなたの称号</p>
            <h2 className="text-2xl font-bold font-display mt-1">{rank.title}</h2>
          </div>
          <p className="text-lg font-bold">
            {questions.length}問中 {correct}問が辞典と一致
            <span className="text-sub text-sm font-normal">（{score}点）</span>
          </p>
          <p className="text-sm text-sub leading-relaxed">{rank.comment}</p>
          <ShareBar text={shareText} url={url} block={shareBlockText} />
        </div>

        {/* 間違えた問題は消さずに残す。結果画面で自分のペースで読み返せるようにする */}
        <div className="card p-5 space-y-3">
          <h3 className="font-bold text-xl">📋 出題のふりかえり（全{logs.length}問）</h3>
          <ul className="space-y-2">
            {logs.map((l, i) => (
              <li
                key={i}
                className={`rounded-xl border p-3 text-sm ${l.ok ? "border-green-500/50 bg-green-50" : "border-indigo/40 bg-indigo/5"}`}
              >
                <div className="font-bold">
                  {l.ok ? "⭕" : "📖"}「{l.q.word}」= {l.q.meaning}
                </div>
                <div className="text-sm text-sub mt-1">
                  辞典の収録：{l.q.answer}（{REGION_OF[l.q.answer]}）
                  {l.q.sameRegionAlso.length > 0 && <span>・{l.q.sameRegionAlso.join("・")}</span>}
                  {!l.ok && <span className="text-indigo">／あなたの回答：{l.picked}</span>}
                </div>
                <div className="text-sm mt-1">例：{l.q.example}</div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-sub">
            ※ 「収録」は方言ラボ辞典の分類です（出題語は出典を1語ずつ照合しています）。同じ語を別の土地で使うこともあり、
            あなたの言葉が誤りという意味ではありません。違いに気づいたら「みんなの辞書」からお知らせください。
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={start} className="btn-primary">もう一度（別の8問）</button>
          <Link href="/shindan" className="btn-secondary">方言タイプ診断へ</Link>
          <Link href="/kawaii" className="btn-secondary">かわいい方言トーナメント</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/kurabe" className="btn-ghost">🗾 全国方言くらべ</Link>
          <Link href="/quiz" className="btn-ghost">🏅 クイズ検定</Link>
          <Link href="/dict" className="btn-ghost">📖 辞典</Link>
        </div>
        <DokoIntro pool={POOL_WORDS} dialects={POOL_DIALECTS} />
      </div>
    );
  }

  // ───────── 出題中 ─────────
  const progress = Math.round((index / questions.length) * 100);
  const answered = picked !== null;
  const isLast = index + 1 >= questions.length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-sub">
          <span>この方言どこの言葉？</span>
          <span>
            Q{index + 1} / {questions.length}・一致 {correct}
          </span>
        </div>
        <div className="h-2 bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-primary bar-shimmer rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-5 sm:p-6 space-y-4">
        <div className="text-center space-y-1">
          <div className="font-display font-bold text-3xl sm:text-4xl break-words">{q.word}</div>
          <div className="text-sm text-sub">意味：{q.meaning}</div>
        </div>

        <div className="grid gap-2">
          {q.choices.map((c) => {
            let cls = "border-line hover:border-primary hover:bg-primary/5";
            if (answered) {
              if (c === q.answer) cls = "border-green-500 bg-green-50";
              else if (c === picked) cls = "border-indigo/50 bg-indigo/5";
              else cls = "border-line text-sub";
            }
            return (
              <button
                key={c}
                onClick={() => choose(c)}
                disabled={answered}
                className={`border rounded-xl px-4 py-3.5 min-h-[52px] text-left bg-white transition-colors ${cls}`}
              >
                <span className="font-bold">{c}</span>
                <span className="text-sm text-sub ml-2">{REGION_OF[c]}</span>
                {answered && c === q.answer && <span className="text-sm text-green-700 ml-2">辞典の収録地域</span>}
                {answered && c === picked && c !== q.answer && (
                  <span className="text-sm text-indigo ml-2">あなたの回答</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="space-y-3 anim-pop">
            {/* 「不正解」と断定しない。辞典がどこの語として収録しているかを示す形にする */}
            <div className="text-sm bg-paper border border-line rounded-xl p-3 space-y-1">
              <p className="font-bold">
                {picked === q.answer ? "⭕ 辞典と一致！" : "📖 辞典では"}「{q.word}」は
                <span className="text-indigo">{q.answer}</span>（{REGION_OF[q.answer]}）の語として収録しています
              </p>
              <p className="text-sm">例文：{q.example}</p>
              {q.sameRegionAlso.length > 0 && (
                <p className="text-sm text-sub">※ 同じ{REGION_OF[q.answer]}の{q.sameRegionAlso.join("・")}にも収録があります。</p>
              )}
              {picked !== q.answer && (
                <p className="text-sm text-sub">
                  ※ {picked}でも使う、というご指摘は「みんなの辞書」からお寄せください。辞典に反映します。
                </p>
              )}
            </div>
            {/* 自動では進めない。読み終えてから自分で次へ */}
            <button onClick={next} className="btn-primary w-full min-h-[52px]">
              {isLast ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        )}
      </div>
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
      <DokoPage />
      <PageDates route="/doko" type="WebApplication" name="この方言どこ？ | 方言ラボ" />
    </>
  );
}
