/** https://adventofcode.com/2022/day/14 */

export function solvePuzzle14(input: string): [number, number] {

    const getCol = (col: number): number => col - minCol;

    const getCoords = (coord: number[]): number[][] => {
        const [col, row] = coord;
        return row === maxRow ? [] : [[col, row+1], [col-1, row+1], [col+1, row+1]];
    }

    const widenGrid = (g: string[][]): void => {
        g.forEach(r => {
            r.unshift('.');
            r.push('.');
        });
        g[g.length-1][0] = '#';
        g[g.length-1][g[0].length-1] = '#';
        minCol -= 1;
        maxCol += 1;
        rowWidth += 2;
    }

    // simulate the dropping sand. Set 'p2' to true for part 2
    const dropSand = (sandGrid: string[][], p2 = false): number => {
        if (p2) {
            sandGrid.push(new Array(rowWidth).fill('.')); // empty row
            sandGrid.push(new Array(rowWidth).fill('#')); // floor
            maxRow += 2;
        }
        while (true) {
            let curr = [getCol(500), 0];
            let possible = getCoords(curr);
            while (possible.find(x => sandGrid[x[1]][x[0]] === '.') !== undefined) {
                curr = possible.find(x => sandGrid[x[1]][x[0]] === '.');
                if (p2 && (curr[0] === 1 || curr[0] === rowWidth-1) && curr[1]+1 === maxRow) {
                    widenGrid(sandGrid);
                    curr[0] += 1;
                }
                possible = getCoords(curr);
            }
            if (sandGrid[curr[1]][curr[0]] === 'o' || curr[1] === maxRow) break;
            else sandGrid[curr[1]][curr[0]] = 'o';
        }
        return sandGrid.reduce((acc, row) => acc += row.filter(x => x === 'o').length, 0);
    }

    // parse input, extract relevant min and max row/col values
    let minCol = Infinity, maxRow = -Infinity, maxCol = -Infinity;
    let arrs: number[][][] = input.split('\n').map(line => {
        let arr: number[][] = line.split(' -> ').map(coord => {
            let [col, row] = coord.split(',').map(Number);
            minCol = Math.min(minCol, col);
            maxCol = Math.max(maxCol, col);
            maxRow = Math.max(maxRow, row);
            return [col, row];
        });
        return arr;
    });

    // generate grids
    let grid: string[][] = [], gridP2: string[][] = [];
    let rowWidth = maxCol - minCol + 1;
    for (let i=0; i<=maxRow; i++) {
        grid.push(new Array(rowWidth).fill('.'));
        gridP2.push(new Array(rowWidth).fill('.'));
    }

    // populate grids
    arrs.forEach(coords => {
        let corner = [getCol(coords[0][0]), coords[0][1]]; // edge = [col, row]
        for (let i=1; i<coords.length; i++) {
            let next = [getCol(coords[i][0]), coords[i][1]];
            if (corner[0] === next[0]) { // col is constant
                for (let j=Math.min(corner[1], next[1]); j<=Math.max(corner[1], next[1]); j++) {
                    grid[j][corner[0]] = '#';
                    gridP2[j][corner[0]] = '#';
                }
            } else { // row is constant
                for (let j=Math.min(corner[0], next[0]); j<=Math.max(corner[0], next[0]); j++) {
                    grid[corner[1]][j] = '#';
                    gridP2[corner[1]][j] = '#';
                }
            }
            corner = next;
        }
    });
    
    return [dropSand(grid), dropSand(gridP2, true)]; // 795, 30214

}