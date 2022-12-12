/** https://adventofcode.com/2022/day/12 */

export function solvePuzzle12(input: string): [number, number] {

    const getElevation = (char: string) => char.charCodeAt(0) - 'a'.charCodeAt(0);
    const findShortestPath = (startingPoints: number[][]): number => {
        let res = Infinity;
        for (let i=0; i<startingPoints.length; i++) {
            let pathLen = Infinity;
            let toEvaluate: Array<[number[], number]> = [[startingPoints[i], 0]];
            while (toEvaluate.length > 0) {
                let [coords, steps] = toEvaluate.shift();
                let [r, c] = coords;
                let val = grid[r][c] === 'S' ? 0 : grid[r][c];
                [[r-1, c], [r+1, c], [r, c-1], [r, c+1]].forEach(adj => {
                    let [row, col] = adj;
                    if (!grid[row] || !grid[row][col]) return;
                    if (grid[row][col] === 'E' && (val === 24 || val === 25)) {
                        pathLen = Math.min(steps+1, pathLen);
                    } else if (grid[row][col] <= val+1 && steps+1 < minSteps[row][col]) {
                        minSteps[row][col] = steps+1;
                        toEvaluate.push([[row, col], steps+1]);
                    }
                });
            }
            res = Math.min(res, pathLen);
        }
        return res;
    }

    let start = [0, 0], end = [0, 0], grid = [], minSteps = [], p2StartingPoints = [];
    input.split('\n').forEach((row, i) => {
        grid.push(row.split('').map(c => c === 'S' || c === 'E' ? c : getElevation(c)));
        for (let idx=0; idx<row.length; idx++) {
            if (row[idx] === 'S') start = [i, idx];
            else if (row[idx] === 'E') end = [i, idx];
            else if (row[idx] === 'a') p2StartingPoints.push([i, idx]);
        }
        minSteps.push(new Array(row.length).fill(Infinity));
    });

    return [findShortestPath([start]), findShortestPath(p2StartingPoints)]; // 412, 402

}