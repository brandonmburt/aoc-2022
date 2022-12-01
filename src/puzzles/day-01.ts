/** https://adventofcode.com/2022/day/1 */

export function solvePuzzle1(input: string): [number, number] {

    let curr = 0, totals = [];
    input.split('\n').forEach(x => {
        if (x === '') {
            totals.push(curr);
            curr = 0;
        } else {
            curr += +x;
        }
    });
    totals.sort((a, b) => b-a);

    return [totals[0], totals[0] + totals[1] + totals[2]];

}