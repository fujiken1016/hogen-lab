import type { Metadata } from "next";
import Link from "next/link";
import TranslateTool from "@/components/TranslateTool";
import { TRANSLATE_DIALECTS, translateByRegion, translateSlug } from "@/lib/translate_meta";

const BASE = "https://hogen.mainichi-lab.com";

// 全方言をここで選べる形は残したまま（既にインデックスされている可能性があるため）、
// 方言別ページ（/translate/[slug]）への索引を兼ねる。
export const metadata: Metadata = {
  title: `方言変換｜標準語を全${TRANSLATE_DIALECTS.length}方言に変換 | 方言ラボ`,
  description: `入力した文を全${TRANSLATE_DIALECTS.length}方言に変換します。大阪弁・博多弁・津軽弁など、方言同士の変換もできます。方言ごとの変換ページ（「○○弁 変換」）へもここから移動できます。登録不要・スマホで数秒。`,
  alternates: { canonical: `${BASE}/translate` },
  openGraph: {
    title: `方言変換｜標準語を全${TRANSLATE_DIALECTS.length}方言に変換 | 方言ラボ`,
    description: `入力した文を全${TRANSLATE_DIALECTS.length}方言に変換。方言同士の変換もできます。`,
    url: `${BASE}/translate`,
    siteName: "方言ラボ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function TranslatePage() {
  const groups = translateByRegion();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="section-title">🗣️ 方言変換</h1>
        <p className="text-sub text-sm">
          全{TRANSLATE_DIALECTS.length}方言に対応。方言同士の変換もできます
        </p>
      </div>

      <TranslateTool />

      <section className="space-y-3">
        <h2 className="font-bold text-sm text-center">方言を選んで変換する（「○○弁 変換」の個別ページ）</h2>
        {groups.map((g) => (
          <div key={g.region} className="card p-4 space-y-2">
            <h3 className="text-xs font-bold text-sub">{g.region}</h3>
            <div className="flex flex-wrap gap-2">
              {g.dialects.map((d) => (
                <Link
                  key={d}
                  href={`/translate/${translateSlug(d)}`}
                  className="btn-secondary text-sm min-h-[44px] inline-flex items-center"
                >
                  {d} 変換
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <Link href="/quiz" className="btn-ghost">🏅 方言クイズ検定</Link>
        <Link href="/kurabe" className="btn-ghost">🔤 全国方言くらべ</Link>
        <Link href="/dict" className="btn-ghost">📖 方言辞典</Link>
      </div>
    </div>
  );
}
