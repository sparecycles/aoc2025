import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const tiles = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(",").map(Number));

let maxArea = 0;
for (let i = 0; i < tiles.length; i++) {
  for (let j = i + 1; j < tiles.length; j++) {
    maxArea = Math.max(maxArea, area(i, j));
  }
}

console.log(maxArea);

function area(i, j) {
  const dx = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
  const dy = Math.abs(tiles[i][1] - tiles[j][1]) + 1;
  return dx * dy;
}
