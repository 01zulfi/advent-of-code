import fs from "fs";

const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath)
  .split("\n")
  .map((line) => line.split(" ").map(Number));

function computeDifferences(array: number[]) {
  const differences: number[] = [];
  for (let i = 1; i < array.length; i++) {
    differences.push(array[i] - array[i - 1]);
  }
  return differences;
}

function computeDifferencesRecurse(
  input: number[],
  differences: number[][] = []
) {
  if (input.every((num) => num === 0)) {
    return differences;
  }

  const d = computeDifferences(input);
  differences.push(d);
  return computeDifferencesRecurse(d, differences);
}

function extrapolate(input: number[][]) {
  const result = input.slice();
  for (let i = 0; i < input.length - 1; i += 1) {
    const last = result[i][result[i].length - 1];
    result[i + 1].push(last + result[i + 1][result[i + 1].length - 1]);
  }
  return result;
}

const differences = input.map((input) =>
  computeDifferencesRecurse(input, [input]).reverse()
);

const extrapolatedDifferences = differences.map(extrapolate);

const extrapolatedValues = extrapolatedDifferences
  .map((e) => e[e.length - 1])
  .map((e) => e[e.length - 1]);

const extrapolatedSum = extrapolatedValues.reduce((a, b) => a + b, 0);

console.log("Part 1:", extrapolatedSum);

function extrapolateBackwards(input: number[][]) {
  const result = input.slice();
  for (let i = 0; i < input.length - 1; i += 1) {
    const first = result[i][0];
    result[i + 1].unshift(result[i + 1][0] - first);
  }
  return result;
}

const backwardExtrapolatedDifferences = differences.map(extrapolateBackwards);

const backwardExtrapolatedValues = backwardExtrapolatedDifferences
  .map((e) => e[e.length - 1])
  .map((e) => e[0]);

const backwardExtrapolatedSum = backwardExtrapolatedValues.reduce(
  (a, b) => a + b,
  0
);

console.log("Part 2:", backwardExtrapolatedSum);
