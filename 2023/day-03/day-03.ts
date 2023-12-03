import fs from "fs";
const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath);

const rows = input.split("\n");

interface Point {
  x: number;
  y: number;
}

interface Position {
  number: number;
  start: Point;
  end: Point;
}

const numberCoordinates = rows.reduce<Position[]>((acc, row, y) => {
  const regex = /\d+/g;
  const numbers = [...row.matchAll(regex)];
  const coordinates: Position[] = numbers.map((number) => {
    const x = number.index;
    if (x === undefined) throw new Error("what");
    let c = {
      number: Number(number[0]),
      start: { x, y },
      end: { x: x + number[0].length - 1, y },
    };
    return c;
  });
  return [...acc, ...coordinates];
}, []);

const partNumbers = numberCoordinates.reduce((acc, position, i) => {
  const { start, end, number } = position;
  const topLeftI = {
    x: Math.max(start.x - 1, 0),
    y: Math.max(start.y - 1, 0),
  };
  const bottomLeftI = {
    x: Math.max(start.x - 1, 0),
    y: Math.min(start.y + 1, rows.length - 1),
  };
  const topRightI = {
    x: Math.min(end.x + 2, rows[0].length - 1),
    y: start.y - 1,
  };
  const bottomRightI = {
    x: Math.min(end.x + 2, rows[0].length - 1),
    y: Math.min(start.y + 1, rows.length - 1),
  };
  const above = rows[topLeftI.y]?.slice(topLeftI.x, topRightI.x) ?? [];
  const on = rows[start.y][start.x - 1] + rows[start.y][end.x + 1];
  const below = rows[bottomLeftI.y]?.slice(bottomLeftI.x, bottomRightI.x) ?? [];
  const surrounding = [above, on, below];
  const regex = /[0-9]|[.]|(undefined)/g;
  const surroundingNumbers = surrounding
    .map((s) => s.replace(regex, ""))
    .filter((s) => s !== "");
  if (surroundingNumbers.length > 0) {
    return acc + number;
  }
  return acc;
}, 0);

console.log("Part 1", partNumbers);

const gearCoordinates = rows.reduce<Point[]>((acc, row, y) => {
  const regex = /[*]/g;
  const gears = [...row.matchAll(regex)];
  const coordinates = gears.map((gear) => {
    const x = gear.index;
    if (x === undefined) throw new Error("what");
    let c = {
      x,
      y,
    };
    return c;
  });
  return [...acc, ...coordinates];
}, []);

const isAdjacent = (a: Point, b: Point) => {
  return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;
};

const gears: Record<string, Position[]> = {};

gearCoordinates.forEach((gear) => {
  const adjacent = numberCoordinates.filter(
    (number) => isAdjacent(gear, number.start) || isAdjacent(gear, number.end)
  );
  gears[`${gear.x},${gear.y}`] = adjacent;
});

const gearRatios = Object.keys(gears).reduce((acc, gear) => {
  const adjacent = gears[gear];
  if (adjacent.length === 2) {
    const ratio = adjacent.reduce((a, b) => a * b.number, 1);
    return acc + ratio;
  } else {
    return acc;
  }
}, 0);

console.log("Part 2", gearRatios);
