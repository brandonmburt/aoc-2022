/** https://adventofcode.com/2022/day/18 */

export function solvePuzzle18(input: string): [number, number] {

    const cubeToStr = ([x, y, z]) => [x, y, z].map(n => String(n)).join(',');
    const StrToCube = (key) => key.split(',').map(Number);
    const getAdj = ([x, y, z]) => [[x-1,y,z], [x+1,y,z], [x,y-1,z], [x,y+1,z], [x,y,z-1], [x,y,z+1]];
    const updateRanges = ([x, y, z]) => {
        [minX, minY, minZ] = [Math.min(minX, x), Math.min(minY, y), Math.min(minZ, z)];
        [maxX, maxY, maxZ] = [Math.max(maxX, x), Math.max(maxY, y), Math.max(maxZ, z)];
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
    let cubeMap = new Map(), evaledCubes = new Set();

    input.split('\n').forEach(c => {
        let [x, y, z] = c.split(',').map(Number);
        updateRanges([x, y, z]);
        let key = cubeToStr([x, y, z]);
        evaledCubes.add(key);
        let adj = 0;
        getAdj([x, y, z]).forEach(([aX, aY, aZ]) => {
            let adjKey = cubeToStr([aX, aY, aZ]);
            if (cubeMap.has(adjKey)) {
                adj++;
                cubeMap.get(adjKey).count++;
            }
        });
        cubeMap.set(key, { count: adj });
    });

    let p1 = [...cubeMap.values()].reduce((acc, v) => acc += 6 - v.count, 0);

    let allCubes: string[] = [];
    for (let i=minX-1; i<=maxX+1; i++) {
        for (let j=minY-1; j<=maxY+1; j++) {
            for (let k=minZ-1; k<=maxZ+1; k++) {
                allCubes.push(cubeToStr([i, j, k]));
            }
        }
    }

    let emptyCubes = new Set(allCubes.filter(x => !evaledCubes.has(x)));

    let arr = [[minX-1, minY-1, minZ-1]];
    while (arr.length > 0) {
        let [x, y, z] = arr.pop();
        let cKey = cubeToStr([x, y, z]);
        if (emptyCubes.has(cKey)) {
            emptyCubes.delete(cKey);
            arr.push(...getAdj([x, y, z]));
        }
    }

    let p2 = p1 + (6 * emptyCubes.size);
    [...emptyCubes.values()].forEach(key => {
        let [x,y,z] = StrToCube(key);
        getAdj([x,y,z]).forEach(([aX, aY, aZ]) => p2 -= evaledCubes.has(cubeToStr([aX, aY, aZ])) ? 2 : 0);
        evaledCubes.add(key);
    });

    return [p1, p2]; // 4608, 2652

}