import * as Puzzles from '../puzzles';
import { FileUtils, DisplayUtils } from './';
import { performance } from 'perf_hooks';
import inRange from 'lodash/inRange';

export class Wrapper {

    public static solve(day: number): void {
        if (!inRange(day, 1, 26)) {
            console.log('Please enter valid number');
        } else {
            const input: string = FileUtils.getInput(day)
            const t1: number = performance.now();
            const [p1, p2] = this.executePuzzle(day, input);
            DisplayUtils.print(day, p1, p2, performance.now()-t1);
        }
        return;
    }

    private static executePuzzle(day: number, input: string): [any, any] {
        switch (day) {
            case 1:
                return Puzzles.solvePuzzle1(input);
            case 2:
                return Puzzles.solvePuzzle2(input);
            case 3:
                return Puzzles.solvePuzzle3(input);
            case 4:
                return Puzzles.solvePuzzle4(input);
            case 5:
                return Puzzles.solvePuzzle5(input);
            default:
                return [0,0];
        }
    }

}
