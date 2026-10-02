import fs from "fs";
const root="/Users/fujiken/Desktop/claude/副業/hogen-app/";
const read=p=>fs.readFileSync(root+p,"utf8");
const DAK={が:'か',ぎ:'き',ぐ:'く',げ:'け',ご:'こ',ざ:'さ',じ:'し',ず:'す',ぜ:'せ',ぞ:'そ',だ:'た',ぢ:'ち',づ:'つ',で:'て',ど:'と',ば:'は',び:'ひ',ぶ:'ふ',べ:'へ',ぼ:'ほ',ぱ:'は',ぴ:'ひ',ぷ:'ふ',ぺ:'へ',ぽ:'ほ'};
const SM={ゃ:'や',ゅ:'ゆ',ょ:'よ',っ:'つ',ぁ:'あ',ぃ:'い',ぅ:'う',ぇ:'え',ぉ:'お',ゎ:'わ'};
const fold=s=>[...String(s).replace(/[〜ー、。!?？！\s・（）()]/g,"")].map(c=>c>='ァ'&&c<='ヶ'?String.fromCharCode(c.charCodeAt(0)-0x60):c).map(c=>SM[c]||c).map(c=>DAK[c]||c).join("");
const all=[]; // [dialect, word, meaning]
const dataTs=read("lib/data.ts");
const wb=dataTs.slice(dataTs.indexOf("export const WORDS"),dataTs.indexOf("export const QUIZZES"));
let d=null;
for(const line of wb.split("\n")){
  const m=line.match(/^\s{2}"?([^\s":]+)"?:\s*\[/); if(m){d=m[1];continue;}
  const w=line.match(/\{\s*word: "([^"]+)", meaning: "([^"]+)"/); if(w&&d) all.push([d,w[1],w[2]]);
}
let dd=null,lw=null;
for(const line of read("lib/words_extra.ts").split("\n")){
  const m=line.match(/^\s{2}"([^"]+)":\s*\[/); if(m){dd=m[1];continue;}
  const w=line.match(/^\s*"word": "([^"]+)"/); if(w){lw=w[1];continue;}
  const mm=line.match(/^\s*"meaning": "([^"]+)"/); if(mm&&dd&&lw) all.push([dd,lw,mm[1]]);
}
const idx=new Map();
for(const [dl,w,m] of all){const k=fold(w); if(!idx.has(k))idx.set(k,[]); idx.get(k).push([dl,m]);}
const targets=process.argv.slice(2);
for(const t of targets){
  const k=fold(t); const hits=idx.get(k)||[];
  console.log(`== ${t}  → ${hits.length}方言: `+hits.map(([dl,m])=>`${dl}(${m})`).join(" / "));
}
