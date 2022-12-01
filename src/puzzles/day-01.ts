/** https://adventofcode.com/2022/day/1 */

export function solvePuzzle1(input: string): [number, number] {

    let data: string[] = input.split('\n');
    let curr = 0, calories = [];
    data.forEach(x => {
        if (x === '') {
            calories.push(curr);
            curr = 0;
        } else {
            curr += +x;
        }
    });
    calories.sort((a, b) => b-a);

    return [calories[0], calories[0] + calories[1] + calories[2]];

}