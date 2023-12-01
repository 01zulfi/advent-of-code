import fs from "fs";
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile("./input.txt").split("\n");

/**
 * Part 1
 */
const digits = input.map((i) => getDigits(i));
const calibrationValues = digits.map((d) => getCalibrationValue(d));
const sumCalibrationValues = calibrationValues.reduce((a, b) => a + b, 0);
console.log("Part 1", sumCalibrationValues);

/**
 * Part 2
 */
const digitsPartTwo = input.map((i) => getDigitsPartTwo(i));
const calibrationValuesPartTwo = digitsPartTwo.map((d) =>
  getCalibrationValue(d)
);
const sumCalibrationValuesPartTwo = calibrationValuesPartTwo.reduce(
  (a, b) => a + b,
  0
);
console.log("Part 2", sumCalibrationValuesPartTwo);

/**
 *  utils
 */

function getDigits(string: string) {
  const regex = /[^0-9]/g;
  return string.replace(regex, "");
}

function getFirstAndLastChar(string: string) {
  const first = string[0];
  const last = string[string.length - 1];
  return { first, last };
}

function getCalibrationValue(string: string) {
  const { first, last } = getFirstAndLastChar(string);
  return Number(first + last);
}

function getDigitsPartTwo(string: string) {
  const digitMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
  };
  const newString = Object.keys(digitMap).reduce(
    (acc, cur) => acc.replaceAll(cur, `${cur}${digitMap[cur]}${cur}`),
    string
  );
  return getDigits(newString);
}
