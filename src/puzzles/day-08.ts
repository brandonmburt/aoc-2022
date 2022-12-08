/** https://adventofcode.com/2022/day/8 */

export function solvePuzzle8(input: string): [number, number] {

    const isVisible = (row, col): boolean => {
        const val = data[row][col];
        let up = row-1, down = row+1, left = col-1, right = col+1;
        while (up >= 0) {
            if (data[up][col] < val) up--;
            else break;
        }
        if (up === -1) return true;
        while (down < height) {
            if (data[down][col] < val) down++;
            else break;
        }
        if (down === height) return true;
        while (left >= 0) {
            if (data[row][left] < val) left--;
            else break;
        }
        if (left === -1) return true;
        while (right < width) {
            if (data[row][right] < val) right++;
            else break;
        }
        if (right === width) return true;
        return false;
    }

    const getScore = (row, col): number => {
        const val = data[row][col];
        let up = 0, down = 0, left = 0, right = 0;
        for (let i=row-1; i>=0; i--) {
            up++
            if (data[i][col] >= val) break;
        }
        for (let i=row+1; i<height; i++) {
            down++;
            if (data[i][col] >= val) break;
        }
        for (let i=col-1; i>=0; i--) {
            left++;
            if (data[row][i] >= val) break;
        }
        for (let i=col+1; i<width; i++) {
            right++;
            if (data[row][i] >= val) break;
        }
        return up * down * left * right;
    }

    const data = input.split('\n').map(row => row.split('').map(Number));
    const height = data.length, width = data[0].length;
    let p1 = (2 * width) + (2 * height) - 4, p2 = 0;
    for (let i=1; i<height-1; i++) {
        for (let j=1; j<width-1; j++) {
            if (isVisible(i, j)) p1++;
            p2 = Math.max(p2, getScore(i, j));
        }
    }

    return [p1, p2]; // Ugly solution

}