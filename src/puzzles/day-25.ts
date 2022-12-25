/** https://adventofcode.com/2022/day/25 */

export function solvePuzzle25(input: string): [string, string] {

    const getInt = (c: string) => c === '=' ? -2 : c === '-' ? -1 : +c;
    const snafuToNum = (s: string): number => {
        return s.split('').reverse().reduce((a, c, i) => a += (getInt(c) * Math.pow(5, i)), 0);
    }
    const nextVal = (c: string) => c==='2' ? '1' : c==='1' ? '0' : c==='0' ? '-' : c==='-' ? '=' : '';

    // Calculate the sum of all input SNAFU numbers
    let sum: number = input.split('\n').reduce((acc, str) =>acc += snafuToNum(str), 0);

    // Generate the shortest SANFU consisting of only '2's which is greater than our sum
    let snafu = '2';
    while(snafuToNum(snafu) < sum) snafu += '2';

    // Decrease each SNAFU digit (from left to right) while the sum is greater than our target value
    let index = 0;
    while(index < snafu.length) {
        let c = snafu[index];
        if (c === '=') {
            index++;
            continue;
        }
        let newSnafu = snafu.substring(0, index) + nextVal(c) + snafu.substring(index+1);
        let num = snafuToNum(newSnafu);
        if (num >= sum) {
            snafu = newSnafu;
            if (num === sum) break;
        } else {
            index++;
        }
    }

    return [snafu, 'N/A'];

}