import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const lines = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => [...line]);

let count = 0;
let todo = [];
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === "@") {
      todo.push([i, j]);
    }
  }
}

while (todo.length) {
  const [i, j] = todo.pop();
  const adjacents = adj(i, j);
  if (adjacents.length < 5) {
    count++;
    lines[i][j] = ".";
    todo.push(...adjacents.filter(([ai, aj]) => ai != i || aj != j));
  }
}

console.log(count);

function adj(i0, j0) {
  let adjacents = [];
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
      if (lines[i0 + i]?.[j0 + j] === "@") {
        adjacents.push([i0 + i, j0 + j]);
      }
  return adjacents;
}
