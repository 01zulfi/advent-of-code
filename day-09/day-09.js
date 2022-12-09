const fs = require("fs");

const filePath = process.argv.slice(2)[0];
const readFile = (path) => fs.readFileSync(path, { encoding: "utf8" });

const input = readFile(filePath)
  .split("\n")
  .map((move) => {
    const [direction, steps] = move.split(" ");

    return { direction, steps };
  });

const directions = {
  L: [-1, 0],
  R: [+1, 0],
  U: [0, -1],
  D: [0, +1],
};

const isTailAdjacent = (head, tail) => {
  return [Math.abs(head[0] - tail[0]), Math.abs(head[1] - tail[1])].every(
    (diff) => diff <= 1
  );
};

const move = (headOrTail, direction) => {
  const dir = directions[direction];
  return [headOrTail[0] + dir[0], headOrTail[1] + dir[1]];
};

const moveTailAdjacently = (head, tail) => {
  if (isTailAdjacent(head, tail)) return tail;

  if (head[0] === tail[0]) {
    const tailDirection = head[1] - tail[1] < 0 ? "U" : "D";
    return move(tail, tailDirection);
  }

  if (head[1] === tail[1]) {
    const tailDirection = head[0] - tail[0] < 0 ? "L" : "R";
    return move(tail, tailDirection);
  }

  return moveTailDiagonally(head, tail);
};

const moveTailDiagonally = (head, tail) => {
  const directions = [];

  if (head[0] - tail[0] < 0) {
    directions.push("L");
  } else {
    directions.push("R");
  }

  if (head[1] - tail[1] < 0) {
    directions.push("U");
  } else {
    directions.push("D");
  }

  return directions.reduce((acc, dir) => {
    return move(acc, dir);
  }, tail);
};

const solve = (input) => {
  const visitedCoords = new Set();
  let positions = [{ head: [0, 0], tail: [0, 0] }];

  input.forEach((motion) => {
    for (let i = 0; i < motion.steps; i += 1) {
      let head = move(positions.at(-1).head, motion.direction);

      positions = [
        ...positions,
        {
          head,
          tail: moveTailAdjacently(head, positions.at(-1).tail),
        },
      ];
    }
  });

  positions.forEach((pos) => visitedCoords.add(pos.tail.toString()));

  return visitedCoords.size;
};

const solvePartTwo = (input) => {
  const visitedCoords = new Set();
  let positions = Array(10).fill([0, 0]);

  input.forEach((motion) => {
    for (let i = 0; i < motion.steps; i += 1) {
      for (let j = 0; j < positions.length; j += 1) {
        if (j === 0) {
          positions[j] = move(positions[j], motion.direction);
        } else {
          positions[j] = moveTailAdjacently(positions[j - 1], positions[j]);
        }
      }
      visitedCoords.add(positions.at(-1).toString());
    }
  });

  return visitedCoords.size;
};

console.log("Part one:", solve(input));
console.log("Part two:", solvePartTwo(input));
