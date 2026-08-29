"use client";

// 相性チェッカー — 診断し直さずに、相性コード2つで多角相性を鑑定するページ
import Link from "next/link";
import { useEffect, useState } from "react";
import CompatCard, { CompatPerson } from "@/components/CompatCard";
import { decodeCode, loadMyResult } from "@/lib/compat";
import { track } from "@/lib/ga";
import { MASCOT_NAMES } from "@/lib/types";
import { ToolIntro } from "@/components/ToolIntro";

export default function AishouPage() {
  const [codeA, setCodeA] = useState("");
  const [codeB, setCodeB] = useState("");
  const [error, setError] = useState("");
  const [pair, setPair] = useState<{ a: CompatPerson; b: CompatPerson } | null>(null);

  // 自分の結果が端末に保存されていれば自動入力
  useEffect(() => {
    const mine = loadMyResult();
    if (mine) setCodeA(mine.code);
  }, []);

  function check() {
    const a = decodeCode(codeA);
    const b = decodeCode(codeB);
    if (!a || !b) {
      track("aishou_error", { reason: !a ? "code_a" : "code_b" });
      setError(!a ? "1人目のコードが正しくありません" : "2人目のコードが正しくありません");
      setPair(null);
      return;
    }
    track("aishou_check", { type_a: a.type.slug, type_b: b.type.slug });
    setError("");
    setPair({
      a: { type: a.type, cluster: a.cluster, level: a.level, label: MASCOT_NAMES[a.type.slug] },
      b: { type: b.type, cluster: b.cluster, level: b.level, label: MASCOT_NAMES[b.type.slug] },
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="text-center space-y-2">
        <p className="text-primary font-bold tracking-widest text-xs">AISHOU CHECKER</p>
        <h1 className="text-3xl font-bold font-display">相性チェッカー</h1>
        <p className="text-sub text-sm leading-relaxed">
          診断結果に表示される<b className="text-primary">4文字の相性コード</b>を2つ入力するだけ。
          <br />
          何度でも・誰とでも、診断し直さずに相性を鑑定できます。
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-sub">あなたのコード</label>
            <input
              value={codeA}
              onChange={(e) => setCodeA(e.target.value.toUpperCase())}
              placeholder="例: 0K7M"
              maxLength={6}
              className="input-base mt-1 text-center font-display font-bold text-2xl tracking-[0.3em] uppercase"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-sub">相手のコード</label>
            <input
              value={codeB}
              onChange={(e) => setCodeB(e.target.value.toUpperCase())}
              placeholder="例: 9QAB"
              maxLength={6}
              className="input-base mt-1 text-center font-display font-bold text-2xl tracking-[0.3em] uppercase"
            />
          </div>
        </div>
        {error && <p className="text-primary text-xs font-bold text-center">{error}</p>}
        <button onClick={check} disabled={!codeA.trim() || !codeB.trim()} className="btn-primary w-full py-3.5">
          💞 相性を鑑定する
        </button>
        <p className="text-[11px] text-sub text-center">
          コードを持っていない人は
          <Link href="/shindan" className="text-primary font-bold hover:underline">
            2分の診断
          </Link>
          で発行できます（結果画面に表示されます）
        </p>
      </div>

      {pair && (
        <CompatCard
          a={pair.a}
          b={pair.b}
          shareUrl={typeof window !== "undefined" ? `${window.location.origin}/aishou` : "https://hogen.mainichi-lab.com/aishou"}
        />
      )}
      <ToolIntro
        heading="方言相性チェッカーについて"
        paragraphs={[
          "ふたりの方言タイプから、言葉の相性を診断する無料ツールです。方言タイプ診断の結果コードを入力するか、その場でふたりがタイプを選ぶだけで、会話のテンポ・距離感の詰め方・けんかになりやすいポイントを診断します。",
          "方言は「どこで育ったか」だけでなく「人との距離をどう取るか」の癖でもあります。関西の突っ込み文化と東北の間の文化が出会うと何が起きるか——そんな組み合わせの妙を、35タイプ×35タイプの全組み合わせで用意しています。友だち・恋人・職場の人と気軽に試してみてください。",
        ]}
        related={[
          { href: "/shindan", label: "🔮 まず自分のタイプを診断" },
          { href: "/kawaii", label: "💗 かわいい方言対決" },
          { href: "/doko", label: "🗾 この方言どこ？" },
        ]}
      />
    </div>
  );
}
