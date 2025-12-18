/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const adder = (a, b) => a + b;

const t0 = performance.now();

let REGION_RE = /^(\d+)x(\d+):\s([\d\s]+)/;
//'40x42: 38 37 45 42 54 41'

let regions = [];
for await (const line of file.readLines()) {
    if (REGION_RE.test(line)) {
        let match = REGION_RE.exec(line);
        let region = {
            w: parseInt(match[1]),
            h: parseInt(match[2]),
            shapes: match[3].split(' ').map(v => parseInt(v))
        }
        regions.push(region);
        region.max = Math.floor(region.w / 3) * Math.floor(region.h / 3);
        region.total = region.shapes.reduce(adder);
        region.valid = region.max >= region.total;
        console.log(`New region:\n${JSON.stringify(region, null, 2)}`);
    }
}

console.log(`Part 1: ${regions.filter(r => r.valid).length}`);
// 280 too low

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
