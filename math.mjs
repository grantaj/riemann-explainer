export function sieve(n){const a=new Uint8Array(n+1);a.fill(1,2);for(let p=2;p*p<=n;p++)if(a[p])for(let j=p*p;j<=n;j+=p)a[j]=0;return Array.from(a)}

export function primeData(n){const a=sieve(n),pi=new Float64Array(n+1),psi=new Float64Array(n+1),primes=[];for(let p=2;p<=n;p++)if(a[p]){primes.push(p);for(let k=p;k<=n;k*=p)psi[k]+=Math.log(p)}for(let j=1;j<=n;j++){pi[j]=pi[j-1]+a[j];psi[j]+=psi[j-1]}return {a,pi,psi,primes}}

export function li(x){ // li(x) = gamma + log(log x) + sum (log x)^k/(k k!)
 const t=Math.log(x);let sum=0,term=1;for(let k=1;k<100;k++){term*=t/k;sum+=term/k;if(Math.abs(term/k)<1e-14)break}return .5772156649015329+Math.log(t)+sum}

export function series(s,n){let q=0;for(let k=1;k<=n;k++)q+=k**(-s);return q}

export function product(s,ps,n){let q=1;for(const p of ps.slice(0,n))q/=1-p**(-s);return q}

export function add(a,b){return [a[0]+b[0],a[1]+b[1]]}

export function mul(a,b){return [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]]}

export function div(a,b){const d=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d]}

export function pow(x,s){const l=Math.log(x),r=Math.exp(s[0]*l),t=s[1]*l;return [r*Math.cos(t),r*Math.sin(t)]}

export function zeta(s){ // Euler-Maclaurin, N=40 and eight Bernoulli corrections; intended for -4.5<=Re<=5.5, |Im|<=110; approximate, not certified
 const n=Math.max(40,Math.ceil(Math.abs(s[1])*.55));let q=[0,0];for(let k=1;k<n;k++)q=add(q,pow(k,[-s[0],-s[1]]));
 q=add(q,div(pow(n,[1-s[0],-s[1]]),[s[0]-1,s[1]]));q=add(q,mul([.5,0],pow(n,[-s[0],-s[1]])));
 const b=[1/12,-1/720,1/30240,-1/1209600,1/47900160,-691/1307674368000,1/74724249600,-3617/10670622842880000];let rising=[1,0],j=0;
 for(let k=1;k<=b.length;k++){while(j<2*k-1){rising=mul(rising,[s[0]+j,s[1]]);j++}q=add(q,mul([b[k-1],0],mul(rising,pow(n,[1-s[0]-2*k,-s[1]]))))}return q}

export function contribution(x,b,t){return -2*div(pow(x,[b,t]),[b,t])[0]}

export function explicit(x,n){let q=x-Math.log(2*Math.PI)-.5*Math.log1p(-1/(x*x));for(const t of zeros.slice(0,n))q+=contribution(x,.5,t);return q}

export function psiMid(data,x){const k=Math.floor(x);return Number.isInteger(x)?(data.psi[k]+data.psi[k-1])/2:data.psi[k]}
export const zeros=[14.134725141734695,21.022039638771556,25.01085758014569,30.424876125859512,32.93506158773919,37.58617815882567,40.9187190121475,43.327073280915,48.00515088116716,49.7738324776723,52.97032147771446,56.44624769706339,59.34704400260235,60.83177852460981,65.11254404808162,67.07981052949417,69.54640171117398,72.0671576744819,75.70469069908393,77.1448400688748,79.33737502024937,82.91038085408603,84.73549298051705,87.42527461312523,88.80911120763446,92.49189927055848,94.65134404051989,95.87063422824531,98.83119421819369,101.31785100573138];
