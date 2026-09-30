# 第47回(2026-09-30)追加＝縦組み × カタカナ見出し の本を読む照合器。
#   bulk2.py = cols2(縦組み) だが カナを畳まない  → カタカナ見出しに当たらない
#   bulk3.py = カナを畳むが rows2(横組み)        → 縦組みに当てると帯が壊れて偶然一致だらけ
# その空白を埋める。あわせて「帯の先頭＝見出し」に錨を打つ（語釈中の一致を候補から外す）。
# 使い方: python3 bulk4.py <zip> <方言名> [見出しとみなす先頭字数=8]
import json,re,sys,subprocess,os
sys.path.insert(0,'.')
from cols2 import load,page_cols
zp,dialect=sys.argv[1],sys.argv[2]
HEAD=int(sys.argv[3]) if len(sys.argv)>3 else 8
rows=[]
pages=load(zp)
for p in sorted(pages):
    for c,s in page_cols(pages[p]): rows.append((p,c,s))
env=dict(os.environ); env["PATH"]=os.path.expanduser("~/Desktop/claude/tools/node-v22.14.0-darwin-arm64/bin:")+env["PATH"]
words=json.loads(subprocess.run(["node","dictwords.mjs",dialect],capture_output=True,text=True,env=env).stdout)
V=set(json.load(open('verified_set.json')))
DAK={'が':'か','ぎ':'き','ぐ':'く','げ':'け','ご':'こ','ざ':'さ','じ':'し','ず':'す','ぜ':'せ','ぞ':'そ','だ':'た','ぢ':'ち','づ':'つ','で':'て','ど':'と','ば':'は','び':'ひ','ぶ':'ふ','べ':'へ','ぼ':'ほ','ぱ':'は','ぴ':'ひ','ぷ':'ふ','ぺ':'へ','ぽ':'ほ'}
SM={'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ','ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お','ゎ':'わ'}
def vnorm(s): return re.sub(r'[〜ー、。!?？！\s・（）()]','',s)
def kana(s): return ''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in s)
def n(s):
    s=re.sub(r'[ー〜、。・（）()\[\]【】〓\s]','',s)
    s=kana(s)
    s=''.join(SM.get(c,c) for c in s)
    return ''.join(DAK.get(c,c) for c in s)
nrows=[(p,c,s,n(s)) for p,c,s in rows]
for w,m in words:
    k=vnorm(w)+"|"+dialect
    st = "DONE" if k in V else ("UNCONF" if k+"|U" in V else "NEW")
    if st=="DONE": continue
    nw=n(w)
    if len(nw)<2: continue
    head=[(p,c,s) for p,c,s,ns in nrows if nw in ns[:HEAD]]   # 見出し位置
    body=[(p,c,s) for p,c,s,ns in nrows if nw in ns and nw not in ns[:HEAD]]
    if head or body:
        print(f"◎[{st}] {w}（{m}）  見出し{len(head)}件 / 語釈{len(body)}件")
        for p,c,s in head[:3]: print(f"   H p{p} x{c:.0f}: {s[:120]}")
        for p,c,s in body[:1]: print(f"   b p{p} x{c:.0f}: {s[:90]}")
