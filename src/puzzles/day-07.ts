/** https://adventofcode.com/2022/day/7 */

interface Dir {
    name: string;
    files: any[];
    dirs: Dir[];
    parent: Dir | null;
    totalSize: number;
}

export function solvePuzzle7(input: string): [number, number] {

    let root: Dir = { name: '/', files: [], dirs: [], parent: null, totalSize: 0 };
    let curr: Dir = root;
    let arr = input.split('\n');
    const len = arr.length;
    let i = 1;
    while (i < len) {
        let line = arr[i].split(' ');
        i++;
        if (line[1] === 'cd') {
            let d = line[2];
            curr = d === '/' ? root : d === '..' ? curr.parent : curr.dirs.find(x => x.name === d);
        } else if(line[1] === 'ls') {
            while (i < len && arr[i][0] !== '$')  {
                let line = arr[i].split(' ');
                if (line[0] === 'dir') {
                    curr.dirs.push({ name: line[1], files: [], dirs: [], parent: curr, totalSize: 0 });
                } else {
                    curr.files.push(line);
                    let temp: Dir = curr;
                    while (temp !== null) {
                        temp.totalSize += +line[0];
                        temp = temp.parent;
                    }
                }
                i++;
            }
        }
    }

    let dirArr = [root], storage = 70000000 - root.totalSize;
    let p1 = 0, p2 = root.totalSize;
    while (dirArr.length > 0) {
        let d = dirArr.pop();
        p2 = storage + d.totalSize >= 30000000 ? Math.min(d.totalSize, p2) : p2;
        p1 += d.totalSize <= 100000 ? d.totalSize : 0;
        dirArr.push(...d.dirs);
    }

    return [p1, p2];

}