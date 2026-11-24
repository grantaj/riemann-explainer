import {chromium} from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
try {
 for(const viewport of [{width:390,height:844},{width:1280,height:900}]){
  const page=await browser.newPage({viewport});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/");
  await page.waitForSelector("html[data-ready=true]");
  await page.waitForSelector("html[data-journey-ready=true]");
  await page.waitForSelector("html[data-concepts-ready=true]");
  for(const id of ["continue-plot","weight-plot"])assert.ok(await page.locator("#"+id+" > *").count()>0,id);
  await page.locator("#continue-u").evaluate(el=>{el.value="2";el.dispatchEvent(new Event("input",{bubbles:true}))});assert.match(await page.locator("#continue-detail").textContent(),/rational formula = −?\-?1/);
  await page.locator("#weight-x").evaluate(el=>{el.value="20";el.dispatchEvent(new Event("input",{bubbles:true}))});assert.match(await page.locator("#weight-detail").textContent(),/π\(20\) = 8/);
  assert.equal(await page.locator("#prime-grid circle").count(),300);
  // Check every chart has drawn content on initial load, not just the first few.
  for(const id of ["hero-art","prime-grid","gaps","count-plot","density-plot","euler-plot","factor-grid","vector-input","vector","domain","fourier-plot","single-wave","music-plot","rh-plane","rh-growth"]){
   assert.ok(await page.locator("#"+id+" > *").count()>0,id+" did not render");
  }
  const point=page.locator("#vector-input [data-input-point]");
  const x0=await point.getAttribute("cx"),y0=await point.getAttribute("cy");
  await page.locator("#vec-t").evaluate(el=>{el.value="12";el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.equal(await point.getAttribute("cx"),x0,"imaginary input must not move horizontally");
  assert.ok(Number(await point.getAttribute("cy"))<Number(y0),"larger imaginary input moves upwards");
  const y1=await point.getAttribute("cy");
  await page.locator("#vec-s").evaluate(el=>{el.value="2";el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.equal(await point.getAttribute("cy"),y1,"real input must not move vertically");
  assert.ok(Number(await point.getAttribute("cx"))>Number(x0),"larger real input moves right");
  for(const [id,v,output] of [["prime-start","800","#prime-stat"],["count-max","3","#count-stat"],["euler-s","3","#euler-stat"],["vec-t","8","#vector-detail"],["music-n","30","#music-stat"],["rh-beta",".8","#rh-detail"]]){
   const before=await page.locator(output).textContent();
   assert.notEqual(Number(await page.locator("#"+id).inputValue()),Number(v),id+": test must change the input");
   await page.locator("#"+id).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event("input",{bubbles:true}))},v);
   assert.notEqual(await page.locator(output).textContent(),before,id);
  }
  assert.equal(await page.locator("#domain [data-zero]").count(),6);
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"zero-1");
  const xs=await page.locator("#domain [data-zero]").evaluateAll(nodes=>nodes.map(n=>n.getAttribute("cx")));
  assert.equal(new Set(xs).size,1,"all six zeros share the critical line");
  assert.match(await page.locator("#domain-detail").textContent(),/14\.134725/);
  await page.locator('#domain [data-zero="zero-2"]').click();
  assert.match(await page.locator("#domain-detail").textContent(),/21\.022040/);
  await page.locator("#domain-colors").check();
  assert.equal(await page.locator("#domain image").count(),1);
  assert.equal(await page.locator("#domain [data-zero]").count(),6);
  await page.locator("#domain-colors").uncheck();
  const scale=async(id,value)=>page.locator("#"+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}))},value);
  await scale("domain-im-scale","110");
  assert.equal(await page.locator("#domain [data-zero]").count(),30);
  assert.equal(await page.locator("#domain").getAttribute("data-re-min"),"-0.5");
  await scale("domain-re-scale","5");
  assert.equal(await page.locator("#domain").getAttribute("data-im-max"),"110");
  assert.equal(await page.locator("#domain [data-zero]").count(),32);
  await page.locator("#domain-negative").check();
  assert.equal(await page.locator("#domain [data-zero]").count(),62);
  await scale("domain-im-scale","4");
  assert.equal(await page.locator("#domain [data-zero]").count(),2);
  assert.equal(await page.locator("#domain [data-pole]").count(),1);
  assert.match(await page.locator("#domain").getAttribute("data-selection"),/^trivial-/);
  // Choose a particular zero before testing keyboard navigation and snapping.
  await page.locator('#domain [data-zero="trivial-2"]').click();
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"trivial-2");
  await page.locator("#domain").focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"point");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"trivial-2");
  await page.locator("#domain-reset").click();
  assert.equal(await page.locator("#domain [data-zero]").count(),6);
  assert.equal(await page.locator("#domain").getAttribute("data-im-min"),"0");
  assert.equal(await page.locator('#domain-s, #domain-t').count(),0);
  await page.locator('a[data-concept="pnt"]').first().click();
  assert.ok(await page.locator("#concept-dialog").isVisible());
  assert.match(await page.locator("#concept-body").textContent(),/tends to 1/);
  await page.keyboard.press("Escape");
  assert.ok(!(await page.locator("#concept-dialog").isVisible()));
  await page.locator('a[data-concept="li"]').click();
  assert.match(await page.locator("#concept-body").textContent(),/principal value/);
  await page.locator("#concept-close").click();
  assert.ok(!(await page.locator("#concept-dialog").isVisible()));
  assert.ok(!(await page.locator("#gaps").textContent()).includes("Successive prime pairs"));
  assert.equal(await page.locator("details.depth").count(),7);
  assert.equal(await page.locator("details.derivation").count(),7);
  assert.equal(await page.locator("details.depth[open]").count(),0);
  await page.locator("#counting details.depth > summary").click();
  assert.ok(await page.locator("#density-plot").isVisible());
  const densityBefore=await page.locator("#density-detail").textContent();
  await page.locator("#density-x").evaluate(el=>{el.value="250";el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.notEqual(await page.locator("#density-detail").textContent(),densityBefore);
  await page.locator("#counting details.derivation > summary").click();
  assert.ok(await page.locator("#counting details.derivation").evaluate(el=>el.open));
  await page.locator("#euler details.depth > summary").click();
  assert.equal(await page.locator("#factor-grid [data-factor]").count(),30);
  await page.locator('#factor-grid [data-factor="1,2"]').click();
  assert.match(await page.locator("#factor-detail").textContent(),/= 18\./);
  const waveBefore=await page.locator("#fourier-plot path").last().getAttribute("d");
  await page.locator("#fourier-n").evaluate(el=>{el.value="12";el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.notEqual(await page.locator("#fourier-plot path").last().getAttribute("d"),waveBefore);
  await page.locator("#single-zero").selectOption("1");
  assert.match(await page.locator("#single-detail").textContent(),/21\.022040/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"horizontal overflow with nested sections open");

  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"horizontal overflow");
  assert.deepEqual(errors,[]);
  // Navigate through the deployed link, not a source-only path.
  await page.locator('#proofs a[href="./proof.html"]').click();
  await page.waitForSelector("html[data-proof-ready=true]");
  for(const id of ["ramp-plot","window-plot","spot-plot","char-plot","balance-plot","mult-plot"])
   assert.ok(await page.locator("#"+id+" > *").count()>0,id+" did not render");
  for(const [id,v,out] of [["ramp-x","75","ramp-stat"],["ramp-mode","center","ramp-stat"],["window-beta",".85","window-stat"],["char-k","4","char-stat"],["balance-a",".75","balance-stat"],["mult-m","7","mult-stat"]]){
   const before=await page.locator("#"+out).textContent();
   await page.locator("#"+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}))},v);
   assert.notEqual(await page.locator("#"+out).textContent(),before,id+" did not update");
  }
  await page.locator("#windows details.depth > summary").click();
  assert.ok(await page.locator("#spot-plot").isVisible());
  const before=await page.locator("#spot-plot path").getAttribute("d");
  await page.locator("#spot-order").evaluate(el=>{el.value=100;el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.notEqual(await page.locator("#spot-plot path").getAttribute("d"),before);
  await page.locator("#windows details.derivation > summary").click();
  assert.ok(await page.locator("#windows details.derivation").evaluate(el=>el.open));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"Part II horizontal overflow");
  assert.deepEqual(errors,[]);
  await page.goto("http://127.0.0.1:8000/proof.html");
  await page.waitForSelector("html[data-arithmetic-ready=true]");
  await page.waitForSelector("html[data-journey-ready=true]");
  for(const id of ["floor-plot","lem-curve","lem-val","lem-size"])assert.ok(await page.locator("#"+id+" > *").count()>0,id);
  const oldLem=await page.locator("#lem-integer").textContent();await page.locator("#lem-n").evaluate(el=>{el.value="49";el.dispatchEvent(new Event("input",{bubbles:true}))});assert.notEqual(await page.locator("#lem-integer").textContent(),oldLem);
  await page.locator('a[data-concept="lemniscate"]').first().click();assert.ok(await page.locator("#concept-dialog").isVisible());await page.keyboard.press("Escape");
  for(const id of ["bin-chart","field-chart","theta-chart","gain-chart"])assert.ok(await page.locator("#"+id+" > *").count()>0,id);
  for(const [id,v,out] of [["bin-n","70","bin-stat"],["theta-n","8","theta-stat"],["gain-x","70","gain-detail"]]){const before=await page.locator("#"+out).textContent();await page.locator("#"+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}))},v);assert.notEqual(await page.locator("#"+out).textContent(),before,id);}
  await page.locator("#field-prime").selectOption("7");assert.equal(await page.locator("#field-stat").textContent(),"Inert");
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"Phase II arithmetic horizontal overflow");
  assert.deepEqual(errors,[]);
  await page.locator('#continue a[href="./argument.html"]').click();
  await page.waitForSelector("html[data-argument-ready=true]");
  await page.waitForSelector("html[data-labs-ready=true]");
  await page.waitForSelector("html[data-journey-ready=true]");
  for(const id of ["center-plot","center-mean","budget-plot","limit-plot"])assert.ok(await page.locator("#"+id+" > *").count()>0,id);
  await page.locator("#center-count").evaluate(el=>{el.value="4";el.dispatchEvent(new Event("input",{bubbles:true}))});assert.match(await page.locator("#center-stat").textContent(),/−?\-?2\.5545/);
  await page.locator("#limit-eps").evaluate(el=>{el.value=".05";el.dispatchEvent(new Event("input",{bubbles:true}))});assert.equal(await page.locator("#limit-stat").textContent(),"Choose smaller ε");
  assert.equal(await page.locator("#route-plot a").count(),10);
  assert.equal(await page.locator("#route-plot").getAttribute("viewBox"),viewport.width<=600?"0 0 360 465":"0 0 600 310");
  assert.equal(await page.locator("#dependency-map .route-text a").count(),10);
  assert.equal(await page.locator("#cell-body td").count(),8);
  assert.match(await page.locator("#cell-stat").textContent(),/84,701\.032/);
  const old=await page.locator("#cell-detail").textContent();
  await page.locator("#cell-u").selectOption("7");
  assert.notEqual(await page.locator("#cell-detail").textContent(),old);
  await page.locator("#cost-m").evaluate(el=>{el.value=".8";el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.match(await page.locator("#cost-stat").textContent(),/0\.80/);
  for(const id of ["reflect-plot","pole-plane","pole-growth","filter-plot","filter-bars","cell-bars","cell-mean","chain-plot","chain-lattice","valuation-plot","valuation-total","lattice-plot","lattice-bounds","overlap-plot","glue-plot","behrend-plot","behrend-line","host-window-plot"])assert.ok(await page.locator("#"+id+" > *").count()>0,id);
  for(const [id,v,out] of [["reflect-beta",".7","reflect-detail"],["pole-order","90","pole-detail"],["filter-x","1200","filter-stat"],["valuation-a","2000","valuation-stat"],["lattice-a","4","lattice-stat"],["overlap-c",".9","overlap-stat"],["glue-a","5","glue-detail"]]){
   const old=await page.locator("#"+out).textContent();await page.locator("#"+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}))},v);assert.notEqual(await page.locator("#"+out).textContent(),old,id);
  }
  await page.locator("#reflect-exclude").check();assert.equal(await page.locator("#reflect-stat").textContent(),"Contradiction");
  const oldChain=await page.locator("#chain-detail").textContent();await page.locator("#chain-0").click();assert.notEqual(await page.locator("#chain-detail").textContent(),oldChain);
  await page.locator("#behrend-all").check();assert.match(await page.locator("#behrend-detail").textContent(),/Example progression/);
  await page.locator("#host-window-a").evaluate(el=>{el.value="1.5";el.dispatchEvent(new Event("input",{bubbles:true}))});
  assert.equal(await page.locator("#host-window-stat").textContent(),"Not fully covered");
  await page.locator("#behrend-all").uncheck();assert.match(await page.locator("#behrend-stat").textContent(),/0 progressions/);
  await page.locator("#window details.depth > summary").click();
  assert.ok(await page.locator("#window details.depth").evaluate(el=>el.open));
  await page.locator("#window details.depth > div > details.derivation > summary").click();
  await page.locator("#window details.source > summary").click();
  assert.ok(await page.locator("#window details.source a").first().isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"Part III overflow");
  assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log("Desktop and mobile interaction smoke tests passed");
} finally {await browser.close()}
