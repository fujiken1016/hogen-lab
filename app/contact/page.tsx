import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { PageDates } from "@/components/PageDates";

export const metadata: Metadata = {
  title: "お問い合わせ | 方言ラボ",
  description:
    "方言ラボへのお問い合わせ窓口です。方言データの誤りのご指摘、収録語や例文の追加のご要望、掲載内容・取材に関するご連絡は、このページのメールアドレスまでお願いします。",
  alternates: { canonical: "https://hogen.mainichi-lab.com/contact" },
  ...ogMeta({ title: "お問い合わせ | 方言ラボ", description: "方言ラボへのお問い合わせ窓口です。方言データの誤りのご指摘、収録語や例文の追加のご要望、掲載内容・取材に関するご連絡は、このページのメールアドレスまでお願いします。", path: "/contact" }),
};

export default function ContactPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold font-display">お問い合わせ</h1>
      <p>
        方言ラボへのご意見・ご感想・方言データの誤りのご指摘・掲載に関するご相談などは、下記よりお気軽にご連絡ください。
      </p>
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">📮 メールでのお問い合わせ</h2>
          <p>
            <a
              href="mailto:contact@mainichi-lab.com?subject=%E3%80%90%E6%96%B9%E8%A8%80%E3%83%A9%E3%83%9C%E3%80%91%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
              className="inline-flex min-h-[48px] items-center text-primary-text font-bold underline break-all"
            >
              contact@mainichi-lab.com
            </a>
            <span className="block text-sm text-sub mt-1">
              ※ 通常3営業日以内に返信いたします。返信が必要なお問い合わせには、受信可能なメールアドレスからご連絡ください。
            </span>
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">📖 方言データの誤りについて</h2>
          <p className="text-sub">
            「この言い方はうちの地域では違う」などのご指摘は大歓迎です。みんなの方言辞書からの投稿でも受け付けています。
          </p>
          <p>
            <Link href="/dict" className="inline-flex min-h-[48px] items-center text-primary-text font-bold hover:underline">→ みんなの方言辞書</Link>
          </p>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">方言データの誤りを報告するとき</h2>
        <p>
          「この言い方はうちの地域では使わない」「意味がちがう」「別の地域でも使う」といったご指摘は、辞書を直すいちばんの手がかりになります。次の情報を添えていただけると、確認が早く進みます。
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>どのページ・どの単語か（ページのURLや、単語・フレーズそのもの）</li>
          <li>実際に使われている言い方と意味、使う場面（日常会話、年配の方が使う、など）</li>
          <li>どの地域の言葉か（できれば市町村までの範囲）と、その言葉を使っている・聞いたことがある立場（出身・在住・家族など）</li>
        </ul>
        <p>
          いただいたご指摘は、国立国語研究所の資料など公開されている辞書・資料と照らして確認したうえで反映します。方言は地域や世代、家庭によって違いが大きいため、ご指摘をいただいても掲載を変えない場合があります。
        </p>
        <p>
          収録語や例文の追加のご要望も同じ窓口で受け付けています。ご自身の言葉を投稿したい場合は、<Link href="/dict" className="text-primary-text font-bold underline">みんなの方言辞書</Link>からも送れます。
        </p>
      </section>
      <p className="text-sm text-sub">
        いただいた個人情報の取り扱いについてはプライバシーポリシーをご確認ください。
      </p>
      <p>
        <Link href="/privacy" className="inline-flex min-h-[48px] items-center text-sm text-primary-text hover:underline">→ プライバシーポリシー</Link>
      </p>
      <p>
        <Link href="/" className="inline-flex min-h-[48px] items-center text-primary-text font-bold hover:underline">← トップにもどる</Link>
      </p>
      <PageDates route="/contact" type="ContactPage" name="お問い合わせ | 方言ラボ" />
    </article>
  );
}
