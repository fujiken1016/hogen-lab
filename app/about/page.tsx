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
            <td className="py-3">フジケン（個人事業主）</td>
          </tr>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 align-top font-bold">運営サイト</th>
            <td className="py-3">
              <a
                href="https://mainichi-lab.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline"
              >
                毎日ラボ（mainichi-lab.com）
              </a>
              <span className="block text-xs text-sub mt-1">
                方言ラボは「毎日ラボ」が運営するサービスのひとつです。
              </span>
            </td>
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
              <a href="mailto:contact@mainichi-lab.com" className="text-primary font-bold hover:underline break-all">
                contact@mainichi-lab.com
              </a>
              <span className="block text-xs text-sub mt-1">
                詳しくは
                <Link href="/contact" className="text-primary hover:underline">
                  お問い合わせページ
                </Link>
                をご覧ください。
              </span>
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
      <section className="space-y-2">
        <h2 className="text-lg font-bold">記事の編集方針</h2>
        <p>
          「読みもの」の記事は、運営者が自分で調べ、自分で書いています。方言の意味・語源・分布については、
          辞典類・研究機関の公開資料・自治体や企業が公表した調査データなどにあたり、
          <strong>確認できた範囲のことだけを書く</strong>ようにしています。
          出典は各記事の末尾に一覧で掲載しています。
        </p>
        <p>
          諸説ある事柄は「〜という説がある」と明示し、断定を避けます。
          方言は同じ県内でも地域・世代によって差があるため、
          「その土地の人は必ずこう言う」という書き方はしません。
          誤りのご指摘は
          <Link href="/contact" className="text-primary font-bold hover:underline">お問い合わせ</Link>
          からいつでも受け付けており、確認のうえ記事を修正します。
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">広告について</h2>
        <p>
          当サイトは、第三者配信の広告およびアフィリエイトプログラムを利用しています。
          広告リンクを含む箇所には「PR」と明示しています。詳細は
          <Link href="/privacy" className="text-primary font-bold hover:underline">プライバシーポリシー</Link>
          をご確認ください。
        </p>
      </section>
      <p>
        <Link href="/" className="text-primary font-bold hover:underline">← トップにもどる</Link>
      </p>
    </article>
  );
}
