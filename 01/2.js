import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const result = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [, dir, clicks] = /([LR])(\d+)/.exec(line);
    return dir == 'L' ? -clicks : +clicks;
  }).reduce(([count, cursor], clicks) => debug([count, cursor], clicks, [
    count + zeros(cursor, clicks),
    cursor = (((cursor + clicks) % 100) + 100) % 100,
  ]), [0,50])[0]

  function zeros(cursor, clicks) {
    console.log('zeros', {cursor, clicks})
    let zeros = 0;
    if (clicks === 0) {
      return zeros;
    }

    if (clicks > 0) {
      while(clicks + cursor >= 100) {
        clicks -= 100;
        zeros++;
      }
    } else {
      zeros -= cursor == 0;
      while (cursor + clicks <= 0) {
        zeros++;
        clicks += 100;
      }
    }

    return zeros;
  }

function debug(x, y, z) {
  console.log(x, y, z);
  return z;
}

console.log(result);
