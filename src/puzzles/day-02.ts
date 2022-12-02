/** https://adventofcode.com/2022/day/2 */

export function solvePuzzle2(input: string): [number, number] {

    const conversion = new Map([['X', 'A'], ['Y', 'B'], ['Z', 'C']]);
    const score = new Map([['A', 1], ['B', 2], ['C', 3]]);

    const getWinningShape = (opp: string): string => opp === 'A' ? 'B' : opp === 'B' ? 'C' : 'A';
    const getLosingShape = (opp: string): string => opp === 'A' ? 'C' : opp === 'B' ? 'A' : 'B';

    let p1 = 0, p2 = 0;
    input.split('\n').forEach(row => {
        let [opp, play] = row.split(' ');
        let shape = conversion.get(play);

        // part 1
        p1 += score.get(shape);
        p1 += opp === shape ? 3 : shape === getWinningShape(opp) ? 6 : 0;
        
        // part 2
        shape = play === 'Y' ? opp : play === 'X' ? getLosingShape(opp) : getWinningShape(opp);
        p2 += score.get(shape);
        p2 += play === 'Y' ? 3 : play === 'Z' ? 6 : 0;
    });

    return [p1, p2];

}