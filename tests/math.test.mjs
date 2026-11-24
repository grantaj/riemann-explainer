import {test} from "node:test";
import assert from "node:assert/strict";
import {primeData,li,series,product,pow,zeta,zeros,contribution,explicit,psiMid} from "../math.mjs";
const d=primeData(10000);
const near=(x,y,tol=1e-10)=>assert.ok(Math.abs(x-y)<tol,`expected ${x} ≈ ${y}`);
test("prime sieve and counts",()=>{assert.deepEqual(d.primes.slice(0,10),[2,3,5,7,11,13,17,19,23,29]);assert.equal(d.pi[100],25);assert.equal(d.pi[1000],168);assert.equal(d.pi[10000],1229);assert.equal(d.a[1],0)});
test("prime powers and midpoint",()=>{near(d.psi[8],Math.log(840));near(psiMid(d,8),d.psi[7]+Math.log(2)/2);near(psiMid(d,8.5),d.psi[8])});
test("logarithmic integral",()=>near(li(100),30.1261415840796));
test("Euler series and product converge from below",()=>{const z=Math.PI**2/6;assert.ok(series(2,1000)<z);assert.ok(product(2,d.primes,1000)<z);assert.ok(z-series(2,1000)<.0011);assert.ok(z-product(2,d.primes,1000)<.001)});
test("continuation at real values",()=>{near(zeta([2,0])[0],Math.PI**2/6,1e-12);near(zeta([0,0])[0],-.5,1e-12);near(zeta([-1,0])[0],-1/12);near(Math.hypot(...zeta([-2,0])),0);near(Math.hypot(...zeta([-4,0])),0,1e-7)});
test("complex conjugation and first six zeros",()=>{const p=zeta([.25,12]),q=zeta([.25,-12]);near(p[0],q[0]);near(p[1],-q[1]);for(const t of zeros.slice(0,6))near(Math.hypot(...zeta([.5,t])),0,1e-8)});
test("complex exponential",()=>{const v=pow(3,[-.5,-2]);near(Math.hypot(...v),1/Math.sqrt(3))});
test("explicit formula pair term",()=>{const x=100,b=.5,t=14.1;near(contribution(x,b,t),-2*x**b*(b*Math.cos(t*Math.log(x))+t*Math.sin(t*Math.log(x)))/(b*b+t*t));near(explicit(x,0),x-Math.log(2*Math.PI)-.5*Math.log1p(-1/x**2));near(explicit(x,1)-explicit(x,0),contribution(x,.5,zeros[0]))});
test("first 30 zero pairs improve RMS approximation on the test interval",()=>{let e0=0,e30=0;for(let x=2.5;x<100;x+=.25){const v=psiMid(d,x);e0+=(v-explicit(x,0))**2;e30+=(v-explicit(x,30))**2}assert.ok(e30<e0)});

test("all 30 tabulated zeros in the zoom range",()=>{for(const t of zeros){const v=zeta([.5,t]);assert.ok(Math.hypot(...v)<1e-8,"zero at "+t);const w=zeta([.5,-t]);assert.ok(Math.hypot(...w)<1e-8,"conjugate at "+t)}});
