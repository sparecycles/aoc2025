import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const lines = readFileSync(input, "utf-8")
  .split("\n")
  .map((line) => line.trimEnd())
  .filter(Boolean);

const { offsets, ops } = lines
  .pop()
  .split(/(\s+)/)
  .reduce(
    ({ offsets, ops, offset }, op, index) => {
      if (index & 1) {
        offset += op.length + 1;
        offsets.push(offset);
      } else if (op) {
        ops.push(op);
      }
      return { offsets, ops, offset };
    },
    { offsets: [], ops: [], offset: 0 },
  );

function rtl(col) {
  const cols = [];
  const rows = lines.map((line) =>
    line.slice(offsets[col - 1] ?? 0, offsets[col] ?? line.length),
  );
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const c = rows[y][x];
      if (c !== " ") {
        (cols[x] ??= []).push(c);
      }
    }
  }
  return cols
    .filter(Boolean)
    .map((c) => c.join(""))
    .map(Number);
}

const cols = [];
for (let col = 0; col < ops.length; col++) {
  cols.push(rtl(col));
}

const total = ops
  .map((op, index) =>
    op === "+"
      ? cols[index].reduce((a, b) => a + b, 0)
      : cols[index].reduce((a, b) => a * b, 1),
  )
  .reduce((a, b) => a + b, 0);

console.log(total);
