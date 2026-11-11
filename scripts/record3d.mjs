#!/usr/bin/env node
// Records a video of a page of the local dev server (headless Chrome, WebGL
// on), optionally driving the pointer with the same steps as shot3d.mjs.
//
//   node scripts/record3d.mjs '/demo?auto=1' /tmp/caho-demo --seconds 40
//
// Writes <out>.webm. Flags: --size 1600x900 · --seconds 30 · --steps '…'
// (steps run while recording; --seconds is the minimum total length).
import { renameSync } from 'node:fs';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args.splice(index, 2)[1] : fallback;
};
const size = flag('size', '1600x900').split('x').map(Number);
const seconds = Number(flag('seconds', '30'));
const base = flag('base', 'http://localhost:3210');
const steps = flag('steps', '');
const [path, out = '/tmp/record3d'] = args;

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']
});
const context = await browser.newContext({
  viewport: { width: size[0], height: size[1] },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: '/tmp/record3d-raw',
    size: { width: size[0], height: size[1] }
  }
});
const page = await context.newPage();
page.on('pageerror', error => console.log('[pageerror]', error.message));
const started = Date.now();
await page.goto(base + path, { waitUntil: 'domcontentloaded' });
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });

const px = (x, y) => [Number(x) * size[0], Number(y) * size[1]];
for (const step of steps.split(';').filter(Boolean)) {
  const split = step.indexOf(':');
  const name = split < 0 ? step : step.slice(0, split);
  const numbers = (split < 0 ? '' : step.slice(split + 1)).split(',');
  if (name === 'wait') await page.waitForTimeout(Number(numbers[0]));
  else if (name === 'move')
    await page.mouse.move(...px(...numbers), { steps: 25 });
  else if (name === 'click' || name === 'rclick') {
    const [x, y] = px(...numbers);
    await page.mouse.move(x, y, { steps: 20 });
    await page.waitForTimeout(250);
    await page.mouse.click(x, y, {
      button: name === 'rclick' ? 'right' : 'left'
    });
  } else if (name === 'drag') {
    const button = numbers[4] === 'right' ? 'right' : 'left';
    await page.mouse.move(...px(numbers[0], numbers[1]), { steps: 15 });
    await page.mouse.down({ button });
    await page.mouse.move(...px(numbers[2], numbers[3]), {
      steps: Number(numbers[5] ?? 40)
    });
    await page.mouse.up({ button });
  } else if (name === 'wheel') await page.mouse.wheel(0, Number(numbers[0]));
  else if (name === 'key') await page.keyboard.press(numbers[0]);
}
const left = seconds * 1000 - (Date.now() - started);
if (left > 0) await page.waitForTimeout(left);

const video = page.video();
await context.close();
renameSync(await video.path(), `${out}.webm`);
console.log('wrote', `${out}.webm`);
await browser.close();
