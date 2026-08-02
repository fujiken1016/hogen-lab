import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "免責事項 | 方言ラボ",
};

export default function DisclaimerPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold font-display">免責事項</h1>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">コンテンツについて</h2>
        <p>
          当サイトの診断・相性・占いコンテンツは、すべてエンターテインメントを目的として制作されたものです。
          結果は科学的・学術的な根拠に基づく評価ではなく、その正確性・有用性・特定の目的への適合性を保証するものではありません。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">方言データについて</h2>
        <p>
          掲載している方言のデータ（単語・例文・言い回し）は、方言辞典サイト・自治体の公開資料・Wikipedia/Wiktionary（CC BY-SA）等を参照し、
          運営者が独自に編集したものです。方言には地域内でも世代・集落による大きな差異があり、内容の完全性・最新性を保証するものではありません。
          誤りに気づかれた際は<Link href="/contact" className="text-primary hover:underline">お問い合わせ</Link>よりご指摘いただけると幸いです。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">損害等の責任について</h2>
        <p>
          当サイトの利用、または利用できなかったことによって生じたいかなる損害についても、運営者は一切の責任を負いかねます。
          また、当サイトからリンクやバナーによって移動した外部サイトで提供される情報・サービスについても責任を負いません。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">広告について</h2>
        <p>
          当サイトは、第三者配信の広告サービスを利用する場合があります。広告の内容に関するお問い合わせは、各広告配信事業者へお願いいたします。
        </p>
      </section>
      <p className="text-xs text-sub">制定日: 2026年8月2日</p>
      <p>
        <Link href="/" className="text-primary font-bold hover:underline">← トップにもどる</Link>
      </p>
    </article>
  );
}
