import type { Metadata } from "next";
import Link from "next/link";
import { PageDates } from "@/components/PageDates";

export const metadata: Metadata = {
  title: "お問い合わせ | 方言ラボ",
  description:
    "方言ラボへのお問い合わせ窓口です。方言データの誤りのご指摘、掲載内容に関するご連絡はこちらからお願いします。",
  alternates: { canonical: "https://hogen.mainichi-lab.com/contact" },
};

export default function ContactPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold font-display">お問い合わせ</h1>
      <p>
        方言ラボへのご意見・ご感想・方言データの誤りのご指摘・掲載に関するご相談などは、下記よりお気軽にご連絡ください。
      </p>
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-bold mb-1">📮 メールでのお問い合わせ</h2>
          <p>
            <a
              href="mailto:contact@mainichi-lab.com?subject=%E3%80%90%E6%96%B9%E8%A8%80%E3%83%A9%E3%83%9C%E3%80%91%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
              className="text-primary font-bold underline"
            >
              contact@mainichi-lab.com
            </a>
            <span className="block text-xs text-sub mt-1">
              ※ 通常3営業日以内に返信いたします。返信が必要なお問い合わせには、受信可能なメールアドレスからご連絡ください。
            </span>
          </p>
        </div>
        <div>
          <h2 className="font-bold mb-1">📖 方言データの誤りについて</h2>
          <p className="text-sub">
            「この言い方はうちの地域では違う」などのご指摘は大歓迎です。
            <Link href="/dict" className="text-primary font-bold hover:underline">みんなの方言辞書</Link>
            からの投稿でも受け付けています。
          </p>
        </div>
      </section>
      <p className="text-xs text-sub">
        いただいた個人情報の取り扱いについては
        <Link href="/privacy" className="text-primary hover:underline">プライバシーポリシー</Link>
        をご確認ください。
      </p>
      <p>
        <Link href="/" className="text-primary font-bold hover:underline">← トップにもどる</Link>
      </p>
      <PageDates route="/contact" type="ContactPage" name="お問い合わせ | 方言ラボ" />
    </article>
  );
}
