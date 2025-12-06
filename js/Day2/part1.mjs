/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const adder = (ac, cv) => ac + cv;

const t0 = performance.now();

for await (const line of file.readLines()) {
    let ranges = line.split(',').map(rng => rng.split('-').map(v => parseInt(v)));
    let doubles = [];
    let invalids = [];
    dl(JSON.stringify(ranges));
    for (let r = 0; r < ranges.length; r++) {
        let [min, max] = ranges[r];
        for (; min <= max; min++) {
            let smin = min.toString();
            let mid = Math.floor(smin.length / 2);
            if (smin.length % 2 == 0) {
                let part1 = smin.slice(0, mid);
                let part2 = smin.slice(mid);
                if (part1 == part2) doubles.push(min);
            }
            for (let c = 1; c <= mid; c++) {
                let part1 = smin.slice(0, c);
                let rem = smin.replaceAll(part1, "");
                if (rem.length == 0) {
                    invalids.push(min);
                    break;
                }
            }
        }
    }
    console.log(`Part 1: ${doubles.reduce(adder)}`);
    console.log(`Part 2: ${invalids.reduce(adder)}`)
}

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
