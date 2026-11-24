import {chromium} from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true});
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
  await page.locator("#domain").scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector("#domain-detail").textContent.includes("ζ"));
  await page.locator("#domain-mode").selectOption("real");
  await page.waitForFunction(()=>document.querySelector("#domain-s").value==="-2");
  assert.equal(await page.locator("#domain-t").inputValue(),"0");
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"horizontal overflow");
  assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log("Desktop and mobile interaction smoke tests passed");
} finally {await browser.close()}
