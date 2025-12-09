import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const lines = readFileSync(input, "utf-8").split("\n").filter(Boolean);

const counts = lines.reduce(
  (counts, line) => {
    let next = [...counts];
    for (let i = 0; i < counts.length; i++) {
      if (line[i] === "^") {
        next[i - 1] += counts[i];
        next[i] = 0;
        next[i + 1] += counts[i];
      }
    }
    return next;
  },
  [...lines[0]].map((c) => (c === "S" ? 1 : 0)),
);

console.log(counts.reduce((a, b) => a + b, 0));
