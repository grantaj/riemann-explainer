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
const concepts=read("concepts.mjs"),conceptsName=name("concepts","mjs",concepts),journey=read("journey.mjs"),journeyName=name("journey","mjs",journey);
const shared=html=>html.replace("./concepts.mjs","./"+conceptsName).replace("./journey.mjs","./"+journeyName);
const index=shared(read("index.html")).replace('./app.mjs','./'+appName).replace('./style.css','./'+cssName);
if(!index.includes(appName)||!index.includes(cssName)||!app.includes(mathName))throw Error("Asset references not rewritten");
const proof=read("proof.mjs"),proofName=name("proof","mjs",proof);
const arithmetic=read("proof-arithmetic.mjs"),arithmeticName=name("proof-arithmetic","mjs",arithmetic);
const proofPage=shared(read("proof.html")).replace("./proof.mjs","./"+proofName).replace("./style.css","./"+cssName).replace("./proof-arithmetic.mjs","./"+arithmeticName);
if(!proofPage.includes(proofName)||!proofPage.includes(cssName))throw Error("Proof asset references not rewritten");
const argument=read("argument.mjs"),argumentName=name("argument","mjs",argument);
const argumentLabs=read("argument-labs.mjs").replace("./argument.mjs","./"+argumentName),argumentLabsName=name("argument-labs","mjs",argumentLabs);
const argumentPage=shared(read("argument.html")).replace("./argument.mjs","./"+argumentName).replace("./argument-labs.mjs","./"+argumentLabsName).replace("./style.css","./"+cssName);
if(!argumentPage.includes(argumentName)||!argumentPage.includes(cssName)||!argumentPage.includes(argumentLabsName)||!argumentLabs.includes(argumentName))throw Error("Argument asset references not rewritten");
rmSync(dir,{recursive:true,force:true});mkdirSync(dir,{recursive:true});
for(const [file,content] of [[conceptsName,concepts],[journeyName,journey],["argument.html",argumentPage],[argumentName,argument],[argumentLabsName,argumentLabs],["index.html",index],["proof.html",proofPage],[proofName,proof],[arithmeticName,arithmetic],[mathName,math],[appName,app],[cssName,css],[".nojekyll",""]])writeFileSync(join(dir,file),content);
console.log("Release:",appName,mathName,cssName);
