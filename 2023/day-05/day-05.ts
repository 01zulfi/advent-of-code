import fs from "fs";
const filePath = process.argv.slice(2)[0];
const readFile = (path: string) => fs.readFileSync(path, { encoding: "utf8" });
const input = readFile(filePath).split("\n");

const regex = /\d+/g;

const seeds = input[0].match(regex)?.map(Number);

console.log("seeds", seeds);

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
  // console.log("dict", dict);
  let fromCopy = from.slice();
  let mappedIndexes: number[] = [];
  dict.forEach((item: number[]) => {
    let destination = item[0];
    let source = item[1];
    let range = item[2];
    console.log("range", range);
    let destinationRange = [destination, destination + range - 1];
    let sourceRange = [source, source + range - 1];
    console.log("destinationrange", destinationRange);
    console.log("sourcerange", sourceRange);
    fromCopy = fromCopy.map((item, i) => {
      if (isInRange(item, sourceRange)) {
        if (mappedIndexes.includes(i)) {
          return item;
        }
        mappedIndexes.push(i);
        let diff = item - source;
        return destination + diff;
      }
      return item;
    });
    // console.log("from", fromCopy);
  });
  return fromCopy;
}

function ranger(start: number, end: number) {
  return Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
}

function isInRange(value: number, range: number[]) {
  return value >= range[0] && value <= range[1];
}

const locations: number[] = Object.keys(maps).reduce<number[]>((acc, map) => {
  const mapped = Mapper(acc, maps[map]);
  console.log(map, mapped);
  return mapped;
}, seeds!);

const lowestLocation = Math.min(...locations);
console.log(lowestLocation);
// Mapper(seeds!, maps.fertilizerToWater);
// console.log(maps.fertilizerToWater);
