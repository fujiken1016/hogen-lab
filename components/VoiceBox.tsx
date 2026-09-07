"use client";

/**
 * 「一言」ボックス。2026-09-07 新設（SHIP-12 カスタマー）。
 *
 * なぜ置くか：
 *   `memory/customer_voice.md` の声の欄が **0件**（2026-09-07 実測）。
 *   一方で無料ツールには人が来ている（GSC 2026/08/05〜09/01 実測＝`/translate/tosa` 18クリック）。
 *   ＝「商品が悪い」のか「届いていない」のかを判定する材料が、いま1件も無い。
 *
 * なぜ既存の /contact では足りないか（＝「導線が無い」ではなく「重すぎる」）：
 *   hogen・takken とも `/contact` は実在する。ただし**フッタからしか行けず**、
 *   中身は mailto でメーラーを起動する形＝**送信者の実アドレスが相手に渡る**。
 *   「変換がいまいちだった」の一言のために、面を移動してメールを書く人はいない。
 *
 * 設計上ゆずれない点：
 *   1. **変換が終わった後にだけ出す。** 冒頭・途中に割り込まない（ツールの邪魔をしない）
 *   2. **名前もメールも要求しない。** 個人情報を預からない＝こちらが責任を負わない
 *   3. **押した結果は消えない。** お礼は自動で流さず、閉じるまで出したままにする（時間軸の原則）
 *   4. 受け皿は **Cloudflare KV（自分のアカウント）**。外部フォーム事業者にデータを置かない
 *
 * 計測：
 *   評価は **イベント名そのものに埋める**（`voice_good` / `voice_bad`）。
 *   GA4のカスタムディメンションは登録するまでパラメータを読めず遡及もしないので、
 *   登録なしで読める形にしてある（`memory/lessons_learned.md` 2026-09-02 の同型の失敗の対策）。
 */

import { useState } from "react";
import { track } from "@/lib/ga";

const MAX = 200;

/** 個人情報になりうる形を送信前に落とす。ユーザーが誤って書いても預からないため。 */
function scrub(s: string): string {
  return s
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[削除]")
    .replace(/https?:\/\/\S+/g, "[削除]")
    .replace(/0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{3,4}/g, "[削除]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX);
}

type Phase = "ask" | "write" | "done";

export default function VoiceBox({ page }: { page: string }) {
  const [phase, setPhase] = useState<Phase>("ask");
  const [rating, setRating] = useState<"good" | "bad" | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  function send(body: Record<string, string>) {
    // 失敗してもUIは止めない（声が1件落ちるより、画面が壊れるほうが損）
    try {
      const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/voice", blob)) return;
    } catch {
      /* sendBeacon が使えない環境は fetch にフォールバック */
    }
    void fetch("/api/voice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  }

  function vote(r: "good" | "bad") {
    if (rating) return; // 連打・二重送信を防ぐ
    setRating(r);
    setPhase("write");
    track(r === "good" ? "voice_good" : "voice_bad", { page });
    send({ rating: r, page, text: "" });
  }

  function submit() {
    if (sending) return;
    const clean = scrub(text);
    setSending(true);
    if (clean) {
      track("voice_text", { page });
      send({ rating: rating ?? "", page, text: clean });
    }
    setPhase("done");
  }

  return (
    <div className="card p-5 space-y-3">
      <h2 className="text-xl font-bold">この変換、どうでしたか？</h2>

      {phase === "ask" && (
        <>
          <p className="text-sm text-sub leading-relaxed">
            作っているのは個人ひとりです。押すだけで届きます（登録も入力も不要）。
          </p>
          <div className="flex gap-2">
            <button onClick={() => vote("good")} className="btn-secondary flex-1 min-h-[60px]">
              😊 使えた
            </button>
            <button onClick={() => vote("bad")} className="btn-secondary flex-1 min-h-[60px]">
              🤔 いまいち
            </button>
          </div>
        </>
      )}

      {phase === "write" && (
        <>
          <p className="text-sm font-bold leading-relaxed">
            {rating === "good"
              ? "ありがとうございます。届きました。"
              : "ありがとうございます。届きました。直したいので、よければ教えてください。"}
          </p>
          <label htmlFor="voice-text" className="block text-sm text-sub leading-relaxed">
            一言だけ（任意・{MAX}文字まで）。
            {rating === "bad" ? "「この言い方が無かった」など、一語でも助かります。" : ""}
            <br />
            お名前・メールアドレスは書かないでください（返信はできません）。
          </label>
          <textarea
            id="voice-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例：土佐弁の「〜ちゅう」が変換されなかった"
            rows={3}
            maxLength={MAX}
            className="input-base resize-none"
          />
          <div className="flex gap-2">
            <button onClick={submit} disabled={sending} className="btn-primary flex-1 min-h-[48px]">
              送る
            </button>
            <button onClick={() => setPhase("done")} className="btn-secondary min-h-[48px] px-4">
              書かない
            </button>
          </div>
        </>
      )}

      {phase === "done" && (
        <p className="text-sm font-bold leading-relaxed">
          ありがとうございます。読ませてもらいます。
          <br />
          <span className="text-sub font-normal">
            くわしく伝えたいときは{" "}
            <a href="/contact" className="underline text-indigo">
              お問い合わせ
            </a>
            からどうぞ。
          </span>
        </p>
      )}
    </div>
  );
}
