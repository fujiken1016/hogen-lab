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
        {/* 収益先への離脱クリック計測。2026-09-02 に共通版 `/oc.js` へ一本化した。
            正本＝ ~/Desktop/claude/tools/oc_shared.js（配布先の各リポジトリ直下 or public/ に oc.js としてコピー）。
            以前はここに楽天だけを見る委譲リスナーをインライン展開していたが、
            Amazon/note/A8/VC のリンクを足した瞬間に未計測になる作りだったため差し替えた
            （`tools/tracking_audit.py` の残課題3）。送るイベントと slot（data-aff）は従来どおり。
            🔴 素の <script src="/oc.js" defer /> で入れてはいけない（2026-09-02 に本番で実測）。
            React 19 のリソース・ホイスト処理がSSRごとに走り、Workers Free の 10ms CPU 上限を超えて
            error 1102 / HTTP 503 が /translate 等で 14/20 回発生した（同条件の対照版は 20/20 で 200）。
            next/script(afterInteractive) なら従来のインライン版と同じ経路なのでCPUは増えない。
            全数検査は marker "/oc.js" をHTML本文＋Nextチャンクから探す inline モードで見る。 */}
        <Script src="/oc.js" strategy="afterInteractive" />
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
            <div className="flex items-center justify-center gap-2 text-sm text-sub">
              <span className="hanko !w-6 !h-6 !text-sm">方</span>
              方言ラボ — あなたの言葉は、何弁？　ふるさとの言葉を遊んで学ぶ
            </div>
            <p className="text-sm text-sub leading-relaxed">
              辞書データは方言辞典サイト・自治体公開資料・Wikipedia/Wiktionary（CC BY-SA）等を参照して独自に編集したものです。
              方言は地域・世代で差があります。誤りのご指摘は「みんなの辞書」からどうぞ。
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 text-sm text-sub pt-1">
              <a href="/about" className="inline-flex min-h-[48px] items-center px-1 hover:text-primary">運営者情報</a>
              <a href="/privacy" className="inline-flex min-h-[48px] items-center px-1 hover:text-primary">プライバシーポリシー</a>
              <a href="/disclaimer" className="inline-flex min-h-[48px] items-center px-1 hover:text-primary">免責事項</a>
              <a href="/contact" className="inline-flex min-h-[48px] items-center px-1 hover:text-primary">お問い合わせ</a>
            </nav>
            <p className="text-sm text-sub">
              © 2026 方言ラボ ・ 運営：
              <a href="https://mainichi-lab.com/" className="inline-flex min-h-[48px] items-center hover:text-primary underline underline-offset-2">
                フジケン（毎日ラボ）
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
