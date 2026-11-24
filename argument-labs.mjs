// Exact small models and proof-specific calculations for Part III. Importable in Node.
import {chi, residueTable} from "./argument.mjs";
export function reflections(b,t){return [[b,t],[1-b,t],[b,-t],[1-b,-t]].filter((v,i,a)=>a.findIndex(w=>Math.abs(w[0]-v[0])<1e-12&&w[1]===v[1])===i)}
export function poleRatio(beta,j,theta=.6,sigma=3){return (j+1)*Math.log10((sigma-theta)/(sigma-beta))}
export function characterRamps(x,q=11,d=1319){
 const cells=[0,0,0,0,0],terms=[0,0,0,0],points=[];
 const s=new Uint8Array(x+1);s.fill(1,2);for(let p=2;p*p<=x;p++)if(s[p])for(let i=p*p;i<=x;i+=p)s[i]=0;
 for(let p=3;p<=x;p+=2)if(p!==q&&s[p])for(let n=p;n<=x;n*=p){
 const u=chi(q,n),v=chi(d,n),w=Math.log(p)*(x/n-1),z=(1+u)*(1-v),i=v===0?4:(u===1?0:2)+(v===1?0:1);
 cells[i]+=w;terms[0]+=w;terms[1]+=u*w;terms[2]-=v*w;terms[3]-=u*v*w;points.push({n,u,v,w,z,i});
 }
 return {cells,terms,points,combined:points.reduce((a,b)=>a+b.z*b.w,0)};
}
export const matrices=[[[2,1],[0,1]],[[1,0],[1,2]]];
export const multiply=(a,b)=>a.map((r,i)=>b[0].map((_,j)=>r.reduce((s,v,k)=>s+v*b[k][j],0)));
export const det=m=>m[0][0]*m[1][1]-m[0][1]*m[1][0];
export function chainMatrices(word){const list=[[[1,0],[0,1]]];for(const k of word)list.push(multiply(matrices[k],list.at(-1)));return list}
export function valuations(p,a){const terms=[];for(let h=1,n=p;n<=a;n*=p,h++)terms.push({h,n,v:Math.floor(a/n)});const fact=terms.reduce((s,t)=>s+t.v,0),loss=Math.floor((a-1)/(p*p-1));return {terms,fact,loss,remain:fact-loss,odd:a*p/(p*p-1)}}
export function latticeBounds(a,b,d){const trace=a*a+b*b+d*d,index=a*d,op2=(trace+Math.sqrt(Math.max(0,trace*trace-4*index*index)))/2;return {index,hadamard:a*Math.hypot(b,d),op2}}
export function gramStats(c,n=6){return {gram:Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?1:c)),spectrum:[1+(n-1)*c,...Array(n-1).fill(1-c)],effective:n/(1+(n-1)*c*c),rank:c===1?1:n}}
export const gcd=(a,b)=>b?gcd(b,a%b):a;
export function glue(a,b){const first=2**a*3**b,second=2**b*3**a;return {first,second,common:gcd(first,second),exps:[a,b,Math.min(a,b)]}}
export function sphereSet(radius,all=false){
 const points=[];for(let z=0;z<=4;z++)for(let y=0;y<=4;y++)for(let x=0;x<=4;x++)if(all||x*x+y*y+z*z===radius)points.push({x,y,z,n:x+10*y+100*z});
 const sorted=points.map(p=>p.n).sort((a,b)=>a-b),set=new Set(sorted);let count=0,example=null;
 for(let i=0;i<sorted.length;i++)for(let j=i+1;j<sorted.length;j++){let a=sorted[i],b=sorted[j],c=2*b-a;if(set.has(c)){count++;example??=[a,b,c]}}
 return {points,sorted,count,example};
}
export const fitsWindow=a=>a>=1&&1.5*a<=2+1e-12;
export function translatedTotals(){return [1,3,5,7].map(u=>residueTable(u).reduce((a,b)=>a+b,0))}
if(typeof document!=="undefined"){
 const $=id=>document.getElementById(id),num=id=>Number($(id).value),put=(id,s)=>$(id).textContent=s;
 const A="#6edccc",B="#f6b86e",C="#b7a5fb",M="#a0b2bc",L="#34434c",W="#e9efed",BG="#0d1218";
 const fmt=(x,d=2)=>Number(x).toLocaleString("en-AU",{maximumFractionDigits:d}),fix=(x,d=2)=>Number(x).toFixed(d);
 const line=(x1,y1,x2,y2,c=L,dash="",width=1)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+width+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
 const txt=(x,y,s,c=M,anchor="middle",size=14)=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" text-anchor="'+anchor+'" font-size="'+size+'">'+s+'</text>';
 const circle=(x,y,r,c,fill=c,opacity=1)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" stroke="'+c+'" fill="'+fill+'" opacity="'+opacity+'"/>';
 const rect=(x,y,w,h,c,opacity=1,stroke="none")=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(0,w)+'" height="'+Math.max(0,h)+'" rx="3" fill="'+c+'" opacity="'+opacity+'" stroke="'+stroke+'"/>';
 const poly=(p,c,fill="none",opacity=1,width=2)=>'<polygon points="'+p.map(q=>q.join(",")).join(" ")+'" stroke="'+c+'" stroke-width="'+width+'" fill="'+fill+'" opacity="'+opacity+'"/>';
 const path=(p,c,width=2)=>'<polyline points="'+p.map(q=>q.join(",")).join(" ")+'" fill="none" stroke="'+c+'" stroke-width="'+width+'"/>';
 const draw=(id,s)=>$(id).innerHTML=s;
 function on(ids,fn){for(const id of ids)$(id).addEventListener("input",fn);fn()}
 function horizontal(values,names,colors,height=160){const max=Math.max(1,...values.map(Math.abs)),row=(height-15)/values.length,X=v=>315+210*v/max;let s=line(X(0),3,X(0),height-10,M);values.forEach((v,i)=>{let y=i*row+8;s+=txt(5,y+17,names[i],M,"start",13)+rect(Math.min(X(0),X(v)),y,Math.abs(X(v)-X(0)),20,colors[i])+txt(595,y+16,fmt(v),W,"end",13)});return s}
 // The visual dependency graph is itself the chapter navigation.
 function route(){
 const mobile=typeof matchMedia!=="undefined"&&matchMedia("(max-width: 600px)").matches;
 let nodes,s="";
 if(mobile){
  $("route-plot").setAttribute("viewBox","0 0 360 465");
  nodes=[["conclusion",70,4,220,37,"RH / symmetry"],["window",70,53,220,37,"One-sided windows"],["comparison",70,102,220,37,"Prime comparison"],["main-inequality",70,151,220,37,"Main inequality (M)"],["theta-chain",5,216,166,35,"Theta chain"],["local-gain",189,216,166,35,"Divisibility"],["size",5,266,166,35,"Size"],["rank",189,266,166,35,"Rank"],["denominators",97,316,166,35,"Denominators"],["hosts",70,407,220,37,"Arithmetic supply"]];
  for(let i=0;i<3;i++)s+=line(180,nodes[i][2]+37,180,nodes[i+1][2],M,"",2);
  s+=line(180,188,180,204,M)+line(88,204,272,204,M)+line(88,204,88,216,M)+line(272,204,272,216,M);
  s+=line(180,204,180,316,M)+line(171,283,189,283,M)+line(180,351,180,407,L);
  s+=line(5,233,1,233,L)+line(1,233,1,378,L)+line(355,233,359,233,L)+line(359,233,359,378,L)+line(5,283,1,283,L)+line(355,283,359,283,L)+line(1,378,359,378,L);
 }else{
  $("route-plot").setAttribute("viewBox","0 0 600 310");
  nodes=[["conclusion",210,5,180,38,"RH / symmetry"],["window",210,61,180,38,"One-sided windows"],["comparison",210,117,180,38,"Prime comparison"],["main-inequality",210,173,180,38,"Main inequality (M)"],["theta-chain",3,234,114,33,"Theta chain"],["local-gain",123,234,114,33,"Divisibility"],["size",243,234,114,33,"Size"],["rank",363,234,114,33,"Rank"],["denominators",483,234,114,33,"Denominators"],["hosts",210,280,180,27,"Arithmetic supply"]];
  for(let i=0;i<3;i++)s+=line(300,nodes[i][2]+38,300,nodes[i+1][2],M,"",2);s+=line(300,211,300,222,M)+line(60,222,540,222,M);for(let x of [60,180,300,420,540])s+=line(x,222,x,234,M)+line(x,267,x,273,L);s+=line(60,273,540,273,L)+line(300,273,300,280,L);
 }
 for(const [id,x,y,w,h,label] of nodes)s+='<a href="#'+id+'" data-proof-node="'+id+'" aria-label="'+label+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="'+BG+'" stroke="'+(id==="main-inequality"?B:A)+'"/>'+txt(x+w/2,y+h/2+5,label,W,"middle",mobile?14:id==="denominators"?12:14)+'</a>';
 draw("route-plot",s);
 }route();if(typeof matchMedia!=="undefined")matchMedia("(max-width: 600px)").addEventListener("change",route);
 on(["reflect-beta","reflect-exclude"],()=>{
 const b=num("reflect-beta"),excluded=$("reflect-exclude").checked,pts=reflections(b,.65),X=v=>70+460*v,Y=v=>112-105*v;
 let s=rect(X(0),15,460,194,BG)+rect(X(.5),15,230,194,excluded?B:A,excluded?.15:.05)+line(X(0),15,X(0),209,L)+line(X(1),15,X(1),209,L)+line(X(.5),15,X(.5),209,A,"5 5",2)+line(70,Y(0),530,Y(0),L);
 for(const x of [0,.5,1])s+=txt(X(x),232,String(x));s+=txt(540,232,"Re(s)",M,"start",13)+txt(10,23,"Im(s)",M,"start",13);
 if(Math.abs(b-.5)>1e-10)s+=line(X(b),Y(.65),X(1-b),Y(.65),M,"4 4")+line(X(b),Y(-.65),X(1-b),Y(-.65),M,"4 4");
 for(let i=0;i<pts.length;i++){let [x,y]=pts[i],c=i===0?A:B;s+=circle(X(x),Y(y),6,c);if(excluded&&x>.5)s+=line(X(x)-10,Y(y)-10,X(x)+10,Y(y)+10,W,"",2)+line(X(x)-10,Y(y)+10,X(x)+10,Y(y)-10,W,"",2)}
 draw("reflect-plot",s);put("reflect-beta-val",fix(b));const bad=excluded&&b!==.5;put("reflect-stat",bad?"Contradiction":excluded?"On the line":pts.length+" symmetric points");put("reflect-detail",bad?"A forced partner has Re(s) = "+fix(Math.max(b,1-b))+" > ½. Right-half nonvanishing excludes the whole candidate.":b===.5?"Reflection leaves the real part unchanged. These points are not excluded by right-half nonvanishing.":"Reflection sends β = "+fix(b)+" to 1−β = "+fix(1-b)+".");
 });
 on(["pole-beta","pole-order"],()=>{
 const b=num("pole-beta"),j=num("pole-order"),s=3,t=.6,Y=205,xx=370,rad=(s-t)*76;
 const scale=76,px=v=>xx+scale*(v-s);
 let d=line(px(-.5),Y,xx+185,Y,L)+line(px(t),18,px(t),389,A,"4 4")+circle(xx,Y,rad,A,"none",.75)+line(px(b),Y,xx,Y,B,"",2)+circle(px(b),Y,6,B)+circle(xx,Y,5,W)+txt(px(t),16,"θ = 0.60",A)+txt(px(b),Y-13,"ρ",B)+txt(xx,Y-13,"σ = 3",W)+txt((px(b)+xx)/2,Y+20,"d = "+fix(s-b),B)+txt(xx,412,"Allowed radius σ−θ = 2.40",A);
 // Recenter diagram so both sides of the circle are visible.
 draw("pole-plane",d);
 const ratios=Array.from({length:121},(_,i)=>poleRatio(b,i)),min=Math.min(0,...ratios)-.15,max=Math.max(0,...ratios)+.15,x=k=>48+530*k/120,y=v=>147-120*(v-min)/(max-min);
 let g=line(48,y(0),578,y(0),A)+line(48,15,48,147,L)+path(ratios.map((v,i)=>[x(i),y(v)]),B)+line(x(j),15,x(j),147,M,"4 4")+circle(x(j),y(ratios[j]),5,B);for(let k of [0,30,60,90,120])g+=txt(x(k),172,String(k));g+=txt(48,13,fix(max,1),M,"start",12)+txt(48,145,fix(min,1),M,"start",12)+txt(578,172,"j",M,"end",13)+txt(300,13,"log₁₀(coefficient / bound)",M,"middle",12);
 draw("pole-growth",g);put("pole-beta-val",fix(b));put("pole-order-val",j);put("pole-stat",b>t?"Pole inside allowed radius":b===t?"At threshold":"No contradiction from this bound");put("pole-detail","Single-pole coefficient / allowed scale = 10^"+fix(poleRatio(b,j))+". "+(b>t?"Increasing the derivative order eventually defeats any fixed multiplicative constant.":"This candidate does not violate the selected exponent θ."));
 });
 on(["filter-x","filter-view"],()=>{
 const x=num("filter-x"),f=characterRamps(x),only=$("filter-view").value==="selected",X=n=>90+480*n/x;
 let s="";const names=["(+,+)","(+,−)","(−,+)","(−,−)","χd = 0"];
 for(let i=0;i<5;i++){let y=22+i*36;s+=txt(5,y+4,names[i],i===1?A:M,"start",13)+line(90,y,570,y,L)}
 const max=Math.max(1,...f.points.map(p=>p.w));for(const p of f.points){if(only&&!p.z)continue;let y=22+p.i*36,c=p.z?A:B,r=1.5+4*Math.sqrt(p.w/max);s+=circle(X(p.n),y,r,c,c,p.z?.88:.5)}
 for(let i=0;i<=4;i++)s+=txt(X(x*i/4),216,fmt(x*i/4,0),M,"middle",12);draw("filter-plot",s);
 draw("filter-bars",horizontal([...f.terms,f.combined],["G raw","+ χq","− χd","− η","Combined"],[A,C,B,B,A],175));
 put("filter-x-val",x);put("filter-stat","Retained "+f.points.filter(p=>p.z).length+" / "+f.points.length);put("filter-detail","Four signed sums add to "+fmt(f.terms.reduce((s,v)=>s+v,0),3)+". Direct filtered sum: "+fmt(f.combined,3)+". Only the (+,−) class and applicable exceptional terms survive.");
 });
 // Extend the original table without changing its published values.
 const totals=translatedTotals(),mean=totals.reduce((s,v)=>s+v,0)/4,cols=[1,3,5,7];
 function cells(){let u=num("cell-u"),v=residueTable(u),max=Math.max(...v),s="";v.forEach((w,i)=>{let x=36+70*i,h=125*w/max,c=i>=4&&cols[i-4]===u?B:A;s+=rect(x,145-h,44,h,c)+txt(x+22,162,(i<4?"−":"+")+cols[i%4],M)+txt(x+22,Math.max(13,138-h),fmt(w/1000,1)+"k",W,"middle",12)});s+=line(22,145,590,145,L);draw("cell-bars",s);
 const min=Math.min(...totals)-100,maxv=Math.max(...totals)+100,Y=v=>138-105*(v-min)/(maxv-min);s=line(48,Y(mean),580,Y(mean),A,"4 4",2)+txt(580,Y(mean)-6,"mean "+fmt(mean,1),A,"end",12);totals.forEach((w,i)=>{const x=100+i*130;s+=line(x,138,x,Y(w),L)+circle(x,Y(w),7,cols[i]===u?B:C)+txt(x,Math.max(13,Y(w)-12),fmt(w,1),W,"middle",12)+txt(x,160,"±"+cols[i])});draw("cell-mean",s)}
 $("cell-u").addEventListener("input",cells);$("cell-u").addEventListener("change",cells);cells();
 const word=[0,0,1,0];
 function chain(){let list=chainMatrices(word),s="",last=list.at(-1);for(let i=0;i<4;i++){let b=$("chain-"+i);b.textContent="Stage "+(i+1)+": "+(word[i]?"B":"A");b.setAttribute("aria-pressed",String(!!word[i]))}
 for(let i=0;i<5;i++){let m=list[i],ox=60+i*120,oy=160,scale=40/Math.max(1,m[0][0]+m[0][1],m[1][0]+m[1][1]),p=[[0,0],[m[0][0],m[1][0]],[m[0][0]+m[0][1],m[1][0]+m[1][1]],[m[0][1],m[1][1]]].map(([x,y])=>[ox+scale*x-20,oy-scale*y]);s+=rect(ox-50,50,100,125,BG,1,L)+poly(p,A,A,.25)+poly(p,A)+txt(ox,30,i===0?"Source":"After "+i,W)+txt(ox,197,"index "+det(m),A,"middle",13)+txt(ox,216,"["+m[0].join(", ")+"]",M,"middle",12)+txt(ox,233,"["+m[1].join(", ")+"]",M,"middle",12);if(i<4)s+=txt(ox+60,111,"→",B,"middle",18)}
 draw("chain-plot",s+txt(300,257,"Squares individually rescaled to show shape",M,"middle",12));
 const max=Math.max(4,last[0][0]+last[0][1],last[1][0]+last[1][1]),sc=184/max,X=x=>72+x*sc,Y=y=>210-y*sc;let g="";for(let i=0;i<=max;i++)for(let j=0;j<=max;j++)g+=circle(X(i),Y(j),1.5,L);for(let i=-max;i<=max;i++)for(let j=-max;j<=max;j++){let x=last[0][0]*i+last[0][1]*j,y=last[1][0]*i+last[1][1]*j;if(x>=0&&x<=max&&y>=0&&y<=max)g+=circle(X(x),Y(y),4,A)}let p=[[0,0],[last[0][0],last[1][0]],[last[0][0]+last[0][1],last[1][0]+last[1][1]],[last[0][1],last[1][1]]].map(([x,y])=>[X(x),Y(y)]);g+=poly(p,B,B,.22)+poly(p,B);g+=txt(310,70,"Composite "+word.map(k=>k?"B":"A").join(" → "),W,"start")+txt(310,99,"det = "+det(last),A,"start")+txt(310,124,"Same target ℤ²",M,"start");draw("chain-lattice",g);
 put("chain-stat","Index "+det(last)+" · "+word.map(k=>k?"B":"A").join(""));put("chain-detail","Composite matrix = [ "+last[0].join(", ")+" ; "+last[1].join(", ")+" ]. All 16 words have determinant 16, but their images need not agree.");
 }for(let i=0;i<4;i++)$("chain-"+i).addEventListener("click",()=>{word[i]^=1;chain()});chain();
 on(["valuation-p","valuation-a"],()=>{
 const p=num("valuation-p"),a=num("valuation-a"),v=valuations(p,a),max=Math.max(1,v.terms[0]?.v||0),row=210/Math.max(1,v.terms.length);
 let s="";v.terms.forEach((t,i)=>{let y=12+i*row;s+=txt(5,y+16,p+"^"+t.h,M,"start",14)+rect(85,y,430*t.v/max,Math.min(22,row-4),t.h%2?A:B)+txt(590,y+16,fmt(t.v,0),W,"end")});draw("valuation-plot",s+txt(300,248,"Exact floors ⌊a / pʰ⌋",M));
 draw("valuation-total",horizontal([v.fact,-v.loss,v.remain,v.odd],["Factorial","− loss","Remainder","Odd series"],[C,B,A,A],160));put("valuation-a-val",fmt(a,0));put("valuation-stat","Remaining ≥ "+fmt(v.remain,0));put("valuation-detail","vₚ(a!) = "+v.fact+"; coefficient loss at most "+v.loss+"; difference "+v.remain+". Leading odd-power sum = "+fmt(v.odd)+".");
 });
 on(["lattice-a","lattice-b","lattice-d"],()=>{
 const a=num("lattice-a"),b=num("lattice-b"),d=num("lattice-d"),v=latticeBounds(a,b,d),max=11,sc=24,X=x=>50+sc*x,Y=y=>262-sc*y;let s="";
 for(let i=0;i<=max;i++)for(let j=0;j<=10;j++)s+=circle(X(i),Y(j),2,L);
 for(let i=-max;i<=max;i++)for(let j=-max;j<=max;j++){let x=a*i+b*j,y=d*j;if(x>=0&&x<=max&&y>=0&&y<=10)s+=circle(X(x),Y(y),4,A)}
 const p=[[0,0],[a,0],[a+b,d],[b,d]].map(([x,y])=>[X(x),Y(y)]);s+=poly(p,B,B,.18)+poly(p,B);s+=line(X(0),Y(0),X(a),Y(0),A,"",3)+line(X(0),Y(0),X(b),Y(d),C,"",3)+txt(50,285,"0",M)+txt(325,285,"11",M)+txt(340,75,"Basis vectors",W,"start")+txt(340,101,"("+a+", 0)",A,"start")+txt(340,126,"("+b+", "+d+")",C,"start")+txt(340,171,"Area = "+v.index,B,"start",19)+txt(340,196,"Index = "+v.index,A,"start",19);
 draw("lattice-plot",s);draw("lattice-bounds",horizontal([v.index,v.hadamard,v.op2],["Index","Column norms","Norm²"],[A,B,C],130));
 for(let [id,z] of [["a",a],["b",b],["d",d]])put("lattice-"+id+"-val",z);put("lattice-stat","Index "+v.index);put("lattice-detail","Exact index "+v.index+" ≤ column norm product "+fmt(v.hadamard)+"; operator norm² "+fmt(v.op2)+". Both size estimates bound the index from above.");
 });
 on(["overlap-c"],()=>{
 const c=num("overlap-c"),v=gramStats(c),n=6,step=31;let s=txt(132,17,"Gram matrix",W)+txt(440,17,"Eigenvalues",W);
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){let z=v.gram[i][j];s+=rect(35+j*step,30+i*step,step-3,step-3,i===j?A:B,.12+.88*z,L);if(i===j||z>=.5)s+=txt(35+j*step+(step-3)/2,48+i*step,fix(z,1),i===j?BG:W,"middle",10)}
 const X=i=>290+i*46,Y=z=>216-28*z;v.spectrum.forEach((z,i)=>s+=rect(X(i),Y(z),30,28*z,i===0?B:A)+txt(X(i)+15,Math.max(30,Y(z)-5),fix(z,1),W,"middle",12));s+=line(282,216,578,216,L)+txt(132,240,"pairwise inner products",M)+txt(440,240,"sum = 6",M);s+=txt(300,269,"Effective-rank lower bound: "+fix(v.effective),A,"middle",17);draw("overlap-plot",s);
 put("overlap-c-val",fix(c));put("overlap-stat","Effective rank ≥ "+fix(v.effective));put("overlap-detail","Actual rank = "+v.rank+"; second-moment lower bound = "+fix(v.effective)+". The large shared eigenvalue consumes more of the total squared norm as overlap grows.");
 });
 on(["glue-a","glue-b"],()=>{
 const a=num("glue-a"),b=num("glue-b"),v=glue(a,b),lo=Math.min(a,b);let s="";const rows=[["First choice",a,b,A],["Second choice",b,a,B],["Sum",lo,lo,C]];
 for(let i=0;i<3;i++){let [n,p,q,col]=rows[i],y=46+i*58;s+=txt(8,y+18,n,M,"start",14);for(let k=0;k<5;k++)s+=rect(150+k*23,y,19,24,k<p?col:L)+rect(365+k*23,y,19,24,k<q?col:L);s+=txt(279,y+17,p,W)+txt(495,y+17,q,W)}
 s+=txt(203,27,"v₂",W)+txt(418,27,"v₃",W)+txt(300,231,"Take the minimum at each prime",C);draw("glue-plot",s);
 put("glue-a-val",a);put("glue-b-val",b);put("glue-stat","gcd = "+v.common);put("glue-detail",v.first+"ℤ + "+v.second+"ℤ = "+v.common+"ℤ. The combined lattice removes the excess local loss at both primes when the exponents differ.");
 });
 on(["behrend-r","behrend-all"],()=>{
 const r=num("behrend-r"),all=$("behrend-all").checked,v=sphereSet(r,all),set=new Set(v.sorted),example=new Set(v.example||[]);let s="";
 for(let z=0;z<=4;z++){let ox=25+120*z;s+=txt(ox+35,20,"z = "+z,W,"middle",13);for(let y=0;y<=4;y++)for(let x=0;x<=4;x++){let n=x+10*y+100*z,hit=set.has(n),c=example.has(n)?B:hit?A:L;s+=circle(ox+x*18,128-y*18,hit?5:2.7,c,c,hit?1:.65)}}
 s+=txt(300,167,"Each layer: x and y digits 0–4",M);draw("behrend-plot",s);
 const X=n=>30+540*n/444;s=line(30,58,570,58,L);for(let k=0;k<=4;k++)s+=txt(X(k*111),88,String(k*111),M,"middle",12);for(const n of v.sorted)s+=line(X(n),example.has(n)?15:34,X(n),58,example.has(n)?B:A,"",example.has(n)?3:1.5);draw("behrend-line",s);
 put("behrend-stat",v.points.length+" classes · "+v.count+" progressions");put("behrend-detail",v.count?"Example progression: "+v.example.join(", ")+". The full cube contains "+v.count+" distinct three-term progressions.":"The "+v.points.length+" encoded points lie on one sphere; exhaustive counting finds no nontrivial three-term progression.");
 });
 on(["host-window-a"],()=>{
 const a=num("host-window-a"),ok=fitsWindow(a),X=v=>52+(v-.7)*305;
 let s=txt(10,22,"Arithmetic",W,"start")+rect(X(1),30,X(2)-X(1),23,A,.7)+txt(X(1),69,"Y",A)+txt(X(2),69,"Y²",A)+txt(10,95,"Analytic",W,"start")+rect(X(a),104,X(1.5*a)-X(a),23,ok?C:B,.85)+txt(X(a),145,"Z",M)+txt(X(1.5*a),145,"Z^(3/2)",M);
 for(let v of [1,2])s+=line(X(v),26,X(v),130,M,"4 4");
 draw("host-window-plot",s);put("host-window-a-val",fix(a));put("host-window-stat",ok?"Entire window fits":"Not fully covered");put("host-window-detail","Analytic interval in log_Y coordinates: ["+fix(a)+", "+fix(1.5*a)+"]. "+(ok?"Every point is inside [1, 2].":"Part of this interval falls outside [1, 2]; an isolated overlap is not sufficient."));
 });
 document.documentElement.dataset.labsReady="true";
}