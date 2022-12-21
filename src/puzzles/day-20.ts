/** https://adventofcode.com/2022/day/20 */

export function solvePuzzle20(input: string): [number, number] {

    const encrypted: number[] = input.split('\n').map(Number);

    const solve = (encrypted: number[], iterations = 1): number => {
        const DECRYPTION = iterations === 1 ? 1 : 811589153;
        let file: any[] = [...encrypted.map((n, i) => Object({ n: n*DECRYPTION, i }))];
        for (let idx=0; idx<iterations; idx++) {
            encrypted.forEach((n, i) => {
                if (n === 0) return;
                let index: number = file.findIndex(x => x.i === i);
                let [obj] = file.splice(index, 1);
                let newIndex = ((index + obj.n) % file.length);
                file.splice(newIndex, 0, obj);
            });
        }
        let zeroIndex = file.findIndex(x => x.n === 0);
        let arr = [];
        [1000, 2000, 3000].forEach(n => {
            let shift = n % file.length;
            let goalIndex = zeroIndex;
            for (let i=0; i<shift; i++) {
                goalIndex = goalIndex === file.length-1 ? 0 : goalIndex + 1;
            }
            arr.push(file[goalIndex].n);
        });
        return arr.reduce((a, n) => a += n, 0);
    }

    return [solve(encrypted), solve(encrypted, 10)]; // 7395, 1640221678213

}