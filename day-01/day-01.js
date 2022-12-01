const fs = require("fs");
const readFile = (path) => fs.readFileSync(path, { encoding: "utf8" });

const input = readFile("./input.txt").split("\n\n");

const elves = input
  .map((calorieString, index) => {
    const calories = calorieString
      .split("\n")
      .reduce((a, b) => a + Number(b), 0);

    return calories;
  })
  .sort((a, b) => b - a);

const maxCalories = Math.max(...elves);
const topThreeSum = elves[0] + elves[1] + elves[2];

console.log("Part 1:", maxCalories);
console.log("Part 2:", topThreeSum);
