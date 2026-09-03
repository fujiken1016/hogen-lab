import Link from "next/link";
import { QUIZ_DIALECTS, quizSlug } from "@/lib/quiz_meta";
import { translateByRegion, translateSlug } from "@/lib/translate_meta";

/**
 * 全国35方言の索引（/translate/<地域>・/quiz/<地域> への直リンク）。
 *
 * なぜ置くか（2026-09-03・SC実測）:
 * Search Console の「検出 - インデックス未登録」80件のうち **59件が
 * /translate/<地域>（30）と /quiz/<地域>（29）** で、全件「前回のクロール＝該当なし」
 * ＝一度もクロールされていない。この59面へ向かう内部リンクは、
 * ハブ（/translate・/quiz）とスラッグ面どうしの相互リンクしか無く、
 * **実際にクロールされている面（トップ・記事13本）からの導線が0本**だった。
 * さらに /translate ハブ自体も未登録なので、30面が「未登録の親」の下にぶら下がっていた。
 *
 * → クロールされている面から直リンクを通して、クロールの優先度を上げるのが目的。
 *   新規ページは作らない（司令塔裁定35：リードタイム不要な施策に限る）。
 */
export default function DialectIndex({
  heading = "全国の方言ページ",
  sub = "ALL DIALECTS",
  mark = "索",
}: {
  heading?: string;
  sub?: string;
  mark?: string;
}) {
  const groups = translateByRegion();

  return (
    <section className="space-y-3">
      <div className="section-head">
        <span className="hanko-sq">{mark}</span>
        <div>
          <span className="sub">{sub}</span>
          <h2 className="ttl">{heading}</h2>
        </div>
      </div>
      <p className="text-sm text-sub leading-[1.9]">
        地域ごとに「変換（標準語↔方言）」と「検定（8問）」のページがあります。気になる方言から直接どうぞ。
      </p>

      {groups.map((g) => (
        <div key={g.region} className="space-y-2">
          <h3 className="text-xl font-bold text-sub tracking-wide">{g.region}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {g.dialects.map((d) => {
              const tSlug = translateSlug(d);
              const qSlug = QUIZ_DIALECTS.includes(d) ? quizSlug(d) : undefined;
              if (!tSlug) return null;
              return (
                <div
                  key={d}
                  className="!rounded-xl border border-line bg-paper p-2 shadow-[0_2px_10px_rgba(34,48,63,0.06)]"
                >
                  <div className="text-sm font-bold text-center leading-tight mb-1.5 truncate">
                    {d}
                  </div>
                  <div className="flex gap-1.5">
                    <Link
                      href={`/translate/${tSlug}`}
                      className="flex-1 min-h-[48px] inline-flex items-center justify-center !rounded-lg border border-primary/30 bg-primary/5 text-primary-text text-sm font-bold hover:bg-primary/10 transition-colors"
                    >
                      変換
                    </Link>
                    {qSlug && (
                      <Link
                        href={`/quiz/${qSlug}`}
                        className="flex-1 min-h-[48px] inline-flex items-center justify-center !rounded-lg border border-indigo/30 bg-indigo/5 text-indigo text-sm font-bold hover:bg-indigo/10 transition-colors"
                      >
                        検定
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="flex flex-wrap justify-center gap-2 pt-1">
        <Link href="/translate" className="btn-ghost text-sm min-h-[48px] inline-flex items-center">
          方言変換の一覧へ →
        </Link>
        <Link href="/quiz" className="btn-ghost text-sm min-h-[48px] inline-flex items-center">
          方言検定の一覧へ →
        </Link>
      </p>
    </section>
  );
}
