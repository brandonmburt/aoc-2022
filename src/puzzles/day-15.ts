/** https://adventofcode.com/2022/day/15 */

export function solvePuzzle15(input: string): [number, number] {

    // P1 variables/objects
    const TARGET = 2000000;
    let xVals = new Set(), toExclude = new Set();

    // P2 variables/objects
    const MIN = 0, MAX = 4000000;
    let xCoord = 0, yCoord = 0;
    let beacons: number[][] = []; // each element is [x, y, manDist]

    // Return true if coordinate is within the defined range, otherwise return false
    const isValid = (coord: number[]): boolean => {
        return coord[0] >= MIN && coord[0] <= MAX && coord[1] >= MIN && coord[1] <= MAX;
    }

    // Return true if coord is within a beacon's range, otherwise return false
    const isWithinRange = (x: number, y: number): boolean => {
        return beacons.find(b => (Math.abs(x-b[0]) + Math.abs(y-b[1])) <= b[2]) === undefined;
    }

    // Given a sensor's coordinates and the beacon's range, return coordinates adjacent to the range's border
    const getAdjCoords = (beacon: number[]): number[][] => {
        const [x, y, manDist] = beacon;
        let maxX = x + manDist + 1, minX = x - manDist - 1;
        let arr: number[][] = [];
        let currY = 0; 
        for (let i=0; i<=x-minX; i++) {
            arr.push([minX+i, y+currY], [minX+i, y-currY]);
            arr.push([maxX-i, y+currY], [maxX-i, y-currY]);
            currY++;
        }
        return arr.filter(coord => isValid(coord));
    }

    // Parse input and populate objects required to solve each problem
    input.split('\n').forEach(line => {
        let [sensor, beacon] = line.split(': ').map(x => x.split('='));
        const sensorX = +sensor[1].split(', ')[0], sensorY = +sensor[2];
        const beaconX = +beacon[1].split(', ')[0], beaconY = +beacon[2];
        const manDist =  Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY); // Manhattan distance
        if (beaconY === TARGET) toExclude.add(beaconX);
        const yOffset = Math.abs(TARGET - sensorY);
        if (yOffset <= manDist) {
            let left = sensorX - manDist + yOffset;
            let right = sensorX + manDist - yOffset;
            for (let n=left; n<=right; n++) xVals.add(n);
        }
        beacons.push([sensorX, sensorY, manDist]);
    });

    // Resulting size of xVals is the P1 answer
    [...toExclude.values()].forEach(val => xVals.delete(val));

    // Evaluate coordinates adjacent to beacon range borders until we find 
    // the one coordinate that is not within range of any beacon
    for (let i=0; i<beacons.length; i++) {
        let adjCoords: number[][] = getAdjCoords(beacons[i]);
        let p2Coord = adjCoords.find(coord => isWithinRange(coord[0], coord[1]));
        if (p2Coord !== undefined) {
            [xCoord, yCoord] = p2Coord;
            break;
        }
    }

    return [xVals.size, (4000000 * xCoord) + yCoord]; // 4827924, 12977110973564

}