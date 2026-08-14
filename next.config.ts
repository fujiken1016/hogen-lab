import type { NextConfig } from "next";

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
