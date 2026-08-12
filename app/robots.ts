import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 診断結果の共有ページ（/r/コード）は個別結果なのでインデックス対象外
      disallow: ["/r/", "/dev"],
    },
    sitemap: "https://hogen.mainichi-lab.com/sitemap.xml",
  };
}
