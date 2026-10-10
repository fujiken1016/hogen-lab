# -*- coding: utf-8 -*-
"""カタカナ見出しの「語釈つき辞典」を、見出しの境界で突き合わせる（第55回・2026-10-10 新設）

tosa.py（第54回）は katakana→hiragana を畳むところまでは直したが、照合が
「正規化した列の中に部分文字列があるか」なので、見出しでない場所に当たる。
実測した誤りの型（1209295『廣島縣方言の研究』語彙篇）:
  ・シワモブレ（皺だらけ）が「もぶれる」に当たる  ＝複合語の中
  ・ワヤクーユー（無茶を云ふ）が「わやくそ」に当たる ＝語尾1字落としが効き過ぎ
  ・ヒガンボ（土筆）が「がんぼう」に当たる        ＝語中
  ・アンギヤーニ（案外に）が「あんぎゃーに」に当たる ＝これは正しいが語釈が辞典と違う

この本の語彙篇は OCR が「見出し(カタカナ)＋語釈(漢字/かな)＋使用地」を区切り無しで
連結して返す。つまり **カタカナの最長連続＝見出し** であり、その直後から語釈が始まる。
そこで列を「カタカナの最長連続」に割って、その単位で一致を見る。
  python3 katarun.py 1209295.zip 広島弁            # 見出し一致のみ（語釈を25字つけて出す）
  python3 katarun.py 1209295.zip 岡山弁 cross      # 他方言の語を当てる＝multi 判定
"""
import json,re,sys,subprocess,os
sys.path.insert(0,'.')
from cols2 import load,page_cols

DAK=str.maketrans("がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゔ","かきくけこさしすせそたちつてとはひふへほはひふへほう")
SM=str.maketrans("ゃゅょっぁぃぅぇぉゎ","やゆよつあいうえおわ")
KATA=re.compile(r'[ァ-ヶー〓]{2,}')
def kata2hira(s): return "".join(chr(ord(c)-0x60) if "ァ"<=c<="ヶ" else c for c in s)
def n(s):
    s=kata2hira(s)
    s=re.sub(r'[ー〜、。・（）()\[\]【】〓｜|\s!?？！:：;；\-=>↓→^0-9a-zA-Z]','',s)
    return s.translate(SM).translate(DAK)
def dedup(s): return re.sub(r'(.)\1+',r'\1',s)

def main():
    zp,dialect=sys.argv[1],sys.argv[2]
    pages=load(zp)
    runs=[]          # (page, 見出しカタカナ, 正規化, 畳んだ正規化, 直後の語釈)
    for p in sorted(pages):
        for c,s in page_cols(pages[p]):
            for m in KATA.finditer(s):
                head=m.group(0)
                gloss=s[m.end():m.end()+28]
                k=n(head)
                if len(k)<2: continue
                runs.append((p,head,k,dedup(k),gloss))
    env=dict(os.environ); env["PATH"]=os.path.expanduser("~/Desktop/claude/tools/node-v22.14.0-darwin-arm64/bin:")+env["PATH"]
    words=json.loads(subprocess.run(["node","dictwords.mjs",dialect],capture_output=True,text=True,env=env).stdout)
    V=set(json.load(open('verified_set.json')))
    def vnorm(s): return re.sub(r'[〜ー、。!?？！\s・（）()]','',s)
    cross = len(sys.argv)>3 and sys.argv[3]=="cross"
    found=0
    for w,mean in words:
        k=vnorm(w)+"|"+dialect
        st="DONE" if k in V else ("UNCONF" if k+"|U" in V else "NEW")
        if st=="DONE" and not cross: continue
        nw=n(w); 
        if len(nw)<2: continue
        hits=[r for r in runs if r[2]==nw or r[3]==nw or r[3]==dedup(nw)]
        if hits:
            found+=1
            print(f"◎[{st}] {w}（{mean}）  n={nw}")
            seen=set()
            for p,head,a,b,g in hits[:5]:
                key=(head,g[:14])
                if key in seen: continue
                seen.add(key)
                print(f"    p{p} {head} ／ {g}")
    print(f"--- 見出し一致 {found}語 / 辞典 {len(words)}語 / 本の見出し候補 {len(runs)}件", file=sys.stderr)

if __name__=="__main__":
    main()
