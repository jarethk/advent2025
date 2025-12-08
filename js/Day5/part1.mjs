/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const adder = (ac, cv) => ac + cv;

const t0 = performance.now();

let ranges = [];
let ingredients = [];
let readPhase = 'ranges';
let freshCount = 0;
for await (const line of file.readLines()) {
    if (line.trim().length == 0) {
        readPhase = 'ing';
        ranges = ranges.sort((a, b) => a[0] - b[0])
            .map((rng, idx, arr) => {
                for (let ip = idx - 1; ip > 0; ip--) {
                    if (rng[0] <= arr[ip][1]) rng[0] = arr[ip][1] + 1;
                }
                return rng;
            })
            .filter(rng => rng[0] <= rng[1]);
    } else if (readPhase == 'ranges') {
        ranges.push(line.split('-').map(v => parseInt(v)).sort());
    } else {
        let ing = parseInt(line);
        ingredients.push(ing);
        for (const range of ranges) {
            if (range[0] <= ing && ing <= range[1]) {
                freshCount++;
                break;
            }
        }
    }
}

console.log(`Part 1: ${freshCount}`);

let validCount = ranges.map(rng => rng[1] - rng[0] + 1).reduce(adder);
console.log(`Part 2: ${validCount}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
