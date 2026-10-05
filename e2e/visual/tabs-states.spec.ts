import { expect, Locator, Page, test } from '@playwright/test';
import { ExampleOptions, FormExamplePage } from '../form/support/form-example';
import { openExample, pauseClock, screenshotSoft } from './vrt-helper';

/**
 * Tabs-Beispielseite: ein Screenshot pro Tab beider lux-tabs sowie weitere Zustände des Demo-Tabs.
 */

function tabs(page: Page, index: 0 | 1) {
  return page.locator('example-base-content lux-tabs').nth(index);
}

async function selectTab(group: Locator, title: string) {
  const tab = group.getByRole('tab', { name: title, exact: true });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}

/*
 * Der erste Tab wird erst aufgenommen, nachdem auf den zweiten und wieder zurück gewechselt wurde.
 * Direkt nach dem Laden wurden die Tab-Beschriftungen unter Last gelegentlich minimal anders geglättet
 * (rund 30 Pixel); nach einem echten Tab-Wechsel war das Bild in allen Läufen identisch.
 */

test('tabs-states/standard', async ({ page }) => {
  await openExample(page, 'tabs');
  const group = tabs(page, 0);

  // Je Tab ein Textausschnitt, der nur in dessen Inhalt vorkommt.
  for (const [nr, title, text] of [
    [2, 'Beispiel 2', 'Quo corporis exercitationem'],
    [1, 'Beispiel 1', 'dolorem aliqu incidunt']
  ] as const) {
    await selectTab(group, title);
    await expect(group.getByText(text)).toBeVisible();
    await screenshotSoft(page, group, `tabs-standard-${nr}.png`);
  }

  // Der Custom-Tab simuliert beim ersten Aktivieren einen Backend-Aufruf (5 s). Die Uhr wird angehalten,
  // damit der Ladezustand sicher aufgenommen wird; die 100 ms braucht der Tab-Wechsel selbst.
  await pauseClock(page);
  const tab = group.getByRole('tab', { name: 'Beispiel 3', exact: true });
  await tab.click();
  await page.clock.runFor(100);
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expect(group.getByRole('status')).toContainText('Daten werden geladen');
  await screenshotSoft(page, group, 'tabs-standard-3-laden.png');

  // Der Timer startet erst mit der Aktivierung innerhalb der 100 ms oben, deshalb volle 5 s.
  await page.clock.runFor(5000);
  await expect(group.getByRole('heading', { name: 'Custom-Tab' })).toBeVisible();
  await screenshotSoft(page, group, 'tabs-standard-3-geladen.png');
});

test('tabs-states/demo', async ({ page }) => {
  await openExample(page, 'tabs');
  const group = tabs(page, 1);
  // Beim Laden erhält das erste Eingabefeld per luxAutofocus zeitversetzt den Fokus. Darauf warten, damit
  // der Fokus nicht erst während eines späteren Screenshots gesetzt wird (bei Tab-Wechseln passiert das nicht).
  await expect(group.getByRole('textbox', { name: 'Beispiel Eingabefeld #1' })).toBeFocused();

  for (const nr of [2, 1, 3]) {
    await selectTab(group, `Title #${nr}`);
    // Jeder Tab-Inhalt beginnt mit drei Eingabefeldern, nummeriert über alle Tabs hinweg.
    await expect(group.getByRole('textbox', { name: `Beispiel Eingabefeld #${1 + (nr - 1) * 3}` })).toBeVisible();
    await screenshotSoft(page, group, `tabs-demo-${nr}.png`);
  }
});

const DEMO_STATES: Record<string, (options: ExampleOptions) => Promise<void>> = {
  border: (options) => options.setSwitch('luxShowBorder'),
  'ohne-divider': (options) => options.setSwitch('luxDisplayDivider', false),
  'icon-1x': (options) => options.select('luxIconSize', '1x'),
  'tab-2-disabled': async (options) => {
    await options.openTab('Erweitert');
    await options.card.getByRole('button', { name: 'Tab #2' }).click();
    await options.setSwitch('luxDisabled');
  }
};

for (const [state, apply] of Object.entries(DEMO_STATES)) {
  test(`tabs-states/demo-${state}`, async ({ page }) => {
    await openExample(page, 'tabs');
    await apply(FormExamplePage.forPage(page).options);

    await screenshotSoft(page, tabs(page, 1), `tabs-demo-${state}.png`);
  });
}
