// Phase II: independent numerical models, no DOM on import in Node.
export function primeList(n){const a=[];for(let p=2;p<=n;p++){if(a.every(q=>q*q>p||p%q!==0))a.push(p)}return a}
export function primePowers(n){const a=[];for(const p of primeList(n)){for(let k=p;k<=n;k*=p)a.push([k,Math.log(p)])}return a.sort((a,b)=>a[0]-b[0])}
export function smoothError(x,powers=primePowers(Math.floor(x))){return powers.reduce((s,[n,w])=>n<=x?s+w*(x/n-1):s,0)-x*Math.log(x)+(1+.5772156649015329)*x}
export function binomialBounds(n){let logN=0;for(let i=1;i<=n;i++)logN+=Math.log((n+i)/i);const primes=primeList(2*n).filter(p=>p>n);return {primes,values:[primes.reduce((s,p)=>s+Math.log(p),0),logN,2*n*Math.log(2)]}}
export function gaussianFactors(p){const a=[];for(let i=-Math.floor(Math.sqrt(p));i<=Math.sqrt(p);i++)for(let j=-Math.floor(Math.sqrt(p));j<=Math.sqrt(p);j++)if(i*i+j*j===p)a.push([i,j]);return a}
export function thetaTerms(n,R=6){const a=[];for(let i=-R;i<=R;i++)for(let j=-R;j<=R;j++){let re=1,im=0;for(let k=0;k<n;k++)[re,im]=[re*i-im*j,re*j+im*i];let w=Math.exp(-Math.PI*(i*i+j*j));a.push({i,j,re:re*w,im:im*w})}return a}
export const ramp=(x,n)=>Math.max(x/n-1,0);
export const stageCost=(x,m)=>x/m+m;
if(typeof document!=="undefined"){
const $=id=>document.getElementById(id),num=id=>Number($(id).value),put=(id,s)=>$(id).textContent=s;
const A="#6edccc",B="#f6b86e",C="#b7a5fb",M="#a0b2bc",L="#34434c";
const line=(x1,y1,x2,y2,color=L)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'"/>';
const txt=(x,y,s,anchor="middle",color=M)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="13" text-anchor="'+anchor+'">'+s+'</text>';
const circle=(x,y,r,c,opacity=1)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" opacity="'+opacity+'"/>';
const rect=(x,y,w,h,c)=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(0,w)+'" height="'+h+'" rx="3" fill="'+c+'"/>';
const path=(p,c)=>'<polyline points="'+p.map(q=>q.join(",")).join(" ")+'" fill="none" stroke="'+c+'" stroke-width="2"/>';
const draw=(id,s)=>$(id).innerHTML=s;
const listen=(ids,fn)=>{for(const id of ids)$(id).addEventListener("input",fn);fn()};
const fmt=x=>x.toLocaleString("en-AU",{maximumFractionDigits:3});
listen(["bin-n"],()=>{const n=num("bin-n"),{primes,values}=binomialBounds(n),names=["Prime factors","log binomial","Upper bound"],colors=[A,B,C];put("bin-value",n);put("bin-stat",primes.length+" primes");draw("bin-chart",values.map((v,i)=>txt(5,25+i*45,names[i],"start")+rect(125,10+i*45,420*v/values[2],20,colors[i])+txt(595,25+i*45,fmt(v),"end")).join(""));put("bin-detail","Primes: "+(primes.join(", ")||"none")+". Logarithmic bounds: "+values.map(fmt).join(" ≤ ")+".")});
listen(["field-prime"],()=>{let p=num("field-prime"),f=gaussianFactors(p),s="",X=i=>300+i*19,Y=j=>150-j*19;for(let i=-7;i<=7;i++)for(let j=-7;j<=7;j++)s+=circle(X(i),Y(j),2,L);s+=line(X(-7),Y(0),X(7),Y(0))+line(X(0),Y(-7),X(0),Y(7));s+='<circle cx="300" cy="150" r="'+Math.sqrt(p)*19+'" fill="none" stroke="'+B+'" stroke-dasharray="4 4"/>';for(const [i,j] of f)s+=circle(X(i),Y(j),5,A);draw("field-chart",s+txt(450,155,"Re")+txt(300,12,"Im"));put("field-stat",f.length?"Splits":"Inert");let v=f.find(([i,j])=>i>0&&j>0);put("field-detail",v?p+" = ("+v[0]+" + "+v[1]+"i)("+v[0]+" − "+v[1]+"i). Highlighted points have norm "+p+".":"No lattice point has squared distance "+p+"; this prime remains prime in ℤ[i].")});
listen(["theta-n"],()=>{let n=num("theta-n"),t=thetaTerms(n),max=Math.max(...t.map(z=>Math.hypot(z.re,z.im))),re=t.reduce((s,z)=>s+z.re,0),im=t.reduce((s,z)=>s+z.im,0);put("theta-value",n);put("theta-stat","Re sum ≈ "+fmt(re));draw("theta-chart",line(170,145,430,145)+line(300,15,300,275)+t.map(z=>{let mag=Math.hypot(z.re,z.im)/max;return circle(300+z.i*21,145-z.j*21,2+9*Math.sqrt(mag),Math.abs(z.im)>Math.abs(z.re)?C:z.re<0?B:A,.12+.88*Math.sqrt(mag))}).join("")+txt(450,145,"Re")+txt(300,13,"Im"));put("theta-detail","Truncated sum on −6 ≤ a,b ≤ 6: "+fmt(re)+" + ("+fmt(im)+")i. Rotation symmetry forces the infinite sum to vanish unless 4 divides the order.")});
listen(["gain-x"],()=>{let x=num("gain-x"),powers=[3,27,243],v=powers.map(p=>ramp(x,p));put("gain-value",x);draw("gain-chart",v.map((a,i)=>txt(10,35+i*55,"3^"+(2*i+1),"start")+rect(85,18+i*55,a/Math.max(1,...v)*465,22,A)+txt(590,35+i*55,fmt(a),"end")).join(""));put("gain-detail","Sum of displayed normalized gains = "+fmt(v.reduce((s,a)=>s+a,0))+". Higher odd powers exceed x.")});
document.documentElement.dataset.arithmeticReady='true';
}