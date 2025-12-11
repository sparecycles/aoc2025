import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const machines = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => parse(line));

console.log(machines.reduce((a, m) => a + toggle(m), 0));

function reverse(x) {
  const out = [];
  for (const c of [...x]) {
    out.unshift(c);
  }
  return out.join("");
}

function parse(line) {
  const [, lights, buttons] = /\[([.#]*)\]\s*([()\s\d,]*)/.exec(line);
  return {
    lights: parseInt(
      reverse(lights.replace(/#/g, "1").replace(/[.]/g, "0")).replace(
        /^0*/g,
        "",
      ),
      2,
    ),
    buttons: buttons
      .trim()
      .slice(1, -1)
      .split(/[)]\s*[(]/)
      .map((ns) =>
        ns
          .split(/\s*,\s*/)
          .map(Number)
          .reduce((a, n) => a | (1 << n), 0),
      ),
  };
}

function toggle({ lights, buttons }) {
  let min = Infinity;
  let combinations = 1 << buttons.length;
  for (let p = 0; p < combinations; p++) {
    let light = 0;
    let count = 0;
    for (let i = 0; i < buttons.length; i++) {
      if ((1 << i) & p) {
        light ^= buttons[i];
        count++;
      }
    }
    if (lights === light) {
      min = Math.min(min, count);
    }
  }
  return min;
}
