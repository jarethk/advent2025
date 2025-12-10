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
let top3 = [];
let circuits = [];
let finalEntries = [];
for (let i = 0; i < sortedEntries.length; i++) {
    let [p1, p2] = sortedEntries[i][0].split(',');
    dl(`Closest: ${p1}:${points[p1]}; ${p2}:${points[p2]}; distance: ${sortedEntries[i][1]}`);
    let foundat = [];
    for (let c = 0; c < circuits.length; c++) {
        if (circuits[c].includes(p1) && circuits[c].includes(p2)) {
            foundat.push(c);
        } else if (circuits[c].includes(p1)) {
            circuits[c].push(p2);
            foundat.push(c);
        } else if (circuits[c].includes(p2)) {
            circuits[c].push(p1);
            foundat.push(c);
        }
    }
    if (foundat.length > 0) {
        let basecircuit = circuits[foundat[0]];
        for (let c = 1; c < foundat.length; c++) {
            basecircuit.push(...circuits[foundat[c]]);
            circuits[foundat[c]] = [];
        }
        circuits[foundat[0]] = [...new Set(basecircuit)];
        if (circuits[foundat[0]].length == points.length) {
            finalEntries = [p1, p2];
            break;
        }
    } else {
        circuits.push([p1, p2]);
    }
    dl(circuits.map(c => c.length).sort());
    if (i == MAX - 1) {
        top3 = circuits.map(c => c.length).sort((a, b) => b - a).slice(0, 3);
    }
}

// 
console.log(`Part 1: ${top3.reduce((ac, cv) => ac * cv, 1)}`);

console.log(`Part 2: ${finalEntries}: ${points[finalEntries[0]][0] * points[finalEntries[1]][0]}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
