/** https://adventofcode.com/2022/day/22 */

export function solvePuzzle22(input: string): [number, number] {

    const dirMap = new Map([['left', '<'], ['right', '>'], ['up', '^'], ['down', 'v']]);
    const clockwise = new Map([['up', 'right'], ['right', 'down'], ['down', 'left'], ['left', 'up']]);
    const counterclockwise = new Map([['up', 'left'], ['left', 'down'], ['down', 'right'], ['right', 'up']]);

    const rotate = (orientation: string, instruction: string): string => {
        return instruction === 'R' ?  clockwise.get(orientation) : counterclockwise.get(orientation);
    }

    // return the coordinates for the next non-empty cell, regardless of its contents
    const getNextPosition = (direction: string, curr: number[], g: string[][]): number[] => {
        let [row, col] = curr;
        if (direction === 'right') {
            if(col+1 < maxCol && g[row][col+1] !== ' ') {
                return [row, col+1];
            } else {
                let newCol = g[row].findIndex(x => x !== ' ');
                return [row, newCol];
            }
        } else if (direction === 'left') {
            if (col-1 >= 0 && g[row][col-1] !== ' ') {
                return [row, col-1];
            } else {
                let newCol = maxCol-1;
                while (g[row][newCol] === ' ') newCol--;
                return [row, newCol];
            }
        } else if (direction === 'up') {
            if (row-1 >= 0 && g[row-1][col] !== ' ') {
                return [row-1, col];
            } else {
                let newRow = maxRow-1;
                while (g[newRow][col] === ' ') newRow--;
                return [newRow, col];
            }
        } else if (direction === 'down') {
            if (row+1 < maxRow && g[row+1][col] !== ' ') {
                return [row+1, col];
            } else {
                let newRow = 0;
                while (g[newRow][col] === ' ') newRow++;
                return [newRow, col];
            }
        }
    }

    let [board, instructions] = input.split('\n\n');
    let arr = board.split('\n');
    let maxCol = arr.reduce((a,r) => a=Math.max(a, r.length), 0), maxRow = arr.length;

    // Generate the grid and account for empty space
    let grid: string[][] = [], gridP2: string[][] = [];
    arr.forEach(row => {
        let arr = [...row.split('')];
        if (arr.length < maxCol) {
            arr.push(...new Array(maxCol - arr.length).fill(' '));
        }
        grid.push(arr);
        gridP2.push([...arr]);
    });

    // Parse instructions and rotations into one array
    let moves = [], curr = '';
    instructions.split('').forEach(c => {
        if (isNaN(+c)) {
            moves.push(+curr, c);
            curr = '';
        } else {
            curr += c;
        }
    });
    if (curr !== '') moves.push(+curr);

    const solveP1 = (): number => {

        let position = [0, grid[0].findIndex(x => x === '.')];
        grid[position[0]][position[1]] = '>'; // pre-populate the initial cell
        let direction = 'right';
        moves.forEach(x => {
            if (isNaN(x)) {
                direction = rotate(direction, x);
                grid[position[0]][position[1]] = dirMap.get(direction);
            } else {
                for (let i=0; i<x; i++) {
                    let [newRow, newCol] = getNextPosition(direction, position, grid);
                    if (grid[newRow][newCol] !== '#' && grid[newRow][newCol] !== ' ') {
                        grid[newRow][newCol] = dirMap.get(direction);
                        position = [newRow, newCol];
                    } else {
                        break;
                    }
                }
            }
        });

        let [row, col] = position;
        let dirVal = direction === 'right' ? 0 : direction === 'down' ? 1 : direction === 'left' ? 2 : 3;
        return (1000 * (row+1)) + (4 * (col+1)) + dirVal;

    }

    const getFace = (row: number, col: number): string => {
        if (row >= 0 && row < 50 && col >= 50 && col < 100) {
            return 'back';
        } else if (row >= 0 && row < 50 && col >= 100 && col < 150) {
            return 'right';
        } else if (row >= 50 && row < 100 && col >= 50 && col < 100) {
            return 'top';
        } else if (row >= 100 && row < 150 && col >= 0 && col < 50) {
            return 'left';
        } else if (row >= 100 && row < 150 && col >= 50 && col < 100) {
            return 'front';
        } else if (row >= 150 && row < 200 && col >= 0 && col < 50) {
            return 'bottom';
        }
    }

    // return [row, col, direction]
    const getNextPositionP2 = (direction: string, curr: number[]): any[] => {
        let [row, col] = curr;
        let currFace = getFace(row, col);

        if (currFace === 'front') {  // 100 <= row < 150; 50 <= col < 100
            if (direction === 'up' && row === 100) {
                return [99, col, 'up'];
            } else if (direction === 'down' && row === 149) {
                return [150 + (col-50), 49, 'left'];
            } else if (direction === 'left' && col === 50) {
                return [row, 49, 'left'];
            } else if (direction === 'right' && col === 99) {
                return [149-row, 149, 'left'];
            }
        } else if (currFace === 'top') { // 50 <= row < 100; 50 <= col < 100
            if (direction === 'up' && row === 50) {
                return [49, col, 'up'];
            } else if (direction === 'down' && row === 99) {
                return [100, col, 'down'];
            } else if (direction === 'left' && col === 50) {
                return [100, row-50, 'down'];
            } else if (direction === 'right' && col === 99) {
                return [49, 100 + (row-50), 'up'];

            }
        } else if (currFace === 'back') { // 0 <= row < 50; 50 <= col < 100
            if (direction === 'up' && row === 0) {
                return [150 + (col-50), 0, 'right'];
            } else if (direction === 'down' && row === 49) {
                return [50, col, 'down'];
            } else if (direction === 'left' && col === 50) {
                return [149 - row, 0, 'right'];
            } else if (direction === 'right' && col === 99) {
                return [row, 100, 'right'];
            }
        } else if (currFace === 'bottom') { // 150 <= row < 200; 0 <= col < 50
            if (direction === 'up' && row === 150) {
                return [149, col, 'up'];
            } else if (direction === 'down' && row === 199) {
                return [0, 100 + col, 'down'];
            } else if (direction === 'left' && col === 0) {
                return [0, 50 + (row-150), 'down'];
            } else if (direction === 'right' && col === 49) {
                return [149, 50 + (row - 150), 'up'];
            }
        } else if (currFace === 'left') { // 100 <= row < 150; 0 <= col < 50
            if (direction === 'up' && row === 100) {
                return [50 + col, 50, 'right'];
            } else if (direction === 'down' && row === 149) {
                return [150, col, 'down'];
            } else if (direction === 'left' && col === 0) {
                return [149 - row, 50, 'right'];
            } else if (direction === 'right' && col === 49) {
                return [row, 50, 'right'];
            }
        } else if (currFace === 'right') { // 0 <= row < 50; 100 <= col < 150
            if (direction === 'up' && row === 0) {
                return [199, col - 100, 'up'];
            } else if (direction === 'down' && row === 49) {
                return [50 + (col - 100), 99, 'left'];
            } else if (direction === 'left' && col === 100) {
                return [row, 99, 'left'];
            } else if (direction === 'right' && col === 149) {
                return [100 + (49-row), 99, 'left'];
            }
        }

        let newRow = direction === 'up' ? row - 1 : direction === 'down' ? row + 1 : row;
        let newCol = direction === 'left' ? col - 1 : direction === 'right' ? col + 1 : col;
        return [newRow, newCol, direction];

    }

    const solveP2 = (): number => {
        
        let position = [0, gridP2[0].findIndex(x => x === '.')];
        gridP2[position[0]][position[1]] = '>'; // pre-populate the initial cell
        let direction = 'right';

        moves.forEach(x => {
            if (isNaN(x)) {
                direction = rotate(direction, x);
                gridP2[position[0]][position[1]] = dirMap.get(direction);
            } else {
                for (let i=0; i<x; i++) {
                    let [newRow, newCol, newDir] = getNextPositionP2(direction, position);
                    if (gridP2[newRow][newCol] !== '#') {
                        direction = newDir;
                        gridP2[newRow][newCol] = dirMap.get(direction);
                        position = [newRow, newCol];
                    } else {
                        break;
                    }
                }
            }
        });

        let [row, col] = position;
        let dirVal = direction === 'right' ? 0 : direction === 'down' ? 1 : direction === 'left' ? 2 : 3;
        return (1000 * (row+1)) + (4 * (col+1)) + dirVal;
    }

    return [solveP1(), solveP2()]; // 162186, 55267

}