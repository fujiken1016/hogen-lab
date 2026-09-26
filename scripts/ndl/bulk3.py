import json,re,sys,subprocess,os
sys.path.insert(0,'.')
from rows2 import load,page_rows as page_cols
zp,dialect=sys.argv[1],sys.argv[2]  # 例: python3 bulk2.py 868659.zip 茨城弁
rows=[]
pages=load(zp)
for p in sorted(pages):
    for c,s in page_cols(pages[p]): rows.append((p,s))
env=dict(os.environ); env["PATH"]=os.path.expanduser("~/Desktop/claude/tools/node-v22.14.0-darwin-arm64/bin:")+env["PATH"]
words=json.loads(subprocess.run(["node","dictwords.mjs",dialect],capture_output=True,text=True,env=env).stdout)
V=set(json.load(open('verified_set.json')))
DAK={'が':'か','ぎ':'き','ぐ':'く','げ':'け','ご':'こ','ざ':'さ','じ':'し','ず':'す','ぜ':'せ','ぞ':'そ','だ':'た','ぢ':'ち','づ':'つ','で':'て','ど':'と','ば':'は','び':'ひ','ぶ':'ふ','べ':'へ','ぼ':'ほ','ぱ':'は','ぴ':'ひ','ぷ':'ふ','ぺ':'へ','ぽ':'ほ'}
SM={'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ','ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お'}
def vnorm(s): return re.sub(r'[〜ー、。!?？！\s・（）()]','',s)
def kana(s): return ''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in s)
def n(s):
    s=re.sub(r'[ー〜、。・（）()\[\]【】〓]','',s)
    s=kana(s)
    s=''.join(SM.get(c,c) for c in s)
    return ''.join(DAK.get(c,c) for c in s)
nrows=[(p,s,n(s)) for p,s in rows]
new=[]
for w,m in words:
    k=vnorm(w)+"|"+dialect
    st = "DONE" if k in V else ("UNCONF" if k+"|U" in V else "NEW")
    if st=="DONE": continue
    nw=n(w)
    if len(nw)<2: continue
    hits=[(p,s) for p,s,ns in nrows if nw in ns]
    if hits:
        print(f"◎[{st}] {w}（{m}）")
        for p,s in hits[:3]: print(f"    p{p}: {s[:110]}")
