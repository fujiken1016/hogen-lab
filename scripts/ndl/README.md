# NDL次世代デジタルライブラリーの方言調査書を、辞典と機械で突き合わせる道具

第39回（2026-09-22）に作った。**1冊で1方言ぶん（10〜20語）が一度に片づく。**
使い方の全文は `DICT_AUDIT.md` の「66. 第39回」。

```sh
export PATH="$HOME/Desktop/claude/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
cd scripts/ndl

# 1. 全文（zip）を取る。拡張子が txt でも中身は zip
curl -s -A "Mozilla/5.0" -o 868659.zip "https://lab.ndl.go.jp/dl/api/book/fulltext/868659"

# 2. 照合済みの語の集合を作る（検定台帳＋/doko プール＋一般語台帳）
node verified_set.mjs > verified_set.json

# 3. その方言の辞典の全語を、本の中身と突き合わせる
#    [NEW]=未登録 / [UNCONF]=台帳に未確認で載っている / 照合済みは出ない
python3 bulk2.py 868659.zip 茨城弁

# 4. 語や語釈を直接引く（正規表現）・1ページを丸ごと復元する
python3 cols2.py 868659.zip "いが[つっ]ぺ" "退ク|ノク"
python3 cols2.py 868659.zip page 19
```

## 落とし穴（cols2.py が解いていること）

- `fulltext` の zip に入っている `.txt` を連結すると `かかかかかがががか…` になって読めない。
  **同じ zip の `.json`（ブロックごとの xmin/ymin/xmax/ymax）を使う**
- **縦組みの表は「x帯＝1項目」「y＝方言→語釈→使用地方の順」**
- 🔴 **横に広いブロックは、隣り合う複数の項目の文字がOCRで1行にまとめられたもの。左から右へ均等に割って各帯に配る。**
  これをやらないと語頭の1字が落ちて語が引けない
- ページ上端の `いいいいいい…` は**その面の全項目の頭文字**（あの部・いの部…）
- OCRは**濁点をよく落とす**ので、突き合わせは濁点・半濁点・小書きを畳んでから行う（`bulk2.py` の `n()`）

## 書誌の棚卸し

```sh
curl -s -A "Mozilla/5.0" "https://lab.ndl.go.jp/dl/api/book/search?searchfield=metaonly&keyword=方言&size=300"
```
⚠️ `keyword=茨城県 方言` のような県名＋語では 0件になる。**棚を丸ごと取って県名で grep する**。

## ページ画像を見る（第40回・2026-09-23 追加）

**OCRが `〓` で返した字は「資料に無い」ではなく「読めていない」だけ。** 画像は別APIで取れる。

```sh
# fulltext API とは別ホスト。R + 0埋め10桁のコマ番号
curl -s -A "Mozilla/5.0" -o p50.jpg \
  "https://www.dl.ndl.go.jp/api/iiif/868659/R0000000050/full/full/0/default.jpg"
```

- native は 4000px 前後。**1字あたり約100px しかない**ので、6〜9倍に拡大しても確実に読めるとは限らない
- 縦組みは `.rotate(-90, expand=True)` で横に倒すと読みやすい。行の切り出しは `cols2.py` が出す **x帯の中心**を使う
- ⚠️ **OCRのy座標は見出し（大きい字）と語釈（小さい字）で文字ピッチが違う。** 位置合わせは「ページ全体を1枚描いて目で当たりを付ける」のが早い
- 🔑 **読めても断定しない。** 1字を確定できない解像度なら `unconfirmed` のまま、**消去法の材料**（その語釈を別の行でどう組んでいるか）を note に残す
