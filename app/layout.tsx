import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import "./globals.css";

// next/font/google はTurbopackの内部モジュール解決不具合でビルドが壊れるため、
// <link> 読み込みに切り替え（React 19がheadへ自動ホイスト）。
// フォント変数は globals.css の :root で定義している。
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600;700;800&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap";

// スマホ最適化: ノッチ端末で全幅表示＋アドレスバーをブランド色に
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4B3BC4",
};

export const metadata: Metadata = {
  title: "方言ラボ | あなたの言葉は、何弁？",
  description:
    "方言タイプ診断・友達との相性診断・方言翻訳・方言クイズ検定。日本の方言を遊んで学ぶ「ことばの粋」体験。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* GA4（mainichi-lab全サイト共通ストリーム） */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XRJ40EFR6C" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XRJ40EFR6C');
        `}</Script>
        {/* Google AdSense（ca-pub-8289616283786904・mainichi-lab共通）
            next/script(afterInteractive)だとSSRのHTMLに出ないため、
            React 19のhead自動ホイストを使う素の<script>で入れる */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8289616283786904"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
        <Header />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-line seigaiha">
          <div className="max-w-5xl mx-auto px-4 py-5 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-sub">
              <span className="hanko !w-6 !h-6 !text-xs">方</span>
              方言ラボ — あなたの言葉は、何弁？　ふるさとの言葉を遊んで学ぶ
            </div>
            <p className="text-[10px] text-sub/70 leading-relaxed">
              辞書データは方言辞典サイト・自治体公開資料・Wikipedia/Wiktionary（CC BY-SA）等を参照して独自に編集したものです。
              方言は地域・世代で差があります。誤りのご指摘は「みんなの辞書」からどうぞ。
            </p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-sub pt-1">
              <a href="/about" className="hover:text-primary">運営者情報</a>
              <a href="/privacy" className="hover:text-primary">プライバシーポリシー</a>
              <a href="/disclaimer" className="hover:text-primary">免責事項</a>
              <a href="/contact" className="hover:text-primary">お問い合わせ</a>
            </nav>
            <p className="text-[10px] text-sub/60">
              © 2026 方言ラボ ・ 運営：
              <a href="https://mainichi-lab.com/" className="hover:text-primary underline underline-offset-2">
                フジケン（毎日ラボ）
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
