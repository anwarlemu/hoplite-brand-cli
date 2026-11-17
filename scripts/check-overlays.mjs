// Every overlay in the library opens from its trigger, takes focus where it should, closes with Escape and hands focus
// back, at desktop and phone widths. Run through check-docs.mjs against a production docs server. The parts are Base UI:
// popups carry their data-slot, menus mark the item under the keyboard with data-highlighted, a select's trigger and a
// combobox's input have the combobox role over a listbox of options, and toasts are non-modal dialogs.
import assert from 'node:assert/strict';

async function open(page, base, name, example = 'Preview') {
  await page.goto(`${base}/preview/${name}/${example}`);
  await page.locator('[data-preview-ready]').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

const visible = (locator) => locator.first().waitFor({ state: 'visible', timeout: 5000 });
const hidden = (locator) => locator.first().waitFor({ state: 'hidden', timeout: 5000 });
const noOverflow = async (page, label) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: horizontal overflow`);
// Focus moves a frame or two after an event: poll for it rather than reading it once.
const focusedSoon = (locator) => locator.evaluate((el) => new Promise((done) => { const end = Date.now() + 2000; const tick = () => (el === document.activeElement ? done(true) : Date.now() > end ? done(false) : requestAnimationFrame(tick)); tick(); }));
const focusInside = (page, selector) => page.waitForFunction((s) => [...document.querySelectorAll(s)].some((el) => el.contains(document.activeElement)), selector, { timeout: 2000 }).then(() => true, () => false);

// Dialog-like overlays: the trigger opens a dialog, focus moves in, Escape closes it and focus returns to the trigger.
async function dialogLike(page, base, name, trigger, role = 'dialog') {
  await open(page, base, name);
  const button = page.getByRole('button', { name: trigger, exact: true }).first();
  await button.click();
  const panel = page.getByRole(role);
  await visible(panel);
  await noOverflow(page, name);
  assert.ok(await focusInside(page, `[role=${role}]`), `${name}: focus moves into the ${role}`);
  await page.keyboard.press('Escape');
  await hidden(panel);
  assert.ok(await focusedSoon(button), `${name}: focus returns to the trigger`);
}

// A popup opened with the keyboard from its trigger: focus moves in, Escape closes it and focus returns.
async function popupFromKeyboard(page, name, trigger, popup) {
  await trigger.focus();
  await page.keyboard.press('Enter');
  await visible(popup);
  await noOverflow(page, name);
  assert.ok(await focusInside(page, `[data-slot="${name}-content"]`), `${name}: focus moves into the popup`);
  await page.keyboard.press('Escape');
  await hidden(popup);
  assert.ok(await focusedSoon(trigger), `${name}: focus returns to the trigger`);
}

export async function checkOverlays(page, base) {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });

    await dialogLike(page, base, 'dialog', 'New automation');
    await dialogLike(page, base, 'sheet', 'Review pull request');
    await dialogLike(page, base, 'drawer', 'Steer subagents');
    await dialogLike(page, base, 'alert-dialog', 'Delete sandbox', 'alertdialog');

    // An alert dialog does not close from a click outside it; its Cancel closes it and hands focus back.
    await open(page, base, 'alert-dialog');
    const deleteKey = page.getByRole('button', { name: 'Delete sandbox', exact: true }).first();
    await deleteKey.click();
    await visible(page.getByRole('alertdialog'));
    await page.mouse.click(5, 5);
    await page.waitForTimeout(250);
    assert.equal(await page.getByRole('alertdialog').count(), 1, 'alert-dialog: stays open on an outside click');
    await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel', exact: true }).click();
    await hidden(page.getByRole('alertdialog'));
    assert.ok(await focusedSoon(deleteKey), 'alert-dialog: focus returns after Cancel');

    // Popover: opens from its trigger with the keyboard, takes focus, closes with Escape and returns it.
    await open(page, base, 'popover');
    await popupFromKeyboard(page, 'popover', page.locator('[data-slot="popover-trigger"]').first(), page.locator('[data-slot="popover-content"]'));

    // Menus: arrow keys move the highlight, Escape closes and returns focus.
    await open(page, base, 'dropdown-menu');
    const actions = page.locator('[data-slot="dropdown-menu-trigger"]').first();
    await actions.focus();
    await page.keyboard.press('Enter');
    await visible(page.getByRole('menu'));
    await noOverflow(page, 'dropdown-menu');
    // Keys go to the open menu once it has taken focus, as they would for a person.
    await page.waitForFunction(() => document.activeElement?.closest('[role=menu]') !== null, null, { timeout: 2000 });
    await page.keyboard.press('ArrowDown');
    const highlighted = page.locator('[role=menu] [role=menuitem][data-highlighted]');
    assert.equal(await highlighted.count(), 1, 'dropdown-menu: arrows highlight one item');
    const firstItem = await highlighted.innerText();
    await page.keyboard.press('ArrowDown');
    assert.notEqual(await highlighted.innerText(), firstItem, 'dropdown-menu: the next arrow moves the highlight');
    await page.keyboard.press('Escape');
    await hidden(page.getByRole('menu'));
    assert.ok(await focusedSoon(actions), 'dropdown-menu: focus returns');

    await open(page, base, 'context-menu');
    await page.locator('[data-slot="context-menu-trigger"]').first().click({ button: 'right' });
    await visible(page.getByRole('menu'));
    await page.waitForFunction(() => document.activeElement?.closest('[role=menu]') !== null, null, { timeout: 2000 });
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('[role=menu] [role=menuitem][data-highlighted]').count(), 1, 'context-menu: arrows highlight an item');
    await page.keyboard.press('Escape');
    await hidden(page.getByRole('menu'));

    if (width > 400) {
      // Menubar: a click opens the first menu; ArrowRight moves to the next menu (Edit), Escape closes it.
      await open(page, base, 'menubar');
      const thread = page.getByRole('menuitem', { name: 'Thread', exact: true });
      await thread.click();
      await visible(page.getByRole('menu'));
      await page.getByRole('menuitem', { name: 'New thread' }).first().waitFor();
      await page.keyboard.press('ArrowRight');
      await page.getByRole('menuitem', { name: /^Undo/ }).waitFor({ timeout: 5000 });
      await page.keyboard.press('Escape');
      await hidden(page.getByRole('menu'));

      // Navigation menu: a trigger opens its panel, Escape closes it and focus stays on the trigger.
      await open(page, base, 'navigation-menu');
      const product = page.locator('[data-slot="navigation-menu-trigger"]').first();
      await product.click();
      await visible(page.locator('[data-slot="navigation-menu-content"]'));
      await page.getByRole('link', { name: /Multiplayer/ }).waitFor();
      assert.equal(await product.getAttribute('aria-expanded'), 'true', 'navigation-menu: the trigger is expanded');
      await page.keyboard.press('Escape');
      await hidden(page.locator('[data-slot="navigation-menu-content"]'));
      assert.ok(await focusedSoon(product), 'navigation-menu: focus stays on the trigger');
    }

    // Hover card opens from the pointer; the tooltip opens from keyboard focus and closes with Escape.
    await open(page, base, 'hover-card');
    await page.locator('[data-slot="hover-card-trigger"]').first().hover();
    await visible(page.locator('[data-slot="hover-card-content"]'));
    assert.match(await page.locator('[data-slot="hover-card-content"]').innerText(), /Fix flaky upload test/);
    await page.mouse.move(1, 1);
    await hidden(page.locator('[data-slot="hover-card-content"]'));

    await open(page, base, 'tooltip');
    await page.keyboard.press('Tab');
    const tip = page.locator('[data-slot="tooltip-content"]');
    await visible(tip);
    assert.equal((await tip.innerText()).trim(), 'New thread', 'tooltip: shows its label');
    await page.keyboard.press('Escape');
    await hidden(tip);

    // Select: open with the keyboard, choose a value with the arrows and Enter; the trigger shows it and keeps focus.
    await open(page, base, 'select');
    const select = page.getByRole('combobox', { name: 'Default model' });
    assert.match(await select.innerText(), /Auto/, 'select: the trigger shows the starting value');
    await select.focus();
    await page.keyboard.press('ArrowDown');
    await visible(page.getByRole('listbox'));
    assert.ok(await focusInside(page, '[role=listbox]'), 'select: focus moves into the list');
    await page.keyboard.press('Escape');
    await hidden(page.getByRole('listbox'));
    assert.ok(await focusedSoon(select), 'select: focus returns after Escape');
    await select.click();
    await visible(page.getByRole('listbox'));
    await page.getByRole('option', { name: 'Claude Sonnet' }).click();
    await hidden(page.getByRole('listbox'));
    assert.match(await select.innerText(), /Claude Sonnet/, 'select: the trigger shows the choice');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.getByText('Saved: sonnet').waitFor();

    // Combobox: type to filter and press Enter to choose; the input shows it.
    await open(page, base, 'combobox');
    const repo = page.getByRole('combobox', { name: 'Repository' });
    assert.equal(await repo.inputValue(), 'acme/api');
    await repo.fill('');
    await repo.pressSequentially('store');
    await visible(page.getByRole('listbox'));
    await page.waitForFunction(() => document.querySelectorAll('[role=option]').length === 1, null, { timeout: 2000 }).catch(() => {});
    assert.equal(await page.getByRole('option').count(), 1, 'combobox: typing filters the list');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await hidden(page.getByRole('listbox'));
    assert.equal(await repo.inputValue(), 'acme/storefront', 'combobox: Enter chooses the match');

    // Combobox with a trigger: the search moves into the popup; Enter chooses and the trigger shows it.
    await open(page, base, 'combobox', 'WithTrigger');
    const agentTrigger = page.locator('[data-slot="combobox-trigger"]').first();
    assert.match(await agentTrigger.innerText(), /Claude Code/);
    await agentTrigger.click();
    const search = page.getByRole('combobox', { name: /Search agents/ }).or(page.getByPlaceholder('Search agents'));
    await visible(search);
    assert.ok(await focusedSoon(search.first()), 'combobox: focus moves into the search');
    await page.keyboard.type('gem');
    await page.waitForFunction(() => document.querySelectorAll('[role=option]').length === 1, null, { timeout: 2000 }).catch(() => {});
    assert.equal(await page.getByRole('option').count(), 1, 'combobox: the search filters the list');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await hidden(page.locator('[data-slot="combobox-content"]'));
    assert.match(await agentTrigger.innerText(), /Gemini CLI/, 'combobox: Enter chooses the match and the trigger shows it');
    assert.ok(await focusedSoon(agentTrigger), 'combobox: focus returns to the trigger');

    // Command: typing filters the list.
    await open(page, base, 'command');
    const input = page.locator('[cmdk-input]').first();
    const before = await page.locator('[cmdk-item]').count();
    await input.fill('sandbox');
    await page.waitForTimeout(150);
    const after = await page.locator('[cmdk-item]').count();
    assert.ok(after > 0 && after < before, `command: filtering narrows ${before} items to ${after}`);

    // Command dialog: Cmd/Ctrl K opens the palette, Enter runs the item and closes it.
    await open(page, base, 'command', 'Dialog');
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+k' : 'Control+k');
    await visible(page.getByRole('dialog'));
    assert.ok(await focusInside(page, '[role=dialog]'), 'command: focus moves into the palette');
    await page.keyboard.type('pull');
    await page.keyboard.press('Enter');
    await hidden(page.getByRole('dialog'));
    await page.getByText('Ran: Pull requests').waitFor();

    // Date picker: open the calendar, focus lands on a day, pick one, the popover closes and the trigger shows a date.
    await open(page, base, 'date-picker');
    const dateTrigger = page.locator('[data-slot="date-picker-trigger"]').first();
    assert.equal((await dateTrigger.innerText()).trim(), 'Never');
    await dateTrigger.click();
    await visible(page.getByRole('grid'));
    await noOverflow(page, 'date-picker');
    assert.ok(await focusInside(page, '[role=grid]'), 'date-picker: focus moves onto a day');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await hidden(page.getByRole('grid'));
    assert.equal((await dateTrigger.innerText()).trim(), 'Nov 18, 2026', 'date-picker: the trigger shows the chosen date');
    assert.ok(await focusedSoon(dateTrigger), 'date-picker: focus returns to the trigger');

    // Toasts appear, show their message and can be dismissed.
    await open(page, base, 'sonner');
    await page.getByRole('button', { name: 'Pause sandbox' }).click();
    const sonner = page.locator('[data-sonner-toast]');
    await visible(sonner);
    assert.match(await sonner.first().innerText(), /Sandbox paused/);
    await sonner.first().getByRole('button', { name: 'Resume' }).click();
    await page.locator('[data-sonner-toast]', { hasText: 'Sandbox resumed' }).waitFor();

    await open(page, base, 'toast');
    await page.getByRole('button', { name: 'Archive thread' }).click();
    const toast = page.locator('[data-slot="toast"]');
    await visible(toast);
    assert.match(await toast.first().innerText(), /Thread archived/);
    await noOverflow(page, 'toast');
    await toast.first().locator('[data-slot="toast-close"]').click();
    await hidden(toast);
  }
  console.log('PASS: dialogs, sheets, drawers, popovers, menus, select, combobox, command, date picker, tooltips and toasts (1440px and 390px).');
}
