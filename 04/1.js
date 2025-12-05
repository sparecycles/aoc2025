import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const lines = readFileSync(input, "utf-8").split("\n").filter(Boolean);

let count = 0;
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    count += lines[i][j] === "@" && adj(i, j) < 5 ? 1 : 0;
  }
}

console.log(count);

function adj(i0, j0) {
  let count = 0;
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
      if (lines[i0 + i]?.[j0 + j] === "@") {
        count++;
      }
  return count;
}
