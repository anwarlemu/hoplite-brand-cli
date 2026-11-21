// Run against a production docs server: DOCS_URL=http://localhost:3000 npm run test:docs
// Requires the optional playwright-core dependency and its Chromium browser.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { checkOverlays } from './check-overlays.mjs';
import { checkInteractions } from './check-interactions.mjs';

const base = process.env.DOCS_URL ?? 'http://localhost:4645';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
// Open-state examples (a dialog, menu or sheet shown open) take focus as they mount. On a docs page they sit in
// opaque-origin frames, where Chrome refuses focus without a user gesture and logs this policy notice: the refusal is
// what a docs page wants (a frame must not pull focus off the page), so only that exact notice is not an error.
const FOCUS_POLICY = 'Permissions policy violation: focus-without-user-activation is not allowed in this document.';
page.on('console', message => { if (message.type() === 'error' && message.text() !== FOCUS_POLICY) errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) console.log(`HTTP ${response.status()}: ${response.url()}`); });
const nav = page.getByRole('navigation', { name: 'Library', exact: true });
// The rail and the page head must not move between routes: the rail is shared and keeps its scroll and filter.
const measure = () => page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Library"]');
  const list = nav.lastElementChild;
  const main = document.querySelector('main');
  const head = main.querySelector('header');
  return { pageScroll: scrollY, railScroll: list.scrollTop, railX: nav.getBoundingClientRect().x, railWidth: nav.getBoundingClientRect().width, mainX: main.getBoundingClientRect().x, headY: head.getBoundingClientRect().y };
});

try {
  await page.goto(`${base}/components/button`);
  await page.getByRole('heading', { name: 'Button', exact: true, level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  assert.equal(await nav.evaluate(n => n.getBoundingClientRect().width), 288, 'the rail is 288px');
  const items = await nav.locator('a[data-item]').evaluateAll(links => links.map(link => ({ name: link.dataset.item, title: link.textContent.trim() })));
  assert.ok(items.length >= 61, `every component is listed (${items.length})`);
  const timings = [];
  for (const item of items) {
    const link = nav.locator(`a[data-item="${item.name}"]`);
    await link.scrollIntoViewIfNeeded();
    const before = await measure();
    const started = performance.now();
    await link.click();
    await page.waitForURL(`**/components/${item.name}`);
    await page.getByRole('heading', { name: item.title, exact: true, level: 1 }).waitFor();
    timings.push(performance.now() - started);
    await page.waitForTimeout(150);
    const after = await measure();
    for (const key of ['railScroll', 'railX', 'railWidth', 'mainX', 'headY']) assert.ok(Math.abs(before[key] - after[key]) < 1, `${item.name}: ${key} moved from ${before[key]} to ${after[key]}`);
    assert.equal(await nav.locator(`a[data-item="${item.name}"]`).getAttribute('aria-current'), 'page', `${item.name} is marked current`);
    if (timings.length % 17 === 0) console.log(`Checked ${timings.length}/${items.length} routes.`);
  }
  console.log(`PASS: stable rail and page head across ${items.length} component routes.`);
  timings.sort((a, b) => a - b);
  console.log(`Local production navigation: median ${Math.round(timings[Math.floor(timings.length / 2)])}ms, p95 ${Math.round(timings[Math.floor(timings.length * 0.95)])}ms (includes automation overhead).`);

  await page.goto(`${base}/components/button`);
  await nav.getByRole('textbox', { name: 'Filter components' }).fill('card');
  await nav.locator('a[data-item="card"]').click();
  await page.waitForURL('**/components/card');
  assert.equal(await nav.getByRole('textbox', { name: 'Filter components' }).inputValue(), 'card');
  await nav.getByRole('textbox', { name: 'Filter components' }).fill('zzz');
  await nav.getByText('Nothing matches.').waitFor();
  console.log('PASS: rail filter narrows the list and is kept after navigation.');

  // Scroll edges fade, never cut a row off: the rail fades over 24px at an edge with more past it, tied to the scroll.
  const fade = async (locator, scroll) => {
    await locator.evaluate((el, to) => { if (to !== undefined) el.scrollTop = to; }, scroll);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    return locator.evaluate(el => { const s = getComputedStyle(el); return { mask: s.maskImage, start: s.getPropertyValue('--fade-start').trim(), end: s.getPropertyValue('--fade-end').trim() }; });
  };
  await page.goto(`${base}/components/button`);
  const railList = nav.locator('> div').last();
  await railList.evaluate(el => { el.scrollTop = 0; });
  const rest = await fade(railList);
  assert.notEqual(rest.mask, 'none', 'the rail list carries the scroll fade');
  assert.deepEqual([rest.start, rest.end], ['0px', '24px'], 'at rest the first row shows in full and the bottom fades');
  const mid = await fade(railList, 200);
  assert.deepEqual([mid.start, mid.end], ['24px', '24px'], 'scrolled, both edges fade 24px');
  const end = await fade(railList, 1e6);
  assert.deepEqual([end.start, end.end], ['24px', '0px'], 'at the end the last row shows in full');
  await page.goto(`${base}/preview/scroll-area/Preview`);
  await page.locator('[data-preview-ready]').waitFor();
  const area = page.locator('[data-slot=scroll-area-viewport]').first();
  assert.deepEqual(Object.values(await fade(area, 0)).slice(1), ['0px', '24px'], 'a scroll area at rest fades only its bottom');
  assert.deepEqual(Object.values(await fade(area, 100)).slice(1), ['24px', '24px'], 'a scrolled scroll area fades both edges');
  await page.goto(`${base}/components/sidebar`);
  const both = page.locator('pre[data-slot=code-block-content]').nth(await page.evaluate(() => [...document.querySelectorAll('pre[data-slot=code-block-content]')].findIndex(e => e.scrollHeight > e.clientHeight + 50 && e.scrollWidth > e.clientWidth + 50)));
  const axes = async (top, left) => {
    await both.evaluate((e, [t, l]) => { e.scrollTop = t; e.scrollLeft = l; }, [top, left]);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    return both.evaluate(e => ['--fade-start', '--fade-end', '--fade-x-start', '--fade-x-end'].map(n => getComputedStyle(e).getPropertyValue(n).trim()));
  };
  assert.deepEqual(await axes(0, 0), ['0px', '24px', '0px', '24px'], 'a code block at rest fades only its bottom and right');
  assert.deepEqual(await axes(100, 100), ['24px', '24px', '24px', '24px'], 'a code block scrolled both ways fades all four edges');
  console.log('PASS: the rail, scroll areas and two-way code blocks fade at the edges they scroll past, never cutting a row off.');

  await page.goto(`${base}/components/dialog`);
  const iframe = page.locator('iframe').first();
  assert.equal(await iframe.getAttribute('sandbox'), 'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox');
  await page.waitForFunction(() => { const frame = document.querySelector('iframe'); return frame && Number.parseFloat(frame.style.height) !== 320; });
  await page.getByRole('tab', { name: 'Phone', exact: true }).first().click();
  await page.waitForFunction(() => document.querySelector('iframe')?.style.width === '390px');
  const frame = await iframe.contentFrame();
  await frame.locator('[data-preview-ready]').waitFor();
  await frame.getByRole('button').first().click();
  await frame.getByRole('dialog').waitFor();
  assert.equal(await frame.locator('html').evaluate(async () => { await document.fonts.ready; return [...document.fonts].every(font => font.status === 'loaded' || font.status === 'unloaded'); }), true);
  console.log('PASS: isolated previews render, open their overlay and resize at desktop and phone widths.');

  await page.goto(`${base}/components/button`);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } }));
  await page.locator('#example').getByRole('button', { name: 'Copy code', exact: true }).click();
  await page.locator('#example').getByRole('button', { name: 'Copied', exact: true }).waitFor();
  assert.ok((await page.evaluate(() => window.__copied)).includes('Button'));
  await page.getByRole('button', { name: 'Copy command', exact: true }).click();
  assert.match(await page.evaluate(() => window.__copied), /add button$/);
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard permission denied'); }; });
  await page.locator('#source').getByRole('button', { name: 'Copy code', exact: true }).first().click();
  await page.locator('#source').getByText('Copy failed. Select the code and copy it.').waitFor({ state: 'attached' });
  console.log('PASS: code and command copy handle success and denied clipboard access.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/components/button`);
  const toggle = page.getByRole('button', { name: 'Open the library' });
  await toggle.click();
  await nav.getByRole('textbox', { name: 'Filter components' }).fill('checkbox');
  await nav.locator('a[data-item="checkbox"]').click();
  await page.waitForURL('**/components/checkbox');
  assert.equal(await page.getByRole('button', { name: 'Open the library' }).getAttribute('aria-expanded'), 'false');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log('PASS: the mobile rail closes after choosing an item, without horizontal overflow.');
  await checkOverlays(page, base);
  await checkInteractions(page, base);
  assert.deepEqual(errors, [], 'Browser errors');
  console.log('PASS: no browser runtime or resource errors.');
} finally {
  await browser.close();
}
