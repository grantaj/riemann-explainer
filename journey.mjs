// Shared, deterministic teaching calculations. Exact integers use BigInt; plotting uses floating point.
export const GAMMA=.5772156649015329,CHI_CONSTANT=-1.520227887516;
export function mainTerm(a=10000,weights=[.05,.05,.05,.05,10,.05,.05,.05]){return a*(Math.log(a)-1-GAMMA+CHI_CONSTANT-weights.reduce((s,w)=>s+Math.log(w),0)/weights.length)}
export function lemNumbers(N=201){
 const a=Array(N+1).fill(0n),choose=Array.from({length:N+1},()=>[]);a[1]=1n;
 for(let n=0;n<=N;n++){choose[n][0]=choose[n][n]=1n;for(let k=1;k<n;k++)choose[n][k]=choose[n-1][k-1]+choose[n-1][k]}
 // Recurrence for f''=-2 f^3, with only orders 1 mod 4 nonzero.
 for(let n=3;n+2<=N;n+=4){let s=0n;for(let i=1;i<=n;i+=4)for(let j=1;j<=n-i;j+=4){let k=n-i-j;if(k>=1&&k%4===1)s+=choose[n][i]*choose[n-i][j]*a[i]*a[j]*a[k]}a[n+2]=-2n*s}
 return a;
}
export function valuationBig(n,p){let v=0,q=BigInt(p);if(n===0n)return Infinity;while(n%q===0n){v++;n/=q}return v}
export function logBig(n){const s=(n<0n?-n:n).toString();return Math.log(Number(s.slice(0,15)))+Math.max(0,s.length-15)*Math.LN10}
export function primes(n){let a=new Uint8Array(n+1);a.fill(1,2);for(let p=2;p*p<=n;p++)if(a[p])for(let j=p*p;j<=n;j+=p)a[j]=0;return Array.from(a.keys()).filter(i=>a[i])}
export function factorialBudget(n){let size=0,smooth=0,exact=0,psi=0;for(let i=2;i<=n;i++)size+=Math.log(i);for(const p of primes(n))for(let r=p;r<=n;r*=p){const w=Math.log(p);smooth+=w*n/r;exact+=w*Math.floor(n/r);psi+=w}return {size,smooth,exact,psi,loss:smooth-exact}}
export function lemBudget(n,A){const data=primes(n).filter(p=>p%2===1).map(p=>({p,v:valuationBig(A,p),pred:n*p/(p*p-1),inert:p%4===3}));let log=logBig(A),actual=0,guaranteed=0,smooth=0;for(const q of data)if(q.inert){actual+=q.v*Math.log(q.p);guaranteed+=Math.floor(q.pred)*Math.log(q.p);smooth+=q.pred*Math.log(q.p)}return {data,log,actual,guaranteed,smooth}}
export function arc(t){ // Substitute u=1-v² to remove the endpoint square-root singularity.
 let lo=Math.sqrt(1-t),N=800,s=0;for(let i=0;i<N;i++){let v=lo+(1-lo)*(i+.5)/N,u=1-v*v;s+=2/Math.sqrt(1+u+u*u+u*u*u)}return s*(1-lo)/N}
export const geo=(u,n)=>{let s=0,p=1;for(let i=0;i<n;i++){s+=p;p*=u}return s};
export function weightsUpTo(x){let a=[];for(const p of primes(x))for(let r=p;r<=x;r*=p)a.push({r,p,w:Math.log(p),prime:r===p});return a.sort((a,b)=>a.r-b.r)}
export const centered=(totals,count)=>{let M=mainTerm(),v=totals.map(p=>p-M);return {M,v,mean:v.slice(0,count).reduce((s,x)=>s+x,0)/count}};
export const budgetPowers=(l,a)=>[1-a,1+a-4.5,a,.5].map(e=>l*(e-.5));
export const limitExponents=(beta,eps,C=9)=>({beta,theta:.5+C*eps,excluded:.5+C*eps<beta});
if(typeof document!=="undefined"){
 const $=id=>document.getElementById(id),num=id=>Number($(id).value),put=(id,s)=>$(id).textContent=s;
 const A="#6edccc",B="#f6b86e",C="#b7a5fb",M="#a0b2bc",L="#34434c",W="#e9efed",BG="#0d1218";
 const fix=(x,n=2)=>Number(x).toFixed(n),fmt=(x,n=2)=>Number(x).toLocaleString("en-AU",{maximumFractionDigits:n});
 const text=(x,y,t,c=M,anchor="middle",size=14)=>'<text x="'+x+'" y="'+y+'" fill="'+c+'" text-anchor="'+anchor+'" font-size="'+size+'">'+t+'</text>';
 const line=(x1,y1,x2,y2,c=L,d="",w=1)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+w+'"'+(d?' stroke-dasharray="'+d+'"':'')+'/>';
 const rect=(x,y,w,h,c,o=1)=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(0,w)+'" height="'+Math.max(0,h)+'" rx="3" fill="'+c+'" opacity="'+o+'"/>';
 const circle=(x,y,r,c,o=1)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" opacity="'+o+'"/>';
 const path=(p,c,w=2)=>'<polyline points="'+p.map(q=>q.join(",")).join(" ")+'" fill="none" stroke="'+c+'" stroke-width="'+w+'"/>';
 const draw=(id,s)=>$(id).innerHTML=s;
 const on=(ids,fn)=>{if(!$(ids[0]))return;for(const id of ids)$(id).addEventListener("input",fn);fn()};
 function barRows(v,names,colors,H){const max=Math.max(1,...v.map(Math.abs)),row=(H-8)/v.length,X=x=>205+325*x/max;let s=line(X(0),0,X(0),H,L);for(let i=0;i<v.length;i++){let y=6+i*row;s+=text(5,y+15,names[i],M,"start",13)+rect(Math.min(X(0),X(v[i])),y,Math.abs(X(v[i])-X(0)),Math.min(19,row-5),colors[i])+text(595,y+15,fmt(v[i],1),W,"end",13)}return s}
 on(["continue-u","continue-n"],()=>{
 const u=num("continue-u"),n=num("continue-n"),s=geo(u,n),r=u===1?Infinity:1/(1-u),X=v=>45+(v+1.8)/3.8*535,Y=v=>90-74*Math.max(-8,Math.min(8,v))/8;
 let g=rect(X(-1),13,X(1)-X(-1),155,A,.06)+line(45,Y(0),580,Y(0),L)+line(X(1),13,X(1),168,B,"4 4");
 for(let t of [-1,0,1,2])g+=text(X(t),184,t);g+=text(310,204,"u (shaded: series converges)",M,"middle",12);
 const points=Array.from({length:301},(_,i)=>-1.8+3.8*i/300);g+=path(points.map(x=>[X(x),Y(geo(x,n))]),A);
 for(const side of [-1,1])g+=path(points.filter(x=>side*(x-1)>.015).map(x=>[X(x),Y(1/(1-x))]),B);
 g+=line(X(u),13,X(u),168,M,"3 3")+circle(X(u),Y(s),5,A);if(Number.isFinite(r))g+=circle(X(u),Y(r),5,B);
 draw("continue-plot",g+text(53,12,"Partial sum",A,"start",12)+text(580,12,"Rational formula",B,"end",12));put("continue-u-val",fix(u));put("continue-n-val",n);put("continue-stat",Math.abs(u)<1?"Series converges":"Outside convergence region");put("continue-detail","Partial sum = "+fmt(s,3)+"; rational formula = "+(Number.isFinite(r)?fmt(r,3):"undefined (pole)")+". "+(Math.abs(u)<1?"More terms approach the rational value.":"The finite sums do not converge to the continuation."));
 });
 on(["weight-x"],()=>{const x=num("weight-x"),v=weightsUpTo(x),X=n=>48+530*(n-2)/38,Y=w=>177-115*w/Math.log(41);let g=line(48,177,578,177,L);
 for(const t of [2,10,20,30,40])g+=text(X(t),196,t);
 for(const q of v){let c=q.prime?A:B;g+=rect(X(q.r)-4,Y(q.w),8,177-Y(q.w),c);if(x<=12)g+=text(X(q.r),Y(q.w)-6,q.r,M,"middle",11)}
 g+=text(48,12,"Prime (teal) · higher power (orange)",M,"start",12);draw("weight-plot",g);
 put("weight-x-val",x);put("weight-stat",v.length+" prime powers");put("weight-detail","π("+x+") = "+v.filter(q=>q.prime).length+"; ψ("+x+") = "+fmt(v.reduce((s,q)=>s+q.w,0),3)+". Each bar contributes log p.");
 });
 on(["floor-n"],()=>{let n=num("floor-n"),v=factorialBudget(n),max=Math.max(v.smooth,v.size),X=x=>140+390*x/max;let g="";
 for(let [i,label,w,c] of [[0,"Smooth sum",v.smooth,B],[1,"log(n!)",v.size,A],[2,"Floor loss",v.loss,C]]){let y=12+i*57;g+=text(5,y+20,label,M,"start",13)+rect(140,y,390*w/max,22,c)+text(595,y+20,fmt(w,1),W,"end",13)}
 g+=text(300,205,"Floor loss / n = "+fix(v.loss/n,3),C);draw("floor-plot",g);put("floor-n-val",n);put("floor-stat","Loss "+fmt(v.loss,1));put("floor-detail","The exact floor sum is "+fmt(v.exact,3)+", equal to log(n!). The smooth sum is "+fmt(v.smooth,3)+". The missing "+fmt(v.loss,3)+" is "+fix(v.loss/Math.sqrt(n),2)+" × √n.");
 });
 on(["lem-t"],()=>{let t=num("lem-t"),X=x=>300+220*x,Y=y=>125-220*y,pts=(sign,side)=>Array.from({length:121},(_,i)=>{let r=i/120,th=.5*Math.acos(r*r);return [X(sign*r*Math.cos(th)),Y(side*r*Math.sin(th))]});let g=line(50,125,550,125,L)+line(300,15,300,235,L);
 for(let a of [-1,1])for(let b of [-1,1])g+=path(pts(a,b),M);
 const arcPts=Array.from({length:101},(_,i)=>{let r=t*i/100,th=.5*Math.acos(r*r);return [X(r*Math.cos(th)),Y(r*Math.sin(th))]});let [x,y]=arcPts.at(-1);g+=path(arcPts,A,4)+line(300,125,x,y,B,"4 3",2)+circle(x,y,6,A)+text(310,233,"Arc length s = "+fix(arc(t),4)+" · radius t = "+fix(t),A);
 draw("lem-curve",g);put("lem-t-val",fix(t));put("lem-arc-stat","sl(s) = "+fix(t));put("lem-arc-detail","Distance along the highlighted curve: s ≈ "+fix(arc(t),5)+". The inverse relation sl(s)=t defines the real lemniscate sine on this arc.");
 });
 if($("lem-n")){
 const seq=lemNumbers();on(["lem-n"],()=>{const n=num("lem-n"),v=lemBudget(n,seq[n]),ps=[3,5,7,11,13,19,23,29],d=ps.map(p=>({p,v:valuationBig(seq[n],p),pred:p%4===3?n*p/(p*p-1):0,inert:p%4===3})),max=Math.max(1,...d.map(q=>Math.max(q.v,q.pred))),X=i=>65+70*i,Y=y=>190-150*y/max;let g=line(38,190,585,190,L);
 d.forEach((q,i)=>{let x=X(i);g+=rect(x-18,Y(q.v),20,190-Y(q.v),q.inert?A:B)+line(x+5,Y(q.pred),x+25,Y(q.pred),C,"",3)+text(x,210,q.p,M)+text(x-8,Math.max(20,Y(q.v)-5),q.v,W,"middle",12)});
 g+=text(45,14,"Actual exponent",A,"start",12)+text(580,14,"Inert prediction (purple)",C,"end",12);draw("lem-val",g);
 draw("lem-size",barRows([v.log,v.actual,v.guaranteed,v.smooth-v.guaranteed],["log |Aₙ|","Inert factors ≤ n","Guaranteed floors","Rounding loss"],[B,A,C,M],190));
 put("lem-n-val",n);put("lem-number-stat","n = "+n);put("lem-number-detail","Known inert factors explain "+fix(v.log?100*v.actual/v.log:0,1)+"% of log |Aₙ|. Rounding discards "+fmt(v.smooth-v.guaranteed,2)+" log units in the guaranteed bound. Split primes have no forced lower bound.");
 put("lem-integer","A"+n+" = "+seq[n].toString());
 });}
 if($("center-count")){
 // Compute all four actual prime-power sums independently of the displayed table.
 const P=[1,3,5,7].map(u=>{let sum=0;for(const p of primes(200000)){if(p===2||p===11)continue;for(let r=p;r<=200000;r*=p){let a=legendre(11,r),b=legendre(1319,r),k=r%16,col=Math.min(k,16-k),w=a===1&&col===u?10:.05;sum+=(1-b)*Math.log(p)*Math.max(10000/r-w,0)}}return sum});
 on(["center-count"],()=>{const count=num("center-count"),v=centered(P,count),max=340,Y=w=>112-82*w/max;let g=line(48,112,578,112,L);for(let t of [-300,-150,150,300])g+=line(48,Y(t),578,Y(t),L)+text(40,Y(t)+4,t,M,"end",12);
 v.v.forEach((w,i)=>{let x=95+i*130;g+=rect(x-29,Math.min(Y(w),112),58,Math.abs(Y(w)-112),w>0?B:A,i<count?1:.18)+text(x,Math.max(15,Math.min(207,Y(w)+(w>0?-8:16))),fix(w,2),i<count?W:M,"middle",12)+text(x,231,"±"+(1+2*i))});
 g+=line(48,Y(v.mean),578,Y(v.mean),C,"5 4",2)+text(580,Math.max(15,Y(v.mean)-8),"mean "+fix(v.mean,2),C,"end",13);draw("center-plot",g);
 let pm=v.M+v.mean;draw("center-mean",text(10,22,"Mean P",M,"start")+text(590,22,fmt(pm,4),W,"end")+text(10,55,"Independent M",M,"start")+text(590,55,fmt(v.M,4),W,"end")+line(10,69,590,69,L)+text(10,103,"Mean excess P−M",C,"start",18)+text(590,103,fix(v.mean,4),C,"end",18));
 put("center-count-val",count+" / 4");put("center-stat","Mean excess "+fix(v.mean,4));put("center-detail","The "+count+" selected translations have average excess "+fix(v.mean,4)+". "+(count===4?"All columns are now represented equally; positive and negative discrepancies nearly cancel in this example.":"Add more translations to see how the average changes."));
 });}
 function legendre(p,r){let v=r%p;if(!v)return 0;let z=1,e=(p-1)/2;while(e){if(e%2)z=z*v%p;v=v*v%p;e=Math.floor(e/2)}return z===1?1:-1}
 on(["budget-x","budget-m"],()=>{let l=num("budget-x"),a=num("budget-m"),v=budgetPowers(l,a),min=Math.min(-1,...v),max=Math.max(1,...v),X=w=>175+360*(w-min)/(max-min);let g=line(X(0),8,X(0),195,A,"5 4",2),names=["x/m","xm/k","m","k/n²"];v.forEach((w,i)=>{let y=14+44*i;g+=text(6,y+16,names[i],M,"start")+rect(Math.min(X(w),X(0)),y,Math.abs(X(w)-X(0)),20,w>0?B:A)+text(595,y+16,"10^"+fix(w,1),W,"end",13)});g+=text(X(0),220,"√x",A);draw("budget-plot",g);put("budget-x-val","10^"+l);put("budget-m-val",fix(a));put("budget-stat","Largest exponent "+fix(Math.max(1-a,a,.5,1+a-4.5)));put("budget-detail","All four terms are ≤ square-root scale exactly when the largest displayed ratio is ≤1. At a=½ the first, third and fourth terms match √x; the rank correction is much smaller.");});
 on(["limit-beta","limit-eps"],()=>{const b=num("limit-beta"),e=num("limit-eps"),v=limitExponents(b,e),X=x=>50+520*(x-.5)/.5;let g=line(X(.5),95,X(1),95,L)+line(X(.5),35,X(.5),140,A,"4 4")+line(X(b),36,X(b),135,B,"",2)+line(X(v.theta),36,X(v.theta),135,C,"",2)+rect(X(.5),82,Math.max(0,X(v.theta)-X(.5)),26,C,.16)+text(X(.5),160,"½",A)+text(X(1),160,"1",M)+text(X(b),24,"β "+fix(b),B)+text(X(v.theta),148,"θ "+fix(v.theta,3),C);
 draw("limit-plot",g);put("limit-beta-val",fix(b));put("limit-eps-val",fix(e,3));put("limit-stat",v.excluded?"Exponent strictly below β":"Choose smaller ε");put("limit-detail","The resulting bound has exponent "+fix(v.theta,3)+". "+(v.excluded?"A complete-window bound with an exponent between this and β excludes the hypothetical zero.":"The bound does not yet exclude this candidate; reduce ε."));
 });
 document.documentElement.dataset.journeyReady="true";
}
