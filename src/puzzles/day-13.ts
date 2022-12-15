/** https://adventofcode.com/2022/day/13 */

export function solvePuzzle13(input: string): [number, number] {

    const parse = (strArr: (string | number[])[]): any[] => {
        // Could've simply returned JSON.parse(strArr.join('')) instead of this lol
        while (strArr.findIndex(c => c === ']') !== -1) {
            let closeI = strArr.findIndex(c => c === ']'), openI = closeI-1;
            while (strArr[openI] !== '[') openI--;
            let segment = strArr.splice(openI+1, closeI-openI);
            segment.pop(); // Remove the closing bracket
            let arr = [], curr = '';
            for (let i=0; i<segment.length; i++) {
                if (segment[i] === ',') {
                    if (curr !== '') arr.push(curr);
                    curr = '';
                } else if (typeof segment[i] === 'object') arr.push(segment[i]);
                else curr += segment[i]; 
            }
            if (curr !== '') arr.push(curr);
            strArr[openI] = arr.map(x => typeof x === 'object' ? x : +x);
        }
        return strArr;
    }
    
    const checkArrs = (left: any[], right: any[]): boolean => {
        let lLen = left.length, rLen = right.length;
        for (let i=0; i<Math.min(lLen, rLen); i++) {
            let l = left[i], r = right[i];
            if (typeof l === 'number' && typeof r === 'number' && l !== null && r !== null) {
                if (l === r) continue;
                else return l < r;
            } else {
                let check = checkArrs(typeof l === 'number' ? [l] : l,
                                     typeof r === 'number' ? [r] : r);
                if (check !== null) return check;
            }
        }
        return rLen === lLen ? null : rLen > lLen;
    } 

    let p1Indices = [], d1Index = 1, d2Index = 2;
    input.split('\n\n').forEach((pair, i) => {
        let lines: string[][] = pair.split('\n').map(x => x.split('')).map(x => parse(x));
        lines.forEach(val => {
            if (checkArrs(val, [[2]]) === true) d1Index++;
            if (checkArrs(val, [[6]]) === true) d2Index++;
        });
        if (checkArrs(lines[0], lines[1])) p1Indices.push(i+1);
    });

    return [p1Indices.reduce((a, n) => a += n, 0), d1Index * d2Index]; // 6272, 22288

}