"use client";

import { useEffect, useState } from "react";
import { DIALECTS, FREE_INPUT_KEY, STANDARD, speak, unlockBadge, safeParseArray, lsSet } from "@/lib/data";
import { PageDates } from "@/components/PageDates";
import { ToolIntro } from "@/components/ToolIntro";

type Seed = { q: string; text: string; matched: string | null };

type Entry = {
  id: string;
  dialect: string;
  word: string;
  meaning: string;
  example: string;
};

const STORAGE_KEY = "hogen_dict";

export default function DictPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dialect, setDialect] = useState("大阪弁");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [filter, setFilter] = useState("すべて");

  const [seeds, setSeeds] = useState<Seed[]>([]);

  useEffect(() => {
    setEntries(safeParseArray(localStorage.getItem(STORAGE_KEY)));
    setSeeds(safeParseArray(localStorage.getItem(FREE_INPUT_KEY)));
  }, []);

  function useSeed(s: Seed) {
    setWord(s.text);
    setMeaning(s.q === "何してるの？" ? "何してるの？" : s.q);
    if (s.matched && s.matched !== STANDARD) setDialect(s.matched);
  }

  function save(next: Entry[]) {
    setEntries(next);
    lsSet(STORAGE_KEY, next);
  }

  function add() {
    if (!word.trim() || !meaning.trim()) return;
    const entry: Entry = {
      id: `${Date.now()}`,
      dialect,
      word: word.trim(),
      meaning: meaning.trim(),
      example: example.trim(),
    };
    save([entry, ...entries]);
    unlockBadge("dict_first");
    setWord("");
    setMeaning("");
    setExample("");
  }

  function remove(id: string) {
    save(entries.filter((e) => e.id !== id));
  }

  const options = DIALECTS.filter((d) => d !== STANDARD);
  const shown = filter === "すべて" ? entries : entries.filter((e) => e.dialect === filter);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="section-title">📖 みんなの方言辞書</h1>
        <p className="text-sub text-sm">地元の言い回しを投稿して辞書を育てよう（現在はこの端末内に保存されます）</p>
      </div>

      {seeds.length > 0 && (
        <div className="card p-4 space-y-2">
          <div className="text-sm font-bold">✏️ 診断で入力したあなたの言い方（タップでフォームに入力）</div>
          <div className="flex flex-wrap gap-2">
            {seeds.slice(-8).map((s, i) => (
              <button
                key={i}
                onClick={() => useSeed(s)}
                className="chip bg-paper border border-line hover:border-primary transition-colors"
              >
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 space-y-3">
        <h2 className="text-2xl font-bold">ことばを投稿する</h2>
        <div className="flex gap-2">
          <select value={dialect} onChange={(e) => setDialect(e.target.value)} className="select-base">
            {options.map((d) => (
              <option key={d}>{d}</option>
            ))}
            <option>その他</option>
          </select>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="方言（例：なおす）"
            className="input-base flex-1"
          />
        </div>
        <input
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="意味（例：片付ける）"
          className="input-base"
        />
        <input
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="例文（任意）"
          className="input-base"
        />
        <button onClick={add} disabled={!word.trim() || !meaning.trim()} className="btn-primary w-full">
          投稿する
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-sub">絞り込み:</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select-base text-sm py-1.5">
          <option>すべて</option>
          {options.map((d) => (
            <option key={d}>{d}</option>
          ))}
          <option>その他</option>
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="text-center text-sub py-8">まだ投稿がありません。最初のことばを投稿しよう！</p>
      ) : (
        <div className="grid gap-2">
          {shown.map((e) => (
            <div key={e.id} className="card p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="chip bg-primary/10 text-primary-text shrink-0">{e.dialect}</span>
                <span className="font-bold text-lg">{e.word}</span>
                <span className="text-sub">{e.meaning}</span>
                <button onClick={() => remove(e.id)} className="ml-auto text-sm text-sub hover:text-red-500 shrink-0">
                  削除
                </button>
              </div>
              {e.example && (
                <div className="mt-2 text-sm text-sub flex items-center gap-2">
                  <span>「{e.example}」</span>
                  <button onClick={() => speak(e.example)} title="読み上げ">
                    🔊
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ToolIntro
        heading="みんなの方言辞書について"
        paragraphs={[
          "地元や家族が使っている言い回しを、意味と例文つきで書きためておくページです。辞典に載っていない言い方、祖父母しか使わない言い方、自分の家だけで通じる言い方——そういうものを置いておく場所として作りました。",
          "投稿したことばは、いまのところ「あなたが使っているこの端末の中だけ」に保存されます。ほかの人の画面には出ません。共有のしくみはまだありません。ここは正直に書いておきます。",
        ]}
        steps={[
          {
            t: "方言を選ぶ",
            d: "左のプルダウンから方言を選びます。一覧に無ければ「その他」を選んでください。",
          },
          {
            t: "ことばと意味を入れる",
            d: "「方言（例：なおす）」と「意味（例：片付ける）」は必須です。例文は任意ですが、入れておくと使いどころが分かるので後で自分が助かります。",
          },
          {
            t: "投稿する",
            d: "「投稿する」を押すと一覧の先頭に並びます。例文を入れた項目には🔊が付き、端末の読み上げ機能で音にできます。削除もその場でできます。",
          },
          {
            t: "絞り込む",
            d: "一覧の上の「絞り込み」で方言ごとに表示を切り替えられます。方言タイプ診断で自由入力した言い方がこの端末に残っていれば、上部にチップで並び、タップするとフォームに入ります。",
          },
        ]}
        facts={[
          {
            h: "サイト側が持っている辞典データ",
            body: [
              "このページの投稿とは別に、方言ラボは全体で35方言・3,368語の辞典データを持っています。内訳は手で書いた400語と、資料から集めて自動生成した2,968語です。方言変換・この方言どこの言葉？・方言くらべは、このデータを引いています。",
              "「方言」の粒度は県〜都市単位です（津軽弁・神戸弁・飛騨弁など）。8地方に区分しています。",
            ],
          },
          {
            h: "どこまで出典と照合したか",
            body: [
              "正直に書くと、3,368語の全部に出典を付けられてはいません。データ自体に出典欄を持っていないためです。出典と1語ずつ突き合わせたのは、いまのところ517語です。",
              "内訳は、方言別ページに出る一般語が200語、方言クイズ検定の出題語が243語、「この方言どこの言葉？」の出題プールが77語で、3語が重なるので実数で517語です。照合に使ったのは、自治体・観光の公式ページ、地方紙、大学の資料、方言辞典などです。",
              "一般語200語の結果は、その方言の語として確認できたものが81語、確認できたが複数の地方でも使うものが65語、出典に合わせて直したものが10語、出典が取れなかったものが44語でした。取れなかった語は辞典には残していますが、「その地方の語だ」と断定する用途には使っていません。",
              "この区別は現実の使い勝手に直結します。「なおす」「ねぶる」「めげる」のように広い範囲で使う語を1つの方言の正解にしてしまうと、実際に使っている人が不正解になるからです。出題プールを出典照合済みのリストに限定しているのは、そのためです。",
            ],
          },
        ]}
        faq={[
          {
            q: "投稿したことばは他の人にも見えますか？",
            a: "見えません。保存先はあなたのブラウザの中（ローカルストレージ）だけで、サーバーには送っていません。今のところ全国で共有する機能はありません。",
          },
          {
            q: "ブラウザのデータを消したら消えますか？",
            a: "消えます。シークレットウィンドウや別の端末でも引き継がれません。残しておきたいものは、手元にも控えておいてください。",
          },
          {
            q: "辞典に無い言い方を書いてもいいですか？",
            a: "むしろそれを書く場所です。載っていない言い方、世代でしか通じない言い方、家の中だけの言い方も歓迎です。",
          },
          {
            q: "上に並んでいるチップは何ですか？",
            a: "方言タイプ診断で「どれも違う」と思って自由入力した言い方です。同じ端末で診断していると出てきます。タップすると、そのまま投稿フォームに入ります。",
          },
          {
            q: "標準語と同じ言葉が方言として載っているのはなぜですか？",
            a: "複数の地方で使う語や、標準語と地続きの語があるためです。出典と突き合わせた517語はそのぶんを区別していますが、残りは断定に使わない前提で置いています。気づいたらこのページに自分の感覚を書き残してください。",
          },
        ]}
        related={[
          { href: "/translate", label: "🗣️ 方言変換" },
          { href: "/doko", label: "🗾 この方言どこの言葉？" },
          { href: "/kurabe", label: "⚖️ 方言くらべ" },
          { href: "/shindan", label: "🎯 方言タイプ診断" },
        ]}
      />
      <PageDates route="/dict" type="WebApplication" name="方言辞典 | 方言ラボ" />
    </div>
  );
}
