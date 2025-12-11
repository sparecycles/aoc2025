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

function search(name) {
  if (name === "out") {
    return 1;
  }
  return connections[name].reduce((count, name) => count + search(name), 0);
}

console.log(search("you"));
