# -*- coding: utf-8 -*-
"""未照合語ごとに、①語形の近い見出し（編集距離）②意味の重なる語釈 を並べる。"""
import json, sys, re
from match_aomori import book, fold, verified

def ed(a,b):
    if abs(len(a)-len(b))>2: return 9
    prev=list(range(len(b)+1))
    for i,ca in enumerate(a,1):
        cur=[i]
        for j,cb in enumerate(b,1):
            cur.append(min(prev[j]+1,cur[j-1]+1,prev[j-1]+(ca!=cb)))
        prev=cur
    return prev[-1]

# 旧字・旧仮名のゆれを畳んで意味を比べる
OLD=str.maketrans({"転":"轉","体":"體","来":"來","気":"氣","対":"對","会":"會","当":"當","数":"數",
 "様":"樣","礼":"禮","児":"兒","塩":"鹽","声":"聲","恥":"恥","乱":"亂","駄":"駄","労":"勞","児":"兒",
 "証":"證","蔵":"藏","処":"處","悪":"惡","広":"廣","覚":"覺","帰":"歸","満":"滿","県":"縣","昼":"晝",
 "尻":"尻","歯":"齒","顔":"顏","険":"險","湾":"灣","虫":"蟲","団":"團","糸":"絲","点":"點","竜":"龍"})
def mfold(s): return s.translate(OLD)

def grams(s, n=2):
    s=mfold(re.sub(r"[（）()、。，・\s〜～]","",s))
    return {s[i:i+n] for i in range(max(0,len(s)-n+1))}

for dia,path in (("津軽弁","/tmp/tsugaru.json"),("南部弁","/tmp/nanbu.json")):
    words=json.load(open(path))
    todo=[(w,m) for w,m in words if f"{w}|{dia}" not in verified]
    print(f"\n{'#'*20} {dia}  未照合 {len(todo)}/{len(words)}")
    for w,mean in todo:
        fw=fold(w); g=grams(mean)
        formc=sorted(((ed(fw,b[3]),b) for b in book if b[3]), key=lambda t:t[0])[:3]
        formc=[(d,b) for d,b in formc if d<=2]
        meanc=[]
        for p,h,m,f,mk in book:
            gm=grams(m)
            ov=g&gm
            if ov and (len(ov)>=1 and len(max(ov,key=len))>=2):
                meanc.append((len(ov),p,h,m,mk))
        meanc.sort(reverse=True); meanc=meanc[:4]
        if not formc and not meanc: continue
        print(f"\n■ {w}（{mean}）")
        for d,(p,h,m,f,mk) in formc:
            print(f"   形d{d} p{p} {'△' if mk else '  '} {h}\t{m[:60]}")
        for n,p,h,m,mk in meanc:
            print(f"   意{n}  p{p} {'△' if mk else '  '} {h}\t{m[:60]}")
