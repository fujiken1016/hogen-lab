# -*- coding: utf-8 -*-
"""縦組み2段組（上段/下段）の本を、段ごと・列ごと(右→左)に復元して検索する汎用版。
izumo.py（942684 専用）を第52回に一般化した。

  python3 seg2.py <zip> "<正規表現>" [前後文字数]   # @@ 区切りで複数パターン
  python3 seg2.py <zip> page N                      # 1ページを上段/下段で復元

🔴 1段組の本には使うな（cols2.py を使う）。本書が2段組かは `page` で1枚見て確かめる。
"""
import zipfile, json, sys, re, os, pickle, hashlib
ZIP=os.path.abspath(sys.argv[1])
CACHE='/tmp/seg2_%s.pkl'%hashlib.md5(ZIP.encode()).hexdigest()[:10]
def build():
    z=zipfile.ZipFile(ZIP); ns=sorted(n for n in z.namelist() if n.endswith('.json'))
    pages=[]
    for n in ns:
        bs=json.loads(z.read(n).decode())
        if not bs: pages.append(['','']); continue
        ys=[(b['ymin']+b['ymax'])/2 for b in bs]
        mid=(min(ys)+max(ys))/2
        out=[]
        for which in (0,1):
            grp=[b for b in bs if ((b['ymin']+b['ymax'])/2 < mid) == (which==0)]
            if not grp: out.append(''); continue
            grp.sort(key=lambda b:-(b['xmin']+b['xmax'])/2)
            cols=[]
            for b in grp:
                c=(b['xmin']+b['xmax'])/2
                if cols and abs(cols[-1][0]-c)<45: cols[-1][1].append(b)
                else: cols.append([c,[b]])
            s=''
            for c,blist in cols:
                blist.sort(key=lambda b:b['ymin'])
                s+=''.join(b['contenttext'] for b in blist)
            out.append(s)
        pages.append(out)
    return pages
if os.path.exists(CACHE) and os.path.getmtime(CACHE)>max(os.path.getmtime(os.path.abspath(__file__)),os.path.getmtime(ZIP)):
    pages=pickle.load(open(CACHE,'rb'))
else:
    pages=build(); pickle.dump(pages,open(CACHE,'wb'))
if sys.argv[2]=='page':
    for i in [int(x) for x in sys.argv[3:]]:
        for si,t in enumerate(pages[i-1]): print(f'=== p{i} {"上" if si==0 else "下"} ===\n{t}\n')
    sys.exit()
W=int(sys.argv[3]) if len(sys.argv)>3 else 300
for pat in sys.argv[2].split('@@'):
    print(f'########## {pat} ##########')
    n=0; rx=re.compile(pat)
    for i,segs in enumerate(pages):
        for si,t in enumerate(segs):
            for m in rx.finditer(t):
                n+=1
                print(f'--- p{i+1}{"上" if si==0 else "下"}: '+t[max(0,m.start()-20):m.start()+W])
    print(f'-> {n}件')
