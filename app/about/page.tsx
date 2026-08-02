import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営者情報 | 方言ラボ",
};

export default function AboutPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold font-display">運営者情報</h1>
      <table className="w-full text-left border-collapse">
        <tbody>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 w-32 align-top font-bold">サイト名</th>
            <td className="py-3">方言ラボ</td>
          </tr>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 align-top font-bold">運営者</th>
            <td className="py-3">フジケン（個人）</td>
          </tr>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 align-top font-bold">設立</th>
            <td className="py-3">2026年7月</td>
          </tr>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 align-top font-bold">事業内容</th>
            <td className="py-3">方言をテーマにした診断・学習コンテンツの企画・開発・運営</td>
          </tr>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 align-top font-bold">連絡先</th>
            <td className="py-3">
              <Link href="/contact" className="text-primary font-bold hover:underline">お問い合わせフォーム</Link>
              よりご連絡ください
            </td>
          </tr>
        </tbody>
      </table>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">当サイトについて</h2>
        <p>
          方言ラボは「ふるさとの言葉を、遊んで学ぶ」をコンセプトに、全国35方言の診断・辞典・クイズ・相性コンテンツを提供する個人運営のWebサービスです。
          方言は地域の宝物。楽しみながら方言に触れるきっかけをつくることを目指しています。
        </p>
      </section>
      <p>
        <Link href="/" className="text-primary font-bold hover:underline">← トップにもどる</Link>
      </p>
    </article>
  );
}
