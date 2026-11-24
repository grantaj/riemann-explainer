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
  for(const [id,v,output] of [["prime-start","800","#prime-stat"],["count-max","3","#count-stat"],["euler-s","3","#euler-stat"],["vec-t","5","#vector-detail"],["music-n","30","#music-stat"],["rh-beta",".8","#rh-detail"]]){
   const before=await page.locator(output).textContent();
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
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"horizontal overflow");
  assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log("Desktop and mobile interaction smoke tests passed");
} finally {await browser.close()}
