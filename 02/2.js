import { readFileSync } from "node:fs";
const arg = process.argv[2];
const input = arg == "i" ? "./input" : arg ?? "./sample";

const ranges = readFileSync(input, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((line) => line)
  .join("")
  .split(",")
  .map((range) => range.split("-").map(Number));

const primes = [2, 3, 5, 7, 11, 13, 17];

const counts = ranges.map(([l, h]) => {
  const ldigits = Math.ceil(Math.log(l) / Math.log(10));
  const hdigits = Math.ceil(Math.log(h) / Math.log(10));
  const factors = primes
    .filter((p) => ldigits % p == 0 || hdigits % p == 0)
    .map((p, i) => {
      let factor = 1;
      let scale = ldigits % p == 0 ? ldigits / p : hdigits / p;
      let ascale = scale;
      let q = 1;
      for (factor = 1; q < p; q++, ascale += scale) {
        factor += 10 ** ascale;
      }
      return [factor, p, i];
    });
  let sum = 0;
  for (const [factor, p, i] of factors) {
    for (let x = h - (h % factor); x >= l && x >= l; x -= factor) {
      if (
        String(x).length % p === 0 &&
        !factors.slice(0, i).some(([factor]) => x % factor == 0)
      ) {
        sum += x;
        console.log({ l, h, x });
      }
    }
  }

  return sum;
});

console.log(counts.reduce((a, b) => a + b, 0));
