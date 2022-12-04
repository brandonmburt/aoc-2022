/** https://adventofcode.com/2022/day/4 */

export function solvePuzzle4(input: string): [number, number] {

    let p1 = 0, p2 = 0;
    input.split('\n').forEach(row => {
        let [l, r] = row.split(',').map(pair => pair.split('-').map(Number));
        p1 += l[0] >= r[0] && l[1] <= r[1] || r[0] >= l[0] && r[1] <= l[1] ? 1 : 0;
        p2 += l[0] <= r[1] && r[0] <= l[1] ? 1 : 0;
    });

    return [p1, p2];

}