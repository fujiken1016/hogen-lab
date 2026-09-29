import zipfile,json,re,sys,pickle,os
ZIP=sys.argv[1]; CACHE='/private/tmp/claude-501/-Users-fujiken-Desktop-claude/0e500088-2ac4-4baf-8168-c2a4f6fced39/scratchpad/'+os.path.basename(ZIP)+'.pkl'
if os.path.exists(CACHE): full=pickle.load(open(CACHE,'rb'))
else:
    z=zipfile.ZipFile(ZIP); ns=sorted(n for n in z.namelist() if n.endswith('.json'))
    full=[]
    for n in ns:
        bs=json.loads(z.read(n).decode()); bs.sort(key=lambda b:(-b['xmin'], b['ymin']))
        full.append(''.join(b['contenttext'] for b in bs))
    pickle.dump(full,open(CACHE,'wb'))
W=int(sys.argv[3]) if len(sys.argv)>3 else 400
for pat in sys.argv[2].split('@@'):
    print(f'########## {pat} ##########')
    n=0
    for i,t in enumerate(full):
        for m in re.finditer(pat,t):
            n+=1; print(f'--[p{i}]--',t[max(0,m.start()-W):m.start()+W].replace('\n',''))
            if n>=6: break
        if n>=6: break
    if n==0: print('(0件)')
