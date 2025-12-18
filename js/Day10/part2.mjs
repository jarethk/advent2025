/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { init } from 'z3-solver';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
//const file = await open("./sample-input3.txt");
const file = await open("./full-input.txt");

const adder = (a, b) => a + b;

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
    console.log("  " +
        grid.map(r => r.map(v => String(v).padStart(2, '0')).join("|") + " ; " + Math.min(...r.filter(v => v != '--')))
            .map((r, idx) => `${idx}: ${r}`)
            .join("\n  "));

    let start = {
        grid: grid,
        jt: new Array(joltages.length).fill(0),
        presses: 0
    }

    let minPresses = Infinity;
    let queue = [];
    let visited = new Set();
    queue.push(JSON.stringify(start));
    while (queue.length > 0) {
        let dq = queue.pop();
        let state = JSON.parse(dq);
        if (visited.has(state.jt.join(','))) continue;
        visited.add(state.jt.join(','));
        let maxes = state.grid.map(row => Math.min(...row.filter(v => v != '--')));

        if (maxes.filter(v => v > 0).length == 0) {
            if (joltages.join(',') == state.jt.join(',') && start.presses < minPresses)
                minPresses = state.presses;
        } else {
            for (let i = 0; i < maxes.length; i++) {
                if (maxes[i] == 0) continue;
                let newState = JSON.parse(dq);
                let min = maxes[i];
                //let min = 1;
                newState.presses += min;
                if (newState.presses > minPresses) continue;

                for (const x of buttons[i]) {
                    newState.jt[x] += min;
                    for (const row of newState.grid) {
                        if (row[x] != '--') row[x] -= min;
                    }
                }
                //console.log(`==Joltages: ${newState.jt.join(',')}`);

                queue.push(JSON.stringify(newState));
            }
        }
        //console.log(`Queue depth: ${queue.length}`);
    }

    return minPresses;
}

async function solveZ3(buttons, joltages) {
    let z3Init = await init();
    const { Int, Optimize } = z3Init.Context("main");
    const optimizer = new Optimize();
    let vars = [];
    for (let b = 0; b < buttons.length; b++) {
        let v = Int.const(`z${b}`);
        optimizer.add(v.ge(0));
        vars.push(v);
    }
    for (let j = 0; j < joltages.length; j++) {
        let cond = Int.val(0);
        for (let b = 0; b < buttons.length; b++) {
            if (buttons[b].includes(j))
                cond = cond.add(vars[b]);
        }
        cond = cond.eq(Int.val(joltages[j]));
        optimizer.add(cond);
    }

    let reduced = vars.reduce((ac, cv) => ac.add(cv), Int.val(0));
    optimizer.minimize(reduced);
    if (await optimizer.check() == "sat")
        return parseInt(optimizer.model().eval(reduced).toString());

    return undefined;
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
    //findJoltagePresses(joltages, buttons);
    let p2 = await solveZ3(buttons, joltages);
    console.log(`P2: ${p2}`);
    fewestButtons2 += p2;

    //fewestButtons2 += presses.steps.length;
}

console.log(`\n\nPart 1: ${fewestButtons}`);
console.log(`Part 2: ${fewestButtons2}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
