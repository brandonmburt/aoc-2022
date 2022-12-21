/** https://adventofcode.com/2022/day/21 */

export function solvePuzzle21(input: string): [number, number] {

    const solve = (p2 = false): number => {
        let valMap = new Map();
        let evalMap = new Map();

        input.split('\n').forEach(line => {
            let [left, right] = line.split(': ');
            if (isNaN(+right)) {
                let [leftID, op, rightID] = right.split(' ');
                evalMap.set(left, { leftID, rightID, op });
            } else {
                valMap.set(left, { val: +right });
            }
        });

        if (p2) valMap.delete('humn'); // delete myself

        while(evalMap.size > 0) {
            let continueProcessing = false;
            evalMap.forEach((v, k) => {
                let { leftID, rightID, op } = v;
                if (valMap.has(leftID) && valMap.has(rightID)) {
                    continueProcessing = true;
                    let l = valMap.get(leftID).val, r = valMap.get(rightID).val;
                    valMap.set(k, { val: op==='+' ? l+r : op==='-' ? l-r : op==='*' ? l*r : op==='/' ? l/r : 0 });
                    evalMap.delete(k);
                }
            });
            if (p2 && !continueProcessing) break;
        }

        if (!p2) {
            return valMap.get('root').val;
        }
        else {

            const root = evalMap.get('root');
            let val = valMap.has(root.leftID) ? valMap.get(root.leftId).val : valMap.get(root.rightID).val;
            let str = valMap.has(root.leftID) ? root.rightID : root.leftID;;

            while (str !== 'humn') {
                let { leftID, op, rightID } = evalMap.get(str);
                if (valMap.has(leftID)) {
                    let lVal = valMap.get(leftID).val;
                    if (op === '-') val = lVal - val;
                    else if (op === '+') val -= lVal;
                    else if (op === '/') val = lVal / val;
                    else if (op === '*') val /= lVal;
                    str = rightID;
                } else if (valMap.has(rightID)) {
                    let rVal = valMap.get(rightID).val;
                    if (op === '-') val += rVal;
                    else if (op === '+') val -= rVal;
                    else if (op === '/') val *= rVal;
                    else if (op === '*') val /= rVal;
                    str = leftID;
                }
            }
            return val;
        }
    }

    return [solve(), solve(true)]; // 169525884255464, 3247317268284

}