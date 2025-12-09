/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

function euclidDistance(pt1, pt2) {
    return Math.hypot(pt1[0] - pt2[0], pt1[1] - pt2[1], pt1[2] - pt2[2]);
}

let points = [];
for await (const line of file.readLines()) {
    points.push(line.split(',').map(v => parseInt(v)));
}

let distances = {};
for (let p1 = 0; p1 < points.length; p1++) {
    for (let p2 = p1 + 1; p2 < points.length; p2++) {
        distances[p1 + ',' + p2] = euclidDistance(points[p1], points[p2]);
    }
}

let sortedEntries = Object.entries(distances).sort((a, b) => a[1] - b[1]);

let MAX = 1000;
let circuits = [];
for (let i = 0; i < MAX; i++) {
    let [p1, p2] = sortedEntries[i][0].split(',');
    dl(`Closest: ${p1}:${points[p1]}; ${p2}:${points[p2]}; distance: ${sortedEntries[i][1]}`);
    let found = false;
    for (const c of circuits) {
        if (c.includes(p1) && c.includes(p2)) {
            found = true;
        } else if (c.includes(p1)) {
            c.push(p2);
            found = true;
        } else if (c.includes(p2)) {
            c.push(p1);
            found = true;
        }
    }
    if (!found) circuits.push([p1, p2]);
    dl(circuits.map(c => c.length).sort());
}

// merge circuits
let hasupdated = true;
while (hasupdated) {
    hasupdated = false;
    for (let c1 = 0; c1 < circuits.length; c1++) {
        for (let c2 = c1 + 1; c2 < circuits.length; c2++) {
            if (circuits[c1].some(v => circuits[c2].includes(v))) {
                circuits[c1].push(...circuits[c2]);
                circuits[c1] = [...new Set(circuits[c1])];
                circuits[c2] = [];
                hasupdated = true;
            }
        }
    }
}
// 

console.log(`Part 1: ${circuits.map(c => c.length).sort((a, b) => b - a)}`);
//console.log(JSON.stringify(circuits));
let sl = circuits.map(c => c.length).sort((a, b) => b - a);
console.log(`Part 1: ${sl[0] * sl[1] * sl[2]}`);

// 48672 too low

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
