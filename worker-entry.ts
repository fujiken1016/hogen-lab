// Cloudflare Workers の実エントリ。OpenNext が生成する .open-next/worker.js を
// 「エッジキャッシュ」で包む薄いラッパー。
//
// 🔴 なぜ必要か（2026-09-03 実測）
//   方言ラボの全ページは generateStaticParams を使わずリクエスト時SSRしている。
//   `wrangler tail` で測ると 1リクエストあたりの cpuTime は
//     / = 177ms / /translate/okinawa = p50 34ms / /quiz/tosa = p50 23ms / /dict = p50 18ms
//   で、Workers Free の 10ms CPU 上限を常時2〜17倍超えている。
//   実際に outcome:"exceededCpu" が発生した回のcpuTimeは 10〜19ms で打ち切られており、
//   「毎回落ちるのではなく、確率的に10msで殺される」＝観測されていた確率的503の正体。
//   つまり **SSRのCPUを削って10ms未満に収めるのは非現実的**で、
//   「同じHTMLを再生成させない（＝Workerでレンダリングさせない）」のが唯一の根治。
//
//   キャッシュHITはI/Oでありレンダリングを一切しないので、CPUは数ms で収まる。
//
// 設計メモ
//   - RSC（Nextのクライアント遷移/プリフェッチ）はHTMLと別ボディなので**キャッシュしない**。
//     Cloudflare の Cache API は Vary を任意ヘッダで完全にはサポートしないため、
//     キーで分けるのではなく素通しにして事故を避ける。
//   - キャッシュキーに Worker のバージョンID（version_metadata バインディング）を混ぜる。
//     **デプロイするたびにキーが変わる＝自動で総入れ替え**になり、古いHTMLが残らない。
//   - 200 かつ text/html かつ Set-Cookie 無しのレスポンスだけを保存する。
//     503（exceededCpu）は保存されないので、障害がキャッシュに焼き付くことはない。

// @ts-expect-error: wrangler がビルド時に解決する
import worker from "./.open-next/worker.js";
// Durable Object は OpenNext 側の実装をそのまま再エクスポートする（消すとデプロイが壊れる）
// @ts-expect-error: wrangler がビルド時に解決する
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

/** エッジ保持時間（秒）。デプロイごとにキーが変わるので長めでよい */
const EDGE_TTL = 60 * 60 * 6;

/** ブラウザに持たせる時間（秒）。
 *  保存時のヘッダをそのまま返すと mainichi-lab.com ゾーンの Browser Cache TTL（4時間）が
 *  効いてしまい、デプロイしても4時間古いHTMLを見続ける読者が出る。
 *  エッジ（6時間・デプロイでキー総入れ替え）とブラウザ（5分）を分けて持たせる。 */
const BROWSER_TTL = 300;
const CLIENT_CACHE_CONTROL = `public, max-age=${BROWSER_TTL}, must-revalidate`;

/** キャッシュ対象外のパス（計測リダイレクト・API・開発用・静的アセット） */
const BYPASS_PREFIXES = ["/_next/", "/api/", "/r/", "/dev", "/cdn-cgi/"];

function isCacheableRequest(request: Request, url: URL): boolean {
  if (request.method !== "GET") return false;
  // RSC ペイロード（クライアント遷移・プリフェッチ）は同じURLで別ボディを返すので触らない
  if (request.headers.has("rsc")) return false;
  if (request.headers.has("next-router-prefetch")) return false;
  if (request.headers.has("next-router-state-tree")) return false;
  if (request.headers.has("next-router-segment-prefetch")) return false;
  if (url.searchParams.has("_rsc")) return false;
  return !BYPASS_PREFIXES.some((p) => url.pathname.startsWith(p));
}

/** クエリの順序ゆらぎで同じページのキャッシュを分散させない */
function cacheKeyFor(url: URL, version: string): Request {
  const key = new URL(url.origin + url.pathname);
  key.searchParams.set("__v", version);
  for (const name of [...url.searchParams.keys()].sort()) {
    key.searchParams.append(name, url.searchParams.get(name) ?? "");
  }
  return new Request(key.toString(), { method: "GET" });
}

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (!isCacheableRequest(request, url)) {
      return worker.fetch(request, env, ctx);
    }

    const version =
      (env?.CF_VERSION_METADATA as { id?: string } | undefined)?.id ?? "v0";
    const cache = (caches as unknown as { default: Cache }).default;
    const key = cacheKeyFor(url, version);

    const hit = await cache.match(key);
    if (hit) {
      const res = new Response(hit.body, hit);
      res.headers.set("cache-control", CLIENT_CACHE_CONTROL);
      res.headers.set("x-hl-cache", "HIT");
      return res;
    }

    const origin = await worker.fetch(request, env, ctx);
    const contentType = origin.headers.get("content-type") ?? "";
    const storable =
      origin.status === 200 &&
      contentType.includes("text/html") &&
      !origin.headers.has("set-cookie");

    if (!storable) {
      const passthrough = new Response(origin.body, origin);
      passthrough.headers.set("x-hl-cache", "BYPASS");
      return passthrough;
    }

    const toStore = new Response(origin.clone().body, origin);
    // Next は動的ページに private,no-store を付けるので、保存用にだけ上書きする
    toStore.headers.delete("vary");
    toStore.headers.delete("set-cookie");
    toStore.headers.set("cache-control", `public, max-age=0, s-maxage=${EDGE_TTL}`);
    ctx.waitUntil(cache.put(key, toStore));

    const res = new Response(origin.body, origin);
    res.headers.set("cache-control", CLIENT_CACHE_CONTROL);
    res.headers.set("x-hl-cache", "MISS");
    return res;
  },
};
