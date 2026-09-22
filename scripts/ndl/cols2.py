import zipfile,json,sys,re
def units(b):
    t=b['contenttext']
    w=b['xmax']-b['xmin']; h=b['ymax']-b['ymin']
    if len(t)>1 and w>h*0.9 and w/len(t)>30:
        # horizontally merged chars from adjacent vertical columns: left->right
        step=w/len(t)
        return [(b['xmin']+(i+0.5)*step, b['ymin'], c) for i,c in enumerate(t)]
    return [((b['xmin']+b['xmax'])/2, b['ymin'], t)]
def page_cols(blocks):
    us=[]
    for b in blocks: us+=units(b)
    us.sort(key=lambda u:-u[0])
    bands=[]
    for x,y,t in us:
        for bd in bands:
            if abs(bd['c']-x)<42:
                bd['u'].append((y,t)); break
        else:
            bands.append({'c':x,'u':[(y,t)]})
    out=[]
    for bd in bands:
        bd['u'].sort()
        s="".join(t for _,t in bd['u'])
        s=re.sub(r'(.)\1{2,}',r'\1',s)  # collapse OCR repeats
        out.append((bd['c'],s))
    return out
def load(zp):
    z=zipfile.ZipFile(zp); pages={}
    for n in z.namelist():
        if n.endswith('.json') and '_' in n:
            pages[int(n.split('_')[1].split('.')[0])]=json.loads(z.read(n).decode('utf-8'))
    return pages
if __name__=="__main__":
    pages=load(sys.argv[1])
    if sys.argv[2]=="page":
        for p in [int(x) for x in sys.argv[3:]]:
            print(f"=== page {p} ===")
            for c,s in page_cols(pages[p]): print(f"  x{c:.0f} {s}")
    else:
        for pat in sys.argv[2:]:
            print(f"### /{pat}/")
            n=0
            for p in sorted(pages):
                for c,s in page_cols(pages[p]):
                    if re.search(pat,s): print(f"  p{p} x{c:.0f}: {s[:120]}"); n+=1
            print(f"  -> {n}件")
