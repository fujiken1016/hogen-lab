# -*- coding: utf-8 -*-
"""カタカナ見出しの本を辞典と突き合わせる（第54回・2026-10-09 新設）
bulk2.py が katakana→hiragana を畳まないので、カタカナ見出しの資料では
全語が 0 件になる。さらに NDL の OCR は見出しの太字を「アアイイ」のように
1字ずつ二重に返すことがあるので、畳んだ版も作って両方で引く。
  python3 tosa.py 1221960.zip 土佐弁
  python3 tosa.py 1221960.zip 土佐弁 grep "ネキ|ニキ"
"""
import json,re,sys,subprocess,os
sys.path.insert(0,'.')
from cols2 import load,page_cols

DAK=str.maketrans("がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゔ","かきくけこさしすせそたちつてとはひふへほはひふへほう")
SM=str.maketrans("ゃゅょっぁぃぅぇぉゎ","やゆよつあいうえおわ")
def kata2hira(s): return "".join(chr(ord(c)-0x60) if "ァ"<=c<="ヶ" else c for c in s)
def n(s):
    s=kata2hira(s)
    s=re.sub(r'[ー〜、。・（）()\[\]【】〓｜|\s!?？！:：;；\-=>↓→^0-9a-zA-Z]','',s)
    return s.translate(SM).translate(DAK)
def dedup(s):  # アアイイ -> あい（OCRの見出し二重化を畳む）
    return re.sub(r'(.)\1+', r'\1', s)

def main():
    zp=sys.argv[1]; dialect=sys.argv[2]
    pages=load(zp)
    rows=[]
    for p in sorted(pages):
        for c,s in page_cols(pages[p]): rows.append((p,s))
    nrows=[(p,s,n(s),dedup(n(s))) for p,s in rows]

    if len(sys.argv)>3 and sys.argv[3]=="grep":
        pat=re.compile(sys.argv[4])
        for p,s,a,b in nrows:
            if pat.search(s) or pat.search(kata2hira(s)): print(f"p{p}: {s[:220]}")
        sys.exit()

    env=dict(os.environ); env["PATH"]=os.path.expanduser("~/Desktop/claude/tools/node-v22.14.0-darwin-arm64/bin:")+env["PATH"]
    words=json.loads(subprocess.run(["node","dictwords.mjs",dialect],capture_output=True,text=True,env=env).stdout)
    V=set(json.load(open('verified_set.json')))
    def vnorm(s): return re.sub(r'[〜ー、。!?？！\s・（）()]','',s)
    for w,m in words:
        k=vnorm(w)+"|"+dialect
        st = "DONE" if k in V else ("UNCONF" if k+"|U" in V else "NEW")
        if st=="DONE": continue
        nw=n(w)
        if len(nw)<2: continue
        cands=[nw]
        if len(nw)>3: cands.append(nw[:-1])          # 語尾1字落とし（第42回）
        hits=[]
        for p,s,a,b in nrows:
            for cw in cands:
                if cw in a or cw in b:
                    hits.append((p,s,cw)); break
        if hits:
            print(f"◎[{st}] {w}（{m}）  n={nw}")
            for p,s,cw in hits[:4]: print(f"    p{p} <{cw}>: {s[:150]}")

if __name__=="__main__":
    main()
