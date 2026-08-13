# アフィリエイトスロット一覧（方言ラボ 読みもの記事）

記事内の楽天市場PR枠は `components/article.tsx` の `PrBox` コンポーネントで統一。
各設置箇所には `data-aff="スロット名"` が付いており、DOM上で特定して差し替えできる。

- 現在のリンク形式: 楽天アフィリエイト（ID: `5684fd12.0952a564.5684fd13.520271a6`、2026-08-12取得）経由の楽天市場キーワード検索URL（`rel="nofollow sponsored noopener noreferrer"`。2026-08-13に `nofollow` を追加）
- 差し替え方法: 各記事の `PrBox` の `keyword`（検索キーワード）を商品個別URLに変えたい場合は、`PrBox` に個別URL用propを足すか `rakutenLink(商品URL)` を直接使う
- 全記事の冒頭に「※本ページはプロモーションが含まれています」を表示（`ArticleShell` で共通実装）

| スロット名 | 記事（/blog/…） | 現在の紹介内容 | 楽天検索キーワード |
|---|---|---|---|
| RAKUTEN_HOGEN_1 | kawaii-hogen-ranking（かわいい方言TOP10） | 方言辞典・方言集 | 方言 辞典 |
| RAKUTEN_HOGEN_2 | hyoujungo-dato-omotteta（実は方言だった言葉） | ご当地グルメお取り寄せ | ご当地 お取り寄せ グルメ |
| RAKUTEN_HOGEN_3 | tohoku-kansai-hakata（三大方言比較） | 方言の本・方言解説書 | 日本の方言 本 |
| RAKUTEN_HOGEN_4 | naze-hogen-umareru（方言はなぜ生まれる） | 方言地図・日本語学の入門書 | 方言 地図 日本語学 入門 |
| RAKUTEN_HOGEN_5 | shindan-guide（診断の使い方ガイド） | 方言かるた | 方言 かるた |

## アフィリリンクを置いていない記事（2026-08-13 追加分）

以下の4記事にはアフィリエイトリンクを**意図的に置いていない**。AdSense審査に向けて、
広告目的でない純粋な解説記事の比率を確保するため。追加するとしても審査通過後に判断する。

- `arigatou-zenkoku`（「ありがとう」の方言めぐり）
- `hogen-accent-chizu`（方言アクセントの日本地図）
- `yobina-chiiki-sa`（呼び名が地域で変わるもの図鑑）
- `okinawa-ryukyu-kotoba`（うちなーぐちと琉球諸語の入門）

※ `ArticleShell` の「※本ページはプロモーションが含まれています」は全記事共通で表示している
（AdSense広告を含むサイト全体の表記として維持）。
