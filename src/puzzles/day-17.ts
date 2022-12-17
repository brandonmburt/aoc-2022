/** https://adventofcode.com/2022/day/17 */

export function solvePuzzle17(input: string): [number, number] {

    const TUNNEL_WIDTH = 7;
    const JET_PATTERN_LENGTH = input.length;
    const ROCKS = [
        [
            ['.','.','#','#','#','#','.']
        ],
        [
            ['.','.','.','#','.','.','.'],
            ['.','.','#','#','#','.','.'],
            ['.','.','.','#','.','.','.']
        ],
        [
            ['.','.','.','.','#','.','.'],
            ['.','.','.','.','#','.','.'],
            ['.','.','#','#','#','.','.']
        ],
        [
            ['.','.','#','.','.','.','.'],
            ['.','.','#','.','.','.','.'],
            ['.','.','#','.','.','.','.'],
            ['.','.','#','.','.','.','.']
        ],
        [
            ['.','.','#','#','.','.','.'],
            ['.','.','#','#','.','.','.']
        ]
    ];

    const getFirstRockIndex = (tunnel: string[][]): number => tunnel.findIndex(r => r.find(x => x === '#'));
    const getDirection = (index: number): string => input[index % JET_PATTERN_LENGTH];
    const getTowerHeight = (tunnel: string[][]): number => tunnel.length - getFirstRockIndex(tunnel) - 1;
    const getRock = (i: number): string[][] => ROCKS[i % ROCKS.length].map(r => r.slice());

    const updateTunnel = (rock: string[][], tunnel: string[][]): string[][] => {
        let firstRockIndex = getFirstRockIndex(tunnel);
        if (firstRockIndex > 3) {
            for (let i=firstRockIndex; i>3; i--) {
                tunnel.shift();
            }
        } else if (firstRockIndex < 3) {
            for (let i=firstRockIndex; i<3; i++) {
                tunnel.unshift(new Array(TUNNEL_WIDTH).fill('.'));
            }
        }
        tunnel = [...rock, ...tunnel];
        return tunnel;
    }

    const getRockIndices = (rock: string[][]): number[][] => {
        let indices = [];
        rock.forEach((row, i) => {
            row.forEach((c, j) => {
                if (c === '#') {
                    indices.push([i, j]);
                }
            });
        });
        return indices;
    }

    const adjustRockPlacement = (rockIndices: number[][], direction: string, tunnel: string[][]): number[][] => {
        if (direction === '<') {
            let leftmostCol = rockIndices.reduce((acc, rock) => Math.min(rock[1], acc), TUNNEL_WIDTH-1);
            if (leftmostCol === 0) {
                return rockIndices;
            } else {
                let rowIndices = new Set([...rockIndices.map(rock => rock[0])]);
                let leftmostColByRow = [];
                [...rowIndices.values()].forEach(rowI => {
                    let arr = rockIndices.filter(rock => rock[0] === rowI).sort((a,b) => a[1]-b[1]);
                    leftmostColByRow.push([rowI, arr[0][1]]);
                });

                for (let i=0; i<leftmostColByRow.length; i++) {
                    let [row, col] = leftmostColByRow[i];
                    if (tunnel[row][col-1] === '#') return rockIndices;
                }
                rockIndices.forEach(([row, col]) => tunnel[row][col] = '.' );
                return rockIndices.map(([row, col]) => {
                    tunnel[row][col-1] = '#';
                    return [row, col-1];
                });
            }
        } else if (direction === '>') {
            let rightmostCol = rockIndices.reduce((acc, rock) => Math.max(rock[1], acc), 0);
            if (rightmostCol === TUNNEL_WIDTH-1) {
                return rockIndices;
            } else {
                let rowIndices = new Set([...rockIndices.map(rock => rock[0])]);
                let rightmostColByRow = [];
                [...rowIndices.values()].forEach(rowI => {
                    let arr = rockIndices.filter(rock => rock[0] === rowI).sort((a,b) => b[1]-a[1]);
                    rightmostColByRow.push([rowI, arr[0][1]]);
                });

                for (let i=0; i<rightmostColByRow.length; i++) {
                    let [row, col] = rightmostColByRow[i];
                    if (tunnel[row][col+1] === '#') return rockIndices;
                }
                rockIndices.forEach(([row, col]) => tunnel[row][col] = '.' );
                return rockIndices.map(([row, col]) => {
                    tunnel[row][col+1] = '#';
                    return [row, col+1];
                });
            }
        }
    }

    // returns true if we can successfull move down a level, otherwise false
    const canMoveDown = (rockIndices: number[][], tunnel: string[][]): boolean => {
        let rockCols = [...new Set([...rockIndices.map(rock => rock[1])]).values()];
        let lowestRockIndicesByCol = [];
        rockCols.forEach(col => {
            let rockRowsInCol = rockIndices.filter(rock => rock[1]===col).map(rock => rock[0]);
            if (rockRowsInCol.length === 0) return;
            lowestRockIndicesByCol.push([Math.max(...rockRowsInCol), col]);
        });
        for (let i=0; i<lowestRockIndicesByCol.length; i++) {
            let [row, col] = lowestRockIndicesByCol[i];
            if (tunnel[row+1][col] === '#') return false;
        }
        return true;
    }

    const moveDown = (rockIndices: number[][], tunnel: string[][]): number[][] => {
        rockIndices.forEach(([row, col]) => tunnel[row][col] = '.');
        return rockIndices.map(([row, col]) => {
            tunnel[row+1][col] = '#';
            return [row+1, col];
        });
    }

    // generate map key as the first 8 rows of our tunnel, starting with the first instance of a rock
    const getKey = (tunnel: string[][]): string => {
        let i = 0;
        while (tunnel[i] && tunnel[i].find(x => x === '#') === undefined) i++;
        let res = '';
        for (let x=0; x<8; x++) {
            let index = i+x;
            res += !!tunnel[index] ? tunnel[index].join('') : '';
        }
        return res;
    }

    const solve = (n: number, p2 = false): number => {
        let patternMap = new Map(); // only used in p2
        let calculatedHeight = 0; // only used in p2
        let done = false;
        let tunnelGrid: string[][] = [['#','#','#','#','#','#','#']]; // Pre-populate with the floor
        let numDropped = 0, jetIndex = 0;
        while (numDropped < n) {
            let rock = getRock(numDropped);
            numDropped++;
            let rockIndices = getRockIndices(rock);
            tunnelGrid = updateTunnel(rock, tunnelGrid);
            while (true) {
                rockIndices = adjustRockPlacement(rockIndices, getDirection(jetIndex), tunnelGrid);
                jetIndex++;
                if (!canMoveDown(rockIndices, tunnelGrid)) break;
                rockIndices = moveDown(rockIndices, tunnelGrid);
            }

            if (p2 && !done && numDropped > 100) {
                let mapKey = getKey(tunnelGrid) +
                        (numDropped % ROCKS.length).toString() + ',' +
                        (jetIndex % JET_PATTERN_LENGTH).toString();
                if (patternMap.has(mapKey)) {
                    patternMap.get(mapKey).heights.push([getTowerHeight(tunnelGrid), numDropped]);

                    let [first, second] = patternMap.get(mapKey).heights;
                    let heightDiff = second[0]-first[0];
                    let increment = second[1]-first[1];

                    let toDrop = n - numDropped;
                    let multiple = Math.floor(toDrop / increment)
                    calculatedHeight = multiple * heightDiff;
                    let remToDrop = toDrop % increment;
                    done = true;
                    numDropped = n - remToDrop;
                } else {
                    patternMap.set(mapKey, { heights: [[getTowerHeight(tunnelGrid), numDropped]] })
                }
            }
        }
        return getTowerHeight(tunnelGrid) + calculatedHeight;
    }

    return [solve(2022), solve(1000000000000, true)]; // 3048, 1504093567249

}