/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const adder = (ac, cv) => ac + cv;

const t0 = performance.now();

let banks = [];
for await (const line of file.readLines()) {
    banks.push(line.split('').map(v => parseInt(v)));
}

function calcBatteries(bank, max) {
    let bset = new Array(max).fill(-1);
    let last = -1;
    for (let b = 0; b < max; b++) {
        for (let i = last + 1; i < bank.length - (max - 1 - b); i++) {
            if (bank[i] > bset[b]) { bset[b] = bank[i]; last = i; }
        }
    }
    return (bset.map((b, idx, arr) => b * (Math.pow(10, (arr.length - 1 - idx)))).reduce(adder));
}

let part1 = [];
let part2 = [];
for (const bank of banks) {
    part1.push(calcBatteries(bank, 2));
    part2.push(calcBatteries(bank, 12));
}

console.log(`Part 1: ${part1.reduce(adder)}`);
console.log(`Part 2: ${part2.reduce(adder)}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
