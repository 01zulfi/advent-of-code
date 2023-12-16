import fs from "fs";

type Part = "1" | "2";
const part = process.argv.slice(2)[1] as Part;

const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath)
  .split("\n\n")
  .map((line) => line.split("\n"));

const patterns = input;

function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_col, i) => matrix.map((row) => row[i]));
}

function to2D(pattern: string[]) {
  return pattern.map((row) => row.split(""));
}

function to1D(pattern: string[][]) {
  return pattern.map((row) => row.join(""));
}

function possibleSmudges(top: string, bottom: string) {
  let count = 0;
  for (let i = 0; i < top.length; i += 1) {
    if (top[i] !== bottom[i]) {
      count += 1;
    }
  }
  return count;
}

function reflectedAt(pattern: string[]) {
  const s: string[] = [pattern[0]];

  for (let i = 0; i < pattern.length; i++) {
    if (i === 0) continue;
    const bottom = pattern.slice(i).reverse();
    const toMatch = Math.min(s.length, bottom.length);
    const topToMatch = s.slice(-toMatch).join("");
    const bottomToMatch = bottom.slice(-toMatch).join("");
    if (part === "1") {
      if (topToMatch === bottomToMatch) {
        return i;
      }
    }
    if (part === "2") {
      const smudges = possibleSmudges(topToMatch, bottomToMatch);
      if (smudges === 1) {
        return i;
      }
    }
    s.push(pattern[i]);
  }

  return 0;
}

const verticals: number[] = [];
const horizontals: number[] = [];

patterns.forEach((pattern) => {
  const reflectedH = reflectedAt(pattern);
  horizontals.push(reflectedH);
  const transposed = to1D(transpose(to2D(pattern)));
  const reflectedV = reflectedAt(transposed);
  verticals.push(reflectedV);
});

const verticalSum = verticals.reduce((acc, curr) => acc + curr, 0);
const horizontalSum = horizontals
  .map((h) => h * 100)
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Part ${part}`, verticalSum + horizontalSum);
