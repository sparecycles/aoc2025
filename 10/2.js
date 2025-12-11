import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");
import solver from "javascript-lp-solver";

const machines = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .filter((line) => !/[/][/]/.test(line))
  .map((line) => parse(line));

console.log(machines.reduce((a, m) => a + sjolt(m), 0));

function parse(line) {
  const [, _lights, buttons, joltage] =
    /\[([.#]*)\]\s*([()\s\d,]*)\s*[{]([\d,\s]*)[}]/.exec(line);
  const machine = {
    buttons: buttons
      .trim()
      .slice(1, -1)
      .split(/[)]\s*[(]/)
      .map((ns) => ns.split(/\s*,\s*/).map(Number)),
    joltage: joltage
      .trim()
      .split(/\s*,\s*/)
      .map(Number),
  };

  return machine;
}

function sjolt({ joltage, buttons }) {
  const results = solver.Solve({
    optimize: "presses",
    opType: "min",
    constraints: joltage.reduce(
      (constraints, target, index) =>
        Object.assign(constraints, {
          [`w${index}`]: { equal: target },
        }),
      {},
    ),
    variables: buttons.reduce(
      (variables, button, index) =>
        Object.assign(variables, {
          [`b${index}`]: button.reduce(
            (wires, wire) =>
              Object.assign(wires, {
                [`w${wire}`]: 1,
              }),
            joltage.reduce(
              (zeros, _target, index) =>
                Object.assign(zeros, {
                  [`w${index}`]: 0,
                }),
              { presses: 1 },
            ),
          ),
        }),
      {},
    ),
    ints: buttons.reduce(
      (ints, _, index) =>
        Object.assign(ints, {
          [`b${index}`]: 1,
        }),
      {},
    ),
  });

  return results.result;
}
