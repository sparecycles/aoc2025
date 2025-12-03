import { readFileSync } from 'node:fs';
const arg = process.argv[2];
const input = arg == 'i' ? './input' : (arg ?? './sample');

const ranges = readFileSync(input, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => line)
  .join('')
  .split(',').map(range => range.split('-').map(Number));

const counts = ranges.map(([l, h]) => {
  const digits = Math.ceil(Math.log(h)/Math.log(10) + 0.5) & ~1;
  const factor = 1 + 10**(digits/2);
  const max =10**(digits) -1;
  const min = 10**(digits-1);
  const count = (l % factor === 0) + Math.floor((h-l + (l % factor))/factor);
  let sum = 0;
  let counted = 0;
  for(let x = h - h %factor; x >= l && x >= min; x -= factor) {
    if(x <= max) {
      sum += x;
      counted++;
      //console.log({ l, h, x });
      if(String(x).slice(0, digits/2) !== String(x).slice(digits/2)) {
      console.log({ l, h, x, digits });
        
      }
    }

  }
  //const sum =(l + l%factor)*factor*count*(count+1)/2
  //console.log(l, h, factor, count, sum);
  //console.log({ l, h, max, digits, factor, count,counted, sum});
  return sum;
});

console.log(counts.reduce((a,b) => a+b, 0));
