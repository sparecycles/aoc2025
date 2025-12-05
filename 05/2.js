import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const lines = readFileSync(input, "utf-8").split("\n");

const ranges = [];
let index = 0;
while (index < lines.length) {
  const line = lines[index++];
  if (!line) {
    break;
  }
  ranges.push(line.split("-").map(Number));
}

ranges.sort(([l0], [l1]) => l0 - l1);

const merged = ranges.reduce(
  (ranges, range) => {
    ranges.push(...overlaps(ranges.pop(), range));
    return ranges;
  },
  [ranges.shift()]
);

function overlaps(...ranges) {
  if (ranges[0][1] < ranges[1][0]) {
    return ranges;
  }

  return [[ranges[0][0], Math.max(ranges[0][1], ranges[1][1])]];
}

console.log(merged.reduce((total, [l, h]) => h - l + 1 + total, 0));
