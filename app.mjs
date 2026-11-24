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
  for(let k=1;k<=n;k++){const v=pow(k,[-s,-t]),p=points.at(-1);points.push([p[0]+v[0],p[1]+v[1]])}
  const full=zeta([s,t]),last=points.at(-1),all=[...points,full];
  const left=Math.min(...all.map(p=>p[0])),right=Math.max(...all.map(p=>p[0])),lo=Math.min(...all.map(p=>p[1])),hi=Math.max(...all.map(p=>p[1]));
  const scale=Math.min(500/Math.max(right-left,.3),208/Math.max(hi-lo,.45)),X=x=>300+(x-(left+right)/2)*scale,Y=y=>140-(y-(lo+hi)/2)*scale;
  let z=line(25,Y(0),575,Y(0),L)+line(X(0),18,X(0),258,L)+txt(575,Y(0)-6,"Re",{"text-anchor":"end"})+txt(X(0)+5,16,"Im")+circle(X(0),Y(0),3,M)+txt(X(0)-5,Y(0)+16,"0",{"text-anchor":"end"});
  z+=line(X(0),Y(0),X(last[0]),Y(last[1]),B,{"stroke-width":2,"stroke-dasharray":"5 4"});
  for(let k=1;k<=n;k++){const [x0,y0]=points[k-1],[x1,y1]=points[k];z+=line(X(x0),Y(y0),X(x1),Y(y1),A,{"stroke-width":k<5?2:1.6,"stroke-opacity":k<6?1:.65})+circle(X(x1),Y(y1),k<5?3:1.6,A);if(k<=3&&Math.hypot(x1-x0,y1-y0)*scale>24)z+=txt((X(x0)+X(x1))/2,(Y(y0)+Y(y1))/2-7,"n="+k,{"text-anchor":"middle"})}
  z+=line(X(last[0]),Y(last[1]),X(full[0]),Y(full[1]),C,{"stroke-dasharray":"2 4"})+circle(X(last[0]),Y(last[1]),4.5,B,{stroke:"#11161c","stroke-width":1})+circle(X(full[0]),Y(full[1]),4.5,C,{stroke:"#11161c","stroke-width":1});
  $("vector").innerHTML=z;out("vec-s-val",dec(s,2));out("vec-t-val",dec(t,2));const c=v=>dec(v[0])+(v[1]>=0?" + ":" − ")+dec(Math.abs(v[1]))+"i";
  out("vector-detail","24-term sum: "+c(last)+". Full ζ(s) ≈ "+c(full)+". The dotted purple segment is the remaining tail.");
 });

 {
 const svg=$("domain"),ox=58,oy=22,pw=515,ph=335;let bounds,selection,marks=[],image=null;
 const X=s=>ox+(s-bounds.a)/(bounds.b-bounds.a)*pw,Y=t=>oy+(bounds.e-t)/(bounds.e-bounds.c)*ph;
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function color(v){const m=Math.hypot(...v);if(!Number.isFinite(m))return [255,255,255];const hue=((Math.atan2(v[1],v[0])/(2*Math.PI)+1)%1)*6,brightness=Math.min(.94,.035+.39*Math.log1p(m)),chroma=brightness*.8,h=chroma*(1-Math.abs(hue%2-1)),k=brightness-chroma;return [[chroma,h,0],[h,chroma,0],[0,chroma,h],[0,h,chroma],[h,0,chroma],[chroma,0,h]][Math.min(5,Math.floor(hue))].map(v=>Math.round((v+k)*255))}
 function makeImage(){const c=document.createElement("canvas");c.width=260;c.height=180;const ctx=c.getContext("2d"),im=ctx.createImageData(c.width,c.height);for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const s=bounds.a+(bounds.b-bounds.a)*(x+.5)/c.width,t=bounds.e-(bounds.e-bounds.c)*(y+.5)/c.height,v=color(zeta([s,t])),i=4*(y*c.width+x);im.data.set([...v,255],i)}ctx.putImageData(im,0,0);return c.toDataURL()}
 function nearest(s,t){return marks.reduce((best,p)=>!best||Math.hypot(X(p.s)-X(s),Y(p.t)-Y(t))<Math.hypot(X(best.s)-X(s),Y(best.t)-Y(t))?p:best,null)}
 function paint(){
  const colored=$("domain-colors").checked,strip=$("domain-mode").value==="strip";let z=el("rect",{x:ox,y:oy,width:pw,height:ph,fill:"#0d1218",stroke:L});
  if(colored){image??=makeImage();z+=el("image",{x:ox,y:oy,width:pw,height:ph,href:image,preserveAspectRatio:"none"})}
  else z+=el("rect",{x:X(0),y:oy,width:X(1)-X(0),height:ph,fill:A,"fill-opacity":.055});
  const ticks=strip?[0,10,20,30,40]:[-4,-2,0,2,4];
  for(const t of ticks){z+=line(ox,Y(t),ox+pw,Y(t),L)+txt(ox-9,Y(t)+4,String(t),{"text-anchor":"end","font-size":13})}
  const st=strip?[-.5,0,.5,1,1.5]:[-4,-3,-2,-1,0,.5,1,2,3];
  for(const s of st){const critical=s===.5,edge=s===0||s===1;z+=line(X(s),oy,X(s),oy+ph,critical?A:edge?M:L,{"stroke-width":critical?2:1,"stroke-dasharray":critical?"":edge?"5 5":"","stroke-opacity":critical?1:edge?.8:.65})+txt(X(s),oy+ph+19,critical?"½":String(s),{"text-anchor":"middle","font-size":13,fill:critical?A:M})}
  z+=txt(ox,15,"Im(s)",{"font-size":13})+txt(ox+pw,393,"Re(s)",{"text-anchor":"end","font-size":13});
  for(const p of marks){const x=X(p.s),y=Y(p.t),isZero=p.kind!=="pole";if(isZero){
    z+=circle(x,y,8,"#0d1218",{stroke:"#0d1218","stroke-width":2})+circle(x,y,5.5,"#f5f8f7",{stroke:A,"stroke-width":1.5,"data-zero":p.label});
    if(strip)z+=txt(x+13,y+4,p.t.toFixed(3),{fill:"#e9efed","font-size":12,"paint-order":"stroke",stroke:"#0d1218","stroke-width":3,"stroke-linejoin":"round"});
   }else{z+=line(x-5,y-5,x+5,y+5,B,{"stroke-width":3,"data-pole":"true"})+line(x-5,y+5,x+5,y-5,B,{"stroke-width":3});}}
  const {s,t}=selection;z+=el("circle",{cx:X(s),cy:Y(t),r:13,stroke:B,"stroke-width":1.7,fill:"none","pointer-events":"none"});
  svg.innerHTML=z;svg.dataset.mode=strip?"strip":"real";svg.dataset.selection=selection.label||"point";
  const v=zeta([s,t]),input=dec(s,3)+(t<0?" − ":" + ")+dec(Math.abs(t),selection.kind==="nontrivial"?6:3)+"i";
  if(selection.kind==="pole")out("domain-detail","s = 1 · Simple pole (ζ is unbounded).");
  else if(selection.kind)out("domain-detail",(selection.kind==="nontrivial"?"Nontrivial zero":"Trivial zero")+" · s = "+input+" · ζ(s) = 0");
  else out("domain-detail","s = "+input+" · ζ(s) ≈ "+dec(v[0],4)+(v[1]>=0?" + ":" − ")+dec(Math.abs(v[1]),4)+"i · |ζ| ≈ "+dec(Math.hypot(...v),4));
 }
 function reset(){const strip=$("domain-mode").value==="strip";bounds=strip?{a:-.5,b:1.5,c:0,e:40}:{a:-4.35,b:3,c:-4,e:4};marks=strip?[...zeros.filter(t=>t<=40).map((t,i)=>({s:.5,t,kind:"nontrivial",label:"zero-"+(i+1)})),{s:1,t:0,kind:"pole",label:"pole"}]:[{s:-4,t:0,kind:"trivial",label:"trivial-4"},{s:-2,t:0,kind:"trivial",label:"trivial-2"},{s:1,t:0,kind:"pole",label:"pole"}];selection=marks[strip?0:1];image=null;paint()}
 function inspect(s,t,snap=true){s=clamp(s,bounds.a,bounds.b);t=clamp(t,bounds.c,bounds.e);const p=nearest(s,t);selection=snap&&p&&Math.hypot(X(p.s)-X(s),Y(p.t)-Y(t))<19?p:{s,t};paint()}
 $("domain-mode").addEventListener("change",reset);$("domain-colors").addEventListener("change",paint);
 svg.addEventListener("click",ev=>{const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const p=pt.matrixTransform(svg.getScreenCTM().inverse());if(p.x<ox||p.x>ox+pw||p.y<oy||p.y>oy+ph)return;inspect(bounds.a+(p.x-ox)/pw*(bounds.b-bounds.a),bounds.e-(p.y-oy)/ph*(bounds.e-bounds.c))});
 svg.addEventListener("keydown",ev=>{const ds=(bounds.b-bounds.a)/50,dt=(bounds.e-bounds.c)/50;let {s,t}=selection;if(ev.key==="ArrowLeft")s-=ds;else if(ev.key==="ArrowRight")s+=ds;else if(ev.key==="ArrowUp")t+=dt;else if(ev.key==="ArrowDown")t-=dt;else if(ev.key==="Enter"){selection=nearest(s,t);paint();ev.preventDefault();return}else return;ev.preventDefault();inspect(s,t,false)});
 reset();
}
 {
 const entries={
 factor:["Prime factorisation","Every integer greater than 1 has a unique decomposition into prime factors (ignoring their order). For example, 60 = 2² × 3 × 5. This is the fundamental theorem of arithmetic and the reason Euler’s product contains each positive integer exactly once."],
 pnt:["Prime number theorem","As x tends to infinity, π(x)/(x/log x) tends to 1. So the fraction of integers up to x that are prime is approximately 1/log x. This describes average density over large ranges, not the next gap or a probabilistic law."],
 asymptotic:["Asymptotic equivalence","f(x) ∼ g(x) means f(x)/g(x) → 1 as x → ∞. For example, x+√x ∼ x even though their difference grows without bound. It tells us relative accuracy, not the absolute error."],
 li:["Logarithmic integral","li(x) = PV ∫₀ˣ dt/log t. For x > 1, li(x) = li(2) + ∫₂ˣ dt/log t. The integrand is the estimated prime density. PV means the singularity at 1 is crossed using a Cauchy principal value; the integral starting at 2 avoids that issue. li(100) ≈ 30.126."],
 zeta:["Riemann zeta function","ζ(s) = 1 + 2⁻ˢ + 3⁻ˢ + ⋯ for Re(s) > 1. The series is absolutely convergent there. Its unique analytic continuation is defined everywhere else except a simple pole at s = 1."],
 geometric:["Geometric series","For |r| < 1, 1 + r + r² + ⋯ = 1/(1−r). In the Euler product take r = p⁻ˢ. The terms are precisely the powers of the prime p."],
 euler:["Euler product","ζ(s) = ∏ over primes p of (1−p⁻ˢ)⁻¹, for Re(s) > 1. Expanding finite products gives terms for all integers built from those primes. The full product converges absolutely in that region, equals the series, and cannot vanish there."],
 complex:["Complex numbers","A complex number a+ib has real coordinate a and imaginary coordinate b, with i² = −1. It can be drawn as a vector from the origin. Addition is vector addition; multiplication multiplies lengths and adds angles."],
 exp:["Euler’s formula","exp(iθ) = cos θ + i sin θ. This is a unit vector at angle θ in radians. Thus n⁻ˢ = n⁻σ exp(−it log n): σ controls its length and t controls its angle."],
 zero:["Zeros of a function","A zero is an input s at which the output ζ(s) equals 0 (both its real and imaginary components vanish). The known nontrivial zeros have the form ½ ± it, with the first positive t ≈ 14.134725."],
 continuation:["Analytic continuation","A complex analytic function is locally described by a convergent power series. If another analytic function agrees with it on an open overlap, they must agree throughout their connected common domain. This lets us extend ζ beyond Re(s) > 1 uniquely, without pretending the original infinite series converges there."],
 pole:["Simple pole","A pole is an isolated point where a function becomes unbounded. At s = 1, ζ(s) behaves like 1/(s−1) plus a function analytic nearby. The coefficient of 1/(s−1) is 1."],
 strip:["Critical strip","Every nontrivial zero lies in 0 < Re(s) < 1. The Euler product excludes zeros to the right of 1; the functional equation relates the left to the right, and the nonvanishing on Re(s) = 1 is a deeper theorem. The critical line is Re(s) = ½."],
 functional:["Functional equation","The completed zeta function ξ(s) = ½s(s−1)π⁻ˢᐟ² Γ(s/2)ζ(s) is entire and obeys ξ(s) = ξ(1−s). Here Γ extends the factorial: Γ(n) = (n−1)! for positive integers. Its zeros are the nontrivial zeta zeros. Together with conjugation this gives symmetry across the real axis and critical line."],
 psi:["Chebyshev function","ψ(x) = sum of log p over all prime powers pᵏ ≤ x. Equivalently, ψ(x) = Σₙ≤ₓ Λ(n), where the von Mangoldt function Λ(n) equals log p if n is a power of a prime p and 0 otherwise. The logarithmic derivative −ζ′(s)/ζ(s) = Σ Λ(n)n⁻ˢ for Re(s) > 1."],
 explicit:["The explicit formula","Apply a complex inversion integral to −ζ′(s)/ζ(s) to recover ψ. Moving the integration contour encounters poles at the zeros of ζ and at s = 1. Their residues produce the terms −x^ρ/ρ and x; the trivial zeros and the origin supply the logarithmic corrections. This is why the zeros control the distribution of prime powers. The infinite sum is interpreted symmetrically, with midpoint values at jumps."],
 bigO:["Big-O notation","f(x) = O(g(x)) means that for some constants C and x₀, |f(x)| ≤ C|g(x)| whenever x ≥ x₀. Thus the RH prime-counting bound is an upper bound on the magnitude of the error for all sufficiently large x, not an equality or a numerical approximation."]
 };
 const dialog=$("concept-dialog"),close=$("concept-close");let trigger=null;
 for(const link of document.querySelectorAll("a[data-concept]"))link.addEventListener("click",ev=>{if(ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey||typeof dialog.showModal!=="function")return;const entry=entries[link.dataset.concept];if(!entry)return;ev.preventDefault();trigger=link;out("concept-title",entry[0]);$("concept-body").textContent=entry[1];$("concept-source").href=link.href;dialog.showModal();close.focus()});
 close.addEventListener("click",()=>dialog.close());dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener("close",()=>trigger?.focus());
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
