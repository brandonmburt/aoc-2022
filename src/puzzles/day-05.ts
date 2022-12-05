/** https://adventofcode.com/2022/day/5 */

export function solvePuzzle5(input: string): [string, string] {

    let stacks: string[][] = [], p2Stacks: string[][] = [];
    let initalized = false;
    input.split('\n').forEach(row => {
        if (!initalized) {
            if (row[1] === '1') { // indicates stack input has been parsed
                initalized = true;
                p2Stacks = stacks.map(s => s.slice());
                return;
            }
            let arr = [];
            for (let i=0; i<row.length; i+=4) {
                arr.push(row.substring(i+1, i+2));
            }
            for (let i=0; i<arr.length; i++) {
                if (!stacks[i]) stacks.push([]); // initialize empty arrays if not present
                if (arr[i] !== ' ') stacks[i].unshift(arr[i]);
            }
        } else {
            const arr = row.split(' ');
            const source = +arr[3] -1, dest = +arr[5] -1;
            let temp = [];
            for (let i=0; i<+arr[1]; i++) {
                let c = stacks[source].pop(), c2 = p2Stacks[source].pop();
                if (!!c) stacks[dest].push(c);
                if (!!c2) temp.unshift(c2);
            }
            if (temp.length > 0) p2Stacks[dest].push(...temp);
        }
    });

    return [stacks.reduce((a, s) => !!s[0] ? a += s.pop() : a, ''),
            p2Stacks.reduce((a, s) =>  !!s[0] ? a += s.pop() : a, '')];

}