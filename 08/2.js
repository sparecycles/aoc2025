import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const boxes = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(",").map(Number));

const connections = [];
for (let i = 0; i < boxes.length; i++)
  for (let j = i + 1; j < boxes.length; j++) {
    connections.push({ i, j, dist: dist(i, j) });
  }

connections.sort(({ dist: a }, { dist: b }) => a - b);

let groups = boxes.map((_, index) => new Set([index]));

for (const { i, j } of connections) {
  if (groups[i] === groups[j]) continue;
  const gj = groups[j];
  groups[i].forEach((n) => gj.add(n));

  if (gj.size === boxes.length) {
    console.log(boxes[i][0] * boxes[j][0]);
    process.exit(0);
  }

  [...groups[i]].forEach((x) => (groups[x] = gj));
}

function dist(i, j) {
  const dx = boxes[i][0] - boxes[j][0];
  const dy = boxes[i][1] - boxes[j][1];
  const dz = boxes[i][2] - boxes[j][2];
  return dx * dx + dy * dy + dz * dz;
}
