# -*- coding: utf-8 -*-
"""『東奥日用語辞典及青森県方言集』(1110671) の青森県方言集(p73-86)を
   段ごとに「見出し/語釈」の対に組み直す。縦組み3段・各段が上下2行の表。"""
import zipfile, json, sys, re

ZIP = sys.argv[1] if len(sys.argv) > 1 else "1110671.zip"
# 見出し帯 / 語釈帯 の y 境界（ymin のヒストグラムから）
BANDS = [((300, 650), (650, 1050)), ((1050, 1380), (1380, 1780)), ((1780, 2100), (2100, 2500))]

def load(zid):
    z = zipfile.ZipFile(zid)
    return z, sorted(n for n in z.namelist() if n.endswith(".json"))

def colkey(b):  # 縦組み＝x帯が1列。中心xで丸める
    return round((b["xmin"] + b["xmax"]) / 2 / 26)

def entries(zid, p0=73, p1=86):
    z, ns = load(zid)
    out = []
    for pi in range(p0 - 1, p1):
        bs = json.loads(z.read(ns[pi]).decode())
        for hz, mz in BANDS:
            head, mean = {}, {}
            for b in bs:
                y = b["ymin"]; k = colkey(b); t = b["contenttext"].strip()
                if not t: continue
                if hz[0] <= y < hz[1]:   head.setdefault(k, []).append((y, t))
                elif mz[0] <= y < mz[1]: mean.setdefault(k, []).append((y, t))
            cols = sorted(set(list(head) + list(mean)), reverse=True)  # 右から左へ
            cur = None
            for k in cols:
                h = "".join(t for _, t in sorted(head.get(k, [])))
                m = "".join(t for _, t in sorted(mean.get(k, [])))
                # OCRが同じブロックを2回出すことがあるので畳む
                if h and len(h) % 2 == 0 and h[:len(h)//2] == h[len(h)//2:]: h = h[:len(h)//2]
                if m and len(m) % 2 == 0 and m[:len(m)//2] == m[len(m)//2:]: m = m[:len(m)//2]
                if h:
                    cur = [pi + 1, h, m]
                    out.append(cur)
                elif m and cur:
                    cur[2] += m
    return out

if __name__ == "__main__":
    es = entries(ZIP)
    if len(sys.argv) > 2 and sys.argv[2] == "page":
        pg = int(sys.argv[3])
        for p, h, m in es:
            if p == pg: print(f"  {h}\t{m}")
    elif len(sys.argv) > 2:
        pat = re.compile(sys.argv[2])
        for p, h, m in es:
            if pat.search(h) or pat.search(m): print(f"p{p}  {h}\t{m}")
    else:
        print(len(es), "entries")
