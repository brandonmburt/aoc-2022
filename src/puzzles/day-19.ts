/** https://adventofcode.com/2022/day/19 */

interface Blueprint {
    id: number;
    oreRobot: number; // # of ore per ore robot
    clayRobot: number; // # of ore per clay robot
    obsidianRobot: number[]; // [# of ore, # of clay] per obsidian robot
    geodeRobot: number[]; // [# of ore, # of obsidian] per geode robot
}

export function solvePuzzle19(input: string): [number, number] {

   // Triangular number sequence
   const SEQUENCE = [0,1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,231,253,276,300,325,351,378,406,435,465,496];
   const blueprints: Blueprint[] = [];

    input.split('\n').forEach((line, i) => {
        let arr = line.split('. ');
        let bp: Blueprint = {
            id: i+1,
            oreRobot: +arr[0].split(' ')[6],
            clayRobot: +arr[1].split(' ')[4],
            obsidianRobot: [+arr[2].split(' ')[4], +arr[2].split(' ')[7]],
            geodeRobot: [+arr[3].split(' ')[4], +arr[3].split(' ')[7]]
        };
        blueprints.push(bp);
    });

    const stateToString = (obj: any, t: number): string => {
        return [
            t,
            obj.oreQuant,
            obj.clayQuant,
            obj.obsidianQuant,
            obj.geodeQuant,
            obj.oreRobots,
            obj.clayRobots,
            obj.obsidianRobots,
            obj.geodeRobots
        ].join(',');
    }

    const getTotal = (geodeQuant, geodeRobots, t, maxTime): number => {
        let total = geodeQuant;
        let robotCount = geodeRobots;
        for (let i=t; i<=maxTime; i++) {
            total += robotCount;
            robotCount++;
        }
        return total;
    }

    const execute = (n: number, p2 = false): number => {

        const TIME = n;
        let counts: number[] = [];

        blueprints.forEach((bp: Blueprint, i: number) => {

            if (p2 && i >= 3) return;

            let max = 0, evaluatedStates = new Set();

            const solve = (obj: any, t: number, skippedOre, skippedClay, skippedObsidian) => {
                if (t > TIME) {
                    max = Math.max(obj.geodeQuant, max);
                    return;
                }

                let stateStr = stateToString(obj, t);
                if (evaluatedStates.has(stateStr)) return 0;
                else evaluatedStates.add(stateStr);

                let canMakeOreRobot: boolean = !skippedOre && oreOreReq <= obj.oreQuant;
                let canMakeClayRobot: boolean = !skippedClay && clayOreReq <= obj.oreQuant;
                let canMakeObsidianRobot: boolean = !skippedObsidian && obj.clayRobots > 0 && obsidianOreReq <= obj.oreQuant && obsidianClayReq <= obj.clayQuant;
                let canMakeGeodeRobot: boolean = obj.obsidianRobots > 0 && geodeOreReq <= obj.oreQuant && geodeObsidianReq <= obj.obsidianQuant;
                
                let doneMakingObsidianRobots: boolean = obj.obsidianRobots >= geodeObsidianReq;
                let doneMakingClayRobots: boolean = doneMakingObsidianRobots || obj.clayRobots > obsidianClayReq;
                let doneMakingOreRobots: boolean = obj.oreRobots >= maxOreReq;

                if (doneMakingObsidianRobots && doneMakingClayRobots && doneMakingOreRobots) {
                    max = Math.max(max, getTotal(obj.geodeQuant, obj.geodeRobots, t, TIME));
                    return;
                }
                
                // certainly optimistic!
                let maxPossible = obj.geodeQuant + (obj.geodeRobots * (TIME-t+1)) + SEQUENCE[TIME-t];
                if (maxPossible < max) return obj.geodeQuant;

                let newObj = {
                    ...obj,
                    oreQuant: obj.oreQuant + obj.oreRobots,
                    clayQuant: obj.clayQuant + obj.clayRobots,
                    obsidianQuant: obj.obsidianQuant + obj.obsidianRobots,
                    geodeQuant: obj.geodeQuant + obj.geodeRobots
                }

                if (canMakeOreRobot && !doneMakingOreRobots) {
                    solve({
                        ...newObj,
                        oreQuant: newObj.oreQuant - oreOreReq,
                        oreRobots: newObj.oreRobots + 1
                    }, t+1, false, false, false);
                }
                if (canMakeClayRobot && !doneMakingClayRobots) {
                    solve({
                        ...newObj,
                        oreQuant: newObj.oreQuant - clayOreReq,
                        clayRobots: newObj.clayRobots + 1
                    }, t+1, false, false, false);
                }
                if (canMakeObsidianRobot && !doneMakingObsidianRobots) {
                    solve({
                        ...newObj,
                        oreQuant: newObj.oreQuant - obsidianOreReq,
                        clayQuant: newObj.clayQuant - obsidianClayReq,
                        obsidianRobots: newObj.obsidianRobots + 1
                    }, t+1, false, false, false);
                }
                if (canMakeGeodeRobot) {
                    solve({
                        ...newObj,
                        oreQuant: newObj.oreQuant - geodeOreReq,
                        obsidianQuant: newObj.obsidianQuant - geodeObsidianReq,
                        geodeRobots: newObj.geodeRobots + 1
                    }, t+1, false, false, false);
                } else {
                    solve({...newObj}, t+1, canMakeOreRobot, canMakeClayRobot, canMakeObsidianRobot);
                }
            }

            const [geodeOreReq, geodeObsidianReq] = bp.geodeRobot;
            const [obsidianOreReq, obsidianClayReq] = bp.obsidianRobot;
            const clayOreReq = bp.clayRobot;
            const oreOreReq = bp.oreRobot;
            const maxOreReq = Math.max(oreOreReq, clayOreReq, obsidianOreReq);            

            solve({
                oreQuant: 0,
                clayQuant: 0,
                obsidianQuant: 0,
                geodeQuant: 0,
                oreRobots: 1,
                clayRobots: 0,
                obsidianRobots: 0,
                geodeRobots: 0
            }, 1, false, false, false);

            counts.push(max);

        });

        return p2 ? counts.slice(0, 3).reduce((a,n) => a*=n, 1) : counts.reduce((a,n,i) => a += (i+1)*n, 0);

    }

    return [execute(24), execute(32, true)]; // 1404, 5880 (16s runtime)

}