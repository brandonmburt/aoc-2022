/** https://adventofcode.com/2022/day/16 */

export function solvePuzzle16(input: string): [number, number] {

    const MINUTES = 30, P2MINUTES = 26;
    let p1 = 0, p2 = 0;

    let flowRates = new Map(); // valve: string => flowRate: number
    let valveMap = new Map(); // valve: string => valves: string[]
    const allValves: string[] = [], pressureValves: string[] = [];

    input.split('\n').forEach(line => {
        let [left, right] = line.split('; ');
        let valve = left.split(' ')[1];
        right = right.replace('valve ', 'valves ');
        let valves = right.split('valves ')[1].split(', ');
        allValves.push(valve);
        let flowRate = +left.split('=')[1];
        if (flowRate > 0) pressureValves.push(valve);
        valveMap.set(valve, valves);
        flowRates.set(valve, flowRate);
    });

    // calculate the steps required to move from one pressure value to another
    let distanceMap = new Map();
    allValves.forEach(startingValve => {
        let visited = new Set([startingValve]);
        let destinations = new Set (pressureValves);
        let destinationCosts = [];
        let toEval = [startingValve];
        let currSteps = 0;
        while (destinations.size > 0) {
            let temp = [];
            while (toEval.length > 0) {
                let curr = toEval.shift();
                let oneStepAway = valveMap.get(curr);
                visited.add(curr);
                oneStepAway.forEach(dest => {
                    if (destinations.has(dest)) {
                        destinationCosts.push([dest, currSteps+1]);
                        destinations.delete(dest);
                    }
                    if (!visited.has(dest)) temp.push(dest);
                });
            }
            toEval = temp;
            currSteps++;
        }
        destinationCosts = destinationCosts.filter(x => x[0] !== startingValve);
        distanceMap.set(startingValve, destinationCosts);
    });

    const updateSets = (obj, newlyVisited: string[]): any => {
        newlyVisited.forEach(valve => {
            obj.visited.add(valve);
            obj.toVisit.delete(valve);
        });
        return obj;
    }

    const updateP1 = (obj): void => {
        let remSteps = MINUTES - obj.time - 1;
        let val = (remSteps * obj.inc) + obj.value;
        p1 = Math.max(p1, val);
    }

    const getScore = (obj): void => {
        let remSteps = P2MINUTES - obj.time - 1;
        return (remSteps * obj.inc) + obj.value;
    }

    const updateValue = (obj, newSteps, newinc): any => {
        obj.time += newSteps;
        obj.value += (newSteps * obj.inc) + newinc;
        obj.inc += newinc;
        return obj;
    }

    const getSteps = (currValve, destValve): number => {
        return distanceMap.get(currValve).find(x => x[0] === destValve)[1] + 1;
    }

    const copyObj = (obj): object => {
        return {
            ...obj,
            visited: new Set([...obj.visited.values()]),
            toVisit: new Set([...obj.toVisit.values()])
        };
    }

    const convertArrToSortedKeyStr = (arr: string[]): string => {
        arr = arr.sort((a, b) => (a > b ? -1 : 1));
        return arr.join('');
    }

    const convertKeyStrToArr = (str: string): string[] => {
        let res = [];
        for (let i=0; i<str.length; i++) {
            res.push(str[i] + str[i+1]);
        }
        return res;
    }

    let possible = [{
        current: 'AA',
        time: 0,
        value: 0,
        inc: 0,
        visited: new Set(),
        toVisit: new Set(pressureValves)
    }];
    let pathScores = new Map();

    while (possible.length > 0) {
        let curr = possible.pop();
        if (curr.current !== 'AA' && curr.time <= P2MINUTES) {
            let visited: any[] = [...curr.visited.values()];
            let key = convertArrToSortedKeyStr(visited);
            let val = getScore(curr);
            if (pathScores.has(key)) {
                let prevVal = pathScores.get(key);
                if (val > prevVal) {
                    pathScores.set(key, val);
                }
            } else {
                pathScores.set(key, val);
            }
        }
        if (curr.toVisit.size === 0) {
            updateP1(curr);
        } else {
            curr.toVisit.forEach(dest => {
                let newObj: any = copyObj(curr);
                let steps = getSteps(newObj.current, dest);
                if (newObj.time + steps > MINUTES) {
                    updateP1(curr);
                } else {
                    newObj.current = dest;
                    let destinc = flowRates.get(dest);
                    newObj = updateValue(newObj, steps, destinc);
                    newObj = updateSets(newObj, [dest]);
                    possible.push(newObj);
                }
            });
        }
    }

    pathScores.forEach((val, key) => {
        let keyArr = convertKeyStrToArr(key);
        let usedKeySet = new Set(keyArr);
        pathScores.forEach((val2, key2) => {
            let keyArr2 = convertKeyStrToArr(key2);
            if (keyArr2.find(x => usedKeySet.has(x)) === undefined) {
                p2 = Math.max(p2, val + val2);
            }
        });
    });

    return [p1, p2]; // 1850, 2306

}