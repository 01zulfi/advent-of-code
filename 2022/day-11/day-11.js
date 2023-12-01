const fs = require("fs");

const filePath = process.argv.slice(2)[0];
const readFile = (path) => fs.readFileSync(path, { encoding: "utf8" });

const input = readFile(filePath)
  .split(/\n\s*\n/)
  .map((i) => i.split("\n"))
  .map((m) => {
    return m
      .map((s, i) => {
        if (i === 0) {
          return { monkey: Number(s.match(/\d/g)[0]) };
        } else if (i === 1) {
          return {
            startingItems: s
              .split(" ")
              .slice(4)
              .map((a) => Number(a.replace(",", ""))),
          };
        } else if (i === 2) {
          return { operation: s.split(" ").slice(5).join(" ") };
        } else if (i === 3) {
          return s.match(/\d/g).join("");
        } else if (i === 4) {
          return s.match(/\d/g)[0];
        } else if (i === 5) {
          return s.match(/\d/g)[0];
        }
      })
      .reduce((acc, curr, i) => {
        if (i === 3) {
          return { ...acc, test: { divisibleBy: Number(curr) } };
        } else if (i === 4) {
          return { ...acc, test: { ...acc.test, true: Number(curr) } };
        } else if (i === 5) {
          return { ...acc, test: { ...acc.test, false: Number(curr) } };
        }
        return { ...acc, ...curr };
      }, {});
  });

const parseOperation = (operation, value) => {
  let [left, operator, right] = operation.split(" ");

  left = left === "old" ? value : Number(left);
  right = right === "old" ? value : Number(right);

  if (operator === "+") {
    return left + right;
  } else if (operator === "*") {
    return left * right;
  }
};

const Monkey = ({ monkey, startingItems, test, operation }) => {
  let items = [...startingItems];
  let inspected = 0;

  return {
    monkey: Number(monkey),
    items: () => items.slice(),
    itemInspectionResult: (worryLevel, divisors) => {
      inspected += 1;
      const item = items.shift();
      const operated = parseOperation(operation, item);

      const valueAfterRelief =
        worryLevel === "huge" ? operated % divisors : Math.floor(operated / 3);

      if (valueAfterRelief % test.divisibleBy === 0) {
        return { to: test["true"], item: valueAfterRelief };
      } else {
        return { to: test["false"], item: valueAfterRelief };
      }
    },
    receive: (item) => {
      items = [...items, item];
    },
    inspected: () => inspected,
    testDivisibility: test.divisibleBy,
  };
};

const solve = (worryLevel, n) => {
  const monkeys = input.map((m) => Monkey(m));

  const divisors = monkeys.reduce((acc, m) => {
    return acc * m.testDivisibility;
  }, 1);

  for (let i = 0; i < n; i++) {
    monkeys.forEach((monkey) => {
      while (monkey.items().length > 0) {
        const inspectionResult = monkey.itemInspectionResult(
          worryLevel,
          divisors
        );

        const targetMonkey = monkeys.find(
          (m) => m.monkey === inspectionResult.to
        );

        targetMonkey.receive(inspectionResult.item);
      }
    });
  }

  const monkeyInspections = monkeys.map((m) => m.inspected());

  const monkeyBusiness = monkeyInspections
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);

  return monkeyBusiness;
};

console.log("Part One:", solve("small", 20));
console.log("Part Two:", solve("huge", 10000));
