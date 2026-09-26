// Cloudflare Workers向けOpenNextビルド設定
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// プリレンダ済みHTML（.open-next/assets/cdn-cgi/_next_cache/...）を ASSETS バインディング
// から読む、読み取り専用のインクリメンタルキャッシュ。
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// 🔴 なぜインクリメンタルキャッシュを設定するのか（2026-09-26 本番障害の根治）
//   Workers Free の CPU上限は 10ms。方言ラボの全ページをリクエスト時SSRしていたため
//   cpuTime が 18〜177ms に達し、キャッシュミスのたびに outcome:"exceededCpu" で
//   100% 503 を返す状態になっていた（wrangler tail 実測・12/12 失敗）。
//   根治＝「Workerにレンダリングさせない」＝動的ルートをビルド時プリレンダ（generateStaticParams）し、
//   そのHTMLをここから読ませる。
//
//   これまで generateStaticParams を使わなかった理由は
//   「SSGした動的ルートのHTMLがインクリメンタルキャッシュ側に入り、キャッシュ未設定のこの環境では
//     404になる（2026-08 実測）」だった。**そのキャッシュを設定したので前提が変わった**。
//
//   staticAssetsIncrementalCache は読み取り専用（revalidate しない）。
//   方言ラボのデータは全てリポジトリ内の静的データで、更新はデプロイでしか起きないので要件に合う。
//   追加費用はゼロ（KV/R2/D1 を使わず、既にある Workers Static Assets を読むだけ）。
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
