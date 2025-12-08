/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { getSurrounding } from 'geometry/space2d.js'

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const adder = (ac, cv) => ac + cv;

const t0 = performance.now();

let grid = [];
for await (const line of file.readLines()) {
    grid.push(line.split(''));
}

function getRemovable(grid) {
    let accessible = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] != '@') continue;
            let adj = getSurrounding([y, x], grid).filter(pt => grid[pt[0]][pt[1]] == '@');
            //console.log(`Adj from ${y},${x}: ${adj.length}`);
            if (adj.length < 4) accessible.push([y, x]);
        }
    }
    return accessible;
}

let removedcount = [];
let removable = getRemovable(grid);
while (removable.length > 0) {
    removedcount.push(removable.length);
    for (const toremove of removable) {
        grid[toremove[0]][toremove[1]] = '.';
    }
    removable = getRemovable(grid);
}

console.log(`Part 1 ${removedcount[0]}`);
console.log(`Part 2: ${removedcount.reduce(adder)}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
