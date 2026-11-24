// Build a static release with content-addressed assets. Old browser/CDN caches
// cannot combine new HTML with an incompatible previous version of app.mjs.
import {readFileSync,writeFileSync,mkdirSync,rmSync} from "node:fs";
import {createHash} from "node:crypto";
import {join} from "node:path";
const dir=process.argv[2]||"_site";
const name=(base,ext,text)=>base+"-"+createHash("sha256").update(text).digest("hex").slice(0,16)+"."+ext;
const read=p=>readFileSync(p,"utf8");
const math=read("math.mjs"),mathName=name("math","mjs",math);
const app=read("app.mjs").replace('./math.mjs','./'+mathName),appName=name("app","mjs",app);
const css=read("style.css"),cssName=name("style","css",css);
const index=read("index.html").replace('./app.mjs','./'+appName).replace('./style.css','./'+cssName);
if(!index.includes(appName)||!index.includes(cssName)||!app.includes(mathName))throw Error("Asset references not rewritten");
rmSync(dir,{recursive:true,force:true});mkdirSync(dir,{recursive:true});
for(const [file,content] of [["index.html",index],[mathName,math],[appName,app],[cssName,css],[".nojekyll",""]])writeFileSync(join(dir,file),content);
console.log("Release:",appName,mathName,cssName);
