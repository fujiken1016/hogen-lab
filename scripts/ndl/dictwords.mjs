import fs from "fs";
const root="/Users/fujiken/Desktop/claude/副業/hogen-app/";
const read=p=>fs.readFileSync(root+p,"utf8");
const target=process.argv[2];
const out=[];
const dataTs=read("lib/data.ts");
const wb=dataTs.slice(dataTs.indexOf("export const WORDS"),dataTs.indexOf("export const QUIZZES"));
let d=null;
for(const line of wb.split("\n")){
  const m=line.match(/^\s{2}"?([^\s":]+)"?:\s*\[/); if(m){d=m[1];continue;}
  const w=line.match(/\{\s*word: "([^"]+)", meaning: "([^"]+)"/); if(w&&d===target) out.push([w[1],w[2]]);
}
let dd=null,lw=null;
for(const line of read("lib/words_extra.ts").split("\n")){
  const m=line.match(/^\s{2}"([^"]+)":\s*\[/); if(m){dd=m[1];continue;}
  const w=line.match(/^\s*"word": "([^"]+)"/); if(w){lw=w[1];continue;}
  const mm=line.match(/^\s*"meaning": "([^"]+)"/); if(mm&&dd===target&&lw) out.push([lw,mm[1]]);
}
console.log(JSON.stringify(out));
