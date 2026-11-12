// Uncapped frame rate of the 3D table in headless Chrome: a rough number for
// comparing before and after a change, not what a player's screen shows.
//
//   node scripts/fps3d.mjs '/demo?phase=playing&nointro=1' [--dpr 2]
//
// Flags: --size 1600x900 · --dpr 2 · --seconds 6 · --base http://localhost:3210
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? fallback : args[index + 1];
};
const path = args[0] ?? '/demo?phase=playing&nointro=1';
const size = flag('size', '1600x900').split('x').map(Number);
const seconds = Number(flag('seconds', '6'));
const base = flag('base', 'http://localhost:3210');

const browser = await chromium.launch({
  channel: 'chrome',
  args: [
    '--use-angle=metal',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--disable-gpu-vsync',
    '--disable-frame-rate-limit'
  ]
});
const page = await browser.newPage({
  viewport: { width: size[0], height: size[1] },
  deviceScaleFactor: Number(flag('dpr', '2'))
});
await page.goto(base + path, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);

const result = await page.evaluate(
  duration =>
    new Promise(resolve => {
      const times = [];
      const start = performance.now();
      const tick = now => {
        times.push(now);
        if (now - start < duration) requestAnimationFrame(tick);
        else {
          const deltas = times.slice(1).map((time, i) => time - times[i]);
          deltas.sort((a, b) => a - b);
          const mean = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
          resolve({
            fps: Math.round(1000 / mean),
            meanMs: Number(mean.toFixed(2)),
            p95Ms: Number(deltas[Math.floor(deltas.length * 0.95)].toFixed(2))
          });
        }
      };
      requestAnimationFrame(tick);
    }),
  seconds * 1000
);
console.log(JSON.stringify(result));
await browser.close();
