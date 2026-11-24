import test from "node:test";import assert from "node:assert/strict";import {chi,exponents,residueTable} from "../argument.mjs";
test("actual four exponents",()=>{assert.deepEqual(exponents(.5,4.5,2),[.5,-3,.5,.5]);for(let a=0;a<=100;a++)assert.ok(Math.max(...exponents(a/100,4.5,2))>=.5)});
test("quadratic character",()=>{assert.equal(chi(11,11),0);assert.equal(chi(11,5),1);assert.equal(chi(11,2),-1)});
test("published residue table example",()=>{let sums=[1,3,5,7].map(u=>residueTable(u).reduce((a,b)=>a+b,0));assert.ok(Math.abs(sums[0]-84701.0317)<.001);assert.ok(Math.abs(sums[3]-84692.5271)<.01);assert.ok(Math.abs(sums.reduce((a,b)=>a+b,0)/4-84460.8397)<.01)});
