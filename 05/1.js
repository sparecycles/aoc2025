import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const lines = readFileSync(input, "utf-8").split("\n");

const ranges = [];
const ingredients = [];
let index = 0;
while (index < lines.length) {
  const line = lines[index++];
  ranges.push(line.split("-").map(Number));
  if (!line) {
    break;
  }
}
const count = lines
  .slice(index)
  .filter(Boolean)
  .reduce((count, ingredient) => {
    return count + fresh(Number(ingredient));
  }, 0);
console.log(count);

function fresh(ingredient) {
  return ranges.some(([l, h]) => l <= ingredient && h >= ingredient);
}
