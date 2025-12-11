/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { distance } from 'geometry/manhattan.js';
import { printSpace } from 'geometry/space2d.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let points = [];

let xsSet = new Set();
let ysSet = new Set();
for await (const line of file.readLines()) {
    let pt = line.split(',').map(v => parseInt(v));
    xsSet.add(pt[0]);
    ysSet.add(pt[1]);
    points.push(pt);
}

let xs = [...xsSet].sort((a, b) => a - b);
console.log(JSON.stringify(xs));
let ys = [...ysSet].sort((a, b) => a - b);
console.log(JSON.stringify(ys));

function compressPoint(pt) {
    return [xs.indexOf(pt[0]) * 2, ys.indexOf(pt[1]) * 2];
}

let compressedPoints = points.map(pt => compressPoint(pt));
console.log(JSON.stringify(compressedPoints));
let grid = [];
for (let y = 0; y < ys.length * 2; y++) {
    grid.push(new Array(xs.length * 2).fill('.'));
}
let lastpt = compressedPoints[compressedPoints.length - 1];
for (let p = 0; p < compressedPoints.length; p++) {
    let cpt = compressedPoints[p];
    if (cpt[0] == lastpt[0]) {
        // same x
        let [miny, maxy] = [cpt[1], lastpt[1]].sort((a, b) => a - b);
        for (let y = miny; y <= maxy; y++) {
            grid[y][cpt[0]] = '#';
        }
    } else {
        // same y
        let [minx, maxx] = [cpt[0], lastpt[0]].sort((a, b) => a - b);
        for (let x = minx; x <= maxx; x++) {
            grid[cpt[1]][x] = '#';
        }
    }
    lastpt = cpt;
}
//printSpace(grid);

// fill grid
for (let y = 1; y < grid.length - 1; y++) {
    let tofill = false;
    for (let x = 0; x < grid[y].length - 1; x++) {
        if (tofill && grid[y][x] == '.') {
            grid[y][x] = '#';
        } else if (tofill && grid[y][x] == '#') {
            tofill = false;
        } else if (!tofill && (x == 0 || grid[y][x - 1] == '.') && grid[y][x] == '#') {
            // zoom ahead
            while (grid[y][x + 1] == '#' && x < grid[y].length) x++;
            tofill = true;
        }
    }
}
//console.log(`+++After fill+++`);
//printSpace(grid);


function checkInside(pt1, pt2) {
    let cpt1 = compressPoint(pt1);
    let cpt2 = compressPoint(pt2);
    let ptxs = [cpt1[0], cpt2[0]].sort((a, b) => a - b);
    let ptys = [cpt1[1], cpt2[1]].sort((a, b) => a - b);
    for (const y of ptys) {
        for (let x = ptxs[0]; x <= ptxs[1]; x++) {
            if (grid[y][x] != '#') return false;
        }
    }
    for (const x of ptxs) {
        for (let y = ptys[0]; y <= ptys[1]; y++) {
            if (grid[y][x] != '#') return false;
        }
    }
    return true;
}

let largest1 = 0;
let largest2 = 0;

for (let p1 = 0; p1 < points.length; p1++) {
    for (let p2 = p1 + 1; p2 < points.length; p2++) {
        let area = (Math.abs(points[p1][0] - points[p2][0]) + 1) * (Math.abs(points[p1][1] - points[p2][1]) + 1);
        if (area > largest1) {
            largest1 = area;
        }
        if (area > largest2 && checkInside(points[p1], points[p2])) {
            largest2 = area;
        }
    }
}

console.log(`Part 1: ${largest1}`);

console.log(`Part 2: ${largest2}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
