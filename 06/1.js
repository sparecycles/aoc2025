import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const lines = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.trim().split(/\s+/))
  .reduce((acc, line) => {
    acc.push(line);
    return acc;
  }, []);
const ops = lines.pop();
const total = ops
  .map((op, index) =>
    op === "+"
      ? lines
          .map((line) => line[index])
          .map(Number)
          .reduce((a, b) => a + b, 0)
      : lines.map((line) => line[index]).reduce((a, b) => a * b, 1),
  )
  .reduce((a, b) => a + b, 0);

console.log(total);
