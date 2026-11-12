import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { PageDates } from "@/components/PageDates";

export const metadata: Metadata = {
  title: "免責事項 | 方言ラボ",
  description:
    "方言ラボの免責事項です。掲載する方言情報の正確性、診断・クイズ結果の位置づけ、外部リンク先についての考え方を記載しています。",
  alternates: { canonical: "https://hogen.mainichi-lab.com/disclaimer" },
  ...ogMeta({ title: "免責事項 | 方言ラボ", description: "方言ラボの免責事項です。掲載する方言情報の正確性、診断・クイズ結果の位置づけ、外部リンク先についての考え方を記載しています。", path: "/disclaimer" }),
};

export default function DisclaimerPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold font-display">免責事項</h1>
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">コンテンツについて</h2>
        <p>
          当サイトの診断・相性・占いコンテンツは、すべてエンターテインメントを目的として制作されたものです。
          結果は科学的・学術的な根拠に基づく評価ではなく、その正確性・有用性・特定の目的への適合性を保証するものではありません。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">方言データについて</h2>
        <p>
          掲載している方言のデータ（単語・例文・言い回し）は、方言辞典サイト・自治体の公開資料・Wikipedia/Wiktionary（CC BY-SA）等を参照し、
          運営者が独自に編集したものです。方言には地域内でも世代・集落による大きな差異があり、内容の完全性・最新性を保証するものではありません。
          誤りに気づかれた際はお問い合わせよりご指摘いただけると幸いです。
        </p>
        <p>
          <Link href="/contact" className="inline-flex min-h-[48px] items-center text-primary-text hover:underline">→ お問い合わせ</Link>
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">方言データの確認のしかた</h2>
        <p>
          辞典の語は、辞典サイト・自治体や観光協会の公開資料・地方紙・大学の資料などの出典と1語ずつ照らし合わせる作業を続けています。
          2026年11月12日時点で、出典との照合の記録（台帳）は一般語1,265語に達しており、内訳は
          「その方言の語として出典で確認できた」611語、「確認できたが複数の地方でも使う」466語、「出典に合わせて直した」18語、
          「出典が取れていない」170語です。
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>出典が取れていない語は、辞典には残していても、検定や「この方言どこの言葉？」の正解としては使いません。</li>
          <li>複数の地方で使われると確認できた語は、「◯◯弁にも収録があります」と併記し、特定の地方だけの言葉とは断定しません。</li>
          <li>「この方言どこの言葉？」の出題は、出典で一つの地方の語と確認できた語だけに絞っています。確認の結果、複数の地方で使うと分かった語は出題から外し、検定側で複数地方の語として扱います。</li>
        </ul>
        <p>
          方言は同じ県内でも地域や世代で違うため、この照合は「辞典の記述が出典と合っているか」の確認であって、
          その言葉を使う・使わないの個人差まで保証するものではありません。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">診断・クイズの結果の見方</h2>
        <p>
          診断・相性・占い系の結果は、選んだ答え（占いは日付も加えて）をもとに、あらかじめ決めた規則で出しています。同じ答えなら同じ日には同じ結果になり、乱数で変わるものではありません。
          統計調査や学術研究の結果ではないため、その方言の話者全体の傾向を示すものではありません。
          友人や家族と話すきっかけとして楽しむ範囲でご利用ください。
        </p>
        <p>
          結果の内容に違和感がある、辞典の記述が実際と違う、といった点は<Link href="/contact" className="text-primary-text hover:underline">お問い合わせ</Link>からお知らせください。
          確認して誤りが確かめられたものは、辞典や記事を直し、各ページ下部の「最終更新」の日付も更新します。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">損害等の責任について</h2>
        <p>
          当サイトの利用、または利用できなかったことによって生じたいかなる損害についても、運営者は一切の責任を負いかねます。
          また、当サイトからリンクやバナーによって移動した外部サイトで提供される情報・サービスについても責任を負いません。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">広告について</h2>
        <p>
          当サイトは、第三者配信の広告サービスを利用する場合があります。広告の内容に関するお問い合わせは、各広告配信事業者へお願いいたします。
        </p>
      </section>
      <p className="text-sm text-sub">制定日: 2026年8月2日</p>
      <p>
        <Link href="/" className="inline-flex min-h-[48px] items-center text-primary-text font-bold hover:underline">← トップにもどる</Link>
      </p>
      <PageDates route="/disclaimer" type="WebPage" name="免責事項 | 方言ラボ" />
    </article>
  );
}
