# 方言ラボ — Google AdSense 申請ステータス

最終更新: 2026-08-13（記事15本化・キャラページnoindex対応後） ／ 対象: https://hogen.mainichi-lab.com

## 結論

**申請してよい状態。前回（記事9本）より通過確度は上がった。**

司令塔の決定により、AdSense申請は**方言ラボで出す**（宅建GYMでは出さない。
宅建はアフィリ単価が高くAdSenseと食い合うため）。AdSenseはアカウント単位の承認なので、
方言ラボで1回通れば他の mainichi-lab 系サイトにも広告を出せる。

今回の対応で、前回挙げていた不安要素のうち**上位2つを潰した**：

1. 記事本数 9本 → **15本**（合格報告の多い15〜20本のレンジに入った）
2. `/c/[slug]` キャラ個別ページ35体超を **noindex** 化（薄いページ群を審査対象から外した）

残る不安要素は「お問い合わせがメールのみ」「記事に画像がない」の2点だが、
どちらも必須要件ではない。**現時点で申請してよい。**

---

## 1. 要件チェックリスト

| 項目 | 状態 | 備考 |
|---|---|---|
| プライバシーポリシー | ✅ | `/privacy`。Cookie・Google AdSense・アクセス解析・アフィリエイトを明記済み |
| 運営者情報 | ✅ | `/about`。運営者・事業内容・連絡先・記事の編集方針・広告方針を記載 |
| お問い合わせ | ⚠️ | `/contact`。メール（contact@mainichi-lab.com）のみ。フォームは未設置（必須ではない） |
| 免責事項 | ✅ | `/disclaimer` |
| フッターから全法的ページへのリンク | ✅ | `app/layout.tsx` |
| 独自コンテンツ | ✅ | 読みもの**15本**＋診断・相性・翻訳・クイズ・辞書・キャラ図鑑 |
| 記事の出典明示 | ✅ | 15本中**10本**に「参考・出典」欄（`Sources` コンポーネント）。今回追加の6本は全て付与 |
| 薄いページの除外 | ✅ | `/c/[slug]` を noindex（follow は維持）。sitemap からも除外 |
| モバイル対応 | ✅ | 375px 幅で `scrollWidth == clientWidth == 375`、横スクロールなしを本番で実測 |
| sitemap.xml / robots.txt | ✅ | `app/sitemap.ts` が `lib/articles.ts` を唯一の正として自動生成。本番で27 URL・`/c/` は0件を実測 |
| Search Console 登録 | ✅ | `public/google38c8c3945fca1789.html` で所有権確認済み |
| GA4 | ✅ | G-XRJ40EFR6C（毎日ラボ共通ストリーム） |
| 広告表記（ステマ規制対応） | ✅ | 全記事冒頭に「※本ページはプロモーションが含まれています」、アフィリ枠に「PR」ラベル |
| アフィリリンクの rel | ✅ | `nofollow sponsored noopener noreferrer` |
| 禁止コンテンツ | ✅ | アダルト・暴力・著作権侵害なし。診断は「エンタメ目的」と免責済み |
| ads.txt | ― | 審査通過後に設置（申請前は不要） |

## 2. コンテンツの現状 — 読みもの15本（`/blog`）

| slug | テーマ | 出典欄 | 文字数（本番実測） |
|---|---|---|---|
| kawaii-hogen-ranking | かわいい方言ランキング | ― | 約3,000 |
| hyoujungo-dato-omotteta | 標準語だと思ってた方言 | ― | 約3,000 |
| tohoku-kansai-hakata | 三大方言の比較 | ― | 約3,000 |
| naze-hogen-umareru | 方言はなぜ生まれるか（周圏論） | ― | 約3,000 |
| shindan-guide | 診断の使い方ガイド | ― | 約3,000 |
| arigatou-zenkoku | 「ありがとう」の方言と語源 | ✅ | 3,179 |
| hogen-accent-chizu | アクセントの日本地図 | ✅ | 約3,000 |
| yobina-chiiki-sa | 呼び名の地域差（商標 vs 方言） | ✅ | 約3,000 |
| okinawa-ryukyu-kotoba | うちなーぐちと琉球諸語 | ✅ | 2,942 |
| **higashi-nishi-kyoukai** | 東西境界線（糸魚川‐浜名湖線） | ✅ | 3,022 |
| **hogen-keigo-chiiki** | 敬語の地域差・敬語のない方言 | ✅ | 2,902 |
| **jan-shin-hogen** | 「じゃん」と新方言・ネオ方言 | ✅ | 2,993 |
| **media-to-hogen** | 役割語・方言コスプレ・メディア | ✅ | 2,802 |
| **hogen-fuda-kiki** | 方言札の歴史と消滅危機言語 | ✅ | 2,870 |
| **hogen-chizu-chousa** | 方言地図の作られ方（LAJ/GAJ） | ✅ | 2,989 |

太字が 2026-08-13 追加分。既存9本とテーマは重複していない
（東西境界・敬語・新方言・メディア・方言札／危機言語・調査方法論）。

### 追加6本で使った主な出典

- 国立国語研究所『日本言語地図』『方言文法全国地図』、ことば研究館Q&A、経年調査プロジェクト
- 国立国会図書館 レファレンス協同データベース（「してはる」等の敬語方言、方言札）
- 文化庁「消滅の危機にある言語・方言」（ユネスコ2009年の日本8言語）
- 井上史雄（新方言）、金水敏『ヴァーチャル日本語 役割語の謎』、田中ゆかり（方言コスプレ／SYNODOS）
- 語源・由来が諸説あるものは「〜という説がある」「定説ではない」と明示して断定を避けた

## 3. noindex 対応の内容

- 新規 `app/c/[slug]/layout.tsx` を追加し、`metadata.robots = { index: false, follow: true }` を設定。
  ページ本体（`page.tsx`）は `"use client"` で metadata を持てないため、layout 側で付与している。
- `app/sitemap.ts` から `TYPES` / `SECRETS` 由来の `/c/*` URL を削除（12静的＋15記事＝27 URLのみ）。
- **ページは削除していない**。診断結果・図鑑からの遷移は従来どおり動作する。
- 本番実測：`/c/hakata` は 200 かつ `<meta name="robots" content="noindex, follow"/>`。

## 4. 本番実測ログ（2026-08-13 デプロイ後）

- 追加6記事＋既存記事すべて HTTP 200
- `sitemap.xml`：`<loc>` 27件、`/c/` は 0件
- `robots.txt`：200
- `/blog` 一覧：15記事すべてリンク表示
- 375px 幅：`scrollWidth == clientWidth == 375`（横スクロールなし）
- デプロイ：`npx opennextjs-cloudflare build` → `npx wrangler deploy`（Version ID 52531c46）
  ※ node は PATH に無いので `export PATH="/Users/fujiken/.local/node/bin:$PATH"` が必要

## 5. 判定：申請できる状態か

**YES。申請してよい。**

根拠：法的4ページ・独自コンテンツ15本（うち10本に一次資料ベースの出典）・
モバイル対応・sitemap/robots・Search Console 済み・薄いページの noindex 化まで完了。
一般に語られる「落ちる原因」のうち、事前に潰せるものは潰した。

残リスク（落ちた場合の打ち手、優先順）：

1. **お問い合わせフォーム未設置** → Googleフォーム埋め込みで `/contact` に追加
2. **記事に画像・図がない** → 分布図やアクセント図を自作SVGで追加（写真素材は不要）
3. **サイトの主体が診断ツール** → `/shindan` `/quiz` 等より `/blog` を上位導線にする、記事を20本まで積む
4. **運営者情報の具体性** → 落ちた理由がここを指す場合のみ屋号・実名の掲載を検討（先回りで個人情報を出す必要はない）

## 6. フジケンがやる申請手順（Googleアカウント操作）

1. https://www.google.com/adsense/ にアクセスし、**k.fujita1016@gmail.com** でログイン
2. 「お申し込み」→ サイトURLに `https://hogen.mainichi-lab.com` を入力（**wwwなし・httpsで統一**）
3. 国「日本」、支払い受取人の氏名・住所を入力（**AdSenseの氏名は銀行口座の名義と完全一致させる**。ここがずれると後の入金でつまずく）
4. 「サイトをAdSenseにリンク」で審査コード（`<script ... adsbygoogle.js?client=ca-pub-XXXX>`）が表示されるので、**コードをそのままフジケンからClaudeに渡す**
   → Claude が `app/layout.tsx` の GA4 と同じ位置に `<Script>` として設置し、ビルド＆デプロイする
5. デプロイ完了を確認してから、AdSense画面で「審査をリクエスト」を押す
6. 審査は通常 数日〜2週間程度。**審査中はサイト構成を大きく変えない**（記事追加は問題ない）
7. 合格したら `public/ads.txt` を設置（`google.com, pub-XXXXXXXX, DIRECT, f08c47fec0942fa0`）。これもClaude側で対応可
8. 住所確認PIN（郵送）と銀行口座登録は、支払い基準額に達したタイミングで実施

**やらないこと**：Claudeは申請ボタンの押下・Googleアカウントへのログイン・個人情報の入力を行わない。
コードの設置とデプロイのみ担当する。
