import fs from "fs";

interface Point {
  x: number;
  y: number;
}

interface Block extends Point {
  value: number;
}

const DIRS: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function getBlockValue(city: Block[][], point: Point) {
  return city[point.y][point.x].value;
}

function outOfBounds(point: Point, city: Block[][]) {
  return (
    point.x < 0 ||
    point.y < 0 ||
    point.x >= city[0].length ||
    point.y >= city.length
  );
}

function hasUnvisited(seen: boolean[][], dists: number[][]) {
  return seen.some((row, y) =>
    row.some((col, x) => !col && dists[y][x] < Infinity)
  );
}

function getLowestUnvisited(seen: boolean[][], dists: number[][]) {
  let lowest = Infinity;
  let lowestPoint: Point = { x: -1, y: -1 };
  for (let y = 0; y < seen.length; y++) {
    for (let x = 0; x < seen[0].length; x++) {
      if (!seen[y][x] && dists[y][x] < lowest) {
        lowest = dists[y][x];
        lowestPoint = { x, y };
      }
    }
  }
  return lowestPoint;
}

function prevThreePoints(prev: (-1 | Point)[][], point: Point) {
  // get previous three points
  const prevs: Point[] = [];
  const prevPoint = prev[point.y][point.x];
  if (prevPoint !== -1) {
    prevs.push(prevPoint);
    const prevPoint2 = prev[prevPoint.y][prevPoint.x];
    if (prevPoint2 !== -1) {
      prevs.push(prevPoint2);
      const prevPoint3 = prev[prevPoint2.y][prevPoint2.x];
      if (prevPoint3 !== -1) {
        prevs.push(prevPoint3);
      }
    }
  }
  return prevs;
}

function collinearInDirection(points: Point[]): "x" | "y" | "-" {
  if (points.length < 3) {
    return "-";
  }
  const [p1, p2, p3] = points;
  if (p1.x === p2.x && p2.x === p3.x) {
    return "y";
  }
  if (p1.y === p2.y && p2.y === p3.y) {
    return "x";
  }
  return "-";
}

function dijkstra(source: Point, dest: Point, map: Block[][]) {
  const seen = new Array(map.length)
    .fill(null)
    .map(() => new Array(map[0].length).fill(false));
  const prev = new Array(map.length)
    .fill(null)
    .map(() => new Array(map[0].length).fill(-1));
  const dists = new Array(map.length)
    .fill(null)
    .map(() => new Array(map[0].length).fill(Infinity));

  dists[source.y][source.x] = 0;

  while (hasUnvisited(seen, dists)) {
    const curr = getLowestUnvisited(seen, dists);
    seen[curr.y][curr.x] = true;
    let adjs: Point[] = [];
    let dirs = DIRS;
    let prevs = prevThreePoints(prev, curr);
    let prevsCollinear = collinearInDirection(prevs);

    if (prevs.length > 0) {
      let prevDirection = {
        x: prevs[0].x - curr.x,
        y: prevs[0].y - curr.y,
      };
      dirs = dirs.filter(
        (dir) => !(dir.x === prevDirection.x && dir.y === prevDirection.y)
      );
    }
    if (prevsCollinear === "x") {
      dirs = dirs.filter((dir) => dir.x === 0);
    }
    if (prevsCollinear === "y") {
      dirs = dirs.filter((dir) => dir.y === 0);
    }
    adjs = dirs
      .map((dir) => ({
        x: curr.x + dir.x,
        y: curr.y + dir.y,
      }))
      .filter((adj) => !outOfBounds(adj, map));

    for (let i = 0; i < adjs.length; i += 1) {
      const adj = adjs[i];

      //   if (seen[adj.y][adj.x]) {
      //     continue;
      //   }

      const dist = dists[curr.y][curr.x] + getBlockValue(map, adj);
      if (dist < dists[adj.y][adj.x]) {
        dists[adj.y][adj.x] = dist;
        prev[adj.y][adj.x] = { x: curr.x, y: curr.y };
      }
    }
  }

  const out: Point[] = [];
  let curr = dest;
  while (prev[curr.y][curr.x] !== -1) {
    out.push(dists[curr.y][curr.x]);
    const prevPoint = prev[curr.y][curr.x];
    curr = prevPoint;
  }

  out.push(source);
  return out.reverse();
}

const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath);

const city: Block[][] = input
  .split("\n")
  .map((row) => row.split(""))
  .map((row, y) => row.map((value, x) => ({ value: Number(value), x, y })));

const start = { x: 0, y: 0 };
const end = { x: city[0].length - 1, y: city.length - 1 };

console.log(dijkstra(start, end, city));
