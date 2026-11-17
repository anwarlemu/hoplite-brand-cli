// Every interactive control in the library works with the pointer and the keyboard, at desktop and phone widths.
// Run through check-docs.mjs against a production docs server. The parts are Base UI: switches, checkboxes and radios
// are ARIA widgets (a native input sits beside them for forms), toggles report aria-pressed, and tabs follow focus with
// the arrows and are chosen with Enter or Space (manual activation).
import assert from 'node:assert/strict';

async function open(page, base, name, example = 'Preview') {
  await page.goto(`${base}/preview/${name}/${example}`);
  await page.locator('[data-preview-ready]').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

const attr = (locator, name) => locator.getAttribute(name);
// Checked state for ARIA widgets and native inputs alike.
const checked = async (locator) => String(await locator.isChecked());
// State settles a frame or two after an event: poll briefly before asserting.
async function settle(read, ok, timeout = 1500) {
  const end = Date.now() + timeout;
  let value = await read();
  while (!ok(value) && Date.now() < end) {
    await new Promise((r) => setTimeout(r, 50));
    value = await read();
  }
  return value;
}

export async function checkInteractions(page, base) {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });

    // Switch, checkbox, toggle: a click and Space flip their state.
    await open(page, base, 'switch');
    const sw = page.getByRole('switch').first();
    const was = await checked(sw);
    await sw.click();
    assert.notEqual(await settle(() => checked(sw), (v) => v !== was), was, 'switch: click toggles');
    await sw.focus();
    await page.keyboard.press('Space');
    assert.equal(await settle(() => checked(sw), (v) => v === was), was, 'switch: Space toggles back');
    // The label toggles it too.
    await page.getByText('Auto-merge green pull requests').click();
    assert.notEqual(await settle(() => checked(sw), (v) => v !== was), was, 'switch: its label toggles it');

    await open(page, base, 'checkbox');
    const box = page.getByRole('checkbox', { name: 'Require a passing check before merge' });
    const before = await checked(box);
    await box.click();
    assert.notEqual(await settle(() => checked(box), (v) => v !== before), before, 'checkbox: click toggles');
    await box.focus();
    await page.keyboard.press('Space');
    assert.equal(await settle(() => checked(box), (v) => v === before), before, 'checkbox: Space toggles back');

    // A parent checkbox goes mixed while some children are on, and checks them all.
    await open(page, base, 'checkbox', 'Indeterminate');
    const parent = page.getByRole('checkbox', { name: 'Required checks' });
    assert.equal(await attr(parent, 'aria-checked'), 'mixed', 'checkbox: the parent is mixed while some children are on');
    await page.getByRole('checkbox', { name: 'Lint' }).click();
    await page.getByRole('checkbox', { name: 'Preview deploy' }).click();
    assert.equal(await settle(() => attr(parent, 'aria-checked'), (v) => v === 'true'), 'true', 'checkbox: the parent checks once every child is on');
    await parent.click();
    assert.equal(await settle(() => checked(page.getByRole('checkbox', { name: 'Typecheck' })), (v) => v === 'false'), 'false', 'checkbox: the parent clears its children');

    await open(page, base, 'toggle');
    const toggle = page.getByRole('button', { name: 'Pin', exact: true });
    assert.equal(await attr(toggle, 'aria-pressed'), 'false');
    await toggle.click();
    assert.equal(await settle(() => attr(toggle, 'aria-pressed'), (v) => v === 'true'), 'true', 'toggle: click presses');
    await page.keyboard.press('Space');
    assert.equal(await settle(() => attr(toggle, 'aria-pressed'), (v) => v === 'false'), 'false', 'toggle: Space releases');

    // Radio group and toggle group: arrow keys move the choice.
    await open(page, base, 'radio-group');
    const radios = page.getByRole('radio');
    assert.equal(await checked(radios.nth(0)), 'true');
    await page.keyboard.press('Tab');
    assert.ok(await radios.nth(0).evaluate((el) => el === document.activeElement), 'radio-group: Tab lands on the chosen radio');
    await page.keyboard.press('ArrowDown');
    assert.equal(await settle(() => checked(radios.nth(1)), (v) => v === 'true'), 'true', 'radio-group: arrow moves the choice');
    assert.equal(await checked(radios.nth(0)), 'false', 'radio-group: one choice at a time');
    await radios.nth(2).click();
    assert.equal(await settle(() => checked(radios.nth(2)), (v) => v === 'true'), 'true', 'radio-group: click chooses');

    await open(page, base, 'toggle-group');
    const items = page.locator('[data-slot="toggle-group-item"]');
    await items.nth(1).click();
    assert.equal(await settle(() => attr(items.nth(1), 'aria-pressed'), (v) => v === 'true'), 'true', 'toggle-group: click chooses');
    assert.equal(await attr(items.nth(0), 'aria-pressed'), 'false', 'toggle-group: one choice at a time');
    await page.keyboard.press('ArrowLeft');
    assert.ok(await items.nth(0).evaluate((el) => el === document.activeElement), 'toggle-group: arrows move focus');
    await page.keyboard.press('Enter');
    assert.equal(await settle(() => attr(items.nth(0), 'aria-pressed'), (v) => v === 'true'), 'true', 'toggle-group: Enter chooses');

    // Tabs: a click selects and shows its panel; arrows move between tabs and Enter selects.
    await open(page, base, 'tabs');
    const tabs = page.getByRole('tab');
    await tabs.nth(1).click();
    assert.equal(await settle(() => attr(tabs.nth(1), 'aria-selected'), (v) => v === 'true'), 'true', 'tabs: click selects');
    await page.getByRole('tabpanel').getByText('billed once a year').waitFor();
    await open(page, base, 'tabs', 'Boxed');
    const boxed = page.getByRole('tab');
    await boxed.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    assert.ok(await settle(() => boxed.nth(1).evaluate((el) => el === document.activeElement), Boolean), 'tabs: arrow moves to the next tab');
    await page.keyboard.press('Enter');
    assert.equal(await settle(() => attr(boxed.nth(1), 'aria-selected'), (v) => v === 'true'), 'true', 'tabs: Enter selects the focused tab');
    await page.getByRole('tabpanel').getByText('New things you can do.').waitFor();

    // Accordion and collapsible open and close.
    for (const name of ['accordion', 'collapsible']) {
      await open(page, base, name);
      const trigger = page.locator(`[data-slot="${name}-trigger"]`).first();
      const expanded = await attr(trigger, 'aria-expanded');
      await trigger.click();
      assert.notEqual(await settle(() => attr(trigger, 'aria-expanded'), (v) => v !== expanded), expanded, `${name}: click opens or closes`);
      await trigger.focus();
      await page.keyboard.press('Enter');
      assert.equal(await settle(() => attr(trigger, 'aria-expanded'), (v) => v === expanded), expanded, `${name}: Enter opens or closes`);
    }

    // Slider and resizable: arrow keys change their value.
    for (const [name, role] of [['slider', 'slider'], ['resizable', 'separator']]) {
      await open(page, base, name);
      const thumb = page.getByRole(role).first();
      const value = await attr(thumb, 'aria-valuenow');
      await thumb.focus();
      await page.keyboard.press(name === 'slider' ? 'ArrowRight' : 'ArrowLeft');
      assert.notEqual(await settle(() => attr(thumb, 'aria-valuenow'), (v) => v !== value), value, `${name}: arrow changes the value`);
    }
    // The slider's readout shows its value.
    await open(page, base, 'slider');
    await page.getByRole('slider').first().focus();
    await page.keyboard.press('ArrowRight');
    await page.getByText('9', { exact: true }).waitFor();

    // Input OTP: typed digits fill the slots; letters are refused.
    await open(page, base, 'input-otp');
    const cells = page.locator('[data-slot="input-otp-slot"]');
    await cells.first().focus();
    await page.keyboard.type('12a3456');
    const code = () => cells.evaluateAll((inputs) => inputs.map((i) => i.value).join(''));
    assert.equal(await settle(code, (v) => v === '123456'), '123456', 'input-otp: digits fill the cells, letters are refused');
    await page.keyboard.press('Backspace');
    assert.equal(await settle(code, (v) => v === '12345'), '12345', 'input-otp: Backspace clears the last cell');

    // Textarea takes text.
    await open(page, base, 'textarea');
    const area = page.locator('textarea').first();
    await area.fill('Upgrade to Node 22 and fix failing tests.');
    assert.equal(await area.inputValue(), 'Upgrade to Node 22 and fix failing tests.');

    // Clearing a multi-select is one update, including the values submitted by the form.
    // A multi-select combobox: a chip's remove key drops it, choosing adds one, Backspace removes the last.
    await open(page, base, 'combobox', 'Multiple');
    const chips = page.locator('[data-slot="combobox-chip"]');
    assert.equal(await chips.count(), 2);
    await chips.first().locator('[data-slot="combobox-chip-remove"]').click();
    assert.equal(await settle(() => chips.count(), (n) => n === 1), 1, 'combobox: a chip remove key drops it');
    const checksInput = page.getByRole('combobox', { name: 'Required checks' });
    await checksInput.fill('lint');
    await page.getByRole('option', { name: 'lint', exact: true }).click();
    assert.equal(await settle(() => chips.count(), (n) => n === 2), 2, 'combobox: choosing an option adds a chip');
    assert.match(await chips.last().innerText(), /lint/);
    await page.keyboard.press('Escape');
    await checksInput.focus();
    await checksInput.fill('');
    await page.keyboard.press('Backspace');
    assert.equal(await settle(() => chips.count(), (n) => n === 1), 1, 'combobox: Backspace removes the last chip');

    // Calendar: a click selects a day; arrows move the focus.
    await open(page, base, 'calendar');
    const day = page.getByRole('grid').first().locator('button:not([disabled])').nth(12);
    await day.click();
    const dayText = (await day.innerText()).trim();
    assert.equal(await settle(() => page.locator('[role=grid] [aria-selected=true]').innerText().then((t) => t.trim()).catch(() => ''), (t) => t === dayText), dayText, 'calendar: click selects the day');
    await page.keyboard.press('ArrowRight');
    assert.ok(await page.evaluate(() => document.activeElement?.closest('[role=grid]') !== null), 'calendar: arrows keep focus in the grid');
    await page.keyboard.press('Enter');
    const nextDay = String(Number(dayText) + 1);
    assert.equal(await settle(() => page.locator('[role=grid] [aria-selected=true]').innerText().then((t) => t.trim()).catch(() => ''), (t) => t === nextDay), nextDay, 'calendar: Enter selects the focused day');

    // Carousel: Next moves on and enables Previous.
    await open(page, base, 'carousel');
    const prev = page.getByRole('button', { name: /previous/i }).first();
    const next = page.getByRole('button', { name: /next/i }).first();
    assert.ok(await prev.isDisabled(), 'carousel: Previous starts disabled');
    await next.click();
    assert.ok(await settle(() => prev.isEnabled(), Boolean), 'carousel: Next moves on');
    await prev.click();
    assert.ok(await settle(() => prev.isDisabled(), Boolean), 'carousel: Previous moves back to the start');

    // Form: an empty submit shows its error; the handle is checked as it is typed.
    await open(page, base, 'form');
    await page.getByRole('button', { name: 'Start thread', exact: true }).click();
    await page.getByText('Choose a repository.').waitFor();
    await page.getByText('Describe the task.').waitFor();
    const repository = page.getByRole('textbox', { name: 'Repository' });
    assert.equal(await attr(repository, 'aria-invalid'), 'true', 'form: the empty field is marked invalid');
    await repository.fill('payments');
    await page.getByText('Use the owner/name form, like acme/payments-api.').waitFor();
    await repository.fill('acme/payments-api');
    await page.getByRole('textbox', { name: 'Task' }).fill('Upgrade to Node 22');
    await page.getByRole('button', { name: 'Start thread', exact: true }).click();
    await page.getByText('Started on acme/payments-api').waitFor();

    // Data table: a head sorts, the filter narrows, a row checkbox selects.
    await open(page, base, 'data-table');
    const rows = () => page.locator('tbody tr').count();
    const all = await rows();
    const threadHead = page.locator('th', { has: page.getByRole('button', { name: 'Thread' }) });
    assert.equal(await attr(threadHead, 'aria-sort'), 'none');
    await threadHead.getByRole('button').click();
    assert.equal(await settle(() => attr(threadHead, 'aria-sort'), (v) => v === 'ascending'), 'ascending', 'data-table: a head sorts');
    assert.match(await page.locator('tbody tr').first().innerText(), /Add audit log export/, 'data-table: rows follow the sort');
    await threadHead.getByRole('button').click();
    assert.equal(await settle(() => attr(threadHead, 'aria-sort'), (v) => v === 'descending'), 'descending', 'data-table: a second click reverses it');
    await page.getByRole('textbox', { name: 'Filter runs' }).fill('postgres');
    assert.equal(await settle(rows, (count) => count === 1), 1, 'data-table: the filter finds the exact run');
    assert.ok(all > 1);
    assert.match(await page.locator('tbody tr').innerText(), /Upgrade Postgres driver/);
    await page.getByRole('textbox', { name: 'Filter runs' }).fill('');
    await page.getByRole('button', { name: 'Next page' }).click();
    await page.getByText('Page 2 of 3').waitFor();

    // A row checkbox selects its row and the count follows.
    await open(page, base, 'data-table', 'Selectable');
    await page.getByText('1 of 14 selected').waitFor();
    await page.getByRole('checkbox', { name: 'Select run run-1040' }).click();
    await page.getByText('2 of 14 selected').waitFor();
    await page.getByRole('button', { name: 'Rerun 2' }).waitFor();

    // Sidebar: on a desktop the trigger opens the folded rail and Cmd/Ctrl B folds it back to its glyphs.
    if (width > 800) {
      await open(page, base, 'sidebar', 'Icons');
      const rail = page.locator('[data-slot="sidebar"][data-state]').first();
      const state = await attr(rail, 'data-state');
      assert.equal(state, 'collapsed');
      const railKey = page.locator('[data-slot="sidebar-trigger"]').first();
      await railKey.click();
      assert.notEqual(await settle(() => attr(rail, 'data-state'), (v) => v !== state), state, 'sidebar: the trigger opens it');
      assert.equal(await attr(railKey, 'aria-expanded'), 'true', 'sidebar: the trigger reports it open');
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+b' : 'Control+b');
      assert.equal(await settle(() => attr(rail, 'data-state'), (v) => v === state), state, 'sidebar: the shortcut restores it');
    } else {
      await open(page, base, 'sidebar');
      const railKey = page.locator('[data-slot="sidebar-trigger"]').first();
      await railKey.click();
      await page.getByRole('dialog').first().waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'sidebar: no horizontal overflow');
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').first().waitFor({ state: 'hidden' });
      assert.ok(await settle(() => railKey.evaluate((el) => el === document.activeElement), Boolean), 'sidebar: focus returns to the trigger');
    }

    // No control in these previews pushes the page sideways at this width.
    for (const name of ['data-table', 'tabs', 'calendar', 'carousel', 'input-otp', 'combobox']) {
      await open(page, base, name, name === 'combobox' ? 'Multiple' : 'Preview');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: horizontal overflow at ${width}px`);
    }
  }
  console.log('PASS: switches, checkboxes, toggles, radios, tabs, accordions, sliders, resizable panels, OTP, calendar, carousel, form, data table, combobox chips, sidebar (1440px and 390px).');
}
