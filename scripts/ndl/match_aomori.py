# -*- coding: utf-8 -*-
import json, sys, unicodedata
from aomori_extract import entries

def fold(s):
    s = unicodedata.normalize("NFKC", s)
    out = []
    for ch in s:
        o = ord(ch)
        if 0x30A1 <= o <= 0x30F6: ch = chr(o - 0x60)   # カタカナ→ひらがな
        if ch in "ぁぃぅぇぉっゃゅょゎ": ch = chr(ord(ch) + 1)  # 小書き→大
        d = unicodedata.normalize("NFD", ch)
        ch = "".join(c for c in d if not unicodedata.combining(c))   # 濁点除去
        if ch in "ー・·()（）「」、。 　": continue
        out.append(ch)
    return "".join(out)

es = entries("1110671.zip")
book = []
for p, h, m in es:
    mark = "△" in h
    hh = h.replace("△", "")
    book.append((p, hh, m, fold(hh), mark))

verified = set(json.load(open("verified_set.json")))
for dia, path in (("津軽弁", "/tmp/tsugaru.json"), ("南部弁", "/tmp/nanbu.json")):
    words = json.load(open(path))
    print("\n########", dia, len(words), "語 / 未照合",
          sum(1 for w, _ in words if f"{w}|{dia}" not in verified))
    for w, mean in words:
        if f"{w}|{dia}" in verified: continue
        fw = fold(w)
        hits = [b for b in book if b[3] == fw]
        if not hits:
            hits = [b for b in book if len(fw) >= 3 and (b[3].startswith(fw) or fw.startswith(b[3]) and len(b[3]) >= 3)]
        if hits:
            print(f"■ {w}（{mean}）")
            for p, hh, m, _, mk in hits[:4]:
                print(f"    p{p} {'△' if mk else '  '} {hh}\t{m[:60]}")
