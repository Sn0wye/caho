#!/usr/bin/env node
// Screenshots a page of the local dev server in headless Chrome with WebGL on,
// optionally driving the pointer first. For eyeballing the 3D table.
//
//   node scripts/shot3d.mjs '/demo?phase=playing' /tmp/shot.png
//   node scripts/shot3d.mjs '/demo?phase=judging&judge=me' /tmp/j.png \
//     --steps 'wait:3000;move:0.5,0.5;shot:hover;click:0.5,0.5;wait:800;shot:picked'
//
// Steps (x, y are fractions of the viewport):
//   wait:ms · move:x,y · click:x,y · rclick:x,y · drag:x1,y1,x2,y2[,right]
//   wheel:dy · key:Name · shot[:suffix] (writes out-suffix.png) · eval:js
// Without a `shot` step, one screenshot is taken at the end.
// Flags: --size 1600x900 · --wait 3500 (before the steps) · --base http://localhost:3210
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args.splice(index, 2)[1] : fallback;
};
const size = flag('size', '1600x900').split('x').map(Number);
const initialWait = Number(flag('wait', '3500'));
const base = flag('base', 'http://localhost:3210');
const steps = flag('steps', '');
const [path, out = '/tmp/shot3d.png'] = args;
if (!path) {
  console.error('usage: shot3d.mjs <path> [out.png] [--steps ...]');
  process.exit(1);
}

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({
  viewport: { width: size[0], height: size[1] },
  deviceScaleFactor: 1
});
page.on('console', message => {
  if (message.type() === 'error')
    console.log('[console.error]', message.text());
});
page.on('pageerror', error => console.log('[pageerror]', error.message));

await page.goto(base + path, { waitUntil: 'domcontentloaded' });
// The dev overlay would cover the scene.
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
await page.waitForTimeout(initialWait);

const px = (x, y) => [Number(x) * size[0], Number(y) * size[1]];
const withSuffix = suffix => out.replace(/\.png$/, `-${suffix}.png`);
let shots = 0;

for (const step of steps.split(';').filter(Boolean)) {
  const split = step.indexOf(':');
  const name = split < 0 ? step : step.slice(0, split);
  const value = split < 0 ? '' : step.slice(split + 1);
  const numbers = value.split(',');
  if (name === 'wait') await page.waitForTimeout(Number(value));
  else if (name === 'move')
    await page.mouse.move(...px(...numbers), { steps: 8 });
  else if (name === 'click' || name === 'rclick') {
    const [x, y] = px(...numbers);
    await page.mouse.move(x, y, { steps: 6 });
    await page.mouse.click(x, y, {
      button: name === 'rclick' ? 'right' : 'left'
    });
  } else if (name === 'drag') {
    const button = numbers[4] === 'right' ? 'right' : 'left';
    await page.mouse.move(...px(numbers[0], numbers[1]));
    await page.mouse.down({ button });
    await page.mouse.move(...px(numbers[2], numbers[3]), { steps: 20 });
    await page.mouse.up({ button });
  } else if (name === 'wheel') await page.mouse.wheel(0, Number(value));
  else if (name === 'key') await page.keyboard.press(value);
  else if (name === 'eval') console.log('[eval]', await page.evaluate(value));
  else if (name === 'shot') {
    const file = value ? withSuffix(value) : withSuffix(String(++shots));
    await page.screenshot({ path: file });
    shots++;
    console.log('wrote', file);
  } else console.error('unknown step', step);
}

if (shots === 0) {
  await page.screenshot({ path: out });
  console.log('wrote', out);
}
await browser.close();
