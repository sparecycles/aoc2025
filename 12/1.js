import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const lines = readFileSync(input, "utf-8").split("\n").filter(Boolean);

let index = 0;
const shapes = [];
const shapeSizes = [];
const bshapes = [];
const trees = [];
while (readShape());
while (readTree());

function show(result, { w, h }) {
  const bits = `${`0`.repeat(w * h)}${result.toString(2)}`.slice(-w * h);
  for (let y = 0; y < h; y++) {
    console.log(`${`0`.repeat(w)}${bits.slice(y * w, (y + 1) * w)}`.slice(-w));
  }
}

function compose(rows, w) {
  return rows.reduce((acc, row, index) => acc + (row << BigInt(w * index)), 0n);
}

function solve({ w, h, presents }) {
  const weight = presents.reduce(
    (count, num, index) => count + shapeSizes[index] * num,
    0,
  );
  if (weight > w * h) {
    return;
  }

  const shapeBits = bshapes.map((bits) => bits.map((rows) => compose(rows, w)));

  const result = search(0n, 0);

  return result;

  function search(grid, present, remaining = presents[present]) {
    if (present === presents.length) {
      return grid;
    }

    if (remaining == 0) {
      return search(grid, present + 1);
    }

    const shapeOptions = shapeBits[present];

    for (const option of shapeOptions) {
      for (let x = w - 3; x >= 0; x--) {
        for (let y = h - 3; y >= 0; y--) {
          const moved = option << BigInt(x + y * w);
          if ((grid & moved) != 0n) {
            continue;
          }

          const result = search(grid | moved, present, remaining - 1);
          if (result) return result;
        }
      }
    }
  }
}

console.log(
  trees.reduce((count, tree) => {
    const solution = solve(tree);
    if (typeof solution !== "undefined") {
      return count + 1;
    }
    return count;
  }, 0),
);

function shapeBits(shape) {
  const uniq = new Set();
  return [false, true]
    .flatMap((flip) =>
      [0, 1, 2, 3].map((rotation) => {
        return shaped(shape, (shape, y, x) => {
          if (flip == true) {
            y = shape.length - y - 1;
          }
          switch (rotation) {
            case 1:
              [x, y] = [shape.length - y - 1, x];
              break;
            case 2:
              [x, y] = [shape.length - x - 1, shape.length - y - 1];
              break;
            case 3:
              [x, y] = [y, shape.length - x - 1];
              break;
          }

          return shape[y][x];
        });
      }),
    )
    .filter((bits) => {
      const key = bits.join(",");
      return uniq.has(key) ? false : uniq.add(key);
    });
}

function shaped(shape, xy) {
  const bitset = [];
  for (let y = 0; y < shape.length; y++) {
    let bits = 0;
    for (let x = 0; x < shape.length; x++) {
      const bit = xy(shape, y, x) === "#";
      bits = (bits << 1) | bit;
    }
    bitset.push(BigInt(bits));
  }
  return bitset;
}

function readShape() {
  if (index >= lines.length) return;

  if (/^\d+:$/.test(lines[index].trim())) {
    index++;
    const shape = [];
    while (/^[.#]*$/.test(lines[index])) {
      shape.push(lines[index++]);
    }
    shapes.push(shape);

    shapeSizes.push(
      shape.reduce((size, row) => size + row.replace(/[.]/g, "").length, 0),
    );

    const bits = shapeBits(shape);
    bshapes.push(bits);

    return true;
  }
}

function readTree() {
  if (index >= lines.length) return;

  const match = /^(\d+)x(\d+):\s+(.*)/.exec(lines[index]);
  if (!match) return;
  const [, w, h, p] = match;
  trees.push({
    w: Number(w),
    h: Number(h),
    presents: p.trim().split(/\s+/).map(Number),
  });
  index++;
  return true;
}
