import {primeData,li,series,product,pow,zeta,zeros,explicit} from "./math.mjs";
(function main(){
 const $=id=>document.getElementById(id), val=id=>Number($(id).value), out=(id,v)=>{$(id).textContent=v}, A="#6edccc",B="#f6b86e",C="#b7a5fb",M="#a0b2bc",L="#34434c";
 const d=primeData(10000), fmt=x=>x.toLocaleString("en",{maximumFractionDigits:2}), dec=(x,n=3)=>Number.isFinite(x)?x.toFixed(n):"∞";
 const el=(tag,attrs,content="")=>"<"+tag+" "+Object.entries(attrs).map(([k,v])=>k+'="'+v+'"').join(" ")+">"+content+"</"+tag+">";
 const line=(x1,y1,x2,y2,stroke=L,extra={})=>el("line",{x1,y1,x2,y2,stroke,...extra});
 const circle=(cx,cy,r,fill,extra={})=>el("circle",{cx,cy,r,fill,...extra});
 const txt=(x,y,t,extra={})=>el("text",{x,y,fill:M,"font-size":11,...extra},t);
 const path=(pts,color,width=1.8)=>el("path",{d:pts.map(([x,y],i)=>(i?"L":"M")+x.toFixed(2)+","+y.toFixed(2)).join(" "),stroke:color,"stroke-width":width,fill:"none","stroke-linejoin":"round","vector-effect":"non-scaling-stroke"});
 const sample=(a,b,n,f)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return [x,f(x)]});
 function plot(id,series,{xmin,xmax,ymin,ymax,xlabel="x",ylabel="",xtick=fmt,ytick=fmt}={}){
  const svg=$(id),h=svg.viewBox.baseVal.height,w=600,p={l:56,r:16,t:22,b:35};
  xmin??=Math.min(...series.map(s=>s.data[0][0]));xmax??=Math.max(...series.map(s=>s.data.at(-1)[0]));
  const ys=series.flatMap(s=>s.data.map(p=>p[1])).filter(Number.isFinite);ymin??=Math.min(...ys);ymax??=Math.max(...ys);if(ymax===ymin)ymax=ymin+1;
  const X=x=>p.l+(x-xmin)/(xmax-xmin)*(w-p.l-p.r),Y=y=>h-p.b-(y-ymin)/(ymax-ymin)*(h-p.t-p.b);
  let z="";for(let i=0;i<=4;i++){const v=ymin+(ymax-ymin)*i/4,y=Y(v);z+=line(p.l,y,w-p.r,y,L)+txt(p.l-7,y+4,ytick(v),{"text-anchor":"end"})}
  for(let i=0;i<=4;i++){const v=xmin+(xmax-xmin)*i/4,x=X(v);z+=line(x,p.t,x,h-p.b,L)+txt(x,h-p.b+17,xtick(v),{"text-anchor":"middle"})}
  if(ymin<0&&ymax>0)z+=line(p.l,Y(0),w-p.r,Y(0),M,{"stroke-dasharray":"3 4"});
  z+=txt(p.l,13,ylabel)+txt(w-p.r,h-2,xlabel,{"text-anchor":"end"});
  for(const s of series)z+=path(s.data.map(([x,y])=>[X(x),Y(y)]),s.color,s.width);
  svg.innerHTML=z;
 }
 function bind(ids,f){for(const id of ids)$(id).addEventListener("input",f);f()}
 function stepData(arr,min,max,trend=x=>0,skip=false){const a=[[min,arr[min]-trend(min)]];for(let k=min+1;k<=max;k++){if(!skip||arr[k]!==arr[k-1]){a.push([k,arr[k-1]-trend(k)],[k,arr[k]-trend(k)])}}a.push([max,arr[max]-trend(max)]);return a}
 $("hero-art").innerHTML=Array.from({length:800},(_,i)=>circle(6+(i%80)*9.95,8+Math.floor(i/80)*15.4,d.a[i+1]?3.1:1.25,d.a[i+1]?A:L)).join("");
 bind(["prime-start"],()=>{const n=val("prime-start"),ps=d.primes.filter(p=>p>=n&&p<n+300);out("prime-start-val",fmt(n));out("prime-stat",ps.length+" primes / 300 integers");let z="";
 for(let i=0;i<300;i++){const x=10+(i%30)*20,y=10+Math.floor(i/30)*19,k=n+i;z+=circle(x,y,d.a[k]?4.4:1.7,d.a[k]?A:L);}
 z+=txt(4,202,fmt(n))+txt(596,202,fmt(n+299),{"text-anchor":"end"});$("prime-grid").innerHTML=z;
 const gaps=ps.slice(1).map((p,i)=>p-ps[i]);if(gaps.length)plot("gaps",[{data:gaps.map((g,i)=>[i+1,g]),color:B}],{xmin:1,xmax:Math.max(2,gaps.length),ymin:0,ymax:Math.max(...gaps,4),xlabel:"Successive prime pairs",ylabel:"Gap",xtick:x=>String(Math.round(x))});else $("gaps").innerHTML="";
 });
 bind(["count-max","count-error"],()=>{const n=Math.round(10**val("count-max")),err=$("count-error").checked,pi=d.pi,ap=x=>x/Math.log(x);out("count-max-val",fmt(n));out("count-stat","π("+fmt(n)+") = "+fmt(pi[n]));
 let s;if(err){s=[{data:sample(2,n,600,x=>pi[Math.floor(x)]-ap(x)),color:B},{data:sample(2,n,600,x=>pi[Math.floor(x)]-li(x)),color:C}]}else{s=[{data:sample(2,n,500,ap),color:B},{data:sample(2,n,500,li),color:C},{data:stepData(pi,2,n,x=>0,true),color:A}]}
 plot("count-plot",s,{xmin:2,xmax:n,ylabel:err?"Error":"Count",xtick:x=>fmt(Math.round(x))});out("count-detail","At x = "+fmt(n)+": π = "+fmt(pi[n])+", x/log x = "+fmt(ap(n))+", li = "+fmt(li(n))+". Error curves are sampled at 601 points; the counting staircase is exact.");
 });
 bind(["euler-s","euler-n"],()=>{const s=val("euler-s"),n=Math.round(10**val("euler-n")),z=zeta([s,0])[0],a=series(s,n),b=product(s,d.primes,n);out("euler-s-val",dec(s,2));out("euler-n-val",fmt(n));out("euler-stat","ζ ≈ "+dec(z,6));
 const ns=Array.from({length:101},(_,i)=>Math.max(1,Math.round(Math.exp(Math.log(n)*i/100))));plot("euler-plot",[{data:ns.map(k=>[Math.log10(k),series(s,k)]),color:A},{data:ns.map(k=>[Math.log10(k),product(s,d.primes,k)]),color:B},{data:[[0,z],[Math.log10(n),z]],color:C}],{xmin:0,xmax:Math.log10(n),ymin:1,ymax:z*1.03,xlabel:"Number of terms/factors (log scale)",ylabel:"Value",xtick:x=>fmt(Math.round(10**x))});out("euler-detail","Partial sum = "+dec(a,6)+"; product of first "+fmt(n)+" prime factors = "+dec(b,6)+". The horizontal reference uses numerical continuation. The finite cutoffs are different, but both sequences converge to the same limit.");
 });
 bind(["vec-s","vec-t"],()=>{const s=val("vec-s"),t=val("vec-t"),v=pow(3,[-s,-t]),x=300+94*v[0],y=111-94*v[1];out("vec-s-val",dec(s,2));out("vec-t-val",dec(t,2));$("vector").innerHTML=line(170,111,430,111)+line(300,7,300,215)+el("circle",{cx:300,cy:111,r:94,stroke:L,fill:"none","stroke-dasharray":"3 4"})+line(300,111,x,y,A,{"stroke-width":3})+circle(x,y,5,A)+txt(434,115,"Re")+txt(307,14,"Im")+txt(300,224,"Unit circle",{"text-anchor":"middle"});out("vector-detail","3⁻ˢ = "+dec(v[0])+(v[1]>=0?" + ":" − ")+dec(Math.abs(v[1]))+"i; modulus "+dec(Math.hypot(...v))+".");
 });
 const can=$("domain"),ctx=can.getContext("2d"),off=document.createElement("canvas"),ox=48,oy=12,pw=540,ph=305;
 off.width=270;off.height=180;const oc=off.getContext("2d");let bounds={a:-.5,b:1.5,c:0,e:40},domainReady=false;
 function color(v){const m=Math.hypot(...v);if(!Number.isFinite(m))return [255,255,255];const hue=((Math.atan2(v[1],v[0])/(2*Math.PI)+1)%1)*6;const brightness=Math.min(.96,.12+.35*Math.log1p(m));const sat=.72;const chroma=brightness*sat,h=chroma*(1-Math.abs(hue%2-1)),k=brightness-chroma;const rgb=[[chroma,h,0],[h,chroma,0],[0,chroma,h],[0,h,chroma],[h,0,chroma],[chroma,0,h]][Math.min(5,Math.floor(hue))];return rgb.map(v=>Math.round((v+k)*255))}
 const dx=s=>ox+(s-bounds.a)/(bounds.b-bounds.a)*pw,dy=t=>oy+(bounds.e-t)/(bounds.e-bounds.c)*ph;
 function paintDomain(){
  ctx.fillStyle="#0d1218";ctx.fillRect(0,0,600,350);ctx.drawImage(off,ox,oy,pw,ph);
  ctx.font="11px system-ui";ctx.fillStyle=M;ctx.strokeStyle="#a0b2bc";ctx.lineWidth=1;
  for(const s of [0,.5,1]){if(s<bounds.a||s>bounds.b)continue;ctx.setLineDash(s===.5?[2,3]:[5,5]);ctx.beginPath();ctx.moveTo(dx(s),oy);ctx.lineTo(dx(s),oy+ph);ctx.stroke();ctx.fillText(String(s),dx(s)-6,oy+ph+16)}ctx.setLineDash([]);
  for(let i=0;i<=4;i++){let t=bounds.c+(bounds.e-bounds.c)*i/4;ctx.fillText(fmt(t),7,dy(t)+4)}
  ctx.fillText("Re(s)",pw+ox-35,344);ctx.fillText("Im(s)",5,10);
  const pts=[...zeros.flatMap(t=>[[.5,t],[.5,-t]]),[-2,0],[-4,0]];ctx.fillStyle="#fff";for(const [s,t] of pts){if(s<bounds.a||s>bounds.b||t<bounds.c||t>bounds.e)continue;ctx.beginPath();ctx.arc(dx(s),dy(t),2.5,0,2*Math.PI);ctx.fill()}
  const s=val("domain-s"),t=val("domain-t");ctx.strokeStyle=B;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(dx(s),dy(t),6,0,2*Math.PI);ctx.stroke();out("domain-s-val",dec(s,2));out("domain-t-val",dec(t,2));
  const v=zeta([s,t]);out("domain-detail",s===1&&t===0?"s = 1: simple pole": "ζ(s) ≈ "+dec(v[0],5)+(v[1]>=0?" + ":" − ")+dec(Math.abs(v[1]),5)+"i; |ζ| ≈ "+dec(Math.hypot(...v),5));
 }
 function calcDomain(){const strip=$("domain-mode").value==="strip";bounds=strip?{a:-.5,b:1.5,c:0,e:40}:{a:-4,b:3,c:-5,e:5};for(const [id,lo,hi,v] of [["domain-s",bounds.a,bounds.b,strip?.5:-2],["domain-t",bounds.c,bounds.e,strip?14.13:0]]){const node=$(id);node.min=lo;node.max=hi;node.value=v}
  const im=oc.createImageData(off.width,off.height);for(let y=0;y<off.height;y++)for(let x=0;x<off.width;x++){const s=bounds.a+(bounds.b-bounds.a)*(x+.5)/off.width,t=bounds.e-(bounds.e-bounds.c)*(y+.5)/off.height,v=color(zeta([s,t])),i=4*(y*off.width+x);im.data[i]=v[0];im.data[i+1]=v[1];im.data[i+2]=v[2];im.data[i+3]=255}oc.putImageData(im,0,0);domainReady=true;paintDomain();
 }
 $("domain-mode").addEventListener("change",calcDomain);for(const id of ["domain-s","domain-t"])$(id).addEventListener("input",()=>{if(domainReady)paintDomain();else calcDomain()});
 can.addEventListener("click",ev=>{if(!domainReady)calcDomain();const box=can.getBoundingClientRect(),x=(ev.clientX-box.left)*600/box.width,y=(ev.clientY-box.top)*350/box.height;if(x<ox||x>ox+pw||y<oy||y>oy+ph)return;$("domain-s").value=(bounds.a+(x-ox)/pw*(bounds.b-bounds.a)).toFixed(2);$("domain-t").value=(bounds.e-(y-oy)/ph*(bounds.e-bounds.c)).toFixed(2);paintDomain()});
 if("IntersectionObserver" in window){const observer=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){observer.disconnect();if(!domainReady)calcDomain()}},{rootMargin:"300px"});observer.observe(can)}else calcDomain();
 bind(["music-n","music-x","music-error"],()=>{const n=val("music-n"),max=Math.round(10**val("music-x")),error=$("music-error").checked,trend=x=>error?x:0;out("music-n-val",n+" / 30");out("music-x-val",fmt(max));out("music-stat",2*n+" zeros");
 const exact=stepData(d.psi,2,max,trend,!error),approx=sample(2,max,900,x=>explicit(x,n)-trend(x));plot("music-plot",[{data:exact,color:A},{data:approx,color:B}],{xmin:2,xmax:max,ylabel:error?"ψ(x) − x":"ψ(x)",xtick:x=>fmt(Math.round(x))});});
 bind(["rh-beta"],()=>{const b=val("rh-beta"),t=14.134725141734695;out("rh-beta-val",dec(b,2));out("rh-stat",b===.5?"On the critical line":"Off the critical line");const X=s=>90+s*420,Y=t=>82-t*4.5;
 let z=el("rect",{x:X(0),y:5,width:420,height:150,fill:"#6edccc","fill-opacity":.05})+line(55,82,545,82)+line(X(0),5,X(0),155,M)+line(X(1),5,X(1),155,M)+line(X(.5),5,X(.5),155,A,{"stroke-dasharray":"4 4"});
 for(const s of [0,.5,1])z+=txt(X(s),164,String(s),{"text-anchor":"middle"});for(const s of b===.5?[b]:[b,1-b])for(const sign of [-1,1])z+=circle(X(s),Y(sign*t),4.5,b===.5?A:B);
 z+=txt(12,22,"+iγ")+txt(12,148,"−iγ");$("rh-plane").innerHTML=z;
 const envelope=(s,l)=>Math.log10(2/Math.hypot(s,t))+s*l;plot("rh-growth",[{data:sample(0,12,120,l=>envelope(.5,l)),color:A},{data:sample(0,12,120,l=>envelope(b,l)),color:B}],{xmin:0,xmax:12,xlabel:"x (log scale)",ylabel:"Amplitude (log scale)",xtick:l=>"10^"+fmt(l),ytick:l=>"10^"+fmt(l)});
 const ratio=10**(12*(b-.5))*Math.hypot(.5,t)/Math.hypot(b,t);out("rh-detail","At x = 10¹², the selected pair has an envelope "+fmt(ratio)+" times the on-line envelope. This compares amplitudes, not instantaneous values or a bound for the full zero sum.");
 });
 document.documentElement.dataset.ready="true";
})();
