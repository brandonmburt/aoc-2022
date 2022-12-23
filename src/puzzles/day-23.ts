/** https://adventofcode.com/2022/day/23 */

export function solvePuzzle23(input: string): [number, number] {

    const coordToStr = (x, y): string => [String(x), String(y)].join(',');
    const strToCoords = (str): number[] => str.split(',').map(Number);
    const updateDirections = (): void => {
        let first = directions.shift();
        directions.push(first);
    }
    const getNorthAdj = (x, y): number[][] => [[x-1, y-1], [x-1, y], [x-1, y+1]];
    const getSouthAdj = (x, y): number[][] => [[x+1, y-1], [x+1, y], [x+1, y+1]];
    const getWestAdj = (x, y): number[][] => [[x-1, y-1], [x, y-1], [x+1, y-1]];
    const getEastAdj = (x, y): number[][] => [[x-1, y+1], [x, y+1], [x+1, y+1]];
    const getAllAdj = (x, y): number[][] => {
        return [[x-1, y-1], [x-1, y], [x-1, y+1], [x, y-1], [x, y+1], [x+1, y-1], [x+1, y], [x+1, y+1]];
    }
    const getDirectionAdj = (direction, x, y): number[][] => {
        return direction === 'N' ? getNorthAdj(x, y) : 
               direction === 'S' ? getSouthAdj(x, y) :
               direction === 'E' ? getEastAdj(x, y) :
               getWestAdj(x, y);
    }
    const calculateP1 = (): number => {
        let finalCoords: number[][] = [...coords.values()].map(x => strToCoords(x));
        let xVals: number[] = finalCoords.map(c => c[0]);
        let yVals: number[] = finalCoords.map(c => c[1]);
        const width: number = Math.max(...yVals) - Math.min(...yVals);
        const height: number = Math.max(...xVals) - Math.min(...xVals);
        return (width + 1) * (height + 1) - coords.size;
    }

    let coords = new Set();
    input.split('\n').forEach((line, row) => {
        line.split('').forEach((val, col) => {
            if (val === '#') coords.add(coordToStr(row, col));
        });
    });

    let directions = ['N', 'S', 'W', 'E'];
    let p1 = 0, round = 0;
    while (true) {
        round++
        let proposed = new Set(), invalid = new Set(), stationary = new Set();
        let proposalMap = new Map();

        [...coords.values()].forEach((cStr: string) => {
            let [x, y] = strToCoords(cStr);
            if (getAllAdj(x, y).find(([cX, cY]) => coords.has(coordToStr(cX, cY))) === undefined) {
                stationary.add(cStr);
                invalid.add(cStr);
                return;
            }
            let processed = false;
            for (let i=0; i<directions.length; i++) {
                let d = directions[i];
                let adjCoords = getDirectionAdj(d, x, y);
                let proposeMove: boolean = adjCoords.find(([pX, pY]) => coords.has(coordToStr(pX, pY))) === undefined;
                if (proposeMove) {
                    let [pX, pY] = d === 'N' ? [x-1, y] : d === 'S' ? [x+1, y] : d === 'W' ? [x, y-1] : [x, y+1];
                    let pStr = coordToStr(pX, pY);
                    if (invalid.has(pStr)) {
                        stationary.add(cStr);
                    } else if (proposed.has(pStr)) {
                        proposed.delete(pStr);
                        invalid.add(pStr);
                        [cStr, proposalMap.get(pStr)].forEach(x => stationary.add(x));
                    } else {
                        proposed.add(pStr);
                        proposalMap.set(pStr, cStr);
                    }
                    processed = true;
                    break;
                }
            }
            if (!processed) stationary.add(cStr);
        });

        coords.clear();
        [...stationary.values(), ...proposed.values()].forEach(x => coords.add(x));
        updateDirections();

        if (round === 10) p1 = calculateP1();
        if (proposed.size === 0) break;
    }

    return [p1, round]; // 4138, 1010

}