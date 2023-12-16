import fs from "fs";

const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath).split(",");

function getAscii(char: string) {
  return char.charCodeAt(0);
}

function hash(string: string) {
  let current = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    const ascii = getAscii(char);
    current += ascii;
    current *= 17;
    current %= 256;
  }
  return current;
}

const hashed = input.map(hash);

console.log(
  "Part 1:",
  hashed.reduce((a, b) => a + b, 0)
);

const transformed = input
  .map((s) => s.split(/\-|=/))
  .map((s) => {
    const [label, focal] = s;
    if (focal === "") {
      return { key: label, value: 0, operation: "-" };
    } else {
      return { key: label, value: parseInt(focal), operation: "=" };
    }
  });

const hashMap: Record<number, { label: string; focal: number }[]> = {};

transformed.forEach((t) => {
  const index = hash(t.key);
  const box = hashMap[index];
  if (!box) {
    hashMap[index] = [];
  }
  if (t.operation === "-") {
    hashMap[index] = hashMap[index].filter((b) => b.label !== t.key);
  } else {
    const foundIndex = hashMap[index].findIndex((b) => b.label === t.key);
    if (foundIndex === -1) {
      hashMap[index].push({ label: t.key, focal: t.value });
    } else {
      hashMap[index][foundIndex] = { label: t.key, focal: t.value };
    }
  }
});

let focusingPower = 0;
Object.keys(hashMap).forEach((key) => {
  const box = hashMap[Number(key)];
  box.forEach((lense, slotNumber) => {
    focusingPower += (Number(key) + 1) * (slotNumber + 1) * lense.focal;
  });
});

console.log("Part 2:", focusingPower);
