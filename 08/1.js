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

const numconnects = Number(
  process.argv[3] ?? (process.argv[2] === "input" ? 1000 : 10),
);

for (const { i, j } of connections.slice(0, numconnects)) {
  if (groups[i] === groups[j]) continue;
  groups[i].forEach((n) => groups[j].add(n));
  const gj = groups[j];
  [...groups[i]].forEach((x) => (groups[x] = gj));
}

console.log(
  [...new Set(groups.map((g) => [...g].join("-")))]
    .map((g) => g.split("-").length)
    .sort((g, h) => h - g)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1),
);

function dist(i, j) {
  const dx = boxes[i][0] - boxes[j][0];
  const dy = boxes[i][1] - boxes[j][1];
  const dz = boxes[i][2] - boxes[j][2];
  return dx * dx + dy * dy + dz * dz;
}
