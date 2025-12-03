import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const result = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [, dir, clicks] = /([LR])(\d+)/.exec(line);
    return dir == 'L' ? -clicks : +clicks;
  }).reduce(([cursor,count], clicks) => [cursor = (cursor + clicks) % 100, count + (cursor === 0)], [50,0])[1]

console.log(result);
