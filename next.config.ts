import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";
import path from "node:path";

// ページの公開日・最終更新日（lib/page_dates.json）を git 履歴から再生成する。
// ⚠️ ここに置いてあるのは、本番デプロイが `npx opennextjs-cloudflare build` 経由で
//    **npm の prebuild を通らない**ため。ビルドのたびに必ず走る場所に置かないと、
//    日付が古いまま本番へ出て「更新していないサイト」に見えてしまう。
// dev では走らせない（起動が遅くなるだけなので）。手動実行は `npm run dates`。
if (process.env.NODE_ENV !== "development" && process.env.SKIP_PAGE_DATES !== "1") {
  try {
    const out = execFileSync(
      process.execPath,
      [path.join(process.cwd(), "scripts/gen_page_dates.mjs")],
      { encoding: "utf8" }
    );
    process.stdout.write(out);
  } catch (e) {
    console.warn("[page_dates] 生成に失敗（既存の lib/page_dates.json を使う）:", e);
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    // 記事の正URLは /blog/*。旧・別名パス /articles/* からは301で寄せる
    return [
      { source: "/articles", destination: "/blog", permanent: true },
      { source: "/articles/kawaii-hogen", destination: "/blog/kawaii-hogen-ranking", permanent: true },
      { source: "/articles/kizukanai-hogen", destination: "/blog/hyoujungo-dato-omotteta", permanent: true },
      { source: "/articles/sanbon-hikaku", destination: "/blog/tohoku-kansai-hakata", permanent: true },
      { source: "/articles/hogen-naze", destination: "/blog/naze-hogen-umareru", permanent: true },
      { source: "/articles/shindan-guide", destination: "/blog/shindan-guide", permanent: true },
      { source: "/articles/:slug", destination: "/blog/:slug", permanent: true },
      // 検定ページのslugはキャラ図鑑（/c/:slug）と共通。方言名と綴りがずれる2件だけ別名を寄せる
      { source: "/quiz/osaka", destination: "/quiz/kansai", permanent: true },
      { source: "/quiz/nanbu", destination: "/quiz/iwate", permanent: true },
    ];
  },
};

export default nextConfig;
