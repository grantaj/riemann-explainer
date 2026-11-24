export const gamma=0.5772156649015329;
export function primePowerWeights(n){
 const a=Array(n+1).fill(0);
 const composite=new Uint8Array(n+1);
 for(let p=2;p<=n;p++)if(!composite[p]){
  for(let j=p*p;j<=n;j+=p)composite[j]=1;
  for(let k=p;k<=n;k*=p)a[k]=Math.log(p);
 }
 return a;
}
export function primeSum(x,weights,mode="ramps"){
 let sum=0;
 for(let n=2;n<=Math.floor(x);n++)sum+=weights[n]*(mode==="steps"?1:x/n-1);
 return mode==="center"?sum-x*Math.log(x)+(1+gamma)*x:sum;
}
export function character(k,n){
 const j=[-1,0,1,3,2][((n%5)+5)%5];
 if(j<0)return [0,0];
 if(k===4)return [j===0?1:0,0];
 return [[1,0],[0,1],[-1,0],[0,-1]][(k*j)%4];
}
export const spotlight=(k,t)=>t<=0?0:Math.exp(k*(Math.log(t)-t+1));
export const costs=a=>[a,1-a,Math.max(a,1-a)];
export const rootBudget=(d,m)=>Math.floor(d/m);
export function mount(){
 const $=id=>document.getElementById(id);
 const ns="http://www.w3.org/2000/svg", A="#6edccc",B="#f6b86e",C="#b7a5fb",M="#a0b2bc",L="#34434c";
 function add(svg,tag,attrs={},txt){
  const el=document.createElementNS(ns,tag);
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);
  if(txt!==undefined)el.textContent=txt;
  svg.append(el);return el;
 }
 function line(svg,x1,y1,x2,y2,stroke=L,extra={}){return add(svg,"line",{x1,y1,x2,y2,stroke,...extra});}
 function label(svg,x,y,t,extra={}){return add(svg,"text",{x,y,fill:M,"font-size":13,...extra},t);}
 function path(svg,pts,color,width=2){return add(svg,"path",{d:pts.map(([x,y],i)=>(i?"L":"M")+x.toFixed(2)+" "+y.toFixed(2)).join(" "),fill:"none",stroke:color,"stroke-width":width,"stroke-linejoin":"round"});}
 function axes(svg,xmin,xmax,ymin,ymax,xticks,yticks,xformat=String,yformat=String){
  svg.replaceChildren();
  const h=Number(svg.getAttribute("viewBox").split(" ")[3]),x=v=>58+520*(v-xmin)/(xmax-xmin),y=v=>h-32-(h-48)*(v-ymin)/(ymax-ymin);
  for(const t of yticks){line(svg,58,y(t),578,y(t));label(svg,50,y(t)+4,yformat(t),{"text-anchor":"end"});}
  for(const t of xticks){line(svg,x(t),16,x(t),h-32);label(svg,x(t),h-12,xformat(t),{"text-anchor":"middle"});}
  return {x,y,h};
 }
 function hook(ids,fn){for(const id of ids)$(id).addEventListener("input",fn);fn();}
 const weights=primePowerWeights(150);
 hook(["ramp-x","ramp-mode"],()=>{
  const n=+$("ramp-x").value,mode=$("ramp-mode").value,svg=$("ramp-plot");
  $("ramp-val").value=n;
  const points=[];
  for(let j=1;j<n;j++){
   points.push([j,primeSum(j,weights,mode)]);
   if(mode==="steps")points.push([j+1,primeSum(j,weights,mode)]);
   else for(let q=1;q<5;q++){const x=j+q/5;points.push([x,primeSum(x,weights,mode)]);}
  }
  const end=primeSum(n,weights,mode);points.push([n,end]);
  const vals=points.map(p=>p[1]),lo=Math.min(0,...vals),hi=Math.max(1,...vals),pad=(hi-lo)*.05;
  const ymin=lo-pad,ymax=hi+pad, ticks=Array.from({length:5},(_,i)=>ymin+(ymax-ymin)*i/4);
  const {x,y}=axes(svg,1,n,ymin,ymax,[1,Math.round(n/2),n],ticks,String,v=>v.toFixed(1));
  line(svg,58,y(0),578,y(0),M);
  path(svg,points.map(([a,b])=>[x(a),y(b)]),A);
  add(svg,"circle",{cx:x(n),cy:y(end),r:4,fill:B});
  $("ramp-stat").value=(mode==="steps"?"ψ":mode==="center"?"G":"Ramp sum")+"("+n+") = "+end.toFixed(3);
 });
 hook(["window-beta"],()=>{
  const beta=+$("window-beta").value,theta=(beta+.5)/2,svg=$("window-plot");
  $("window-beta-val").value=beta.toFixed(2);$("window-stat").value="Choose θ = "+theta.toFixed(3);
  const {x,y}=axes(svg,0,12,0,12,[0,3,6,9,12],[0,3,6,9,12],v=>"10^"+v,v=>"10^"+v);
  for(const start of [2,7])add(svg,"rect",{x:x(start),y:16,width:x(1.5*start)-x(start),height:172,fill:A,opacity:.1});
  path(svg,[[x(0),y(0)],[x(12),y(12*theta)]],A);
  path(svg,[[x(0),y(0)],[x(12),y(12*beta)]],B);
 });
 hook(["spot-order"],()=>{
  const k=+$("spot-order").value,svg=$("spot-plot");
  $("spot-val").value=k;
  const {x,y}=axes(svg,0,2,0,1.05,[0,.5,1,1.5,2],[0,.5,1],String,String);
  path(svg,Array.from({length:201},(_,i)=>[x(i/100),y(spotlight(k,i/100))]),A);
 });
 hook(["char-k"],()=>{
  const k=+$("char-k").value,svg=$("char-plot");svg.replaceChildren();
  const names=["0","1","2","3","4"],fmt=([re,im])=>im===1?"i":im===-1?"−i":String(re);
  for(let n=0;n<5;n++){
   const cx=60+120*n,cy=83,[re,im]=character(k,n);
   add(svg,"circle",{cx,cy,r:36,fill:"none",stroke:L});
   line(svg,cx-40,cy,cx+40,cy);line(svg,cx,cy-40,cx,cy+40);
   line(svg,cx,cy,cx+36*re,cy-36*im,A,{"stroke-width":3});
   add(svg,"circle",{cx:cx+36*re,cy:cy-36*im,r:5,fill:A});
   label(svg,cx,145,"n ≡ "+names[n],{"text-anchor":"middle"});
   label(svg,cx,172,fmt([re,im]),{"text-anchor":"middle",fill:A,"font-size":20});
  }
  $("char-stat").value=k===4?"Only residue 1 remains":"χ"+k+"(2) = "+fmt(character(k,2));
 });
 hook(["balance-a"],()=>{
  const a=+$("balance-a").value,svg=$("balance-plot"),[p,q,m]=costs(a);
  $("balance-val").value=a.toFixed(2);$("balance-stat").value="Largest exponent = "+m.toFixed(2);
  const {x,y}=axes(svg,0,1,0,1.05,[0,.25,.5,.75,1],[0,.25,.5,.75,1]);
  path(svg,[[x(0),y(1)],[x(.5),y(.5)],[x(1),y(1)]],C,5);
  path(svg,[[x(0),y(0)],[x(1),y(1)]],A);
  path(svg,[[x(0),y(1)],[x(1),y(0)]],B);
  line(svg,x(a),y(0),x(a),y(m),M,{"stroke-dasharray":"4 4"});
  add(svg,"circle",{cx:x(a),cy:y(m),r:5,fill:C});
 });
 hook(["mult-m"],()=>{
  const m=+$("mult-m").value,d=30,n=rootBudget(d,m),svg=$("mult-plot");svg.replaceChildren();
  $("mult-val").value=m;$("mult-stat").textContent="At most "+n+" distinct roots; "+(d-n*m)+" degree units left.";
  for(let i=0;i<d;i++)add(svg,"rect",{x:12+i*19.2,y:28,width:16,height:40,rx:2,fill:i>=n*m?L:Math.floor(i/m)%2?B:A});
 });
 document.documentElement.dataset.proofReady="true";
}
if(typeof document!=="undefined")mount();
