import fs from "fs";

const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath)
  .split("\n")
  .map((line) => line.split(""));

function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_col, i) => matrix.map((row) => row[i]));
}

function expand<T>(space: T[][]) {
  const emptyRows = space.reduce<number[]>((acc, row, i) => {
    if (isAllEmpty(row)) {
      acc.push(i);
    }
    return acc;
  }, []);
  const emptyColumns = transpose(space).reduce<number[]>((acc, row, i) => {
    if (isAllEmpty(row)) {
      acc.push(i);
    }
    return acc;
  }, []);
  return {
    emptyRows,
    emptyColumns,
  };
}

function isAllEmpty<T>(row: T[]) {
  return row.every((col) => col === ".");
}

function galaxiesAt(space: string[][]) {
  let currentGalaxy: number[][] = [];
  space.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col === "#") {
        currentGalaxy.push([i, j]);
      }
    });
  });
  return currentGalaxy;
}

function manhattan(x1: number, y1: number, x2: number, y2: number) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function inBetween(start: number, end: number, check: number) {
  return check > start && check < end;
}

const { emptyRows, emptyColumns } = expand(input);
const galaxiesCoords = galaxiesAt(input);
const combinations = galaxiesCoords.reduce<number[][][]>((acc, galaxy, i) => {
  return acc.concat(galaxiesCoords.slice(i + 1).map((next) => [galaxy, next]));
}, []);

const lengthsP1 = combinations.map((pair) => {
  const [start, end] = pair;
  const rows = emptyRows.filter(
    (row) =>
      inBetween(start[0], end[0], row) || inBetween(end[0], start[0], row)
  ).length;
  const columns = emptyColumns.filter(
    (column) =>
      inBetween(start[1], end[1], column) || inBetween(end[1], start[1], column)
  ).length;
  return (
    manhattan(start[0], start[1], end[0], end[1]) +
    2 * (rows + columns) -
    (rows + columns)
  );
});

console.log(
  "Part 1: ",
  lengthsP1.reduce((a, b) => a + b, 0)
);

const lengthsP2 = combinations.map((pair) => {
  const [start, end] = pair;
  const rows = emptyRows.filter(
    (row) =>
      inBetween(start[0], end[0], row) || inBetween(end[0], start[0], row)
  ).length;
  const columns = emptyColumns.filter(
    (column) =>
      inBetween(start[1], end[1], column) || inBetween(end[1], start[1], column)
  ).length;
  return (
    manhattan(start[0], start[1], end[0], end[1]) +
    1000000 * (rows + columns) -
    (rows + columns)
  );
});

console.log(
  "Part 2: ",
  lengthsP2.reduce((a, b) => a + b, 0)
);
