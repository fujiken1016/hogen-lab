import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 方言ラボ",
};

// AdSense審査要件: Cookie・広告・解析の利用を明記
export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold font-display">プライバシーポリシー</h1>
      <p>
        方言ラボ（以下「当サイト」）は、ユーザーの個人情報の保護を重要と考え、以下の方針に基づき運営します。
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">1. 収集する情報</h2>
        <p>
          当サイトの診断・相性・図鑑などの機能は、回答内容や結果をお使いの端末内（ブラウザのローカルストレージ）にのみ保存します。
          これらのデータが当サイトのサーバーに送信・保存されることはありません。
          お問い合わせの際にいただくメールアドレス等は、返信の目的にのみ利用します。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">2. アクセス解析ツールについて</h2>
        <p>
          当サイトは、サービス向上のためアクセス解析ツール（Google Analytics等）を利用する場合があります。
          これらのツールはトラフィックデータの収集のためにCookieを使用します。
          このデータは匿名で収集されており、個人を特定するものではありません。
          Cookieを無効にすることで収集を拒否できますので、お使いのブラウザの設定をご確認ください。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">3. 広告について</h2>
        <p>
          当サイトは、第三者配信の広告サービス（Google AdSense等）を利用する場合があります。
          広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
          パーソナライズ広告は、
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            広告設定
          </a>
          で無効にできます。詳しくは
          <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Googleのポリシーと規約
          </a>
          をご覧ください。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">4. 免責事項</h2>
        <p>
          当サイトの診断・相性・占いコンテンツはエンターテインメントを目的としたものであり、結果の正確性・有用性を保証するものではありません。
          方言のデータは方言辞典サイト・自治体公開資料・Wikipedia/Wiktionary（CC BY-SA）等を参照して独自に編集したものですが、
          地域・世代による差異があり、内容の完全性を保証するものではありません。
          当サイトの利用によって生じたいかなる損害についても、運営者は責任を負いかねます。
          リンク先の外部サイトで提供される情報・サービスについても同様です。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">5. 著作権</h2>
        <p>
          当サイトに掲載されているキャラクター・文章・画像等の著作権は運営者に帰属します。
          引用の範囲を超える無断転載はご遠慮ください。
          辞書データの一部はCC BY-SAライセンスのコンテンツ（Wikipedia/Wiktionary）を参照しています。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">6. ポリシーの変更</h2>
        <p>本ポリシーの内容は、法令の変更やサービス内容の変更に応じて、予告なく改定されることがあります。</p>
      </section>

      <p className="text-xs text-sub">制定日: 2026年8月2日</p>
      <p>
        <Link href="/" className="text-primary font-bold hover:underline">← トップにもどる</Link>
      </p>
    </article>
  );
}
