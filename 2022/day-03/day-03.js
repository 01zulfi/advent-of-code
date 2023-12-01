const fs = require("fs");

const filePath = process.argv.slice(2)[0];
const readFile = (path) => fs.readFileSync(path, { encoding: "utf8" });

const input = readFile(filePath).split("\n");

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const letterValHash = letters.split("").reduce((acc, letter, index) => {
  acc[letter] = index + 1;
  return acc;
}, {});

const transformed = input.map((word) =>
  word.split("").map((letter) => letterValHash[letter])
);

const duplicates = transformed.flatMap((nums) => {
  [first, second] = [
    nums.slice(0, nums.length / 2),
    nums.slice(nums.length / 2),
  ];

  const common = first.filter((val) => second.includes(val));

  return [...new Set(common)];
});

const sum = duplicates.reduce((a, b) => a + b, 0);

const transformedPartTwo = transformed.reduce((acc, nums, i) => {
  if (i % 3 !== 0 && acc.length > 0) {
    acc[acc.length - 1].push(nums);
    return acc;
  }

  acc.push([nums]);
  return acc;
}, []);

const duplicatesPartTwo = transformedPartTwo.flatMap((group) => {
  return [
    ...new Set(
      group.reduce((acc, curr) => acc.filter((num) => curr.includes(num)))
    ),
  ];
});

const sumPartTwo = duplicatesPartTwo.reduce((a, b) => a + b, 0);

console.log("Part 1:", sum);
console.log("Part 2:", sumPartTwo);
