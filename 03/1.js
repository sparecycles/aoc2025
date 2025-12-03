import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const lines = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => joltage(line))
  .reduce((acc, jolt) => {
    return acc + jolt;
  }, 0);

console.log(lines);

function joltage(line) {
  const m = +[...line.slice(0, -1)].sort().slice(-1)[0];
  const n = +[...line.slice(line.indexOf(m) + 1)].sort().slice(-1)[0];

  return m * 10 + n;
}
