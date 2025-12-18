/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./sample-input3.txt");
//const file = await open("./full-input.txt");

const t0 = performance.now();

function findButtonPresses(indicators, buttons) {
    //console.log(`Finding press sequence for ${indicators} with ${buttons}`);
    //let queue = new PriorityQueue();
    let queue = [];
    let visited = new Set();
    let newStates = new Set();
    let goal = JSON.stringify(indicators);
    let startState = {
        steps: [],
        lights: new Array(indicators.length).fill('.')
    }
    //queue.push(JSON.stringify(startState), 0);
    queue.push(startState);
    let nextQueue = [];
    let loopcount = 0;
    while (queue.length > 0) {
        loopcount++;
        //if (loopcount % 100 == 0) console.log(`Queue depth: ${queue.length}`);
        //let dq = queue.getLowest();
        //let state = JSON.parse(dq[0]);
        let state = queue.shift();
        //console.log(`Looping for ${state.steps}: ${state.lights}`);
        let lightString = JSON.stringify(state.lights);
        if (visited.has(lightString)) continue;
        visited.add(lightString);
        if (lightString == goal) {
            return state;
        }
        // for each button calculate new state and add that to the queue
        for (let b = 0; b < buttons.length; b++) {
            if (b == state.steps[state.steps.length - 1]) continue;
            let lc = [...state.lights];
            for (const p of buttons[b]) {
                if (lc[p] == '.') lc[p] = '#'
                else lc[p] = '.';
            }
            let newLightString = JSON.stringify(lc);
            if (visited.has(newLightString)) continue;
            if (newStates.has(newLightString)) continue;
            newStates.add(newLightString);
            let newState = {
                steps: [...state.steps, b],
                lights: lc
            }
            if (newLightString == goal) {
                return newState;
            }

            //queue.add(JSON.stringify(newState), dq[1] + 1);
            nextQueue.push(newState);
        }
        if (queue.length == 0) {
            queue = nextQueue;
            nextQueue = [];
        }
    }
    return startState;
}


function findJoltagePresses(joltages, buttons) {
    let presses = 0;
    let grid = [];
    let maxes = new Array(buttons.length).fill(Infinity);
    for (let b = 0; b < buttons.length; b++) {
        let row = new Array(joltages.length).fill('--');
        grid.push(row);
        for (let jidx = 0; jidx < joltages.length; jidx++) {
            if (!buttons[b].includes(jidx)) continue;
            row[jidx] = joltages[jidx];
        }
        //let filtered = joltages.filter((j, idx) => buttons[b].includes(idx));
        maxes[b] = Math.min(...grid[b].filter(v => v != '--'));
    }
    console.log(`Press maxes: ${JSON.stringify(maxes)}`);
    console.log("  " + grid.map(r => r.map(v => String(v).padStart(2, '0')).join("|")).map((r, idx) => `${idx}: ${r}`).join("\n  "));

    let jt = new Array(joltages.length).fill(0);
    let b = maxes.lastIndexOf(Math.min(...maxes.filter(v => v > 0)));
    while (b != -1) {
        let min = Math.min(...grid[b].filter(v => v != '--'));
        console.log(`Pressing button ${b} ${min} times`);
        presses += min;
        // now reduce the grid
        for (const x of buttons[b]) {
            jt[x] += min;
            for (const row of grid) {
                if (row[x] != '--') row[x] -= min;
            }
        }
        maxes[b] = Math.min(...grid[b].filter(v => v != '--'));
        console.log('\n----------');
        console.log("  " + grid.map(r => r.map(v => String(v).padStart(2, '0')).join("|")).map((r, idx) => `${idx}: ${r}`).join("\n  "));
        console.log(`Joltages: ${jt.join(',')}`);
        console.log(`Press maxes: ${JSON.stringify(maxes)}`);
        //b = -1; 
        b = maxes.lastIndexOf(Math.min(...maxes.filter(v => v > 0)));
    }

    console.log(`Compare:  ${joltages.join(',')}`);
    return presses;
}

let LINE_RE = /^\[(.*)\]\s([\(\)\,\d\s]+)\s\{([\,\d]+)\}$/;
const BUTTON_RE = /\(|\)/g;

let fewestButtons = 0;
let fewestButtons2 = 0;
for await (const line of file.readLines()) {
    let match = LINE_RE.exec(line);
    //console.log(JSON.stringify(match));
    let indicators = match[1].split('');
    let buttons = match[2].split(' ').map(b => b.replaceAll(BUTTON_RE, '').split(',').map(v => parseInt(v)));
    let presses = findButtonPresses(indicators, buttons);
    //console.log(`Step 1: ${JSON.stringify(presses)}\n\n`);
    fewestButtons += presses.steps.length;

    let joltages = match[3].split(',').map(v => parseInt(v));
    fewestButtons2 += findJoltagePresses(joltages, buttons);
    //fewestButtons2 += presses.steps.length;
}

console.log(`\n\nPart 1: ${fewestButtons}`);
console.log(`Part 2: ${fewestButtons2}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
