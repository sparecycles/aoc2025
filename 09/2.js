import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const tiles = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(",").map(Number));

function collapse(s) {
  const enumerated = s.map((e, i) => [e, i]).sort(([a], [b]) => a - b);

  const { list, order } = enumerated.reduce(
    (state, [e, i], index, enumerated) => {
      state.order[i] = index;
      if (index === 0) {
        state.list.push(0);
        return state;
      }

      const prevC = state.list[state.list.length - 1] ?? 0;
      const prevV = enumerated[index - 1]?.[0] ?? 0;
      if (e === prevV) {
        state.list.push(prevC);
      } else if (e === prevV + 1) {
        state.list.push(prevC + 1);
      } else {
        state.list.push(prevC + 2);
      }

      return state;
    },
    { order: [], list: [], values: {} },
  );

  return order.map((index) => list[index]);
}

const compressed = {
  x: collapse(tiles.map(([x]) => x)),
  y: collapse(tiles.map(([, y]) => y)),
};

const xm = compressed.x.reduce((a, b) => Math.max(a, b), 0);
const ym = compressed.y.reduce((a, b) => Math.max(a, b), 0);

const grid = [];
for (let y = 0; y <= ym; y++) {
  const row = (grid[y] = []);
  for (let x = 0; x <= xm; x++) {
    row.push(".");
  }
}

for (let i = 0; i < compressed.x.length; i++) {
  const x = compressed.x[i];
  const y = compressed.y[i];
  grid[y][x] = "#";
}

const parity = grid.map((row) => row.map(() => 0));
const xbars = [];
const ybars = [];

function connect(i, j) {
  const xj = compressed.x[j];
  const yj = compressed.y[j];
  const xi = compressed.x[i];
  const yi = compressed.y[i];

  grid[yi][xi] = "#";

  if (xi == xj) {
    ybars.push({ x: xi, y: [yi, yj].sort((a, b) => a - b) });
  } else if (yi == yj) {
    xbars.push({ y: yi, x: [xi, xj].sort((a, b) => a - b) });
  } else throw new Error("oops");
}

for (let i = 1; i < compressed.x.length; i++) {
  connect(i - 1, i);
}
connect(compressed.x.length - 1, 0);
ybars.sort(({ x: xa }, { x: xb }) => xa - xb);
xbars.sort(({ y: ya }, { y: yb }) => ya - yb);

const ysweep = grid.map(() => 0);
let xoffset = 0;
function pysweep(x) {
  while (xoffset < x) {
    for (let y = 0; y < grid.length; y++) {
      parity[y][xoffset] ^= ysweep[y];
    }
    xoffset++;
  }
}

for (const { x, y } of ybars) {
  pysweep(x);
  for (let yi = y[0]; yi < y[1]; yi++) {
    ysweep[yi] ^= 1;
  }
  for (let yi = y[0]; yi <= y[1]; yi++) {
    grid[yi][x] = "#";
  }
}

pysweep(xm + 1);

const xsweep = grid[0].map(() => 0);
let yoffset = 0;
function pxsweep(y) {
  while (yoffset < y) {
    for (let x = 0; x < grid[0].length; x++) {
      parity[yoffset][x] ^= xsweep[x];
    }
    yoffset++;
  }
}

for (const { x, y } of xbars) {
  pxsweep(y);
  for (let xi = x[0]; xi < x[1]; xi++) {
    xsweep[xi] ^= 2;
  }
  for (let xi = x[0]; xi <= x[1]; xi++) {
    grid[y][xi] = "#";
  }
}

for (let y = 0; y < parity.length; y++) {
  for (let x = 0; x < parity[0].length; x++) {
    if (parity[y][x]) grid[y][x] = "#";
  }
}

pxsweep(ym + 1);

let maxArea = 0;
for (let i = 0; i < tiles.length; i++) {
  for (let j = i + 1; j < tiles.length; j++) {
    maxArea = Math.max(maxArea, area(i, j));
  }
}

console.log(maxArea);

function area(i, j) {
  const [xi, xj] = [i, j].map((z) => compressed.x[z]).sort((a, b) => a - b);
  const [yi, yj] = [i, j].map((z) => compressed.y[z]).sort((a, b) => a - b);

  for (let y = yi; y <= yj; y++) {
    for (let x = xi; x <= xj; x++) {
      if (grid[y][x] !== "#") {
        return 0;
      }
    }
  }

  const dx = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
  const dy = Math.abs(tiles[i][1] - tiles[j][1]) + 1;
  return dx * dy;
}
