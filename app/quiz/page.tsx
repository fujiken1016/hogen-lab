import type { Metadata } from "next";
import Link from "next/link";
import TypeAvatar from "@/components/TypeAvatar";
import { REGIONS } from "@/lib/data";
import { AREA_OF, QUIZ_DIALECTS, quizSampleWords, quizSlug } from "@/lib/quiz_meta";
import { typeByDialect } from "@/lib/types";

const BASE = "https://hogen.mainichi-lab.com";
const TITLE = "方言クイズ検定｜全35方言・各8問（津軽弁・土佐弁・博多弁…） | 方言ラボ";
const DESC =
  "土佐弁検定・博多弁検定・津軽弁検定など全35方言の検定に挑戦。各8問の4択クイズで、8割正解すると合格バッジ。方言を選んでスマホで約1分、登録不要。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/quiz` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/quiz`, siteName: "方言ラボ", locale: "ja_JP", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function QuizIndexPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="section-title">🏅 方言クイズ検定</h1>
        <p className="text-sub text-sm leading-relaxed">
          全{QUIZ_DIALECTS.length}方言の検定を用意しています。方言を選ぶとその検定ページへ。
          各8問・約1分、8割正解で合格バッジがもらえます。
        </p>
      </div>

      {REGIONS.map((r) => {
        const list = r.dialects.filter((d) => QUIZ_DIALECTS.includes(d));
        if (list.length === 0) return null;
        return (
          <section key={r.name} className="space-y-2">
            <h2 className="font-bold text-sm text-sub border-b border-line pb-1">{r.name}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {list.map((d) => {
                const t = typeByDialect(d);
                return (
                  <Link
                    key={d}
                    href={`/quiz/${quizSlug(d)}`}
                    className="card p-4 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-3 min-h-[72px] min-w-0"
                  >
                    {t && <TypeAvatar type={t} size={52} />}
                    <div className="min-w-0">
                      <div className="font-bold">{d} 検定</div>
                      <div className="text-xs text-sub mt-0.5 leading-relaxed">
                        {AREA_OF[d]}・全8問（{quizSampleWords(d, 2).join("・")} など）
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="text-[11px] text-sub leading-relaxed">
        ※ 出題は方言ラボ辞典に収録している語だけを使い、出典を照合済みの語を優先しています。
        辞典が他の方言にも同じ語を収録している場合は設問ごとに併記します。方言には地域差・世代差があり、
        判定は辞典の語釈にもとづくもので、あなたの言葉が間違いという意味ではありません。
      </p>

      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        <Link href="/kawaii" className="btn-ghost">💗 かわいい方言トーナメント</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/shindan" className="btn-ghost">🎭 方言タイプ診断</Link>
      </div>
    </div>
  );
}
