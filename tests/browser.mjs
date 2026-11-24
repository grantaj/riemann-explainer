import {chromium} from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
try {
 for(const viewport of [{width:390,height:844},{width:1280,height:900}]){
  const page=await browser.newPage({viewport});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/");
  await page.waitForSelector("html[data-ready=true]");
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
  await page.locator("#domain-mode").selectOption("real");
  assert.equal(await page.locator("#domain [data-zero]").count(),2);
  assert.equal(await page.locator("#domain [data-pole]").count(),1);
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"trivial-2");
  await page.locator("#domain").focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"point");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#domain").getAttribute("data-selection"),"trivial-2");
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
  await page.close();
 }
 console.log("Desktop and mobile interaction smoke tests passed");
} finally {await browser.close()}
