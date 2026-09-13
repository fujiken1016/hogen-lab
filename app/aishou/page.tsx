"use client";

// 相性チェッカー — 診断し直さずに、相性コード2つで多角相性を鑑定するページ
import Link from "next/link";
import { useEffect, useState } from "react";
import CompatCard, { CompatPerson } from "@/components/CompatCard";
import { CLUSTERS, decodeCode, loadMyResult } from "@/lib/compat";
import { track } from "@/lib/ga";
import { MASCOT_NAMES, TYPES } from "@/lib/types";
import { ToolIntro } from "@/components/ToolIntro";
import { PageDates } from "@/components/PageDates";

/**
 * ページ下部の静的解説。この面は診断そのものを持たず「コードを2つ受け取る窓口」なので、
 * 解説の中心はコードの読み方と、結果が毎回同じになる理由に置く（2026-09-14）。
 */
function AishouIntro() {
  const types = TYPES.length;
  const clusters = CLUSTERS.length;
  const levels = 5;
  return (
    <ToolIntro
      heading="方言相性チェッカーについて"
      paragraphs={[
        `方言タイプ診断で出た4文字のコードを2つ入れると、そのふたりの相性を出すページです。この面自体には質問がありません。${types}タイプ×${clusters}種類の性格×強さ${levels}段階＝${(types * clusters * levels).toLocaleString()}通りの結果が、すべて4文字に畳み込まれているからです。`,
        "だから、相手に診断をやり直してもらう必要がありません。1回出したコードを控えておけば、何人とでも、何度でも、あとから相性だけを出し直せます。",
      ]}
      steps={[
        {
          t: "自分のコードを用意する",
          d: "方言タイプ診断の結果画面に4文字のコードが出ます。この端末で一度診断していれば、1人目の欄には自動で入ります（端末に保存してあるためで、サーバーには送っていません）。",
        },
        {
          t: "相手のコードをもらう",
          d: "相手には診断を1回だけやってもらい、出た4文字を教えてもらいます。コードだけで足りるので、結果画面のスクリーンショットも、アカウントのやり取りも要りません。",
        },
        {
          t: "2つ入れて鑑定する",
          d: "英数字は小文字で打っても自動で大文字になります。コードが正しくないときは、どちらの欄が違うかを名指しで出します。",
        },
        {
          t: "5つの軸で読む",
          d: "会話のテンポ・価値観・恋愛相性・コンビ仕事力・ケンカ耐性の5軸が、それぞれ5段階で出ます。総合点だけを見るより、どの軸が低いかを見たほうが心当たりが当たります。",
        },
      ]}
      facts={[
        {
          h: "4文字コードに入っているもの",
          body: [
            `コードは3文字＋確認用の1文字でできています。前の3文字に、方言タイプ（${types}種類）・性格の型（${clusters}種類）・強さ（${levels}段階）の3つが1つの番号として詰めてあります。`,
            "最後の1文字は打ち間違いを見つけるためのものです。1文字でも違えば計算が合わなくなるので、存在しないコードを入れて別人の結果が出てしまうことはありません。似た形の「O」と「0」、「I」と「1」だけは、そのままで通らなかったときに入れ替えて読み直します。",
            "コードに名前も生年月日も位置情報も入っていません。診断の答えそのものも入っていません。入っているのは結果の3つだけなので、人に渡しても、そこから何かをたどれる性質のものではありません。",
          ],
        },
        {
          h: "何度やっても同じ結果になる",
          body: [
            "この鑑定に乱数は使っていません。同じ2つのコードなら、いつ・誰の端末で出しても同じ結果になります。占いのように引き直すと変わる作りにはしていません。",
            "入れる順番も結果を変えません。自分を1人目にしても2人目にしても同じです。相性の話で「どちらから見たか」で答えが変わるのは不自然なので、内部では2つのコードを並べ替えてから計算しています。",
            "5つの軸は、タイプ同士の近さを土台に、軸ごとに決まった幅で散らして出しています。さらに、ふたりの性格の型が同じなら価値観が1段階上がり、にぎやか型・熱血型どうしならテンポが1段階上がります。相性の良し悪しには、方言タイプに割り当てた五行（木・火・土・金・水）の関係も添えています。",
          ],
        },
      ]}
      faq={[
        {
          q: "コードを持っていません。",
          a: "方言タイプ診断を1回受けると結果画面に出ます。所要は約2分で、登録もインストールも要りません。",
        },
        {
          q: "自分のコードが自動で入りません。",
          a: "この端末でまだ診断していないか、ブラウザの保存データが消えている可能性があります。別の端末で診断した場合も引き継がれないので、手で打ち込んでください。",
        },
        {
          q: "相手のコードを保存してしまって大丈夫ですか？",
          a: "コードは相手の診断結果だけを表した4文字で、個人を特定できる情報は入っていません。ただし、相手がタイプを知られたくない場合もあるので、渡すかどうかは本人に決めてもらってください。",
        },
        {
          q: "3人以上の相性を一度に出せますか？",
          a: "一度に出せるのは2人ぶんです。3人なら、組み合わせを変えて3回鑑定してください。同じコードなら何度出しても結果は変わらないので、比べても矛盾しません。",
        },
        {
          q: "診断し直したらコードは変わりますか？",
          a: "答えが変われば結果も変わるので、コードも変わります。前のコードも入力自体は通りますが、それは前回の結果を指したままになります。",
        },
      ]}
      related={[
        { href: "/shindan", label: "🔮 まず自分のタイプを診断" },
        { href: "/kawaii", label: "💗 かわいい方言対決" },
        { href: "/doko", label: "🗾 どこの言葉か当てる" },
        { href: "/kurabe", label: "🔤 同じ意味を全国でくらべる" },
      ]}
    />
  );
}

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
        <p className="text-primary-text font-bold tracking-widest text-sm">AISHOU CHECKER</p>
        <h1 className="text-3xl font-bold font-display">相性チェッカー</h1>
        <p className="text-sub text-sm leading-relaxed">
          診断結果に表示される<b className="text-primary-text">4文字の相性コード</b>を2つ入力するだけ。
          <br />
          何度でも・誰とでも、診断し直さずに相性を鑑定できます。
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-sub">あなたのコード</label>
            <input
              value={codeA}
              onChange={(e) => setCodeA(e.target.value.toUpperCase())}
              placeholder="例: 0K7M"
              maxLength={6}
              className="input-base mt-1 text-center font-display font-bold text-2xl tracking-[0.3em] uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-sub">相手のコード</label>
            <input
              value={codeB}
              onChange={(e) => setCodeB(e.target.value.toUpperCase())}
              placeholder="例: 9QAB"
              maxLength={6}
              className="input-base mt-1 text-center font-display font-bold text-2xl tracking-[0.3em] uppercase"
            />
          </div>
        </div>
        {error && <p className="text-primary-text text-sm font-bold text-center">{error}</p>}
        <button onClick={check} disabled={!codeA.trim() || !codeB.trim()} className="btn-primary w-full py-3.5">
          💞 相性を鑑定する
        </button>
        <p className="text-sm text-sub text-center">
          コードを持っていない人は、2分の診断で発行できます（結果画面に表示されます）
        </p>
        <p className="text-center">
          <Link href="/shindan" className="inline-flex min-h-[48px] items-center justify-center text-sm font-bold text-primary-text hover:underline">
            → 2分の診断でコードを発行する
          </Link>
        </p>
      </div>

      {pair && (
        <CompatCard
          a={pair.a}
          b={pair.b}
          shareUrl={typeof window !== "undefined" ? `${window.location.origin}/aishou` : "https://hogen.mainichi-lab.com/aishou"}
        />
      )}
      <AishouIntro />
      <PageDates route="/aishou" type="WebApplication" name="方言相性診断 | 方言ラボ" />
    </div>
  );
}
