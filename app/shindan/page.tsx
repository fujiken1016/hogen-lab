"use client";

import { useEffect, useRef, useState } from "react";
import CrossSite from "@/components/CrossSite";
import ShareBar from "@/components/ShareBar";
import { useCopy } from "@/lib/clipboard";
import Link from "next/link";
import {
  ARCHETYPES,
  FREE_INPUT_KEY,
  LEVEL_LABELS,
  LEVEL_LINES,
  PERSONA_MODS,
  PERSONALITY_QUESTIONS,
  REGIONS,
  SHINDAN_PHRASES,
  SHINDAN_QUESTIONS,
  STANDARD,
  wordsOf,
  matchShindanPhrase,
  phraseNearDup,
  safeParseArray,
  lsSet,
  phraseSimilarity,
  shuffle,
  unlockBadge,
} from "@/lib/data";
import Confetti from "@/components/Confetti";
import { Bush, Cloud, Sun, Tree } from "@/components/Scenery";
import { kanteiOf } from "@/lib/fortune";
import { maskWord, meter, shareBlock } from "@/lib/share_text";
import CompatCard from "@/components/CompatCard";
import { decodeCode, encodeCode, saveMyResult, type DecodedCode } from "@/lib/compat";
import SecretAvatar from "@/components/SecretAvatar";
import { SECRETS, rollSecret, secretRand, unlockSecret } from "@/lib/secret";
import TypeAvatar, { avatarColors } from "@/components/TypeAvatar";
import { DialectType, MASCOT_NAMES, TYPES, affinity, typeByDialect, typeBySlug } from "@/lib/types";
import { track } from "@/lib/ga";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

type Choice = { dialect: string; phrase: string };
type PChoice = { label: string; dialects: string[]; cluster: string };
type Question =
  | { kind: "phrase"; key: string; label: string; choices: Choice[] }
  | { kind: "personality"; key: string; label: string; choices: PChoice[] };
type FreeInput = { q: string; text: string; matched: string | null };

// ---- 採点エンジン ----
// ・標準語の選択は0点（誰でも話せるデフォルトは証拠にならない）
// ・方言フレーズは「珍しさ」で配点が変わる: 他方言と言い方が被るほど弱い証拠（1.4〜2.2点）
// ・似た言い方の方言にも部分点を波及（「ほかしといて」→関西を選んでも京都・神戸に少し入る）
// ・性格質問は1点＋次点候補に0.5/0.25/0.1点のグラデーション
// ・最後に回答の組み合わせから決まる微小な指紋値を加えて小数1桁で表示
//   → 1問違うだけで全成分が微妙に変わり、判で押したような結果にならない
function jitterFor(seed: string, d: string): number {
  const s = seed + "|" + d;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000; // 0〜0.999（決定論的: 同じ回答なら同じ値）
}

// 成分ランキングの算出。結果表示とGA4イベント（完了時のタイプ送信）の両方から使うので、
// レンダー本体から関数に切り出して「表示している結果」と「計測している結果」を必ず一致させる。
function rankDialects(
  picks: Record<string, number>,
  seed: string,
  regionDialects: string[],
): { d: string; pct: number }[] {
  const entries = Object.entries(picks)
    .filter(([d]) => d !== STANDARD)
    .map(([d, n]) => [d, n + jitterFor(seed, d) * 0.4] as const);
  const total = entries.reduce((a, [, n]) => a + n, 0) || 1;
  return entries
    .map(([d, n]) => ({ d, pct: Number(((n / total) * 100).toFixed(1)) }))
    .sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      // 同率なら出身地方の方言を優先
      const ar = regionDialects.includes(a.d) ? 0 : 1;
      const br = regionDialects.includes(b.d) ? 0 : 1;
      return ar - br;
    });
}

function topDialectOf(ranked: { d: string }[], regionDialects: string[]): string {
  return ranked[0]?.d ?? regionDialects[0] ?? "大阪弁";
}

// 各質問ごとに「標準語＋出身地方の方言2＋よその方言1」の4択を生成。
// 35方言をただランダムに出すと自分の方言が8問中ほぼ登場せず（期待値0.7回）、
// 全員が標準語（クールバランサー）に吸われるため、出身地方の言い方を必ず選択肢に入れる。
// 出題数は固定（8＋6）だが、質問自体はプール（言葉12・性格12）から診断開始時にランダムに選ぶ
const PHRASE_Q_COUNT = 8;
const PERSONA_Q_COUNT = 6;
const TOTAL_Q = PHRASE_Q_COUNT + PERSONA_Q_COUNT;
type QuizSet = { phrase: typeof SHINDAN_QUESTIONS; persona: typeof PERSONALITY_QUESTIONS };

// 適応型の出題: 1問ずつ、その時点の回答傾向を見て選択肢を組み立てる。
// ・反応があった方言（加点済み）は再出題して確証を取る
// ・標準語/「どれも違う」が続いたら地方枠を縮めて全国の言い方に切り替える
// ・選択肢は標準語＋方言4つの計5択
function makeQuestion(
  i: number,
  picksNow: Record<string, number>,
  stdCount: number,
  regionDialects: string[],
  quizSet: QuizSet,
): Question {
  if (i >= quizSet.phrase.length) {
    const pq = quizSet.persona[i - quizSet.phrase.length];
    return { kind: "personality", key: `p${i}`, label: pq.label, choices: shuffle(pq.choices) };
  }
  const q = quizSet.phrase[i];
  const all = Object.keys(SHINDAN_PHRASES).filter((d) => d !== STANDARD);
  // これまでに点が入った方言（スコア順）
  const scored = Object.entries(picksNow)
    .filter(([d, n]) => d !== STANDARD && n > 0.5)
    .sort((a, b) => b[1] - a[1])
    .map(([d]) => d);
  // 地方枠: 標準語/不一致が続くほど縮小（2 → 1 → 0）して全国枠に譲る
  const regionQuota = stdCount >= 4 ? 0 : stdCount >= 2 ? 1 : 2;
  const others = shuffle(all.filter((d) => !regionDialects.includes(d) && !scored.includes(d)));
  const pool = [
    ...scored.slice(0, 2),
    ...shuffle(regionDialects.filter((d) => !scored.includes(d))).slice(0, regionQuota),
    ...others,
  ];
  const chosen: Choice[] = [{ dialect: STANDARD, phrase: SHINDAN_PHRASES[STANDARD][q.key] }];
  for (const d of pool) {
    if (chosen.length >= 5) break;
    const p = SHINDAN_PHRASES[d]?.[q.key];
    if (!p) continue;
    // 「こえ〜」と「あー、こえー」のようなほぼ同じ言い方は並べない（類似度＋芯の包含で重複排除）
    if (chosen.some((c) => c.dialect === d || phraseNearDup(c.phrase, p))) continue;
    chosen.push({ dialect: d, phrase: p });
  }
  return { kind: "phrase", key: q.key, label: q.label, choices: shuffle(chosen) };
}

// ---- 占い（結果ページ用。日付×タイプで決まる決定論的な運勢） ----
const LUCKY_COLORS = [
  { name: "茜色", hex: "#C73E3A" },
  { name: "藍色", hex: "#234A6B" },
  { name: "山吹色", hex: "#E8A33D" },
  { name: "抹茶色", hex: "#7A8F4E" },
  { name: "藤色", hex: "#8A6BAF" },
  { name: "桜色", hex: "#E38BA8" },
  { name: "浅葱色", hex: "#4E8FA3" },
  { name: "柿色", hex: "#C97B4A" },
];

// 曜日表示（鑑定書の日付・運気の波に使う）
const WDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function ShindanPage() {
  const [phase, setPhase] = useState<"intro" | "region" | "quiz" | "reveal" | "result">("intro");
  const [grown, setGrown] = useState(false); // 結果画面のバーを0%から伸ばす演出用
  const [current, setCurrent] = useState<Question | null>(null); // 適応型: いま表示中の1問
  const [stdCount, setStdCount] = useState(0); // 標準語/不一致が続いた回数（地方枠の縮小判定）
  const [pendingP, setPendingP] = useState<PChoice | null>(null); // 性格質問: 選択後の「どれくらい？」待ち
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [friendType, setFriendType] = useState<DialectType | null>(null);
  const [freeOpen, setFreeOpen] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [freeInputs, setFreeInputs] = useState<FreeInput[]>([]);
  const [slot, setSlot] = useState(0); // ドラムロール中のスロット演出
  const [regionDialects, setRegionDialects] = useState<string[]>([]); // 出身地方の方言（性格質問の加点先の優先解決に使う）
  // 今回の診断で使う質問セット（プールから8＋6問をランダム抽出。初期値は先頭固定でSSRと一致させる）
  const [quizSet, setQuizSet] = useState<QuizSet>({
    phrase: SHINDAN_QUESTIONS.slice(0, PHRASE_Q_COUNT),
    persona: PERSONALITY_QUESTIONS.slice(0, PERSONA_Q_COUNT),
  });
  const [answerLog, setAnswerLog] = useState<string[]>([]); // 回答の指紋（結果の微差シードに使う）
  const [personaScores, setPersonaScores] = useState<Record<string, number>>({}); // 性格アーキタイプの得点
  const [levels, setLevels] = useState<number[]>([]); // 性格質問の数字回答(1-5)。平均が「強さレベル」になる

  // 友達の結果リンク（?with=slug）から相性診断モードを検出
  // ?secret=slug はシークレットの強制出現（動作確認・プレビュー用）
  const [forcedSecret, setForcedSecret] = useState<string | null>(null);
  const [friendCode, setFriendCode] = useState("");
  const [friendCodeError, setFriendCodeError] = useState("");
  const [friendDecoded, setFriendDecoded] = useState<DecodedCode | null>(null);
  const { status: codeStatus, copy: copyCode, reset: resetCodeCopy } = useCopy();
  const [vsParam, setVsParam] = useState<string | null>(null);
  // 連打対策: 1問1回答ロック。新しい問題が表示されたら解除
  const answerLock = useRef(false);
  useEffect(() => {
    answerLock.current = false;
  }, [current]);
  // 安全網: 万一indexが総問数を超えたら結果へ（バッチ更新の競合対策）
  useEffect(() => {
    if (phase === "quiz" && index >= TOTAL_Q) setPhase("reveal");
  }, [phase, index]);
  // 画面が切り替わったら先頭へ（結果の下の方でボタンを押した後など）
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("with");
    if (slug) {
      const t = typeBySlug(slug);
      if (t) setFriendType(t);
    }
    setForcedSecret(params.get("secret"));
    setVsParam(params.get("vs"));
  }, []);

  // シークレット出現時は図鑑のモザイクを解放（結果確定のタイミングで保存）
  useEffect(() => {
    if (phase !== "result") return;
    const s =
      SECRETS.find((x) => x.slug === forcedSecret) ??
      rollSecret(secretRand(answerLog.join("|")));
    if (s) unlockSecret(s.slug);
  }, [phase, answerLog, forcedSecret]);

  // GA4: 診断が最後まで完了したときに1回だけ送る（結果表示と同じ算出関数を使う）
  useEffect(() => {
    if (phase !== "result") return;
    const top = topDialectOf(rankDialects(picks, answerLog.join("|"), regionDialects), regionDialects);
    track("shindan_complete", {
      dialect: top,
      type: typeByDialect(top)?.slug ?? "unknown",
      free_inputs: freeInputs.length,
    });
    // 結果が確定した瞬間の値だけを送る（同じ結果画面で再送しない）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    track("shindan_start");
    // 再診断: 前回の友達コード鑑定やコピー状態も含めて全リセット
    setFriendCode("");
    setFriendCodeError("");
    setFriendDecoded(null);
    resetCodeCopy();
    setIndex(0);
    setPicks({});
    setPersonaScores({});
    setLevels([]);
    setAnswerLog([]);
    setFreeInputs([]);
    setFreeOpen(false);
    setFreeText("");
    setPhase("region");
  }

  function chooseRegion(dialects: string[]) {
    // 診断のたびに質問をプールからランダム抽出（イベントハンドラ内なのでSSRハイドレーションに影響しない）
    const set: QuizSet = {
      phrase: shuffle(SHINDAN_QUESTIONS).slice(0, PHRASE_Q_COUNT),
      persona: shuffle(PERSONALITY_QUESTIONS).slice(0, PERSONA_Q_COUNT),
    };
    setQuizSet(set);
    setRegionDialects(dialects);
    setStdCount(0);
    setPendingP(null);
    setCurrent(makeQuestion(0, {}, 0, dialects, set));
    setPhase("quiz");
  }

  // 次の問題へ。最新の回答状況を渡して選択肢を適応的に組み立てる
  function advance(nextPicks: Record<string, number>, nextStd: number) {
    setFreeOpen(false);
    setFreeText("");
    setPendingP(null);
    if (index + 1 >= TOTAL_Q) {
      unlockBadge("shindan");
      setPhase("reveal"); // ドラムロール演出をはさむ
    } else {
      setIndex((i) => i + 1);
      setCurrent(makeQuestion(index + 1, nextPicks, nextStd, regionDialects, quizSet));
    }
  }

  // ドラムロール（スロット演出）→結果、結果表示後にバーを伸ばす
  useEffect(() => {
    if (phase === "reveal") {
      const spin = setInterval(() => setSlot((s) => s + 1), 110);
      const t = setTimeout(() => {
        clearInterval(spin);
        setPhase("result");
      }, 2000);
      return () => {
        clearInterval(spin);
        clearTimeout(t);
      };
    }
    if (phase === "result") {
      setGrown(false);
      const t = setTimeout(() => setGrown(true), 150);
      return () => clearTimeout(t);
    }
  }, [phase]);

  function choose(c: Choice) {
    if (!current || answerLock.current) return;
    answerLock.current = true;
    setAnswerLog((l) => [...l, `${current.key}=${c.dialect}`]);
    // 標準語の選択は加点しない。連続すると地方枠が縮小され全国出題に切り替わる
    if (c.dialect === STANDARD) {
      const nextStd = stdCount + 1;
      setStdCount(nextStd);
      advance(picks, nextStd);
      return;
    }
    // 同じ質問で言い方が近い方言を洗い出す
    const sims: { d: string; s: number }[] = [];
    for (const [d, phrases] of Object.entries(SHINDAN_PHRASES)) {
      if (d === STANDARD || d === c.dialect) continue;
      const p = phrases[current.key];
      if (!p) continue;
      const s = phraseSimilarity(c.phrase, p);
      if (s >= 0.55) sims.push({ d, s });
    }
    // 被りが多い（＝全国的な）言い方ほど配点を下げる
    const base = 2.2 - 0.2 * Math.min(sims.length, 4);
    const next = { ...picks, [c.dialect]: (picks[c.dialect] ?? 0) + base };
    for (const { d, s } of sims) next[d] = (next[d] ?? 0) + base * s * 0.35;
    setPicks(next);
    advance(next, stdCount);
  }

  // 性格質問: 選択→「どれくらい当てはまる？」を1〜5の数字で回答
  function applyPersonality(pc: PChoice, num: number) {
    if (!current || answerLock.current) return;
    answerLock.current = true;
    const mult = [0.4, 0.7, 1.0, 1.4, 1.8][num - 1];
    setLevels((l) => [...l, num]);
    setAnswerLog((l) => [...l, `${current.key}=${pc.label}×${num}`]);
    // 性格アーキタイプ（キャラとの掛け算の「性格」側）に加点
    setPersonaScores((s) => ({ ...s, [pc.cluster]: (s[pc.cluster] ?? 0) + mult }));
    // 出身地方に含まれる方言を最優先に、残りの候補にもグラデーションで加点
    const first = pc.dialects.find((d) => regionDialects.includes(d)) ?? pc.dialects[0];
    const rest = pc.dialects.filter((d) => d !== first);
    const grades = [0.5, 0.25, 0.1];
    const next = { ...picks, [first]: (picks[first] ?? 0) + 1 * mult };
    rest.forEach((d, i) => {
      if (grades[i]) next[d] = (next[d] ?? 0) + grades[i] * mult;
    });
    setPicks(next);
    advance(next, stdCount);
  }

  // 「どれも違う」→ 自由入力を全方言データと照合して一番近い方言に加点
  function chooseFree() {
    const text = freeText.trim();
    if (!text || !current || answerLock.current) return;
    answerLock.current = true;
    const q = current;
    const matches = matchShindanPhrase(text, q.key);
    // 精度優先: 高スコア(0.45+)が1〜3方言に絞れた時だけ加点。
    // 多数の方言にマッチする入力（「うまい」等の共通語）は判別不能として加点しない
    const strong = matches.filter((m) => m.score >= 0.45);
    const top = matches[0];
    // ほぼ一致(0.8+)なら無条件で採用。それ以外は高スコアが1〜3方言に絞れた時だけ採用
    const matched =
      top && (top.score >= 0.8 || (strong.length > 0 && strong.length <= 3)) ? top.dialect : null;
    let nextPicks = picks;
    let nextStd = stdCount;
    if (matched) {
      const next = { ...picks, [matched]: (picks[matched] ?? 0) + 2 };
      // 高スコアだった他の方言にも部分点（言い方が近い＝同系統の訛り）
      for (const m of strong) {
        if (m.dialect === matched || m.dialect === STANDARD) continue;
        next[m.dialect] = (next[m.dialect] ?? 0) + Math.min(m.score, 1) * 0.6;
      }
      nextPicks = next;
      setPicks(next);
    } else {
      // どの方言とも照合できなかった＝地方が合っていない可能性 → 出題の地方枠を縮める
      nextStd = stdCount + 1;
      setStdCount(nextStd);
    }
    setAnswerLog((l) => [...l, `free=${text}`]);
    const entry: FreeInput = { q: q.key, text, matched };
    setFreeInputs((f) => [...f, entry]);
    // 辞書の種としてブラウザに保存（「みんなの辞書」への投稿候補）
    const saved = safeParseArray<Record<string, unknown>>(localStorage.getItem(FREE_INPUT_KEY));
    saved.push({ ...entry, date: new Date().toISOString() });
    lsSet(FREE_INPUT_KEY, saved);
    advance(nextPicks, nextStd);
  }

  // ---------- イントロ ----------
  if (phase === "intro") {
    return (
      <div className="max-w-3xl mx-auto text-center space-y-5 seigaiha rounded-3xl border border-line px-6 py-8 relative overflow-hidden">
        {/* 背景あしらい: 空と緑 */}
        <Sun className="w-12 top-2 right-3 opacity-90" />
        <Cloud className="w-20 top-9 -left-3 cloud-drift opacity-80" />
        <Bush className="w-24 -bottom-1 -left-2 opacity-60" />
        <Tree className="w-11 bottom-0 right-3 tree-sway opacity-70" />
        {friendType && (
          <div className="card p-4 text-sm">
            {friendType.emoji} 友達（<b>{friendType.name}</b>タイプ）から相性診断の招待が届いています！
            診断すると2人の相性がわかります。
          </div>
        )}
        <div className="space-y-3">
          <p className="text-gold font-bold tracking-widest text-sm">HOGEN TYPE SHINDAN</p>
          <h1 className="text-4xl font-bold leading-snug">
            あなたの言葉は、
            <br />
            何弁？
          </h1>
          <p className="text-sub">
            言葉づかい8問＋性格6問でわかる、あなたの「方言キャラタイプ」。
            <br />
            標準語で暮らしていても大丈夫。あなたの中の方言気質を見つけます。
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button onClick={start} className="btn-primary cta-glow text-lg px-10 py-4">
            診断をはじめる（約2分）
          </button>
          <p className="text-sm text-sub">全14問・245通り以上の結果・登録不要・無料</p>
        </div>
        <div className="flex justify-center gap-1 sm:gap-3 flex-wrap">
          {[1, 5, 9, 13, 20, 27].map((idx, i) => (
            <div key={idx} className="avatar-float" style={{ animationDelay: `${i * 0.35}s` }}>
              <TypeAvatar type={TYPES[idx]} size={72} />
            </div>
          ))}
        </div>
        <ToolIntro
          heading="方言タイプ診断について"
          paragraphs={[
            "この診断は、ふだんの言い回しや語感の好みに関する全14問から、あなたの言葉がどの方言圏のタイプに近いかを判定する無料の性格・方言診断です。出身地を直接聞くのではなく、「気を抜いたときに出る言い方」を手がかりにするのが特徴で、引っ越しが多かった人や、標準語で育ったつもりの人ほど意外な結果が出ることがあります。",
            "結果には全35タイプのご当地キャラクターが割り当てられ、性格の傾向・恋愛傾向・他のタイプとの相性も表示されます。登録不要・約2分で、何度でも受けられます。結果画面から友だちを招待すると、ふたりの相性もその場で確かめられます。",
          ]}
          related={[
            { href: "/aishou", label: "💞 友だちとの相性診断" },
            { href: "/translate", label: "🗣️ 方言変換" },
            { href: "/quiz", label: "🏅 方言クイズ検定" },
          ]}
        />
      </div>
    );
  }

  // ---------- 出身地方の選択 ----------
  if (phase === "region") {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center space-y-2">
          <p className="text-primary-text font-bold tracking-widest text-sm">STEP 0</p>
          <h1 className="text-3xl font-bold">育った地域・ゆかりのある地域は？</h1>
          <p className="text-sub text-sm">
            あなたの地方の言い方を優先して出題します（結果を縛るものではありません）
            <br />
            しっくりこない選択が続いた場合は、自動で全国の言い方に切り替わります
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.name}
              onClick={() => chooseRegion(r.dialects)}
              className="card !rounded-xl p-4 text-left hover:border-primary hover:-translate-y-0.5 transition-all"
            >
              <div className="font-bold">{r.name}</div>
              <div className="text-sm text-sub mt-0.5 truncate">
                {r.dialects.slice(0, 3).join("・")}
                {r.dialects.length > 3 ? " など" : ""}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => chooseRegion(shuffle(Object.keys(SHINDAN_PHRASES).filter((d) => d !== STANDARD)).slice(0, 7))}
          className="btn-ghost w-full justify-center"
        >
          全国転々・選べない（ランダム出題）
        </button>
      </div>
    );
  }

  // ---------- 設問 ----------
  if (phase === "quiz") {
    const q = current;
    if (!q) return null;
    const progress = Math.round((index / TOTAL_Q) * 100);
    // 選択肢の頭文字（A. B. C.）はピンクと浅葱を交互に（ラブ診断風の色分け）
    const letterColor = (i: number) => (i % 2 === 0 ? "#E75B7B" : "#4E8FA3");
    const LETTERS = ["A", "B", "C", "D", "E"];
    const HEART_COLORS = ["#F2B8B5", "#EE9DB6", "#E75B7B", "#D9564F", "#C73E3A"];
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {/* 応援キャラの帯 */}
        <div className="flex justify-center gap-1 opacity-75">
          {[2, 7, 13, 19, 25, 31].map((idx, i) => (
            <div key={idx} className="avatar-float" style={{ animationDelay: `${i * 0.3}s` }}>
              <TypeAvatar type={TYPES[idx]} size={34} />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-sm text-sub">
            <span>{q.kind === "phrase" ? "ふだんの言葉に一番近いものを選んでください" : "深く考えず、直感で選んでください"}</span>
            <span className="shrink-0 pl-2">
              残りの質問 <b className="font-display text-xl text-primary-text">{TOTAL_Q - index}</b>
            </span>
          </div>
          <div className="h-2 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-primary bar-shimmer rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right">
            <button onClick={start} className="inline-flex min-h-[48px] items-center text-sm text-sub hover:text-primary-text transition-colors">
              ↻ 最初からやり直す
            </button>
          </div>
        </div>
        <div className="card p-6 space-y-4">
          <h2 className="text-2xl font-bold">{q.label}</h2>
          <div className="grid gap-2">
            {q.kind === "phrase"
              ? q.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => choose(c)}
                    className="border border-line rounded-xl px-4 py-3.5 min-h-[60px] text-base text-left bg-white hover:border-primary hover:bg-primary/5 active:bg-primary/10 active:scale-[0.99] transition-all flex items-baseline gap-2.5"
                  >
                    <span className="font-bold text-sm shrink-0" style={{ color: letterColor(i) }}>
                      {LETTERS[i]}.
                    </span>
                    <span>{c.phrase}</span>
                  </button>
                ))
              : pendingP === null
                ? q.choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setPendingP(c)}
                      className="border border-line rounded-xl px-4 py-3.5 min-h-[60px] text-base text-left bg-white hover:border-primary hover:bg-primary/5 active:bg-primary/10 active:scale-[0.99] transition-all flex items-baseline gap-2.5"
                    >
                      <span className="font-bold text-sm shrink-0" style={{ color: letterColor(i) }}>
                        {LETTERS[i]}.
                      </span>
                      <span>{c.label}</span>
                    </button>
                  ))
                : (
                    <div className="space-y-3 anim-fade-up">
                      <div className="border border-primary bg-primary/5 rounded-xl px-4 py-3.5 text-sm font-bold">
                        {pendingP.label}
                      </div>
                      <p className="text-sm text-sub text-center">どれくらい当てはまる？（ハートをタップ）</p>
                      {/* ハートスケール: 小→大＆淡→濃で強さを表す（ラブ診断風） */}
                      <div className="flex items-end justify-center gap-2.5 pt-1">
                        {[1, 2, 3, 4, 5].map((n) => {
                          const s = 26 + n * 5.5;
                          return (
                            <button
                              key={n}
                              onClick={() => applyPersonality(pendingP, n)}
                              className="flex flex-1 min-h-[60px] flex-col items-center justify-end gap-1 transition-transform hover:-translate-y-1 active:scale-90"
                              aria-label={`強さ${n}`}
                            >
                              <svg width={s} height={s} viewBox="0 0 24 24">
                                <path
                                  d="M12 21 C 5.5 15.5 2 11.5 2 7.8 C 2 4.9 4.4 2.8 7 2.8 C 9 2.8 11 4 12 5.8 C 13 4 15 2.8 17 2.8 C 19.6 2.8 22 4.9 22 7.8 C 22 11.5 18.5 15.5 12 21 Z"
                                  fill={HEART_COLORS[n - 1]}
                                  fillOpacity={n === 5 ? 1 : 0.16 + n * 0.14}
                                  stroke={HEART_COLORS[n - 1]}
                                  strokeWidth="2"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm text-sub font-bold">{n}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-sm text-sub px-1">
                        <span>← ちょっとだけ</span>
                        <span>完全にそれ →</span>
                      </div>
                      <button onClick={() => setPendingP(null)} className="btn-ghost w-full justify-center text-sm">
                        ← 選び直す
                      </button>
                    </div>
                  )}
          </div>

          {/* 応援ストリップ（余白埋め: キャラが応援してくれる） */}
          <div className="flex justify-center items-end gap-1.5 pt-1 opacity-90">
            <span className="bubble !text-sm !px-2 !py-1 rotate-[-3deg] mb-3">
              {["ええ感じやん！", "その調子だべ！", "ばりよかよ〜", "なまら順調っしょ", "こじゃんとえいぞ！"][index % 5]}
            </span>
            {[6, 14, 22, 28].map((idx, i) => (
              <div key={idx} style={{ transform: `rotate(${[-5, 4, -4, 6][i]}deg)` }}>
                <div className="avatar-float" style={{ animationDelay: `${i * 0.3}s` }}>
                  <TypeAvatar type={TYPES[(idx + index * 3) % TYPES.length]} size={40} />
                </div>
              </div>
            ))}
          </div>

          {/* 自由入力（どれも当てはまらない時。言葉の質問のみ） */}
          {q.kind !== "phrase" ? null : !freeOpen ? (
            <button onClick={() => setFreeOpen(true)} className="btn-ghost w-full justify-center">
              ✏️ どれも違う — 自分の言い方で答える
            </button>
          ) : (
            <div className="bg-paper border border-line rounded-xl p-4 space-y-3">
              <p className="text-sm text-sub">
                あなたの地元の言い方を入力してください。全国{Object.keys(SHINDAN_PHRASES).length - 1}方言のデータと照合して、一番近い方言に加点します。
              </p>
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && chooseFree()}
                placeholder="例：投げでおいて"
                maxLength={30}
                autoFocus
                className="input-base"
              />
              <div className="flex gap-2">
                <button onClick={chooseFree} disabled={!freeText.trim()} className="btn-primary flex-1 py-2.5">
                  この言い方で回答する
                </button>
                <button onClick={() => setFreeOpen(false)} className="btn-secondary">
                  戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- ドラムロール（スロットマシン演出） ----------
  if (phase === "reveal") {
    const spinning = TYPES[slot % TYPES.length];
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-8">
        <p className="text-xl font-bold font-display">
          あなたの方言タイプは<span className="inline-block anim-drum">…</span>
        </p>
        <div className="mx-auto w-48 h-48 card grid place-items-center overflow-hidden">
          <TypeAvatar type={spinning} size={150} />
        </div>
        <div className="h-2 max-w-xs mx-auto bg-line rounded-full overflow-hidden">
          <div className="h-full bg-primary bar-shimmer rounded-full w-full" />
        </div>
      </div>
    );
  }

  // ---------- 結果 ----------
  // picksには重み付け済みスコアが入っている（標準語は加点されないので混ざらない）。
  // 回答の組み合わせを指紋として微小値を加算 → 同じタイプでも成分%が人ごとに変わる
  const seed = answerLog.join("|");
  const ranked = rankDialects(picks, seed, regionDialects);
  const topDialect = topDialectOf(ranked, regionDialects);
  const myType = typeByDialect(topDialect) ?? TYPES[0];
  const heroColor = avatarColors(myType.slug);
  // 性格アーキタイプ（同点は回答指紋で決着）→ キャラとの掛け算で結果タイトルが決まる
  const topCluster =
    Object.entries(personaScores).sort(
      (a, b) => b[1] - a[1] || jitterFor(answerLog.join("|"), b[0]) - jitterFor(answerLog.join("|"), a[0]),
    )[0]?.[0] ?? "jiyu";
  const archetype = ARCHETYPES[topCluster] ?? ARCHETYPES.jiyu;
  // 強さレベル: 数字回答(1-5)の平均 → 7気質×5レベル=35通りの性格分岐
  const level = Math.min(5, Math.max(1, Math.round(levels.reduce((a, b) => a + b, 0) / (levels.length || 1))));
  const personaMod = (PERSONA_MODS[topCluster] ?? PERSONA_MODS.jiyu)[level - 1];
  const resultName = `${personaMod}${MASCOT_NAMES[myType.slug]}`;
  // 全タイプとの相性%ランキング
  const compatRanking = TYPES.filter((t) => t.slug !== myType.slug && t.slug !== "std")
    .map((t) => ({ t, a: affinity(myType, t) }))
    .sort((x, y) => y.a.score - x.a.score);
  const compatTop = compatRanking.slice(0, 3);
  const compatWorst = compatRanking[compatRanking.length - 1];
  // シークレット抽選（回答指紋から決定論的。?secret=slug で強制出現＝プレビュー用）
  const secret =
    SECRETS.find((x) => x.slug === forcedSecret) ??
    rollSecret(secretRand(seed));
  // 相性コード（診断し直し不要でペア鑑定できる4文字。結果は端末にも保存）
  const myCode = encodeCode(myType.slug, topCluster, level);
  if (typeof window !== "undefined") {
    saveMyResult({ code: myCode, slug: myType.slug, cluster: topCluster, level, name: resultName });
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  // シェアは「自分の結果がそのまま見られる」閲覧ページへ（受け取った側は自動で相性も出る）
  const inviteUrl = `${origin}/r/${myCode}`;
  const shareText = `【方言タイプ診断】${secret ? `🌟シークレット「${secret.name}」降臨！！ ` : ""}わたしは ${myType.emoji}「${resultName}」（${myType.dialect} ${Math.round(ranked[0]?.pct ?? 0)}%）でした！私の結果と相性はこちら→ #方言ラボ`;
  // Wordle型: タイプ名も方言名も伏せる。「文字数」と「一致度の形」だけ見せて、リンクで答え合わせさせる
  const shareBlockText = shareBlock([
    `方言タイプ診断 わたしは「${maskWord(resultName)}」でした`,
    `${meter(Math.round(ranked[0]?.pct ?? 0))} 一致度${Math.round(ranked[0]?.pct ?? 0)}%`,
    `${secret ? "🌟シークレット降臨 " : ""}リンクで答え合わせ＋相性診断 #方言ラボ`,
  ]);
  const compat = friendType ? affinity(myType, friendType) : null;

  // ことだま鑑定（回答指紋×日付で決まる本格占い: 数秘×五行×タロット×月相×運気の波）
  // 同じ人が同じ日に見れば同じ結果＝占いの再現性。毎日0時に更新される
  const now = new Date();
  const dateSeed = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const kantei = kanteiOf(seed || myType.slug, dateSeed, myType.dialect);
  const bestDate = new Date(now);
  bestDate.setDate(now.getDate() + kantei.bestDayOffset);
  const fSeed = `${dateSeed}-${myType.slug}`;
  const luckyPool = wordsOf(myType.dialect);
  const luckyWord = luckyPool[Math.floor(jitterFor(fSeed, "word") * luckyPool.length)];
  const luckyColor = LUCKY_COLORS[Math.floor(jitterFor(fSeed, "color") * LUCKY_COLORS.length)];
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Confetti />

      {/* シークレット降臨カード（超低確率。図鑑のモザイクが解放される） */}
      {secret && (
        <div className="rounded-2xl overflow-hidden anim-pop relative border-2 border-gold shine">
          <div
            className="sunburst text-center px-6 py-8 space-y-3"
            style={{ background: "linear-gradient(160deg, #241C3A 0%, #3A2A5E 55%, #4B3BC4 100%)" }}
          >
            <span className="sparkle text-2xl" style={{ top: "10%", left: "10%" }}>✦</span>
            <span className="sparkle text-lg" style={{ top: "20%", right: "12%", animationDelay: "0.7s" }}>✧</span>
            <span className="sparkle text-xl" style={{ bottom: "16%", left: "16%", animationDelay: "1.3s" }}>✦</span>
            <p className="text-gold text-sm font-bold tracking-[0.4em] animate-pulse">★ S E C R E T ★</p>
            <div className="flex justify-center">
              <SecretAvatar slug={secret.slug} size={150} dance />
            </div>
            <h2 className="font-display text-3xl font-bold text-goldgrad">{secret.name}</h2>
            <p className="text-white/90 text-sm font-bold">{secret.tagline}</p>
            <p className="text-white/70 text-sm leading-relaxed max-w-md mx-auto">{secret.desc}</p>
            <p className="inline-block rounded-full border border-gold/50 text-gold text-sm font-bold px-4 py-1">
              {secret.rateLabel} — 図鑑のシークレット枠が解放されました！
            </p>
          </div>
        </div>
      )}

      {/* タイプカード（タイプごとのテーマカラー背景＋後光＋きらめき） */}
      <div className="card overflow-hidden anim-fade-up shine">
        <div
          className="sunburst text-white text-center px-6 pt-8 pb-10 space-y-3"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 20%, ${heroColor.body}66, transparent), linear-gradient(168deg, ${heroColor.dark} 0%, #182A3E 85%)`,
          }}
        >
          <span className="sparkle text-2xl" style={{ top: "14%", left: "12%" }}>✦</span>
          <span className="sparkle text-lg" style={{ top: "28%", right: "10%", animationDelay: "0.9s" }}>✦</span>
          <span className="sparkle text-sm" style={{ top: "62%", left: "18%", animationDelay: "1.5s" }}>✧</span>
          <span className="sparkle text-xl" style={{ top: "70%", right: "16%", animationDelay: "0.4s" }}>✦</span>
          <p className="text-gold text-sm font-bold tracking-widest">YOUR HOGEN TYPE</p>
          <div className="flex justify-center anim-pop relative">
            {/* キャラの周りを漂うお祝い絵文字 */}
            <span className="emoji-drift text-2xl" style={{ top: "18%", left: "16%" }}>🎉</span>
            <span className="emoji-drift text-xl" style={{ top: "8%", right: "18%", animationDelay: "0.8s" }}>✨</span>
            <span className="emoji-drift text-xl" style={{ bottom: "6%", left: "24%", animationDelay: "1.5s" }}>💕</span>
            <span className="emoji-drift text-lg" style={{ bottom: "16%", right: "22%", animationDelay: "2.1s" }}>⭐</span>
            <TypeAvatar type={myType} size={150} dance />
          </div>
          <p className="text-gold text-sm font-bold anim-fade-up" style={{ animationDelay: "0.2s" }}>
            {myType.dialect}タイプ × {archetype.label}・{LEVEL_LABELS[level - 1]}
          </p>
          {/* 称号（小）→ 名前（特大・金箔）の2段組でコントラストをつける */}
          <h1 className="anim-fade-up leading-tight px-2 text-3xl" style={{ animationDelay: "0.25s" }}>
            <span className="block text-sm text-white/80 font-bold tracking-[0.15em] mb-1">
              — {personaMod} —
            </span>
            <span
              className={`font-display font-bold text-goldgrad tracking-tight ${
                MASCOT_NAMES[myType.slug].length >= 8 ? "text-3xl sm:text-5xl" : "text-4xl sm:text-5xl"
              }`}
            >
              {MASCOT_NAMES[myType.slug]}
            </span>
            <span className="text-sm align-top text-white/60 ml-1">ⓒ</span>
          </h1>
          <p className="text-sm opacity-90 anim-fade-up" style={{ animationDelay: "0.4s" }}>
            {myType.emoji} {myType.tagline}
          </p>
          <p className="anim-fade-up" style={{ animationDelay: "0.5s" }}>
            <span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-1">
              <span className="text-white/70 text-sm">{myType.dialect}成分</span>
              <span className="font-display font-bold text-2xl text-gold">{ranked[0]?.pct ?? 0}</span>
              <span className="text-gold text-sm">%</span>
            </span>
          </p>
        </div>
        <div className="p-6 space-y-5 -mt-4 bg-white rounded-t-2xl relative">
          {/* 詳細レポート（ラブ診断級のボリューム） */}
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
              あなたの中の{myType.dialect}気質
            </h3>
            <p className="leading-relaxed text-sm text-sub">{myType.desc}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">💘 恋愛スタイル</div>
              <p className="text-sub">{archetype.love}</p>
            </div>
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">💞 {MASCOT_NAMES[myType.slug]}の恋</div>
              <p className="text-sub">{myType.love}</p>
            </div>
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">💼 仕事でのあなた</div>
              <p className="text-sub">{archetype.work}</p>
            </div>
            <div className="bg-paper rounded-xl p-4">
              <div className="font-bold mb-1">📖 あなたのトリセツ</div>
              <p className="text-sub">{archetype.torisetsu}</p>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm">
            <div className="font-bold mb-1">😂 {myType.dialect}キャラあるある</div>
            <p className="text-sub">{myType.aruaru}</p>
          </div>

          {/* 方言成分 */}
          <div className="space-y-2">
            <div className="font-bold text-sm">あなたの方言成分</div>
            {ranked.slice(0, 5).map(({ d, pct }, i) => (
              <div key={d} className="flex items-center gap-3">
                <span className={`w-20 shrink-0 ${i === 0 ? "text-sm font-bold" : "text-sm text-sub"}`}>{d}</span>
                <div className={`flex-1 bg-line/50 rounded-full overflow-hidden ${i === 0 ? "h-4" : "h-2.5"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${i === 0 ? "bg-primary bar-shimmer" : "bg-primary/55"}`}
                    style={{ width: `${grown ? pct : 0}%`, transitionDelay: `${i * 0.1}s` }}
                  />
                </div>
                <span className={`text-right shrink-0 ${i === 0 ? "w-14 font-display font-bold text-lg text-primary-text" : "w-14 text-sm text-sub"}`}>
                  {pct}<span className="text-sm">%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 相性ランキング（%） */}
      <div className="card p-6 space-y-4 anim-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="font-bold">💞 あなたと相性のいいタイプ TOP3</div>
        <div className="space-y-3">
          {compatTop.map(({ t, a }, i) => (
            <div key={t.slug} className="flex items-center gap-3">
              <span className="text-lg font-bold font-display w-6 text-center shrink-0">{i + 1}</span>
              <TypeAvatar type={t} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">
                  {t.name} <span className="font-normal text-sm text-sub">（{t.dialect}）</span>
                </div>
                <div className="bg-line/50 rounded-full h-2.5 overflow-hidden mt-1">
                  <div
                    className="bg-gold h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${grown ? a.score : 0}%`, transitionDelay: `${i * 0.15}s` }}
                  />
                </div>
              </div>
              <span className="text-lg font-bold text-primary-text w-14 text-right shrink-0">{a.score}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-line">
          <span className="text-lg w-6 text-center shrink-0">⚡</span>
          <TypeAvatar type={compatWorst.t} size={44} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">
              火花が散る相手：{compatWorst.t.name}
              <span className="font-normal text-sm text-sub">（{compatWorst.t.dialect}）</span>
            </div>
            <div className="bg-line/50 rounded-full h-2.5 overflow-hidden mt-1">
              <div
                className="bg-indigo h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${grown ? compatWorst.a.score : 0}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-bold text-indigo w-14 text-right shrink-0">{compatWorst.a.score}%</span>
        </div>
        <p className="text-sm text-sub">友達に診断リンクを送ると、実際の2人の相性%が出ます</p>
      </div>

      {/* 友達との相性結果（招待リンク経由。性格情報なしの簡易版） */}
      {compat && friendType && (
        <CompatCard
          a={{ type: myType, cluster: topCluster, level, label: "あなた" }}
          b={{ type: friendType, label: MASCOT_NAMES[friendType.slug] }}
        />
      )}

      {/* 相性コード（発行＋友達コード入力） */}
      <div className="card p-6 space-y-4 text-center anim-fade-up" style={{ animationDelay: "0.32s" }}>
        <div className="font-bold">💞 あなたの相性コード</div>
        <div className="inline-block rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 px-8 py-3">
          <span className="font-display font-bold text-4xl tracking-[0.25em] text-primary-text">{myCode}</span>
        </div>
        <p className="text-sm text-sub leading-relaxed">
          この4文字を送り合えば、お互い診断し直さずに何度でも相性を鑑定できます。
          <br />
          結果はこの端末に保存済み。相性チェッカーでもいつでも使えます。
        </p>
        <p>
          <Link href="/aishou" className="inline-flex min-h-[48px] items-center text-sm text-primary-text font-bold hover:underline">
            → 相性チェッカー
          </Link>
        </p>
        <button
          onClick={() => {
            void copyCode(myCode);
          }}
          className="btn-secondary text-sm"
        >
          {codeStatus === "ok"
            ? "✓ コピーしました！"
            : codeStatus === "fail"
              ? "⚠️ コピーできませんでした"
              : "コードをコピー"}
        </button>
        {/* コピーの結果は必ず目に見える形で、読める長さだけ出す */}
        <p aria-live="polite" className="text-sm font-bold min-h-[1.25rem]">
          {codeStatus === "ok" && (
            <span className="text-primary-text">
              相性コード「{myCode}」をコピーしました。友達に送ってください。
            </span>
          )}
          {codeStatus === "fail" && (
            <span className="text-primary-text">
              コピーできませんでした。お使いのブラウザの設定でコピーが許可されていない可能性があります。上の4文字「{myCode}」を手動で控えてください。
            </span>
          )}
        </p>
        <div className="pt-3 border-t border-line space-y-2">
          <p className="text-sm font-bold">友達のコードを入力して、その場で鑑定</p>
          <div className="flex gap-2 max-w-xs mx-auto">
            <input
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
              placeholder="例: 9QAB"
              maxLength={6}
              className="input-base text-center font-display font-bold text-xl tracking-[0.25em] uppercase"
            />
            <button
              onClick={() => {
                const d = decodeCode(friendCode);
                if (!d) {
                  setFriendCodeError("コードが正しくありません");
                  setFriendDecoded(null);
                  return;
                }
                setFriendCodeError("");
                setFriendDecoded(d);
              }}
              disabled={!friendCode.trim()}
              className="btn-primary px-5 shrink-0"
            >
              鑑定
            </button>
          </div>
          {friendCodeError && <p className="text-primary-text text-sm font-bold">{friendCodeError}</p>}
        </div>
      </div>

      {/* 友達コードでの多角相性（手入力 or 結果ページ経由の?vs=から自動表示） */}
      {(friendDecoded ?? (vsParam ? decodeCode(vsParam) : null)) && (
        <CompatCard
          a={{ type: myType, cluster: topCluster, level, label: "あなた" }}
          b={(() => {
            const d = friendDecoded ?? (vsParam ? decodeCode(vsParam) : null)!;
            return { type: d.type, cluster: d.cluster, level: d.level, label: MASCOT_NAMES[d.type.slug] };
          })()}
        />
      )}

      {/* 自由入力の照合結果（辞書の種） */}
      {freeInputs.length > 0 && (
        <div className="card p-6 space-y-3">
          <div className="font-bold">✏️ あなたの言い方（{freeInputs.length}件）</div>
          <div className="space-y-2 text-sm">
            {freeInputs.map((f, i) => (
              <div key={i} className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sub text-sm shrink-0">「{f.q}」→</span>
                <span className="font-bold">{f.text}</span>
                {f.matched ? (
                  <span className="chip bg-gold/15 text-amber-800 border border-gold/40">
                    {f.matched}の言い方に近い！
                  </span>
                ) : (
                  <span className="chip bg-indigo/10 text-indigo">未登録のレア表現かも</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-sub">
            この言い方はこの端末に保存しました。
          </p>
          <p>
            <Link href="/dict" className="inline-flex min-h-[48px] items-center text-sm text-primary-text hover:underline">
              みんなの方言辞書に投稿する →
            </Link>
          </p>
        </div>
      )}

      {/* ことだま鑑定書（本格占い: 数秘×五行×タロット×月相×運気の波） */}
      <div
        className="rounded-2xl overflow-hidden anim-fade-up relative"
        style={{ animationDelay: "0.3s", background: "linear-gradient(160deg, #141A38 0%, #2C2350 55%, #3A2A5E 100%)" }}
      >
        <span className="sparkle text-lg" style={{ top: "4%", left: "8%" }}>✦</span>
        <span className="sparkle text-sm" style={{ top: "9%", right: "12%", animationDelay: "1.1s" }}>✧</span>
        <span className="sparkle text-sm" style={{ bottom: "6%", left: "14%", animationDelay: "0.6s" }}>✦</span>
        <span className="sparkle text-lg" style={{ bottom: "30%", right: "7%", animationDelay: "1.7s" }}>✧</span>
        {/* 金の内枠 */}
        <div className="m-2.5 rounded-xl border border-gold/40 p-5 sm:p-6 space-y-6 relative">
          {/* 表題 */}
          <div className="text-center space-y-1.5">
            <p className="text-gold text-sm font-bold tracking-[0.35em]">KOTODAMA KANTEI</p>
            <h2 className="font-display text-3xl font-bold text-goldgrad tracking-wide">ことだま鑑定書</h2>
            <p className="text-white/50 text-sm">
              {now.getMonth() + 1}月{now.getDate()}日（{WDAYS[now.getDay()]}）　{MASCOT_NAMES[myType.slug]} どの
            </p>
            <p className="text-white/75 text-sm leading-relaxed">
              {kantei.moon.icon} 今宵の月「{kantei.moon.name}」— {kantei.moon.text}
            </p>
          </div>

          {/* 総合運 */}
          <div className="text-center space-y-2">
            <div className="text-white/60 text-sm tracking-[0.35em]">総 合 運</div>
            <div className="text-gold text-4xl tracking-[0.15em]">{stars(kantei.totalN)}</div>
            <p className="text-white/90 text-sm font-display">{kantei.opener}</p>
          </div>

          {/* 四大運勢（星＋鑑定文） */}
          <div className="grid sm:grid-cols-2 gap-2.5">
            {kantei.categories.map((c) => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white font-bold text-sm">{c.icon} {c.label}</span>
                  <span className="text-gold text-sm tracking-tight shrink-0">{stars(c.n)}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          {/* ことだま数（数秘術） */}
          <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="shrink-0 text-center w-16">
              <div className="text-sm text-gold tracking-[0.2em]">ことだま数</div>
              <div className="font-display text-5xl text-goldgrad font-bold leading-none mt-1.5">
                {kantei.kotodama.n}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-sm">
                第「{kantei.kotodama.name}」— {kantei.kotodama.catch}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mt-1">{kantei.kotodama.text}</p>
            </div>
          </div>

          {/* ことだま五行 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-full grid place-items-center font-display text-2xl font-bold text-white shrink-0 shadow-lg"
                style={{ background: kantei.gogyo.color }}
              >
                {kantei.gogyo.el}
              </span>
              <div className="min-w-0">
                <div className="text-sm text-gold tracking-[0.2em]">ことだま五行</div>
                <div className="text-white font-bold text-sm">
                  {myType.dialect}のことだまは「{kantei.gogyo.el}（{kantei.gogyo.reading}）」の気
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{kantei.gogyo.nature}</p>
            <div className="grid gap-1.5 text-sm border-t border-white/10 pt-2.5">
              <div className="flex gap-2">
                <span className="text-emerald-300 font-bold shrink-0 w-8">相生</span>
                <span className="text-white/70 leading-relaxed">{kantei.gogyo.boost}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-rose-300 font-bold shrink-0 w-8">相剋</span>
                <span className="text-white/70 leading-relaxed">{kantei.gogyo.care}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gold font-bold shrink-0 w-8">習慣</span>
                <span className="text-white/70 leading-relaxed">{kantei.gogyo.habit}</span>
              </div>
            </div>
          </div>

          {/* ことだまタロット（今日の一枚） */}
          <div className="flex gap-4 items-center bg-white/5 border border-white/10 rounded-xl p-4">
            <div
              className={`shrink-0 w-20 h-28 rounded-lg border-2 border-gold/60 grid place-items-center text-center p-1.5 transition-transform ${kantei.isUp ? "" : "rotate-180"}`}
              style={{ background: "linear-gradient(180deg, #2A2148, #1B1535)" }}
            >
              <div>
                <div className="text-gold font-display text-sm">{kantei.tarot.no}</div>
                <div className="text-2xl my-1">{kantei.isUp ? "🌞" : "🌙"}</div>
                <div className="text-white text-sm font-bold leading-tight">{kantei.tarot.name}</div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gold tracking-[0.2em]">今日の一枚</div>
              <div className="text-white font-bold text-sm mt-0.5">
                「{kantei.tarot.name}」
                <span className={`ml-1.5 text-sm px-2 py-0.5 rounded-full border ${kantei.isUp ? "border-gold/50 text-gold" : "border-white/30 text-white/60"}`}>
                  {kantei.isUp ? "正位置" : "逆位置"}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mt-1">
                {kantei.isUp ? kantei.tarot.up : kantei.tarot.down}
              </p>
            </div>
          </div>

          {/* 運気の波（7日間バイオリズム） */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div className="text-white font-bold text-sm">📈 運気の波 — これから7日間</div>
              <div className="text-gold text-sm font-bold">
                勝負日：{kantei.bestDayOffset === 0 ? "今日！" : `${bestDate.getMonth() + 1}/${bestDate.getDate()}（${WDAYS[bestDate.getDay()]}）`}
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {kantei.wave.map((v, i) => {
                const d = new Date(now);
                d.setDate(now.getDate() + i);
                const isBest = i === kantei.bestDayOffset;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full rounded-t-md transition-all duration-700 ease-out"
                      style={{
                        height: grown ? `${v * 18}%` : "4%",
                        transitionDelay: `${i * 0.08}s`,
                        background: isBest
                          ? "linear-gradient(180deg, #F5C84C, #C7862B)"
                          : "rgba(255,255,255,0.22)",
                      }}
                    />
                    <span className={`text-sm ${i === 0 ? "text-gold font-bold" : isBest ? "text-gold" : "text-white/50"}`}>
                      {i === 0 ? "今日" : `${d.getDate()}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* お守り（吉方位・ラッキー方言・カラー・開運行動） */}
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5">
              <span className="text-gold font-bold">🧭 吉方位「{kantei.direction.dir}」</span>
              <p className="mt-1 text-white/60 leading-relaxed">{kantei.direction.tip}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5">
              <span className="text-gold font-bold">🎐 開運ことだま行動</span>
              <p className="mt-1 text-white/60 leading-relaxed">{kantei.action}</p>
            </div>
            {luckyWord && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5">
                <span className="text-gold font-bold">✦ ラッキー方言</span>
                <p className="mt-1 text-white/80">
                  <b className="text-white text-sm">{luckyWord.word}</b>
                  <span className="text-white/50">（{luckyWord.meaning}）</span>
                </p>
              </div>
            )}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5">
              <span className="text-gold font-bold">🎨 ラッキーカラー</span>
              <p className="mt-1 text-white/80 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-white/30 inline-block" style={{ background: luckyColor.hex }} />
                <b className="text-white text-sm">{luckyColor.name}</b>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-white/40">
            ことだま鑑定は毎日0時に更新されます — 明日の鑑定書もお楽しみに
          </p>
        </div>
      </div>

      {/* シェア＆招待 */}
      <div className="card p-6 space-y-4 text-center">
        <div className="font-bold">結果をシェアして、友達との相性を見る</div>
        <p className="text-sm text-sub">
          このリンクから友達が診断すると、あなたとの相性が自動で表示されます
        </p>
        <ShareBar text={shareText} url={inviteUrl} block={shareBlockText} />
        <button onClick={() => setPhase("intro")} className="btn-ghost">
          ↻ もう一度診断する
        </button>
      </div>
      <CrossSite content="shindan" />

      <ToolIntro
        heading="方言タイプ診断について"
        paragraphs={[
          "この診断は、ふだんの言い回しや語感の好みに関する全14問から、あなたの言葉がどの方言圏のタイプに近いかを判定する無料の性格・方言診断です。出身地を直接聞くのではなく、「気を抜いたときに出る言い方」を手がかりにするのが特徴で、引っ越しが多かった人や、標準語で育ったつもりの人ほど意外な結果が出ることがあります。",
          "結果には全35タイプのご当地キャラクターが割り当てられ、性格の傾向・恋愛傾向・他のタイプとの相性も表示されます。登録不要・約2分で、何度でも受けられます。結果画面から友だちを招待すると、ふたりの相性もその場で確かめられます。",
        ]}
        related={[
          { href: "/aishou", label: "💞 友だちとの相性診断" },
          { href: "/translate", label: "🗣️ 方言変換" },
          { href: "/quiz", label: "🏅 方言クイズ検定" },
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
      <ShindanPage />
      <PageDates route="/shindan" type="WebApplication" name="方言タイプ診断 | 方言ラボ" />
    </>
  );
}
