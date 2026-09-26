# 横組みの表を行方向に読む（青森県方言集 1232197 型）。cols2.py は縦組み専用。
import zipfile,json,sys,re
def load(zp):
    z=zipfile.ZipFile(zp); pages={}
    for n in sorted(z.namelist()):
        if n.endswith('.json') and '_' in n:
            pages[int(n.split('_')[1].split('.')[0])]=json.loads(z.read(n).decode('utf-8'))
    return pages
def page_rows(blocks, tol=28):
    us=[((b['ymin']+b['ymax'])/2,(b['xmin']+b['xmax'])/2,b['contenttext']) for b in blocks]
    us.sort(key=lambda u:u[0])
    bands=[]
    for y,x,t in us:
        for bd in bands:
            if abs(bd['c']-y)<tol: bd['u'].append((x,t)); bd['c']=(bd['c']*len(bd['u'])+y)/(len(bd['u'])+1); break
        else: bands.append({'c':y,'u':[(x,t)]})
    out=[]
    for bd in bands:
        bd['u'].sort()
        out.append((bd['c'],"".join(t for _,t in bd['u'])))
    return out
if __name__=="__main__":
    pages=load(sys.argv[1])
    if sys.argv[2]=="page":
        for p in [int(x) for x in sys.argv[3:]]:
            print(f"=== page {p} ===")
            for c,s in page_rows(pages[p]): print(f"  y{c:.0f} {s}")
    else:
        for pat in sys.argv[2:]:
            print(f"### /{pat}/"); n=0
            for p in sorted(pages):
                for c,s in page_rows(pages[p]):
                    if re.search(pat,s): print(f"  p{p}: {s[:150]}"); n+=1
            print(f"  -> {n}件")
