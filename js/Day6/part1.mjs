/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { pivotGrid } from 'geometry/space2d.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const adder = (ac, cv) => ac + cv;
const multiplr = (ac, cv) => ac * cv;

function processOp(op, row) {
    if (op == '+')
        return row.reduce(adder);
    else if (op == '*')
        return row.reduce(multiplr, 1);
}

const t0 = performance.now();

let ingrid1 = [];
let ingrid2 = [];
for await (const line of file.readLines()) {
    ingrid1.push(line.trim().split(/\s+/));
    ingrid2.push(line.split(''));
}
let mathgrid1 = pivotGrid(ingrid1)

let total = 0;
for (const row of mathgrid1) {
    let op = row.pop();
    total += processOp(op, row.map(v => parseInt(v)));
}

console.log(`Part 1: ${total}`);

let mathgrid2 = pivotGrid(ingrid2);
let total2 = 0;
let op = '+';
let numstack = [];
for (const row of mathgrid2) {
    if (row.join('').trim().length == 0) {
        total2 += processOp(op, numstack);
        numstack = [];
    } else {
        if (row[row.length - 1] == '+' || row[row.length - 1] == '*')
            op = row.pop();
        numstack.push(parseInt(row.join('')));
    }
}

total2 += processOp(op, numstack);
console.log(`Part 2: ${total2}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
