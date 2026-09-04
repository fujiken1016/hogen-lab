/**
 * 方言ラボ → 毎日ラボ（ポータル）への導線。2026-09-04 新設。
 *
 * なぜ置くか：
 *   方言ラボは自社9面の検索流入の84%（109/130クリック・2026年8月・GSC実測）を持つ最大の水源なのに、
 *   他の自社資産へ出る導線が「フッタの運営者表記リンク1本」しか無かった。
 *
 * なぜ送り先がポータルなのか（他を選ばなかった理由）：
 *   - 宅建GYM …… 方言に興味がある人に宅建講座は文脈が繋がらない。置かない
 *   - 雀トレ／トレ飯 …… トピックが繋がらない。「ご当地グルメ」は 2026-08-31 に
 *     制約2違反（関連性の薄い商品）として既に撤去済みで、同じ轍を踏まない
 *   - 🔴 shoubu-lab 系 …… ギャンブル隔離ドメイン。クリーン側と相互リンクしない（明確な禁止事項）
 *   → 残るのは「同じ作者が作っている他の無料ツールの一覧」＝ポータルだけ。
 *     商品を売りつける導線ではないので、体験を壊さず AdSense 再審査でも不利にならない。
 *
 * 計測：
 *   href に静的な utm を持たせる（oc.js の読み込み前にクリックされても取りこぼさないため）。
 *   加えて `/oc.js` が data-cross を見て GA4 `cross_click`（to_site / from_page / slot）を送る。
 *
 * ⚠️ AdSense審査中は共通テンプレート（layout / ArticleShell / ToolReads）に入れないこと。
 *    実測クリック上位の**個別ページだけ**が呼ぶ。全面展開は審査の決着後に判断する
 *    （`~/Desktop/claude/memory/deferred_until_adsense.md` に起票済み）。
 */
export default function CrossSite({ content }: { content: string }) {
  const href =
    "https://mainichi-lab.com/?utm_source=hogen&utm_medium=inline&utm_campaign=cross_2026q3&utm_content=" +
    content;

  return (
    <section className="card p-5 space-y-3">
      <h2 className="font-bold text-xl">🏠 このサイトを作っている「毎日ラボ」</h2>
      <p className="text-sm text-sub leading-relaxed">
        方言ラボは、個人で作っている無料ツール集「毎日ラボ」のひとつです。
        同じように登録不要・無料で使える学習ツールを他にも公開しています。
      </p>
      <a
        href={href}
        data-cross="CROSS_PORTAL"
        className="btn-ghost w-full text-sm"
      >
        毎日ラボのツール一覧を見る →
      </a>
    </section>
  );
}
