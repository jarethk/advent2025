/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { printSpace } from 'geometry/space2d.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let space = [];
for await (const line of file.readLines()) {
    space.push(line.split('').map(v => v == '.' ? 0 : v));
}

function fillDown(y, x, space, fillval) {
    for (y += 1; y < space.length; y++) {
        if (typeof space[y][x] == "number") space[y][x] += fillval;
        else break;
    }
}

let splits = 0;
let timelines = 0;
for (let y = 1; y < space.length; y++) {
    for (let x = 0; x < space[y].length; x++) {
        if (space[y - 1][x] == 'S') {
            timelines++;
            space[y][x] = 1;
            fillDown(y, x, space, space[y][x]);
        } else if (space[y][x] == '^' && typeof space[y - 1][x] == 'number' && space[y - 1][x] > 0) {
            splits++;
            timelines += space[y - 1][x];
            let adj = [x - 1, x + 1].filter(p => 0 <= p && p < space[y].length);
            for (const p of adj) {
                space[y][p] += space[y - 1][x];
                fillDown(y, p, space, space[y - 1][x]);
            }
        }
    }
}


console.log(`Part 1: ${splits}`);
console.log(`Part 2: ${timelines}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
