/** https://adventofcode.com/2022/day/9 */

export function solvePuzzle9(input: string): [number, number] {

    const coordToStr = (coord: number[]) => coord[0].toString() + ',' + coord[1].toString();
    const isAdj = (head: number[], tail: number[]): boolean => {
        const [i, j] = head;
        return [
            [i, j],
            [i-1, j],
            [i+1, j],
            [i, j+1],
            [i, j-1],
            [i+1, j+1],
            [i+1, j-1],
            [i-1, j+1],
            [i-1, j-1]
        ].findIndex(coord => coord[0] === tail[0] && coord[1] === tail[1]) !== -1;
    }

    // P1
    let head = [0,0], tail = [0,0]; // arbitrary starting coordinates (0, 0)
    let visited = new Set([coordToStr(tail)]);

    // P2
    let rope: number[][] = [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]];
    let p2Visited = new Set([coordToStr(rope[9])]);

    input.split('\n').forEach(row => {
        const [direction, num] = row.split(' ');
        for (let i=0; i<+num; i++) {

            let prev = [...head];
            let prevRope = rope.map(c => [...c]);

            if (direction === 'U') {
                head[0]--;
                rope[0][0]--;
            } else if (direction === 'D') {
                head[0]++;
                rope[0][0]++;
            } else if (direction === 'L') {
                head[1]--;
                rope[0][1]--;
            } else if (direction === 'R') {
                head[1]++;
                rope[0][1]++;
            }

            // P1
            if (!isAdj(head, tail)) {
                tail = prev;
                visited.add(coordToStr(tail));
            }

            // P2
            let adj = false;
            for (let j=1; j<=9; j++) {
                if (isAdj(rope[j-1], rope[j])) {
                    adj = true;
                } else {
                    if (rope[j][0] === rope[j-1][0]) {
                        rope[j][1] += (rope[j-1][1] - rope[j][1]) / 2;
                        adj = false;
                    } else if (rope[j][1] === rope[j-1][1]) {
                        rope[j][0] += (rope[j-1][0] - rope[j][0]) / 2;
                        adj = false;
                    } else if (!adj) {
                        rope[j] = [...prevRope[j-1]];
                        adj = true;
                    } else {
                        rope[j][0] += rope[j-1][0] - prevRope[j-1][0];
                        rope[j][1] += rope[j-1][1] - prevRope[j-1][1];
                    }
                }
            }
            p2Visited.add(coordToStr(rope[9]));
        }
    });

    return [visited.size, p2Visited.size]; // 6212, 2522

}