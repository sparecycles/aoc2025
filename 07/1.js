import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

let count = 0;
const result = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .reduce((prev, line) => {
    if (!prev) {
      return line.replace(/S/, "|");
    }
    const next = [...line];
    for (let i = 0; i < prev.length; i++) {
      if (prev[i] === "|") {
        if (next[i] === "^") {
          next[i - 1] = next[i + 1] = "|";
          count++;
        } else {
          next[i] = "|";
        }
      }
    }

    return next.join("");
  }, "");

console.log(result, count);
