import fs from "fs";
const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath).split("\n");

const regex = /\d+/g;

const seeds = input[0].match(regex)?.map(Number);

const titles = {
  seedToSoil: "seed-to-soil map:",
  soilToFertilizer: "soil-to-fertilizer map:",
  fertilizerToWater: "fertilizer-to-water map:",
  waterToLight: "water-to-light map:",
  lightToTemperature: "light-to-temperature map:",
  temperatureToHumidity: "temperature-to-humidity map:",
  humidityToLocation: "humidity-to-location map:",
} as const;

type Map = Record<keyof typeof titles, number[][]>;

const maps: Map = Object.keys(titles).reduce((acc, title, index) => {
  const indexes = Object.values(titles).map((title) => input.indexOf(title));
  const map = input
    .slice(indexes[index] + 1, indexes[index + 1])
    .filter(Boolean)
    .map((line) => line.match(regex)!.map(Number));
  return {
    ...acc,
    [title]: map,
  };
}, {} as Map);

function Mapper(from: number[], dict: number[][]) {
  let fromCopy = from.slice();
  let mappedIndexes: number[] = [];
  dict.forEach((item: number[]) => {
    let destination = item[0];
    let source = item[1];
    let range = item[2];
    let sourceRange = [source, source + range - 1];
    fromCopy = fromCopy.map((fromItem, i) => {
      if (isInRange(fromItem, sourceRange)) {
        if (mappedIndexes.includes(i)) {
          return fromItem;
        }
        mappedIndexes.push(i);
        let diff = fromItem - source;
        return destination + diff;
      }
      return fromItem;
    });
  });
  return fromCopy;
}

function isInRange(value: number, range: number[]) {
  return value >= range[0] && value <= range[1];
}

const locations: number[] = Object.keys(maps).reduce<number[]>((acc, map) => {
  const mapped = Mapper(acc, maps[map]);
  return mapped;
}, seeds!);

const lowestLocation = Math.min(...locations);
console.log("Part 1:", lowestLocation);

function chunkArrayInGroups(arr: number[], size: number) {
  let a: number[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    a.push(arr.slice(i, i + size));
  }
  return a;
}

const seedsPartTwo = chunkArrayInGroups(input[0].match(regex)!.map(Number), 2);

const locations2 = (seed: number) =>
  Object.keys(maps).reduce<number[]>(
    (acc, map) => {
      const mapped = Mapper(acc, maps[map]);
      return mapped;
    },
    [seed]
  );

let skip = 100000;
let fakeMinLocation = Infinity;
let index = 0;
seedsPartTwo.forEach(([seed, range]) => {
  for (let i = seed; i < seed + range; i += skip) {
    const location = locations2(i);
    if (location[0] < fakeMinLocation) {
      fakeMinLocation = location[0];
      index = i;
    }
  }
});

let lowestLocation2 = Infinity;
for (let i = index - skip; i < index + skip; i += 1) {
  const location = locations2(i);
  if (location[0] < lowestLocation2) {
    lowestLocation2 = location[0];
  }
}

console.log("Part 2", lowestLocation2);
