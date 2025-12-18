/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { PriorityQueue } from 'priority-queue/priority-queue';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let devices = {};
for await (const line of file.readLines()) {
    let parts = line.split(':').map(v => v.trim()).map(v => v.split(' '));
    devices[parts[0]] = parts[1];
}

function findPaths(from, target) {
    let queue = [];
    queue.push({
        step: from,
        counter: 0
    });
    let countEnd = 0;
    while (queue.length > 0) {
        let dq = queue.pop();
        if (dq.step == target) {
            countEnd++;
            //console.log(`Found end after ${dq.counter}`);
            continue;
        }
        //console.log(`Processing dq ${JSON.stringify(dq)}; queue depth: ${queue.length}`);
        for (const nextstate of devices[dq.step]) {
            //console.log(`--Adding ${nextstate}`);
            queue.push({
                step: nextstate,
                counter: dq.counter + 1
            });
        }
    }
    return countEnd;
}

let cache = new Map();
function findPathsBackwards(from, target) {
    let ck = `${from}-${target}`;
    if (cache.has(ck)) return cache.get(ck);
    if (from == target) {
        return 1;
    }

    let countEnd = 0;
    if (!devices[from]) return 0;
    for (const nextstep of devices[from]) {
        countEnd += findPathsBackwards(nextstep, target);
    }
    cache.set(ck, countEnd);
    return countEnd;
}

console.log(`Part 1: ${findPaths('you', 'out')}`);
console.log(`Part 2: ${findPathsBackwards('svr', 'fft')}`);
console.log(`Part 2: ${findPathsBackwards('svr', 'fft') * findPathsBackwards('fft', 'dac') * findPathsBackwards('dac', 'out')}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
