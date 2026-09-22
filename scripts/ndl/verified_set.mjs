import fs from "fs";
const root="/Users/fujiken/Desktop/claude/副業/hogen-app/";
const read=p=>fs.readFileSync(root+p,"utf8");
const norm=s=>String(s).replace(/[〜ー、。!?？！\s・（）()]/g,"").replace(/^〜/,"").replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const v=new Set();
for(const m of read("lib/doko_pool.ts").matchAll(/^\s*\{ word: "([^"]+)", dialect: "([^"]+)" \},/gm)) v.add(norm(m[1])+"|"+m[2]);
for(const m of read("lib/verified_quiz_words.ts").matchAll(/word: "([^"]+)", dialect: "([^"]+)"/g)) v.add(norm(m[1])+"|"+m[2]);
for(const e of JSON.parse(read("data_src/verified_words.json")).entries) v.add(norm(e.word)+"|"+e.dialect+(e.status==="unconfirmed"?"|U":""));
console.log(JSON.stringify([...v]));
