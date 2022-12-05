const fs = require("fs");

const Stack = () => {
  let stack = [];

  return {
    stack: () => stack.slice(),
    push: (el) => stack.push(el),
    pushAll: (el) => stack.push(...el),
    peek: () => stack[stack.length - 1],
    pop: () => stack.pop(),
    popN: (n) => {
      return stack.splice(-n);
    },
    trim: (token) => {
      stack = stack.filter((el) => el !== token);
    },
  };
};

const filePath = process.argv.slice(2)[0];
const readFile = (path) => fs.readFileSync(path, { encoding: "utf8" });

const input = readFile(filePath).split("\n");

const emptyLineIndex = input.indexOf("");

const [rawStacksOfCrates, rawRearrangementProcedure] = [
  input.slice(0, emptyLineIndex),
  input.slice(emptyLineIndex + 1),
];

const parseAndTransformStacks = (rawStacksOfCrates) => {
  const mapStacksOfCrates = new Map();

  let curSpacing = 3;

  rawStacksOfCrates.reverse().forEach((row, i) => {
    let rowArr = [];
    curSpacing = 3;

    for (let j = 0; j < row.length; ) {
      rowArr.push(row.slice(j, j + curSpacing));
      j = j + curSpacing;
      curSpacing = curSpacing === 3 ? 1 : 3;
    }

    rowArr = rowArr.filter((el) => el !== " ");

    const totalStacks = rowArr.length;

    if (i === 0) return;

    for (let k = 1; k < totalStacks + 1; k += 1) {
      const crate = rowArr[k - 1];
      const definedStack = mapStacksOfCrates.get(k);

      if (definedStack) {
        mapStacksOfCrates.get(k).push(crate);
      } else {
        mapStacksOfCrates.set(k, Stack());
        mapStacksOfCrates.get(k).push(crate);
      }

      mapStacksOfCrates.get(k).trim("   ");
    }
  });

  return mapStacksOfCrates;
};

const stacksOfCratesPartOne = parseAndTransformStacks(
  rawStacksOfCrates.slice()
);
const stacksOfCratesPartTwo = parseAndTransformStacks(
  rawStacksOfCrates.slice()
);

const procedureParseRegex = /move (.*?) from (.*) to (.*)/;

const procedures = rawRearrangementProcedure.map((proc) => {
  const matches = proc.match(procedureParseRegex);

  const mapped = matches.map(Number);

  return {
    n: mapped[1],
    from: mapped[2],
    to: mapped[3],
  };
});

procedures.forEach((proc) => {
  for (let i = 0; i < proc.n; i += 1) {
    let popped = stacksOfCratesPartOne.get(proc.from).pop();
    stacksOfCratesPartOne.get(proc.to).push(popped);
  }
});

procedures.forEach((proc) => {
  let popped = stacksOfCratesPartTwo.get(proc.from).popN(proc.n);
  stacksOfCratesPartTwo.get(proc.to).pushAll(popped);
});

const crateOnTop = (stacksOfCrates) => {
  return [...stacksOfCrates.values()]
    .map((stack) => {
      return stack.peek();
    })
    .join("")
    .replaceAll("[", "")
    .replaceAll("]", "");
};

console.log("Part 1:", crateOnTop(stacksOfCratesPartOne));
console.log("Part 2:", crateOnTop(stacksOfCratesPartTwo));
