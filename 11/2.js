import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : (arg ?? "./sample");

const connections = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [name, output] = line.split(/:\s*/);
    return [name.trim(), output.trim().split(/\s+/)];
  })
  .reduce(
    (acc, [name, outputs]) =>
      Object.assign(acc, {
        [name]: outputs,
      }),
    {},
  );

function search(name, visited) {
  if (name === "out") {
    return visited === 3 ? 1 : 0;
  }
  if (name === "dac") visited |= 1;
  if (name === "fft") visited |= 2;
  return (search.cache[name + ":" + visited] ??= connections[name].reduce(
    (count, name) => count + search(name, visited),
    0,
  ));
}

search.cache = {};

console.log(search("svr"));
