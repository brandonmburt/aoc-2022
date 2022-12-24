/** https://adventofcode.com/2022/day/24 */

export function solvePuzzle24(input: string): [number, number] {

    let valley: string[][] = input.split('\n').map(line => line.split(''));
    const topWall = 0, bottomWall = valley.length-1;
    const leftWall = 0, rightWall = valley[0].length-1;
    const goalCol = valley[bottomWall].findIndex(c => c === '.'); // exit point is implicitly in bottomWall

    const coordsToStr = (row, col): string => [row, col].join(',');
    const strToCoords = (str): number[] => str.split(',').map(Number);
    const shiftUp = (row, col) => [row-1 === topWall ? bottomWall-1 : row-1, col];
    const shiftDown = (row, col) => [row+1 === bottomWall ? topWall+1 : row+1, col];
    const shiftLeft = (row, col) => [row, col-1 === leftWall ? rightWall-1 : col-1];
    const shiftRight = (row, col) => [row, col+1 === rightWall ? leftWall+1 : col+1];
    const minPossible = (row, col, minutes) => (bottomWall-row) + (goalCol-col) + minutes;

    let valleyMap = new Map();
    for (let i=topWall+1; i<bottomWall; i++) {
        for (let j=leftWall+1; j<rightWall; j++) {
            if (valley[i][j] !== '.') valleyMap.set(coordsToStr(i, j), { blizzards: [valley[i][j]] });
        }
    }

    const updateValley = (vall): Map<any, any> => {
        let newValley = new Map();
        vall.forEach((v, k) => {
            let [r, c] = strToCoords(k);
            v.blizzards.forEach(b => {
                let [r2, c2] = b === '^' ? shiftUp(r,c) : b === 'v' ? shiftDown(r,c) :
                               b === '<' ? shiftLeft(r,c) : shiftRight(r,c);
                let k2 = coordsToStr(r2, c2);
                if (newValley.has(k2)) {
                    newValley.get(k2).blizzards.push(b);
                } else {
                    newValley.set(k2, { blizzards: [b] });
                }
            });
        });
        return newValley;
    }

    const getMinTime = (start: string, goal: string, startMin: number): number => {
        let [sR, sC] = strToCoords(start);
        let [gR, gC] = strToCoords(goal);
        let paths: Set<string> = new Set([start]); // pre-populate with starting coord
        let minMinutes = Infinity, minute = startMin;
        while (paths.size > 0) {
            valleyMap = updateValley(valleyMap);
            minute++;
            let newPaths: Set<string> = new Set();
            [...paths.values()].forEach(p => {
                let options: number[][] = []; // possible new coords
                let [r, c] = strToCoords(p);
                options = r === topWall ? [[r,c], [r+1,c]] : r === bottomWall ? [[r,c], [r-1,c]] :
                          [[r,c], [r+1,c], [r-1,c], [r,c+1], [r,c-1]];
                options = options.filter(([oR, oC]) => {
                    if ((oR === sR && oC === sC) || (oR === gR && oC === gC)) return true;
                    else if (oR === topWall || oR === bottomWall || oC === leftWall || oC === rightWall) return false;
                    else return true;
                });
                options.forEach(([oR, oC]) => {
                    let opStr = coordsToStr(oR, oC);
                    if (oR === gR && oC === gC) {
                        minMinutes = Math.min(minMinutes, minute);
                    } else if (valleyMap.has(opStr) || minPossible(oR, oC, minute) > minMinutes) {
                        return;
                    } else {
                        newPaths.add(opStr)
                    }
                });
            });
            paths = newPaths;
        }
        return minMinutes;
    }

    const startStr = coordsToStr(0, 1), endStr = coordsToStr(bottomWall, goalCol);
    const p1: number = getMinTime(startStr, endStr, 0);
    const toStart: number = getMinTime(endStr, startStr, 1);
    const toEnd: number = getMinTime(startStr, endStr, 1);
    const p2: number = p1 + toStart + toEnd;

    return [p1, p2]; // 228, 723

}