/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { wrap } from 'num-wrap/num-wrap.js'

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let dial = 50;
let steps = [];
let zeroClicks = 0;
for await (const line of file.readLines()) {
    let turns = parseInt(line.slice(1));
    let start = dial;
    if (line[0] == 'L') dial -= turns;
    else dial += turns;

    if (start == 0 && Math.abs(dial) < 100) {
        // no clicks
    } else if (dial == 0) {
        zeroClicks++;
    } else if (dial <= 0) {
        if (start > 0) zeroClicks++;
        zeroClicks += Math.floor(Math.abs(dial) / 100);
    } else {
        zeroClicks += Math.floor(dial / 100);
    }
    dial = wrap(dial, 0, 99);

    steps.push(dial);
}

console.log(`Part 1: ${steps.filter(d => d == 0).length}`);
console.log(`Part 2: ${zeroClicks}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
