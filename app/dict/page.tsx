"use client";

import { useEffect, useState } from "react";
import { DIALECTS, FREE_INPUT_KEY, STANDARD, speak, unlockBadge, safeParseArray, lsSet } from "@/lib/data";

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
        <h2 className="font-bold">ことばを投稿する</h2>
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
        <p className="text-center text-sub/70 py-8">まだ投稿がありません。最初のことばを投稿しよう！</p>
      ) : (
        <div className="grid gap-2">
          {shown.map((e) => (
            <div key={e.id} className="card p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="chip bg-primary/10 text-primary shrink-0">{e.dialect}</span>
                <span className="font-bold text-lg">{e.word}</span>
                <span className="text-sub">{e.meaning}</span>
                <button onClick={() => remove(e.id)} className="ml-auto text-xs text-sub/60 hover:text-red-500 shrink-0">
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
    </div>
  );
}
