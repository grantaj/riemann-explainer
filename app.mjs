import {primeData,li,series,product,pow,zeta,zeros,explicit,contribution} from "./math.mjs";
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
 const gaps=ps.slice(1).map((p,i)=>p-ps[i]);if(gaps.length)plot("gaps",[{data:gaps.map((g,i)=>[ps[i],g]),color:B}],{xmin:n,xmax:n+299,ymin:0,ymax:Math.max(...gaps,4),xlabel:"",ylabel:"Gap",xtick:x=>fmt(Math.round(x))});else $("gaps").innerHTML="";
 });
 bind(["count-max","count-error"],()=>{const n=Math.round(10**val("count-max")),err=$("count-error").checked,pi=d.pi,ap=x=>x/Math.log(x);out("count-max-val",fmt(n));out("count-stat","π("+fmt(n)+") = "+fmt(pi[n]));
 let s;if(err){s=[{data:sample(2,n,600,x=>pi[Math.floor(x)]-ap(x)),color:B},{data:sample(2,n,600,x=>pi[Math.floor(x)]-li(x)),color:C}]}else{s=[{data:sample(2,n,500,ap),color:B},{data:sample(2,n,500,li),color:C},{data:stepData(pi,2,n,x=>0,true),color:A}]}
 plot("count-plot",s,{xmin:2,xmax:n,ylabel:err?"Error":"Count",xtick:x=>fmt(Math.round(x))});out("count-detail","At x = "+fmt(n)+": π = "+fmt(pi[n])+", x/log x = "+fmt(ap(n))+", li = "+fmt(li(n))+". Error curves are sampled at 601 points; the counting staircase is exact.");
 });
 bind(["euler-s","euler-n"],()=>{const s=val("euler-s"),n=Math.round(10**val("euler-n")),z=zeta([s,0])[0],a=series(s,n),b=product(s,d.primes,n);out("euler-s-val",dec(s,2));out("euler-n-val",fmt(n));out("euler-stat","ζ ≈ "+dec(z,6));
 const ns=Array.from({length:101},(_,i)=>Math.max(1,Math.round(Math.exp(Math.log(n)*i/100))));plot("euler-plot",[{data:ns.map(k=>[Math.log10(k),series(s,k)]),color:A},{data:ns.map(k=>[Math.log10(k),product(s,d.primes,k)]),color:B},{data:[[0,z],[Math.log10(n),z]],color:C}],{xmin:0,xmax:Math.log10(n),ymin:1,ymax:z*1.03,xlabel:"Number of terms/factors (log scale)",ylabel:"Value",xtick:x=>fmt(Math.round(10**x))});out("euler-detail","Partial sum = "+dec(a,6)+"; product of first "+fmt(n)+" prime factors = "+dec(b,6)+". The horizontal reference uses numerical continuation. The finite cutoffs are different, but both sequences converge to the same limit.");
 });

 bind(["vec-s","vec-t"],()=>{
  const s=val("vec-s"),t=val("vec-t"),points=[[0,0]],n=24;
  // Cartesian coordinates of the INPUT, on fixed independently labelled scales.
  const ix=s=>42+s/3.25*235,iy=t=>254-t/30*230;
  let input=line(ix(0),iy(0),ix(3.25),iy(0),M)+line(ix(0),iy(0),ix(0),iy(30),M);
  for(const q of [0,1,2,3])input+=line(ix(q),iy(0),ix(q),iy(30),L)+txt(ix(q),274,String(q),{"text-anchor":"middle","font-size":12});
  for(const q of [0,5,10,15,20,25,30])input+=line(ix(0),iy(q),ix(3.25),iy(q),L)+txt(34,iy(q)+4,String(q),{"text-anchor":"end","font-size":12});
  input+=line(ix(s),iy(0),ix(s),iy(t),A,{"stroke-dasharray":"3 4"})+line(ix(0),iy(t),ix(s),iy(t),A,{"stroke-dasharray":"3 4"});
  input+=circle(ix(s),iy(t),5,A,{"data-input-point":"true"})+txt(ix(s)-9,Math.max(14,iy(t)-10),"s",{"text-anchor":"end",fill:A,"font-size":15})+txt(279,294,"Re(s)",{"text-anchor":"end","font-size":12})+txt(42,13,"Im(s)",{"font-size":12});
  $("vector-input").innerHTML=input;out("vector-input-detail","s = "+dec(s,2)+" + "+dec(t,2)+"i. Axes use different scales.");

  for(let k=1;k<=n;k++){const v=pow(k,[-s,-t]),p=points.at(-1);points.push([p[0]+v[0],p[1]+v[1]])}
  const full=zeta([s,t]),last=points.at(-1),all=[...points,full];
  const left=Math.min(...all.map(p=>p[0])),right=Math.max(...all.map(p=>p[0])),lo=Math.min(...all.map(p=>p[1])),hi=Math.max(...all.map(p=>p[1]));
  const scale=Math.min(500/Math.max(right-left,.3),208/Math.max(hi-lo,.45)),X=x=>300+(x-(left+right)/2)*scale,Y=y=>140-(y-(lo+hi)/2)*scale;
  let z=line(25,Y(0),575,Y(0),L)+line(X(0),18,X(0),258,L)+txt(575,Y(0)-6,"Re(output)",{"text-anchor":"end"})+txt(X(0)+5,16,"Im(output)")+circle(X(0),Y(0),3,M)+txt(X(0)-5,Y(0)+16,"0",{"text-anchor":"end"});
  z+=line(X(0),Y(0),X(last[0]),Y(last[1]),B,{"stroke-width":2,"stroke-dasharray":"5 4"});
  for(let k=1;k<=n;k++){const [x0,y0]=points[k-1],[x1,y1]=points[k];z+=line(X(x0),Y(y0),X(x1),Y(y1),A,{"stroke-width":k<5?2:1.6,"stroke-opacity":k<6?1:.65})+circle(X(x1),Y(y1),k<5?3:1.6,A);if(k<=3&&Math.hypot(x1-x0,y1-y0)*scale>24)z+=txt((X(x0)+X(x1))/2,(Y(y0)+Y(y1))/2-7,"n="+k,{"text-anchor":"middle"})}
  z+=line(X(last[0]),Y(last[1]),X(full[0]),Y(full[1]),C,{"stroke-dasharray":"2 4"})+circle(X(last[0]),Y(last[1]),4.5,B,{stroke:"#11161c","stroke-width":1})+circle(X(full[0]),Y(full[1]),4.5,C,{stroke:"#11161c","stroke-width":1});
  $("vector").innerHTML=z;out("vec-s-val",dec(s,2));out("vec-t-val",dec(t,2));const c=v=>dec(v[0])+(v[1]>=0?" + ":" − ")+dec(Math.abs(v[1]))+"i";
  out("vector-detail","24-term sum: "+c(last)+". Full ζ(s) ≈ "+c(full)+". The dotted purple segment is the remaining tail.");
 });

 {
 const svg=$("domain"),ox=58,oy=22,pw=515,ph=335;let bounds,selection,marks=[],image=null,frame=0;
 const allMarks=[...zeros.flatMap((t,i)=>[{s:.5,t,kind:"nontrivial",label:"zero-"+(i+1)},{s:.5,t:-t,kind:"nontrivial",label:"negative-zero-"+(i+1)}]),{s:-4,t:0,kind:"trivial",label:"trivial-4"},{s:-2,t:0,kind:"trivial",label:"trivial-2"},{s:1,t:0,kind:"pole",label:"pole"}];
 const inView=p=>p.s>=bounds.a&&p.s<=bounds.b&&p.t>=bounds.c&&p.t<=bounds.e;
 function niceTicks(lo,hi,target){const d=(hi-lo)/target,base=10**Math.floor(Math.log10(d)),step=([1,2,2.5,5,10].find(k=>k*base>=d)||10)*base;const ticks=[];for(let x=Math.ceil((lo-1e-9)/step)*step;x<=hi+1e-9;x+=step)ticks.push(Number(x.toFixed(9)));return ticks;}
 const X=s=>ox+(s-bounds.a)/(bounds.b-bounds.a)*pw,Y=t=>oy+(bounds.e-t)/(bounds.e-bounds.c)*ph;
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function color(v){const m=Math.hypot(...v);if(!Number.isFinite(m))return [255,255,255];const hue=((Math.atan2(v[1],v[0])/(2*Math.PI)+1)%1)*6,brightness=Math.min(.94,.035+.39*Math.log1p(m)),chroma=brightness*.8,h=chroma*(1-Math.abs(hue%2-1)),k=brightness-chroma;return [[chroma,h,0],[h,chroma,0],[0,chroma,h],[0,h,chroma],[h,0,chroma],[chroma,0,h]][Math.min(5,Math.floor(hue))].map(v=>Math.round((v+k)*255))}
 function makeImage(){const c=document.createElement("canvas");c.width=260;c.height=180;const ctx=c.getContext("2d"),im=ctx.createImageData(c.width,c.height);for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const s=bounds.a+(bounds.b-bounds.a)*(x+.5)/c.width,t=bounds.e-(bounds.e-bounds.c)*(y+.5)/c.height,v=color(zeta([s,t])),i=4*(y*c.width+x);im.data.set([...v,255],i)}ctx.putImageData(im,0,0);return c.toDataURL()}
 function nearest(s,t){return marks.reduce((best,p)=>!best||Math.hypot(X(p.s)-X(s),Y(p.t)-Y(t))<Math.hypot(X(best.s)-X(s),Y(best.t)-Y(t))?p:best,null)}
 function paint(withColor=true){
  const colored=$("domain-colors").checked&&withColor;let z=el("rect",{x:ox,y:oy,width:pw,height:ph,fill:"#0d1218",stroke:L});
  if(colored){image??=makeImage();z+=el("image",{x:ox,y:oy,width:pw,height:ph,href:image,preserveAspectRatio:"none"})}
  else z+=el("rect",{x:X(0),y:oy,width:X(1)-X(0),height:ph,fill:A,"fill-opacity":.055});
  const ticks=niceTicks(bounds.c,bounds.e,5);
  for(const t of ticks){z+=line(ox,Y(t),ox+pw,Y(t),L)+txt(ox-9,Y(t)+4,String(t),{"text-anchor":"end","font-size":13})}
  const ordinary=niceTicks(bounds.a,bounds.b,6).filter(s=>![0,.5,1].some(k=>Math.abs(X(k)-X(s))<23));
  const st=[...ordinary,...[0,.5,1].filter(s=>s>=bounds.a&&s<=bounds.b)].sort((a,b)=>a-b);
  for(const s of st){const critical=s===.5,edge=s===0||s===1;z+=line(X(s),oy,X(s),oy+ph,critical?A:edge?M:L,{"stroke-width":critical?2:1,"stroke-dasharray":critical?"":edge?"5 5":"","stroke-opacity":critical?1:edge?.8:.65})+txt(X(s),oy+ph+19,critical?"½":String(s),{"text-anchor":"middle","font-size":13,fill:critical?A:M})}
  z+=txt(ox,15,"Im(s)",{"font-size":13})+txt(ox+pw,393,"Re(s)",{"text-anchor":"end","font-size":13});
  let lastLabelY=-Infinity;
  const labelAll=marks.filter(p=>p.kind==="nontrivial").length<=10;
  for(const p of [...marks].sort((a,b)=>b.t-a.t)){const x=X(p.s),y=Y(p.t),isZero=p.kind!=="pole";if(isZero){
    const radius=labelAll?5.5:3.6;
    z+=circle(x,y,radius+2,"#0d1218",{stroke:"#0d1218","stroke-width":1})+circle(x,y,radius,"#f5f8f7",{stroke:A,"stroke-width":1.2,"data-zero":p.label});
    if(p.kind==="nontrivial"&&(labelAll||p.label===selection?.label)&&y-lastLabelY>=15){z+=txt(x+13,y+4,p.t.toFixed(3),{fill:"#e9efed","font-size":12,"paint-order":"stroke",stroke:"#0d1218","stroke-width":3,"stroke-linejoin":"round"});lastLabelY=y;}
   }else{z+=line(x-5,y-5,x+5,y+5,B,{"stroke-width":3,"data-pole":"true"})+line(x-5,y+5,x+5,y-5,B,{"stroke-width":3});}}
  const {s,t}=selection;z+=el("circle",{cx:X(s),cy:Y(t),r:11,stroke:B,"stroke-width":1.7,fill:"none","pointer-events":"none"});
  svg.innerHTML=z;svg.dataset.selection=selection.label||"point";svg.dataset.reMin=bounds.a;svg.dataset.reMax=bounds.b;svg.dataset.imMin=bounds.c;svg.dataset.imMax=bounds.e;
  const v=zeta([s,t]),input=dec(s,3)+(t<0?" − ":" + ")+dec(Math.abs(t),selection.kind==="nontrivial"?6:3)+"i";
  if(selection.kind==="pole")out("domain-detail","s = 1 · Simple pole (ζ is unbounded).");
  else if(selection.kind)out("domain-detail",(selection.kind==="nontrivial"?"Nontrivial zero":"Trivial zero")+" · s = "+input+" · ζ(s) = 0");
  else out("domain-detail","s = "+input+" · ζ(s) ≈ "+dec(v[0],4)+(v[1]>=0?" + ":" − ")+dec(Math.abs(v[1]),4)+"i · |ζ| ≈ "+dec(Math.hypot(...v),4));
 }
 function scale(){
  const re=val("domain-re-scale"),im=val("domain-im-scale"),negative=$("domain-negative").checked;
  bounds={a:Number((.5-re).toFixed(2)),b:Number((.5+re).toFixed(2)),c:negative?-im:0,e:im};
  marks=allMarks.filter(inView);image=null;
  if(!selection||!inView(selection))selection=marks.find(p=>p.kind==="nontrivial"&&p.t>0)||marks.find(p=>p.kind==="trivial")||{s:.5,t:0};
  out("domain-re-val",fmt(bounds.a)+" to "+fmt(bounds.b));out("domain-im-val",fmt(bounds.c)+" to "+fmt(bounds.e));
  $("domain-re-scale").setAttribute("aria-valuetext",fmt(bounds.a)+" to "+fmt(bounds.b));
  $("domain-im-scale").setAttribute("aria-valuetext",fmt(bounds.c)+" to "+fmt(bounds.e));
  // Keep zoom responsive even when domain colouring is enabled.
  if(frame)cancelAnimationFrame(frame);
  paint(false);
  if($("domain-colors").checked)frame=requestAnimationFrame(()=>{frame=0;paint()});
 }
 function reset(){$("domain-re-scale").value=1;$("domain-im-scale").value=40;$("domain-negative").checked=false;selection=allMarks[0];scale()}
 function inspect(s,t,snap=true){s=clamp(s,bounds.a,bounds.b);t=clamp(t,bounds.c,bounds.e);const p=nearest(s,t);selection=snap&&p&&Math.hypot(X(p.s)-X(s),Y(p.t)-Y(t))<19?p:{s,t};paint()}
 for(const id of ["domain-re-scale","domain-im-scale"])$(id).addEventListener("input",scale);
 $("domain-negative").addEventListener("change",scale);$("domain-reset").addEventListener("click",reset);$("domain-colors").addEventListener("change",()=>paint());
 svg.addEventListener("click",ev=>{const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const p=pt.matrixTransform(svg.getScreenCTM().inverse());if(p.x<ox||p.x>ox+pw||p.y<oy||p.y>oy+ph)return;inspect(bounds.a+(p.x-ox)/pw*(bounds.b-bounds.a),bounds.e-(p.y-oy)/ph*(bounds.e-bounds.c))});
 svg.addEventListener("keydown",ev=>{const ds=(bounds.b-bounds.a)/50,dt=(bounds.e-bounds.c)/50;let {s,t}=selection;if(ev.key==="ArrowLeft")s-=ds;else if(ev.key==="ArrowRight")s+=ds;else if(ev.key==="ArrowUp")t+=dt;else if(ev.key==="ArrowDown")t-=dt;else if(ev.key==="Enter"){selection=nearest(s,t)||selection;paint();ev.preventDefault();return}else return;ev.preventDefault();inspect(s,t,false)});
 reset();
}

 bind(["music-n","music-x","music-error"],()=>{const n=val("music-n"),max=Math.round(10**val("music-x")),error=$("music-error").checked,trend=x=>error?x:0;out("music-n-val",n+" / 30");out("music-x-val",fmt(max));out("music-stat",2*n+" zeros");
 const exact=stepData(d.psi,2,max,trend,!error),approx=sample(2,max,900,x=>explicit(x,n)-trend(x));plot("music-plot",[{data:exact,color:A},{data:approx,color:B}],{xmin:2,xmax:max,ylabel:error?"ψ(x) − x":"ψ(x)",xtick:x=>fmt(Math.round(x))});});
 bind(["rh-beta"],()=>{const b=val("rh-beta"),t=14.134725141734695;out("rh-beta-val",dec(b,2));out("rh-stat",b===.5?"On the critical line":"Off the critical line");const X=s=>90+s*420,Y=t=>82-t*4.5;
 let z=el("rect",{x:X(0),y:5,width:420,height:150,fill:"#6edccc","fill-opacity":.05})+line(55,82,545,82)+line(X(0),5,X(0),155,M)+line(X(1),5,X(1),155,M)+line(X(.5),5,X(.5),155,A,{"stroke-dasharray":"4 4"});
 for(const s of [0,.5,1])z+=txt(X(s),164,String(s),{"text-anchor":"middle"});for(const s of b===.5?[b]:[b,1-b])for(const sign of [-1,1])z+=circle(X(s),Y(sign*t),4.5,b===.5?A:B);
 z+=txt(12,22,"+iγ")+txt(12,148,"−iγ");$("rh-plane").innerHTML=z;
 const envelope=(s,l)=>Math.log10(2/Math.hypot(s,t))+s*l;plot("rh-growth",[{data:sample(0,12,120,l=>envelope(.5,l)),color:A},{data:sample(0,12,120,l=>envelope(b,l)),color:B}],{xmin:0,xmax:12,xlabel:"x (log scale)",ylabel:"Amplitude (log scale)",xtick:l=>"10^"+fmt(l),ytick:l=>"10^"+fmt(l)});
 const ratio=10**(12*(b-.5))*Math.hypot(.5,t)/Math.hypot(b,t);out("rh-detail","At x = 10¹², the selected pair has an envelope "+fmt(ratio)+" times the on-line envelope. This compares amplitudes, not instantaneous values or a bound for the full zero sum.");
 });

 bind(["density-x"],()=>{
  const n=val("density-x"),density=x=>1/Math.log(x),area=li(n)-li(2),curve=sample(2,500,400,density);
  const id="density-plot",svg=$(id);
  plot(id,[{data:curve,color:C}],{xmin:2,xmax:500,ymin:0,ymax:1.5,xlabel:"Number",ylabel:"Estimated density",xtick:x=>fmt(Math.round(x))});
  const X=x=>56+(x-2)/498*528,Y=y=>200-y/1.5*178;
  const top=sample(2,n,300,density).map(([x,y])=>[X(x),Y(y)]);
  const coords=[[X(2),Y(0)],...top,[X(n),Y(0)]].map(p=>p.join(",")).join(" ");
  svg.insertAdjacentHTML("afterbegin",el("polygon",{points:coords,fill:A,"fill-opacity":.22}));
  svg.insertAdjacentHTML("beforeend",line(X(n),Y(0),X(n),Y(density(n)),A,{"stroke-width":2}));
  out("density-x-val",fmt(n));out("density-detail","Shaded area ≈ "+fmt(area)+". Add li(2) ≈ "+dec(li(2),3)+" to obtain li("+fmt(n)+") ≈ "+fmt(li(n))+". The area is a heuristic count, not a tally of individual primes.");
 });
 bind(["factor-a","factor-b"],()=>{
  const a=val("factor-a"),b=val("factor-b"),n=2**a*3**b;
  let z=txt(320,18,"Power of 2 (a)",{"text-anchor":"middle","font-size":13})+txt(10,50,"b",{"font-size":14});
  for(let j=0;j<=5;j++)z+=txt(104+j*87,40,String(j),{"text-anchor":"middle","font-size":13});
  for(let k=0;k<=4;k++){z+=txt(37,68+k*39,String(k),{"text-anchor":"middle","font-size":13});for(let j=0;j<=5;j++){const selected=a===j&&b===k,x=65+j*87,y=48+k*39;z+=el("rect",{x,y,width:78,height:31,rx:4,fill:selected?"#204d48":"#0d1218",stroke:selected?A:L,"data-factor":j+","+k,"data-active":selected?"true":"false"})+txt(x+39,y+21,String(2**j*3**k),{"text-anchor":"middle","font-size":15,fill:selected?"#e9efed":M,"pointer-events":"none"})}}
  z+=txt(12,252,"b = power of 3",{"font-size":12});
  $("factor-grid").innerHTML=z;out("factor-a-val",a);out("factor-b-val",b);out("factor-detail","2^"+a+" × 3^"+b+" = "+fmt(n)+". At s = 2: 1/"+fmt(2**(2*a))+" × 1/"+fmt(3**(2*b))+" = 1/"+fmt(n*n)+".");
 });
 $("factor-grid").addEventListener("click",e=>{const cell=e.target.closest("[data-factor]");if(!cell)return;const [a,b]=cell.dataset.factor.split(",");$("factor-a").value=a;$("factor-b").value=b;$("factor-a").dispatchEvent(new Event("input"))});
 bind(["fourier-n"],()=>{
  const n=val("fourier-n"),end=4*Math.PI,wave=x=>{let q=0;for(let j=0;j<n;j++){const k=2*j+1;q+=Math.sin(k*x)/k}return q*4/Math.PI};
  const square=[[0,1],[Math.PI,1],[Math.PI,-1],[2*Math.PI,-1],[2*Math.PI,1],[3*Math.PI,1],[3*Math.PI,-1],[end,-1]];
  plot("fourier-plot",[{data:square,color:M,width:1.3},{data:sample(0,end,1000,wave),color:A,width:2}],{xmin:0,xmax:end,ymin:-1.35,ymax:1.35,xlabel:"Position",ylabel:"Height",xtick:x=>Math.round(x/Math.PI)===0?"0":Math.round(x/Math.PI)+"π"});out("fourier-n-val",n);
 });
 function single(){
  const j=val("single-zero"),t=zeros[j],envelope=x=>2*Math.sqrt(x)/Math.hypot(.5,t);
  plot("single-wave",[{data:sample(2,100,400,envelope),color:L,width:1},{data:sample(2,100,400,x=>-envelope(x)),color:L,width:1},{data:sample(2,100,800,x=>contribution(x,.5,t)),color:A,width:2}],{xmin:2,xmax:100,xlabel:"x",ylabel:"Contribution to ψ(x)"});
  out("single-detail","γ = "+dec(t,6)+". The wave changes sign repeatedly. The grey envelopes are ±2√x/√(¼+γ²). Higher zeros oscillate faster in log x; all these known zeros have the same square-root growth exponent.");
 }
 $("single-zero").addEventListener("change",single);single();

 document.documentElement.dataset.ready="true";
})();
