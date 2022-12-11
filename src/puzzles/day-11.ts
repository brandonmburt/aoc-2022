/** https://adventofcode.com/2022/day/11 */

interface Monkey {
    items: number[];
    operation: any;
    divisor: number;
    trueDest: number;
    falseDest: number;
    count: number;
}

export function solvePuzzle11(input: string): [number, number] {

    let monkeys: Monkey[] = [], p2Monkeys: Monkey[] = [], divisors = [];

    input.split('\n\n').forEach(monkey => {
        let arr = monkey.split('\n');
        let startingItems = arr[1].split(': ')[1].replace(' ', '').split(',').map(Number);

        let opArr = arr[2].split(': ')[1].split(' ');
        let func = (old: number): number => {
            let n = opArr[4] === 'old' ? old : +opArr[4];
            return opArr[3] === '+' ? old + n : old * n;
        }

        let divisor = +arr[3].split(' ')[5];
        divisors.push(divisor);
        
        let m: Monkey = {
            items: startingItems,
            operation: func,
            divisor,
            trueDest: +arr[4].split(' ')[9],
            falseDest: +arr[5].split(' ')[9],
            count: 0
        }
        monkeys.push(m);
        p2Monkeys.push({...m, items: [...startingItems]});
    });

    const CONSTANT = divisors.reduce((a, n) => a*=n, 1);
    const solve = (arr: Monkey[], rounds: number, p2 = false): number => {
        for (let i=0; i<rounds; i++) {
            arr.forEach(m => {
                m.count += m.items.length;
                while (m.items.length > 0) {
                    let item = m.items.shift();
                    item = m.operation(item);
                    item = p2 ? item % CONSTANT : Math.floor(item/3);
                    arr[item % m.divisor === 0 ? m.trueDest : m.falseDest].items.push(item);
                }
            });
        }
        let counts = arr.map(m => m.count).sort((a,b) => b-a);
        return counts[0] * counts[1];
    }

    return [solve(monkeys, 20), solve(p2Monkeys, 10000, true)];

}