/** https://adventofcode.com/2022/day/3 */

export function solvePuzzle3(input: string): [number, number] {

    const lower = 'a'.charCodeAt(0) - 1, upper = 'A'.charCodeAt(0) - 27;
    const getVal = (c) => c.charCodeAt(0) - (c === c.toLowerCase() ? lower : upper);

    let p1 = 0, p2 = 0;
    let p2Set = new Set();
    input.split('\n').forEach((row, idx) => {
        // part 1
        const len = row.length;
        const l = row.substring(0, len/2), r = row.substring(len/2);
        const leftSet = new Set(l.split(''));
        for (let i=0; i<r.length; i++) {
            if (leftSet.has(r[i])) {
                p1 += getVal(r[i]);
                break;
            }
        }

        // part 2
        if (idx % 3 === 0) {
            p2Set = new Set(row.split(''));
        } else if (idx % 3 === 1) {
            let tempSet = new Set();
            row.split('').forEach(c => {
               if (p2Set.has(c)) tempSet.add(c); 
            });
            p2Set = tempSet;
        } else {
            for (let i=0; i<len; i++) {
                if (p2Set.has(row[i])) {
                    p2 += getVal(row[i]);
                    break;
                }
            }
        }
    });

    return [p1, p2];

}