/** https://adventofcode.com/2022/day/6 */

export function solvePuzzle6(input: string): [number, number] {

    const findIndex = (len: number): number => {
        for (let i=len; i<input.length; i++) {
            if (new Set(input.substring(i-len, i)).size === len) return i;
        }
    }
    return [findIndex(4), findIndex(14)];

}