# -*- coding: utf-8 -*-
"""見出しの載っている列と左右2列を、y順に丸ごと出す（語釈の取りこぼしを目で拾う）"""
import zipfile, json, sys, re
z=zipfile.ZipFile(sys.argv[1]); ns=sorted(n for n in z.namelist() if n.endswith('.json'))
page=int(sys.argv[2]); pat=re.compile(sys.argv[3])
bs=json.loads(z.read(ns[page-1]).decode())
hits={round((b['xmin']+b['xmax'])/2) for b in bs if pat.search(b['contenttext'])}
for hx in sorted(hits, reverse=True):
    print(f"--- 列 x≈{hx} ---")
    sel=[b for b in bs if abs((b['xmin']+b['xmax'])/2 - hx) < 80]
    for b in sorted(sel, key=lambda b:(b['ymin'])):
        print(f"  y{round(b['ymin']):5d}-{round(b['ymax']):5d} x{round(b['xmin'])} {b['contenttext']}")
