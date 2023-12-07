import fs from "fs";

type Part = "1" | "2";
const part = process.argv.slice(2)[1] as Part;

const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath).split("\n");

const game = input
  .map((line) => line.split(" "))
  .map((hand) => ({
    hand: hand[0],
    bid: Number(hand[1]),
  }));

// five of a kind: length === 1 && [5]
// four of a kind: length === 2 && [4, 1]
// full house: length === 2 && [3, 2]
// three of a kind: length === 3 && [3, 1, 1]
// two pair: length === 3 && [2, 2, 1]
// one pair: length === 4 && [2, 1, 1, 1]
// high card: length === 5 && [1, 1, 1, 1, 1]

type CardType =
  | "five of a kind"
  | "four of a kind"
  | "full house"
  | "three of a kind"
  | "two pair"
  | "one pair"
  | "high card";

function getCardType(hand: string): CardType {
  const charMap = getCharMap(hand);

  if (part === "2") {
    if (charMap["J"]) {
      const J = charMap["J"];
      delete charMap["J"];
      const highestValueAt = Object.keys(charMap).reduce((a, b) => {
        return charMap[a] > charMap[b] ? a : b;
      }, "");
      charMap[highestValueAt] += J;
    }
  }

  const charMapValues = Object.values(charMap);

  if (charMapValues.length === 1) {
    return "five of a kind";
  }
  if (charMapValues.length === 2 && charMapValues.includes(4)) {
    return "four of a kind";
  }
  if (charMapValues.length === 2 && charMapValues.includes(3)) {
    return "full house";
  }
  if (charMapValues.length === 3 && charMapValues.includes(3)) {
    return "three of a kind";
  }
  if (charMapValues.length === 3 && charMapValues.includes(2)) {
    return "two pair";
  }
  if (charMapValues.length === 4 && charMapValues.includes(2)) {
    return "one pair";
  }
  if (charMapValues.length === 5) {
    return "high card";
  }
  throw new Error("Invalid hand");
}

function getCharMap(string: string) {
  return string.split("").reduce((acc, char) => {
    if (acc[char]) {
      acc[char]++;
    } else {
      acc[char] = 1;
    }
    return acc;
  }, {});
}

function getStrength(char: string) {
  const cards =
    part === "2"
      ? ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"]
      : ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  return cards.indexOf(char);
}

function compareRank(hand1: string, hand2: string) {
  if (hand1[0] === hand2[0]) {
    return compareRank(hand1.slice(1), hand2.slice(1));
  }

  if (getStrength(hand1[0]) > getStrength(hand2[0])) {
    return 1;
  } else if (getStrength(hand1[0]) < getStrength(hand2[0])) {
    return -1;
  }
  return 0;
}

function groupByCardType(game: any[]) {
  return game.reduce((acc, hand) => {
    const cardType = getCardType(hand.hand);
    if (acc[cardType]) {
      acc[cardType].push(hand);
    } else {
      acc[cardType] = [hand];
    }
    return acc;
  }, {});
}

const grouped = groupByCardType(game);

const sortByType = [
  grouped["high card"],
  grouped["one pair"],
  grouped["two pair"],
  grouped["three of a kind"],
  grouped["full house"],
  grouped["four of a kind"],
  grouped["five of a kind"],
].filter(Boolean);

const sortWithinType = sortByType
  .map((type) => {
    return type.sort((a, b) => compareRank(a.hand, b.hand));
  })
  .flat();

const totalWinnings = sortWithinType.reduce((acc, hand, index) => {
  return acc + hand.bid * (index + 1);
}, 0);

console.log("sol", totalWinnings);
