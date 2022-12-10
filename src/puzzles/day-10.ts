/** https://adventofcode.com/2022/day/10 */

export function solvePuzzle10(input: string): [number, any] {

    let p1 = 1, i = 1, p1Products = [], crt = [], curr = '', vals = [];
    input.split('\n').forEach(row => {
        vals.push(0);
        if (row !== 'noop') vals.push(+row.split(' ')[1]);
    });

    while (vals.length > 0) {
        let idx = (i-1) % 40;
        curr += (p1 === idx || p1-1 === idx || p1+1 === idx) ? '#' : '.';
        if (curr.length === 40) {
            crt.push(curr);
            curr = '';
        }
        if ((i-20) % 40 === 0) p1Products.push(i*p1);
        p1 += vals.shift();
        i++;
    }

    crt.forEach(row => console.log(row)); // Print P2
    return [p1Products.reduce((a, n) => a += n ,0), 'View Console']; // 12540, FECZELHE

}