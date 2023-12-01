const fs = require("fs");

const Stack = () => {
  let stack = [];

  return {
    stack: () => stack.slice(),
    push: (el) => stack.push(el),
    peek: () => stack.at(-1),
    pop: () => stack.pop(),
    clear: () => {
      stack = [];
    },
  };
};

const filePath = process.argv.slice(2)[0];
const readFile = (path) => fs.readFileSync(path, { encoding: "utf8" });

const input = readFile(filePath).split("\n");

const FolderStack = Stack();
const folderSizes = {};

input.forEach((line) => {
  let chunks = line.split(" ");

  if (line.startsWith("$ cd")) {
    if (chunks[2] === "..") {
      FolderStack.pop();
    } else {
      FolderStack.push(chunks[2]);
    }
  }

  if (
    !line.startsWith("$ ls") &&
    !line.startsWith("$ cd") &&
    !line.startsWith("dir")
  ) {
    let fileSize = Number(chunks[0]);
    const currentFolders = FolderStack.stack();

    while (currentFolders.length > 0) {
      const path = currentFolders.join(" ");

      folderSizes[path] = folderSizes[path]
        ? folderSizes[path] + fileSize
        : fileSize;

      currentFolders.pop();
    }
  }
});

const sumOfSizesLessThan100K = Object.values(folderSizes)
  .filter((size) => size <= 100000)
  .reduce((a, b) => a + b, 0);

const spaceAvailable = 70000000;
const atLeast = 30000000;
const usedSpace = folderSizes["/"];
const unused = spaceAvailable - usedSpace;
const atLeastToDelete = Math.abs(unused - atLeast);

const toDelete = Object.values(folderSizes)
  .filter((size) => size >= atLeastToDelete)
  .sort((a, b) => a - b)[0];

console.log("Part One:", sumOfSizesLessThan100K);
console.log("Part Two:", toDelete);
