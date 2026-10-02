import json,re,sys
sys.path.insert(0,'.')
from cols2 import load,page_cols
zp=sys.argv[1]; words=sys.argv[2].split(',')
HEAD=8
rows=[]; pages=load(zp)
for p in sorted(pages):
    for c,s in page_cols(pages[p]): rows.append((p,c,s))
DAK={'が':'か','ぎ':'き','ぐ':'く','げ':'け','ご':'こ','ざ':'さ','じ':'し','ず':'す','ぜ':'せ','ぞ':'そ','だ':'た','ぢ':'ち','づ':'つ','で':'て','ど':'と','ば':'は','び':'ひ','ぶ':'ふ','べ':'へ','ぼ':'ほ','ぱ':'は','ぴ':'ひ','ぷ':'ふ','ぺ':'へ','ぽ':'ほ'}
SM={'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ','ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お','ゎ':'わ'}
def kana(s): return ''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in s)
def n(s):
    s=re.sub(r'[ー〜、。・（）()\[\]【】〓\s]','',s); s=kana(s)
    s=''.join(SM.get(c,c) for c in s); return ''.join(DAK.get(c,c) for c in s)
nrows=[(p,c,s,n(s)) for p,c,s in rows]
for w in words:
    nw=n(w)
    if len(nw)<2: continue
    head=[(p,c,s) for p,c,s,ns in nrows if nw in ns[:HEAD]]
    body=[(p,c,s) for p,c,s,ns in nrows if nw in ns and nw not in ns[:HEAD]]
    print(f"== {w}  H{len(head)} / b{len(body)}")
    for p,c,s in head[:4]: print(f"   H p{p} x{c:.0f}: {s[:110]}")
    for p,c,s in body[:2]: print(f"   b p{p} x{c:.0f}: {s[:90]}")
