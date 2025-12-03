import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const lines = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => joltage(line, 12))
  .reduce((acc, jolt) => {
    return acc + jolt;
  }, 0);

console.log(lines);

function joltage(line, z) {
  let acc = 0;
  let i = 0;
  for (let c = 0; c < z; c++) {
    acc *= 10;
    const m = [...line.slice(i, -z + 1 + c || line.length)].sort().slice(-1)[0];
    acc += +m;
    i = line.slice(i).indexOf(m) + 1 + i;
  }

  return acc;
}
