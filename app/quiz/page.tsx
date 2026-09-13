import type { Metadata } from "next";
import Link from "next/link";
import TypeAvatar from "@/components/TypeAvatar";
import { REGIONS } from "@/lib/data";
import { AREA_OF, QUIZ_DIALECTS, quizSampleWords, quizSlug } from "@/lib/quiz_meta";
import { typeByDialect } from "@/lib/types";
import { PageDates } from "@/components/PageDates";

const BASE = "https://hogen.mainichi-lab.com";
// SC実測（28日）: 「方言検定」8表示・順位8.6 /「方言 検定」8表示・順位7.4 でクリック0。
// 旧タイトルは「方言クイズ検定」で、検索されている「方言検定」という並びを含んでいなかった。
const TITLE = "方言検定｜全35方言の方言クイズ・各8問（土佐弁・博多弁・津軽弁…） | 方言ラボ";
const DESC =
  "土佐弁検定・博多弁検定・津軽弁検定・熊本弁検定など全35方言の方言検定に挑戦。各8問の4択クイズで、8割正解すると合格バッジ。方言を選んでスマホで約1分、登録不要。";

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
        <h1 className="section-title">🏅 方言検定（方言クイズ）</h1>
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
            <h2 className="font-bold text-2xl text-sub border-b border-line pb-1">{r.name}</h2>
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
                      <div className="text-sm text-sub mt-0.5 leading-relaxed">
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

      {/* 2026-09-14: 出題方針・判定基準の本文は /quiz/about に集約した */}
      <p className="text-sm text-sub leading-relaxed">
        出題は方言ラボ辞典に立項している語だけ。判定は辞典の語釈にもとづきます。
      </p>
      <p>
        <Link
          href="/quiz/about"
          className="inline-flex min-h-[48px] items-center text-sm text-primary-text underline underline-offset-2"
        >
          → 方言検定の作り方と読み方（出題・出典照合・判定の基準）
        </Link>
      </p>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <Link href="/doko" className="btn-ghost">🗾 この方言どこの言葉？</Link>
        <Link href="/kawaii" className="btn-ghost">💗 かわいい方言トーナメント</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/shindan" className="btn-ghost">🎭 方言タイプ診断</Link>
      </div>
      <PageDates route="/quiz" type="CollectionPage" name="方言検定（全国）| 方言ラボ" />
    </div>
  );
}
